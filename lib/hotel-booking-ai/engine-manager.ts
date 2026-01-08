/**
 * Hotel Booking AI - Engine Manager
 * Manages engine instances, conversation state, and tool execution
 */

// @ts-ignore - groq-sdk may not be installed yet
import Groq from 'groq-sdk';
import type {
  BookingEngineTemplate,
  ConversationContext,
  ConversationMessage,
  BookingTool,
  ToolResult,
  EngineInstance,
  EngineSessionMetrics
} from './types';
import { allTemplates, getTemplateById } from './templates';
import { allSkills } from './skills';

// ========================================
// GROQ CLIENT
// ========================================

const getGroqClient = (): any => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }
  return new Groq({ apiKey });
};

// ========================================
// ENGINE INSTANCE MANAGEMENT
// ========================================

const engineInstances = new Map<string, EngineInstance>();
const conversationContexts = new Map<string, ConversationContext>();

export interface CreateEngineOptions {
  templateId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a new engine instance from a template
 */
export function createEngine(options: CreateEngineOptions): EngineInstance {
  const { templateId, userId, metadata } = options;

  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const instanceId = `${templateId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const instance: EngineInstance = {
    id: instanceId,
    templateId,
    template,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    userId,
    metadata: metadata || {},
    metrics: {
      messagesProcessed: 0,
      toolsExecuted: 0,
      avgResponseTime: 0,
      errorCount: 0,
      sessionDuration: 0
    }
  };

  // Initialize conversation context
  const context: ConversationContext = {
    sessionId: instanceId,
    engineType: template.type,
    history: [],
    currentState: 'greeting',
    language: 'en',
    userPreferences: {},
    metadata: {
      createdAt: instance.createdAt,
      templateId
    }
  };

  engineInstances.set(instanceId, instance);
  conversationContexts.set(instanceId, context);

  return instance;
}

/**
 * Get an existing engine instance
 */
export function getEngine(instanceId: string): EngineInstance | undefined {
  return engineInstances.get(instanceId);
}

/**
 * Get conversation context for an engine
 */
export function getConversationContext(instanceId: string): ConversationContext | undefined {
  return conversationContexts.get(instanceId);
}

/**
 * Destroy an engine instance and clean up resources
 */
export function destroyEngine(instanceId: string): boolean {
  const deleted = engineInstances.delete(instanceId);
  conversationContexts.delete(instanceId);
  return deleted;
}

/**
 * List all active engine instances
 */
export function listEngines(filter?: { status?: string; templateId?: string }): EngineInstance[] {
  const instances = Array.from(engineInstances.values());

  if (!filter) return instances;

  return instances.filter(instance => {
    if (filter.status && instance.status !== filter.status) return false;
    if (filter.templateId && instance.templateId !== filter.templateId) return false;
    return true;
  });
}

// ========================================
// TOOL EXECUTION
// ========================================

interface ToolHandler {
  (params: Record<string, any>, context: ConversationContext): Promise<ToolResult>;
}

const toolHandlers: Record<string, ToolHandler> = {};

/**
 * Register a handler for a specific tool
 */
export function registerToolHandler(toolName: string, handler: ToolHandler): void {
  toolHandlers[toolName] = handler;
}

/**
 * Execute a tool and return the result
 */
export async function executeTool(
  toolName: string,
  params: Record<string, any>,
  context: ConversationContext
): Promise<ToolResult> {
  const handler = toolHandlers[toolName];

  if (!handler) {
    return {
      success: false,
      data: null,
      error: `No handler registered for tool: ${toolName}`
    };
  }

  try {
    const startTime = Date.now();
    const result = await handler(params, context);
    result.executionTime = Date.now() - startTime;
    return result;
  } catch (error: any) {
    console.error(`Tool execution error (${toolName}):`, error);
    return {
      success: false,
      data: null,
      error: error.message || 'Tool execution failed'
    };
  }
}

/**
 * Get available tools for an engine template
 */
export function getToolsForEngine(templateId: string): BookingTool[] {
  const template = getTemplateById(templateId);
  if (!template) return [];

  const tools: BookingTool[] = [];
  for (const skill of template.skills) {
    tools.push(...skill.tools);
  }
  return tools;
}

// ========================================
// CONVERSATION MANAGEMENT
// ========================================

export interface ChatOptions {
  instanceId: string;
  message: string;
  language?: 'en' | 'he';
}

export interface ChatResponse {
  reply: string;
  toolCalls?: Array<{
    name: string;
    parameters: Record<string, any>;
    result: ToolResult;
  }>;
  context: {
    sessionId: string;
    messageCount: number;
    currentState: string;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Process a chat message for an engine instance
 */
export async function chat(options: ChatOptions): Promise<ChatResponse> {
  const { instanceId, message, language = 'en' } = options;

  const instance = getEngine(instanceId);
  if (!instance) {
    throw new Error(`Engine instance not found: ${instanceId}`);
  }

  const context = getConversationContext(instanceId);
  if (!context) {
    throw new Error(`Conversation context not found: ${instanceId}`);
  }

  const template = instance.template;
  const startTime = Date.now();

  // Update context
  context.language = language;

  // Add user message to history
  const userMessage: ConversationMessage = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };
  context.history.push(userMessage);

  // Get tools for this engine
  const tools = getToolsForEngine(instance.templateId);

  // Build messages for LLM
  const systemPrompt = language === 'he' && template.prompts.systemPromptHe
    ? template.prompts.systemPromptHe
    : template.prompts.systemPrompt;

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...context.history.slice(-template.config.contextWindowSize).map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }))
  ];

  // Convert tools to Groq format
  const groqTools: any[] = tools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));

  try {
    const groq = getGroqClient();

    // Initial LLM call
    const completion = await groq.chat.completions.create({
      model: template.modelConfig.model,
      messages,
      tools: groqTools.length > 0 ? groqTools : undefined,
      tool_choice: groqTools.length > 0 ? 'auto' : undefined,
      temperature: template.modelConfig.temperature,
      max_tokens: template.modelConfig.maxTokens,
      top_p: template.modelConfig.topP
    });

    const responseMessage = completion.choices[0].message;
    const toolCalls: ChatResponse['toolCalls'] = [];

    // Process tool calls if any - PARALLEL EXECUTION for better performance
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // Execute all independent tools in parallel
      const toolPromises = responseMessage.tool_calls.map(async (toolCall: any) => {
        const toolName = toolCall.function.name;
        const toolParams = JSON.parse(toolCall.function.arguments);
        
        // Emit progress event
        console.log(`[Progress] Executing tool: ${toolName}`);
        
        const result = await executeTool(toolName, toolParams, context);
        
        return {
          id: toolCall.id,
          name: toolName,
          parameters: toolParams,
          result
        };
      });

      // Wait for all tools to complete in parallel
      const toolResults = await Promise.all(toolPromises);
      
      // Process results
      for (const toolResult of toolResults) {
        toolCalls.push({
          name: toolResult.name,
          parameters: toolResult.parameters,
          result: toolResult.result
        });
        instance.metrics.toolsExecuted++;
      }

      // Get final response with tool results
      const toolResultMessages: any[] = [
        ...messages,
        responseMessage,
        ...toolResults.map(tc => ({
          role: 'tool' as const,
          tool_call_id: tc.id,
          content: JSON.stringify(tc.result.data)
        }))
      ];

      const finalCompletion = await groq.chat.completions.create({
        model: template.modelConfig.model,
        messages: toolResultMessages,
        temperature: template.modelConfig.temperature,
        max_tokens: template.modelConfig.maxTokens
      });

      const finalReply = finalCompletion.choices[0].message.content || '';

      // Add assistant message to history
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: finalReply,
        timestamp: new Date().toISOString(),
        toolCalls: toolCalls.map(tc => ({
          name: tc.name,
          parameters: tc.parameters
        }))
      };
      context.history.push(assistantMessage);

      // Update metrics
      instance.metrics.messagesProcessed++;
      const responseTime = Date.now() - startTime;
      instance.metrics.avgResponseTime =
        (instance.metrics.avgResponseTime * (instance.metrics.messagesProcessed - 1) + responseTime) /
        instance.metrics.messagesProcessed;
      instance.lastActiveAt = new Date().toISOString();

      return {
        reply: finalReply,
        toolCalls,
        context: {
          sessionId: instanceId,
          messageCount: context.history.length,
          currentState: context.currentState
        },
        usage: {
          promptTokens: (completion.usage?.prompt_tokens || 0) +
            (finalCompletion.usage?.prompt_tokens || 0),
          completionTokens: (completion.usage?.completion_tokens || 0) +
            (finalCompletion.usage?.completion_tokens || 0),
          totalTokens: (completion.usage?.total_tokens || 0) +
            (finalCompletion.usage?.total_tokens || 0)
        }
      };
    }

    // No tool calls - return direct response
    const reply = responseMessage.content || '';

    const assistantMessage: ConversationMessage = {
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString()
    };
    context.history.push(assistantMessage);

    // Update metrics
    instance.metrics.messagesProcessed++;
    const responseTime = Date.now() - startTime;
    instance.metrics.avgResponseTime =
      (instance.metrics.avgResponseTime * (instance.metrics.messagesProcessed - 1) + responseTime) /
      instance.metrics.messagesProcessed;
    instance.lastActiveAt = new Date().toISOString();

    return {
      reply,
      context: {
        sessionId: instanceId,
        messageCount: context.history.length,
        currentState: context.currentState
      },
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      }
    };
  } catch (error: any) {
    console.error('Chat error:', error);
    instance.metrics.errorCount++;

    const errorMessage = template.prompts.errorMessages?.general ||
      'I apologize, but something went wrong. Please try again.';

    return {
      reply: errorMessage,
      context: {
        sessionId: instanceId,
        messageCount: context.history.length,
        currentState: 'error'
      }
    };
  }
}

// ========================================
// CONVERSATION UTILITIES
// ========================================

/**
 * Get the greeting message for an engine
 */
export function getGreeting(instanceId: string, language: 'en' | 'he' = 'en'): string {
  const instance = getEngine(instanceId);
  if (!instance) return '';

  const template = instance.template;
  return language === 'he' && template.prompts.greetingMessageHe
    ? template.prompts.greetingMessageHe
    : template.prompts.greetingMessage || '';
}

/**
 * Clear conversation history for an engine
 */
export function clearHistory(instanceId: string): boolean {
  const context = getConversationContext(instanceId);
  if (!context) return false;

  context.history = [];
  context.currentState = 'greeting';
  return true;
}

/**
 * Get conversation summary
 */
export function getConversationSummary(instanceId: string): {
  messageCount: number;
  toolCalls: number;
  duration: number;
  lastMessage?: string;
} | null {
  const instance = getEngine(instanceId);
  const context = getConversationContext(instanceId);

  if (!instance || !context) return null;

  const firstMessageTime = context.history[0]
    ? new Date(context.history[0].timestamp).getTime()
    : Date.now();
  const duration = Date.now() - firstMessageTime;

  return {
    messageCount: context.history.length,
    toolCalls: instance.metrics.toolsExecuted,
    duration,
    lastMessage: context.history[context.history.length - 1]?.content
  };
}

// ========================================
// TEMPLATE UTILITIES
// ========================================

/**
 * Get all available templates
 */
export function getAvailableTemplates(): BookingEngineTemplate[] {
  return allTemplates;
}

/**
 * Get template by ID
 */
export function getTemplate(templateId: string): BookingEngineTemplate | undefined {
  return getTemplateById(templateId);
}

// ========================================
// DASHBOARD STATS
// ========================================

export interface DashboardStats {
  activeEngines: number;
  totalConversations: number;
  totalMessages: number;
  totalToolCalls: number;
  avgResponseTime: number;
  errorRate: number;
  enginesByType: Record<string, number>;
}

/**
 * Get dashboard statistics
 */
export function getDashboardStats(): DashboardStats {
  const engines = Array.from(engineInstances.values());

  let totalMessages = 0;
  let totalToolCalls = 0;
  let totalResponseTime = 0;
  let totalErrors = 0;
  const enginesByType: Record<string, number> = {};

  for (const engine of engines) {
    totalMessages += engine.metrics.messagesProcessed;
    totalToolCalls += engine.metrics.toolsExecuted;
    totalResponseTime += engine.metrics.avgResponseTime * engine.metrics.messagesProcessed;
    totalErrors += engine.metrics.errorCount;

    const type = engine.template.type;
    enginesByType[type] = (enginesByType[type] || 0) + 1;
  }

  return {
    activeEngines: engines.filter(e => e.status === 'active').length,
    totalConversations: engines.length,
    totalMessages,
    totalToolCalls,
    avgResponseTime: totalMessages > 0 ? totalResponseTime / totalMessages : 0,
    errorRate: totalMessages > 0 ? (totalErrors / totalMessages) * 100 : 0,
    enginesByType
  };
}
