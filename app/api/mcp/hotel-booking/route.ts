/**
 * MCP Hotel Booking API Route
 * Provides MCP-style tool execution with SSE streaming
 */

import { NextRequest, NextResponse } from 'next/server';
import { mcpHotelBookingTool } from '@/lib/mcp/hotel-booking-tool';

// ========================================
// GET - Server Info & Tool Discovery
// ========================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    if (action === 'tools') {
      // Return all available tools
      return NextResponse.json({
        success: true,
        tools: mcpHotelBookingTool.getTools()
      });
    }

    if (action === 'tool') {
      const name = searchParams.get('name');
      if (!name) {
        return NextResponse.json({ success: false, error: 'Tool name required' }, { status: 400 });
      }
      const tool = mcpHotelBookingTool.getTool(name);
      if (!tool) {
        return NextResponse.json({ success: false, error: 'Tool not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, tool });
    }

    // Return server info
    return NextResponse.json({
      success: true,
      server: mcpHotelBookingTool.getServerInfo()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ========================================
// POST - Execute Tools
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tools, tool, parameters, sessionId, userId, stream } = body;

    // Handle parallel tool execution
    if (action === 'execute-parallel' && Array.isArray(tools)) {
      const inputs = tools.map((t: any) => ({
        tool: t.tool || t.name,
        parameters: t.parameters || {},
        sessionId,
        userId
      }));

      const results = await mcpHotelBookingTool.executeParallel(inputs);
      return NextResponse.json({
        success: true,
        results
      });
    }

    // Single tool execution
    if (tool) {
      const result = await mcpHotelBookingTool.execute({
        tool,
        parameters: parameters || {},
        sessionId,
        userId
      });

      return NextResponse.json(result);
    }

    // Handle tool reload
    if (action === 'reload') {
      mcpHotelBookingTool.reloadTools();
      return NextResponse.json({
        success: true,
        message: 'Tools reloaded',
        server: mcpHotelBookingTool.getServerInfo()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request. Provide tool name or action.' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
