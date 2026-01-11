/**
 * AI Engine Chat API Route
 * Handles chat interactions with AI booking engines
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAIEngineManager } from '@/lib/ai-engines/engine-manager';
import { executeHandler } from '@/lib/ai-engines/handlers';

// Lazy initialization of Groq client
let groqClient: any = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    const Groq = require('groq-sdk').default;
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: any[];
  toolCallId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      conversationId, 
      message, 
      engineId,
      userId,
      language = 'he' // Default to Hebrew
    } = body;

    const manager = getAIEngineManager();
    
    // Get or create conversation
    let context = conversationId 
      ? manager.getConversation(conversationId)
      : null;

    if (!context && engineId) {
      context = manager.startConversation(engineId, userId);
    }

    if (!context) {
      return NextResponse.json({
        success: false,
        error: 'No active conversation. Please start a conversation first.'
      }, { status: 400 });
    }

    // Get engine
    const engine = manager.getEngine(context.engineInstanceId);
    if (!engine) {
      return NextResponse.json({
        success: false,
        error: 'Engine not found'
      }, { status: 404 });
    }

    // Check for handoff triggers
    const handoffCheck = manager.shouldTriggerHandoff(message, context);
    if (handoffCheck.shouldHandoff && handoffCheck.targetEngine) {
      const handoffResult = await manager.executeHandoff(
        context.conversationId,
        handoffCheck.targetEngine
      );
      
      if (handoffResult.success && handoffResult.newContext) {
        context = handoffResult.newContext;
        // Continue with new engine
      }
    }

    // Build system prompt
    const systemPrompt = language === 'he' 
      ? (engine.template.prompts.systemPromptHe || engine.template.prompts.systemPrompt)
      : engine.template.prompts.systemPrompt;

    // Get tools for this engine
    const tools = manager.formatToolsForLLM(engine.instanceId);

    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history from metadata if available
    if (context.metadata?.history) {
      messages.push(...context.metadata.history);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call LLM with tools
    const modelConfig = engine.template.modelConfig;
    const groq = getGroqClient();
    
    if (!groq) {
      return NextResponse.json({
        success: false,
        error: 'GROQ_API_KEY not configured. Please add it to environment variables.'
      }, { status: 500 });
    }
    
    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: modelConfig.model,
        messages: messages as any,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? 'auto' : undefined,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens
      });
    } catch (llmError: any) {
      console.error('[Chat API] LLM error:', llmError);
      return NextResponse.json({
        success: false,
        error: 'Failed to process message'
      }, { status: 500 });
    }

    const assistantMessage = completion.choices[0]?.message;
    
    // Handle tool calls
    let finalResponse = assistantMessage?.content || '';
    const toolResults: any[] = [];

    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        console.log(`[Chat API] Executing tool: ${toolName}`, toolArgs);

        try {
          // Find handler path for this tool
          const handlerPath = findHandlerPath(toolName);
          
          if (handlerPath) {
            const result = await executeHandler(handlerPath, toolArgs, context);
            toolResults.push({
              toolCallId: toolCall.id,
              toolName,
              result
            });
          } else {
            toolResults.push({
              toolCallId: toolCall.id,
              toolName,
              result: { error: 'Tool handler not found' }
            });
          }
        } catch (toolError: any) {
          console.error(`[Chat API] Tool execution error:`, toolError);
          toolResults.push({
            toolCallId: toolCall.id,
            toolName,
            error: toolError.message
          });
        }
      }

      // If tools were executed, get final response with results
      if (toolResults.length > 0) {
        const toolMessages = toolResults.map(tr => ({
          role: 'tool' as const,
          tool_call_id: tr.toolCallId,
          content: JSON.stringify(tr.result || tr.error)
        }));

        try {
          const groqFinal = getGroqClient();
          const finalCompletion = await groqFinal.chat.completions.create({
            model: modelConfig.model,
            messages: [
              ...messages,
              assistantMessage as any,
              ...toolMessages
            ],
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.maxTokens
          });

          finalResponse = finalCompletion.choices[0]?.message?.content || finalResponse;
        } catch (err) {
          console.error('[Chat API] Final completion error:', err);
        }
      }
    }

    // Update conversation context
    manager.updateConversation(context.conversationId, {
      messageCount: context.messageCount + 1,
      metadata: {
        ...context.metadata,
        history: [
          ...(context.metadata?.history || []),
          { role: 'user', content: message },
          { role: 'assistant', content: finalResponse }
        ].slice(-20) // Keep last 20 messages
      }
    });

    return NextResponse.json({
      success: true,
      conversationId: context.conversationId,
      response: finalResponse,
      toolsExecuted: toolResults.map(tr => ({
        name: tr.toolName,
        success: !tr.error
      })),
      engine: {
        id: engine.instanceId,
        name: engine.template.name,
        persona: engine.template.persona?.name
      }
    });

  } catch (error: any) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Find handler path for a tool name
 */
function findHandlerPath(toolName: string): string | undefined {
  const toolHandlerMap: Record<string, string> = {
    'search_hotels': 'lib/ai-engines/handlers/booking.searchHotels',
    'prebook_room': 'lib/ai-engines/handlers/booking.prebookRoom',
    'book_room': 'lib/ai-engines/handlers/booking.bookRoom',
    'cancel_booking': 'lib/ai-engines/handlers/booking.cancelBooking',
    'get_cancellation_policy': 'lib/ai-engines/handlers/booking.getCancellationPolicy',
    'initiate_call': 'lib/ai-engines/handlers/voice.initiateCall',
    'transfer_to_human': 'lib/ai-engines/handlers/voice.transferToHuman',
    'send_call_summary_sms': 'lib/ai-engines/handlers/voice.sendCallSummarySms',
    'track_hotel_price': 'lib/ai-engines/handlers/monitoring.trackHotelPrice',
    'get_price_history': 'lib/ai-engines/handlers/monitoring.getPriceHistory',
    'analyze_price_trends': 'lib/ai-engines/handlers/monitoring.analyzePriceTrends'
  };

  return toolHandlerMap[toolName];
}
