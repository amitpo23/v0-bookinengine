/**
 * Streaming Chat API with SSE for Real-time Progress
 * Provides real-time tool execution feedback
 */

import { NextRequest } from 'next/server';
import { chat, createEngine, getEngine } from '@/lib/hotel-booking-ai';
import type { EngineInstance } from '@/lib/hotel-booking-ai/types';

// ========================================
// SSE HELPER
// ========================================

function createSSEStream() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    cancel() {
      controller = null;
    }
  });

  const send = (event: string, data: any) => {
    if (controller) {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(encoder.encode(message));
    }
  };

  const close = () => {
    if (controller) {
      controller.close();
    }
  };

  return { stream, send, close };
}

// ========================================
// POST - Streaming Chat
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { engineId, message, sessionId, userId, createNew, engineType, config, stream: shouldStream, language } = body;

    // Non-streaming response
    if (!shouldStream) {
      let engine: EngineInstance | undefined = engineId ? getEngine(engineId) : undefined;

      // Create new engine if requested
      if (createNew && engineType) {
        try {
          engine = createEngine({ templateId: engineType, userId, metadata: config });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      if (!engine) {
        return new Response(JSON.stringify({ success: false, error: 'Engine not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const result = await chat({ instanceId: engine.id, message, language });
        return new Response(JSON.stringify({ success: true, ...result }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ========================================
    // SSE STREAMING RESPONSE
    // ========================================

    const { stream, send, close } = createSSEStream();

    // Start async processing
    (async () => {
      try {
        // Send initial connection event
        send('connected', { timestamp: new Date().toISOString() });

        let engine: EngineInstance | undefined = engineId ? getEngine(engineId) : undefined;

        // Create new engine if needed
        if (createNew && engineType) {
          send('progress', { step: 'creating-engine', message: `Creating ${engineType} engine...` });
          
          try {
            engine = createEngine({ templateId: engineType, userId, metadata: config });
            send('engine-created', { engineId: engine.id, type: engineType });
          } catch (err: any) {
            send('error', { error: err.message });
            close();
            return;
          }
        }

        if (!engine) {
          send('error', { error: 'Engine not found' });
          close();
          return;
        }

        // Send processing start
        send('progress', { 
          step: 'processing', 
          message: 'Processing your message...',
          engineId: engine.id,
          engineType: engine.templateId
        });

        // Analyze intent
        send('progress', { step: 'analyzing', message: 'Analyzing intent...' });

        // Process message
        try {
          const result = await chat({ instanceId: engine.id, message, language });

          // Send tool execution progress if tools were called
          if (result.toolCalls && result.toolCalls.length > 0) {
            send('tools', {
              step: 'tools-executed',
              tools: result.toolCalls.map((t: { name: string }) => t.name),
              message: `Executed ${result.toolCalls.length} tool(s)`
            });
          }

          // Send response in chunks for better UX
          const response = result.reply || '';
          const words = response.split(' ');
          const chunkSize = 10;
          
          for (let i = 0; i < words.length; i += chunkSize) {
            const chunk = words.slice(i, i + chunkSize).join(' ');
            send('chunk', { 
              text: chunk, 
              index: Math.floor(i / chunkSize),
              total: Math.ceil(words.length / chunkSize)
            });
            
            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Send complete event
          send('complete', {
            response: result.reply,
            toolsUsed: result.toolCalls?.map((t: { name: string }) => t.name) || [],
            state: result.context.currentState
          });
        } catch (err: any) {
          send('error', { error: err.message });
        }

      } catch (error: any) {
        send('error', { error: error.message });
      } finally {
        close();
      }
    })();

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
