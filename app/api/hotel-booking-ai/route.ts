/**
 * Hotel Booking AI - API Route
 * Main API endpoint for engine management
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createEngine,
  getEngine,
  destroyEngine,
  listEngines,
  getAvailableTemplates,
  getDashboardStats
} from '@/lib/hotel-booking-ai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'templates': {
        const templates = getAvailableTemplates();
        return NextResponse.json({
          success: true,
          data: templates.map(t => ({
            id: t.id,
            type: t.type,
            name: t.name,
            nameHe: t.nameHe,
            description: t.description,
            descriptionHe: t.descriptionHe,
            icon: t.icon,
            color: t.color,
            capabilities: t.capabilities,
            skillCount: t.skills.length
          }))
        });
      }

      case 'engines': {
        const status = searchParams.get('status') || undefined;
        const templateId = searchParams.get('templateId') || undefined;
        const engines = listEngines({ status, templateId });
        return NextResponse.json({
          success: true,
          data: engines.map(e => ({
            id: e.id,
            templateId: e.templateId,
            templateName: e.template.name,
            status: e.status,
            createdAt: e.createdAt,
            lastActiveAt: e.lastActiveAt,
            metrics: e.metrics
          }))
        });
      }

      case 'stats': {
        const stats = getDashboardStats();
        return NextResponse.json({
          success: true,
          data: stats
        });
      }

      case 'engine': {
        const instanceId = searchParams.get('id');
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
        return NextResponse.json({
          success: true,
          data: {
            id: engine.id,
            templateId: engine.templateId,
            template: {
              name: engine.template.name,
              nameHe: engine.template.nameHe,
              type: engine.template.type,
              persona: engine.template.persona
            },
            status: engine.status,
            createdAt: engine.createdAt,
            lastActiveAt: engine.lastActiveAt,
            metrics: engine.metrics,
            metadata: engine.metadata
          }
        });
      }

      default:
        return NextResponse.json({
          success: true,
          message: 'Hotel Booking AI API',
          version: '1.0.0',
          endpoints: {
            templates: '/api/hotel-booking-ai?action=templates',
            engines: '/api/hotel-booking-ai?action=engines',
            stats: '/api/hotel-booking-ai?action=stats',
            engine: '/api/hotel-booking-ai?action=engine&id=<instanceId>'
          }
        });
    }
  } catch (error: any) {
    console.error('Hotel Booking AI API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create': {
        const { templateId, userId, metadata } = body;
        if (!templateId) {
          return NextResponse.json(
            { success: false, error: 'Template ID required' },
            { status: 400 }
          );
        }

        const engine = createEngine({ templateId, userId, metadata });
        return NextResponse.json({
          success: true,
          data: {
            id: engine.id,
            templateId: engine.templateId,
            templateName: engine.template.name,
            status: engine.status,
            createdAt: engine.createdAt,
            greeting: engine.template.prompts.greetingMessage
          }
        });
      }

      case 'destroy': {
        const { instanceId } = body;
        if (!instanceId) {
          return NextResponse.json(
            { success: false, error: 'Instance ID required' },
            { status: 400 }
          );
        }

        const success = destroyEngine(instanceId);
        return NextResponse.json({
          success,
          message: success ? 'Engine destroyed' : 'Engine not found'
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Hotel Booking AI API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get('id');

    if (!instanceId) {
      return NextResponse.json(
        { success: false, error: 'Instance ID required' },
        { status: 400 }
      );
    }

    const success = destroyEngine(instanceId);
    return NextResponse.json({
      success,
      message: success ? 'Engine destroyed' : 'Engine not found'
    });
  } catch (error: any) {
    console.error('Hotel Booking AI API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
