/**
 * AI Engines API Route
 * Exposes AI engine functionality via REST API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAIEngineManager } from '@/lib/ai-engines/engine-manager';
import { allTemplates } from '@/lib/ai-engines/templates';
import { allSkills } from '@/lib/ai-engines/skills';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const manager = getAIEngineManager();

  try {
    switch (action) {
      case 'templates':
        return NextResponse.json({
          success: true,
          templates: allTemplates.map(t => ({
            id: t.id,
            type: t.type,
            name: t.name,
            nameHe: t.nameHe,
            description: t.description,
            descriptionHe: t.descriptionHe,
            capabilities: t.capabilities,
            skillCount: t.skills.length,
            persona: t.persona
          }))
        });

      case 'skills':
        return NextResponse.json({
          success: true,
          skills: allSkills.map(s => ({
            id: s.id,
            name: s.name,
            nameHe: s.nameHe,
            category: s.category,
            capabilities: s.capabilities,
            isEnabled: s.isEnabled,
            toolCount: s.tools.length,
            tools: s.tools.map(t => t.name)
          }))
        });

      case 'engines':
        const engines = manager.getAllEngines();
        return NextResponse.json({
          success: true,
          engines: engines.map(e => ({
            instanceId: e.instanceId,
            templateId: e.template.id,
            name: e.template.name,
            type: e.template.type,
            status: e.status,
            activeConversations: e.activeConversations,
            totalConversations: e.totalConversations,
            toolCount: e.tools.length
          }))
        });

      case 'stats':
        const allEngines = manager.getAllEngines();
        const activeEnginesCount = allEngines.filter(e => e.status === 'active').length;
        const totalConvs = allEngines.reduce((sum, e) => sum + e.totalConversations, 0);
        const activeConvs = allEngines.reduce((sum, e) => sum + e.activeConversations, 0);
        
        return NextResponse.json({
          success: true,
          stats: {
            totalEngines: allEngines.length,
            activeEngines: activeEnginesCount,
            totalConversations: totalConvs,
            activeConversations: activeConvs,
            totalMessages: manager.getConversationAnalytics().totalMessages || 0,
            ...manager.getEngineStats()
          }
        });

      default:
        // Return summary
        return NextResponse.json({
          success: true,
          summary: {
            version: '1.0.0',
            templateCount: allTemplates.length,
            skillCount: allSkills.length,
            engineCount: manager.getAllEngines().length,
            activeConversations: manager.getConversationAnalytics().activeConversations
          },
          endpoints: {
            'GET ?action=templates': 'List all engine templates',
            'GET ?action=skills': 'List all available skills',
            'GET ?action=engines': 'List all engine instances',
            'GET ?action=stats': 'Get aggregate statistics',
            'POST /start-conversation': 'Start a new conversation',
            'POST /send-message': 'Send message to conversation',
            'POST /execute-tool': 'Execute a tool directly'
          }
        });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const manager = getAIEngineManager();

  try {
    const body = await request.json();

    switch (action) {
      case 'start-conversation': {
        const { engineId, userId, sessionId, context } = body;
        
        // Find engine instance
        let targetEngineId = engineId;
        if (!targetEngineId) {
          // Default to orchestrator
          const engines = manager.getAllEngines();
          const orchestrator = engines.find(e => e.template.type === 'multi-agent');
          targetEngineId = orchestrator?.instanceId;
        }

        if (!targetEngineId) {
          return NextResponse.json(
            { success: false, error: 'No engine specified and no orchestrator found' },
            { status: 400 }
          );
        }

        const conversation = manager.startConversation(targetEngineId, userId, sessionId, context);
        
        if (!conversation) {
          return NextResponse.json(
            { success: false, error: 'Failed to start conversation' },
            { status: 500 }
          );
        }

        // Get engine for greeting
        const engine = manager.getEngine(targetEngineId);
        const greeting = engine?.template.prompts.greetingMessage || 'Hello! How can I help you?';
        const greetingHe = engine?.template.prompts.greetingMessageHe;

        return NextResponse.json({
          success: true,
          conversation: {
            conversationId: conversation.conversationId,
            engineId: conversation.engineInstanceId,
            engineName: engine?.template.name,
            persona: engine?.template.persona
          },
          greeting,
          greetingHe
        });
      }

      case 'end-conversation': {
        const { conversationId } = body;
        manager.endConversation(conversationId);
        return NextResponse.json({ success: true });
      }

      case 'execute-tool': {
        const { toolName, parameters, conversationId } = body;
        
        let context = conversationId 
          ? manager.getConversation(conversationId)
          : undefined;

        // Create temporary context if none exists
        if (!context) {
          context = {
            conversationId: `temp-${Date.now()}`,
            engineInstanceId: '',
            startedAt: new Date(),
            lastActivityAt: new Date(),
            messageCount: 0,
            extractedEntities: {},
            bookingData: {},
            preferences: {},
            metadata: {}
          };
        }

        const result = await manager.executeTool(toolName, parameters, context);
        
        return NextResponse.json({
          success: result.success,
          result: result.result,
          error: result.error
        });
      }

      case 'get-tools': {
        const { engineId } = body;
        
        if (!engineId) {
          return NextResponse.json(
            { success: false, error: 'engineId is required' },
            { status: 400 }
          );
        }

        const tools = manager.formatToolsForLLM(engineId);
        
        return NextResponse.json({
          success: true,
          tools,
          count: tools.length
        });
      }

      case 'handoff': {
        const { conversationId, targetEngineId } = body;
        
        const result = await manager.executeHandoff(conversationId, targetEngineId);
        
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[AI Engines API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
