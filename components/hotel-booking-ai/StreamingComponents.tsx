'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ========================================
// TYPES
// ========================================

interface ProgressEvent {
  type: 'connected' | 'progress' | 'tools' | 'chunk' | 'complete' | 'error' | 'engine-created';
  step?: string;
  message?: string;
  text?: string;
  error?: string;
  tools?: string[];
  response?: string;
  toolsUsed?: string[];
  state?: string;
  intent?: string;
  engineId?: string;
  engineType?: string;
  index?: number;
  total?: number;
  timestamp?: string;
}

interface UseStreamingChatOptions {
  engineId?: string;
  engineType?: string;
  config?: Record<string, any>;
  onProgress?: (event: ProgressEvent) => void;
  onChunk?: (text: string) => void;
  onComplete?: (result: { response: string; toolsUsed?: string[] }) => void;
  onError?: (error: string) => void;
}

interface StreamingChatResult {
  sendMessage: (message: string) => Promise<void>;
  isStreaming: boolean;
  currentProgress: string;
  streamedText: string;
  toolsExecuted: string[];
  error: string | null;
  reset: () => void;
}

// ========================================
// HOOK: useStreamingChat
// ========================================

export function useStreamingChat(options: UseStreamingChatOptions): StreamingChatResult {
  const { engineId, engineType, config, onProgress, onChunk, onComplete, onError } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [currentProgress, setCurrentProgress] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const [toolsExecuted, setToolsExecuted] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsStreaming(false);
    setCurrentProgress('');
    setStreamedText('');
    setToolsExecuted([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    reset();
    setIsStreaming(true);

    try {
      const response = await fetch('/api/hotel-booking-ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineId,
          engineType,
          config,
          message,
          stream: true,
          createNew: !engineId && !!engineType
        })
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            const eventMatch = line.match(/event: (\w+)\ndata: ([\s\S]+)/);
            if (eventMatch) {
              const [, eventType, dataStr] = eventMatch;
              try {
                const data = JSON.parse(dataStr);
                const event: ProgressEvent = { type: eventType as any, ...data };

                // Handle different event types
                switch (eventType) {
                  case 'connected':
                    setCurrentProgress('Connected');
                    break;
                    
                  case 'progress':
                    setCurrentProgress(data.message || data.step || '');
                    break;
                    
                  case 'tools':
                    if (data.tools) {
                      setToolsExecuted(data.tools);
                    }
                    setCurrentProgress(`Executed ${data.tools?.length || 0} tools`);
                    break;
                    
                  case 'chunk':
                    setStreamedText(prev => prev + (prev ? ' ' : '') + data.text);
                    onChunk?.(data.text);
                    break;
                    
                  case 'complete':
                    setCurrentProgress('Complete');
                    if (data.toolsUsed) setToolsExecuted(data.toolsUsed);
                    onComplete?.({ response: data.response, toolsUsed: data.toolsUsed });
                    break;
                    
                  case 'error':
                    setError(data.error);
                    onError?.(data.error);
                    break;
                }

                onProgress?.(event);
              } catch (e) {
                console.error('Failed to parse SSE data:', e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setIsStreaming(false);
    }
  }, [engineId, engineType, config, onProgress, onChunk, onComplete, onError, reset]);

  return {
    sendMessage,
    isStreaming,
    currentProgress,
    streamedText,
    toolsExecuted,
    error,
    reset
  };
}

// ========================================
// COMPONENT: ProgressIndicator
// ========================================

interface ProgressIndicatorProps {
  isActive: boolean;
  currentStep: string;
  toolsExecuted: string[];
  className?: string;
}

export function ProgressIndicator({ 
  isActive, 
  currentStep, 
  toolsExecuted,
  className = '' 
}: ProgressIndicatorProps) {
  if (!isActive && !currentStep && toolsExecuted.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ${className}`}>
      {/* Spinner and Status */}
      <div className="flex items-center gap-2">
        {isActive && (
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        )}
        {!isActive && currentStep === 'Complete' && (
          <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentStep || 'Ready'}
        </span>
      </div>

      {/* Tools Executed */}
      {toolsExecuted.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {toolsExecuted.map((tool, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              🔧 {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPONENT: StreamingMessage
// ========================================

interface StreamingMessageProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamingMessage({ text, isStreaming, className = '' }: StreamingMessageProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {text}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
      )}
    </div>
  );
}

// ========================================
// COMPONENT: RealTimeToolsPanel
// ========================================

interface ToolExecution {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

interface RealTimeToolsPanelProps {
  tools: ToolExecution[];
  className?: string;
}

export function RealTimeToolsPanel({ tools, className = '' }: RealTimeToolsPanelProps) {
  if (tools.length === 0) return null;

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-lg shadow-sm ${className}`}>
      <div className="px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tool Executions
        </h3>
      </div>
      <div className="divide-y dark:divide-gray-700">
        {tools.map((tool, index) => (
          <div key={index} className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tool.status === 'running' && (
                <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
              )}
              {tool.status === 'complete' && (
                <span className="text-green-500">✓</span>
              )}
              {tool.status === 'error' && (
                <span className="text-red-500">✗</span>
              )}
              {tool.status === 'pending' && (
                <span className="text-gray-400">○</span>
              )}
              <span className="text-sm font-mono">{tool.name}</span>
            </div>
            {tool.endTime && tool.startTime && (
              <span className="text-xs text-gray-500">
                {tool.endTime - tool.startTime}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  useStreamingChat,
  ProgressIndicator,
  StreamingMessage,
  RealTimeToolsPanel
};
