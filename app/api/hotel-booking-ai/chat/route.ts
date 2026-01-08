/**
 * Hotel Booking AI - Chat API Route
 * Handles chat interactions with engine instances
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  chat,
  getEngine,
  getConversationContext,
  getGreeting,
  clearHistory
} from '@/lib/hotel-booking-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, instanceId, message, language } = body;

    switch (action) {
      case 'chat': {
        if (!instanceId) {
          return NextResponse.json(
            { success: false, error: 'Instance ID required' },
            { status: 400 }
          );
        }

        if (!message) {
          return NextResponse.json(
            { success: false, error: 'Message required' },
            { status: 400 }
          );
        }

        const response = await chat({
          instanceId,
          message,
          language: language || 'en'
        });

        return NextResponse.json({
          success: true,
          data: response
        });
      }

      case 'greeting': {
        if (!instanceId) {
          return NextResponse.json(
            { success: false, error: 'Instance ID required' },
            { status: 400 }
          );
        }

        const greeting = getGreeting(instanceId, language || 'en');
        return NextResponse.json({
          success: true,
          data: { greeting }
        });
      }

      case 'clear': {
        if (!instanceId) {
          return NextResponse.json(
            { success: false, error: 'Instance ID required' },
            { status: 400 }
          );
        }

        const cleared = clearHistory(instanceId);
        return NextResponse.json({
          success: cleared,
          message: cleared ? 'Conversation cleared' : 'Engine not found'
        });
      }

      case 'history': {
        if (!instanceId) {
          return NextResponse.json(
            { success: false, error: 'Instance ID required' },
            { status: 400 }
          );
        }

        const context = getConversationContext(instanceId);
        if (!context) {
          return NextResponse.json(
            { success: false, error: 'Engine not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            sessionId: context.sessionId,
            engineType: context.engineType,
            language: context.language,
            currentState: context.currentState,
            messageCount: context.history.length,
            history: context.history.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
              toolCalls: msg.toolCalls
            }))
          }
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: chat, greeting, clear, history' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Hotel Booking AI Chat API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get('instanceId');
    const action = searchParams.get('action') || 'greeting';
    const language = (searchParams.get('language') || 'en') as 'en' | 'he';

    if (!instanceId) {
      return NextResponse.json(
        { success: false, error: 'Instance ID required' },
        { status: 400 }
      );
    }

    const engine = getEngine(instanceId);
    if (!engine) {
      return NextResponse.json(
        { success: false, error: 'Engine not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'greeting': {
        const greeting = getGreeting(instanceId, language);
        return NextResponse.json({
          success: true,
          data: {
            greeting,
            persona: {
              name: engine.template.persona.name,
              nameHe: engine.template.persona.nameHe,
              role: engine.template.persona.role,
              roleHe: engine.template.persona.roleHe
            }
          }
        });
      }

      case 'history': {
        const context = getConversationContext(instanceId);
        if (!context) {
          return NextResponse.json(
            { success: false, error: 'Conversation not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            sessionId: context.sessionId,
            messageCount: context.history.length,
            history: context.history
          }
        });
      }

      case 'status': {
        const context = getConversationContext(instanceId);
        return NextResponse.json({
          success: true,
          data: {
            instanceId,
            status: engine.status,
            templateName: engine.template.name,
            messageCount: context?.history.length || 0,
            currentState: context?.currentState || 'unknown',
            lastActiveAt: engine.lastActiveAt
          }
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Hotel Booking AI Chat API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
