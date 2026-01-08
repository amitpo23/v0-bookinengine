'use client';

/**
 * Hotel Booking AI - Chat Component
 * Interactive chat interface for booking engines
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Trash2,
  ChevronLeft,
  MoreVertical,
  Copy,
  Check,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useStreamingChat, ProgressIndicator, StreamingMessage } from './StreamingComponents';

// ========================================
// TYPES
// ========================================

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    parameters: Record<string, any>;
  }>;
}

interface EngineInfo {
  id: string;
  templateName: string;
  persona: {
    name: string;
    nameHe: string;
    role: string;
    roleHe: string;
  };
  status: string;
}

// ========================================
// CHAT COMPONENT
// ========================================

interface HotelBookingChatProps {
  instanceId: string;
  language?: 'en' | 'he';
  onBack?: () => void;
  className?: string;
}

export function HotelBookingChat({ 
  instanceId, 
  language = 'en',
  onBack,
  className = ''
}: HotelBookingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [engineInfo, setEngineInfo] = useState<EngineInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isRtl = language === 'he';

  // Streaming chat hook
  const { 
    sendMessage: sendStreamingMessage, 
    isStreaming, 
    currentProgress,
    streamedText,
    toolsExecuted,
    error: streamError,
    reset: resetStream
  } = useStreamingChat({
    engineId: instanceId,
    onComplete: (result) => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString(),
        toolCalls: result.toolsUsed?.map(name => ({ name, parameters: {} }))
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    },
    onError: (err) => {
      setError(err);
      setLoading(false);
    }
  });

  const displayError = error || streamError;

  // Fetch initial data
  useEffect(() => {
    fetchEngineInfo();
    fetchHistory();
  }, [instanceId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchEngineInfo = async () => {
    try {
      const res = await fetch(`/api/hotel-booking-ai?action=engine&id=${instanceId}`);
      const data = await res.json();
      if (data.success) {
        setEngineInfo({
          id: data.data.id,
          templateName: data.data.template.name,
          persona: data.data.template.persona,
          status: data.data.status
        });
        
        // Get greeting if no messages
        const greetingRes = await fetch(`/api/hotel-booking-ai/chat?instanceId=${instanceId}&action=greeting&language=${language}`);
        const greetingData = await greetingRes.json();
        if (greetingData.success && greetingData.data.greeting) {
          setMessages([{
            role: 'assistant',
            content: greetingData.data.greeting,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/hotel-booking-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'history', instanceId })
      });
      const data = await res.json();
      if (data.success && data.data.history.length > 0) {
        setMessages(data.data.history);
      }
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || isStreaming) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input.trim();
    setInput('');
    setLoading(true);
    setError(null);
    resetStream();

    try {
      await sendStreamingMessage(messageToSend);
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
    } finally {
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    try {
      const res = await fetch('/api/hotel-booking-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', instanceId })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([]);
        await fetchEngineInfo(); // Get fresh greeting
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyMessage = async (index: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    // Voice input would be implemented here
    setIsListening(!isListening);
  };

  return (
    <div 
      className={`flex flex-col h-full bg-gray-50 ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {engineInfo?.persona 
                  ? (language === 'he' ? engineInfo.persona.nameHe : engineInfo.persona.name)
                  : (language === 'he' ? 'עוזר הזמנות' : 'Booking Assistant')}
              </h3>
              <p className="text-xs text-gray-500">
                {engineInfo?.persona
                  ? (language === 'he' ? engineInfo.persona.roleHe : engineInfo.persona.role)
                  : engineInfo?.templateName}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-gray-500" />}
          </button>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={language === 'he' ? 'נקה שיחה' : 'Clear chat'}
          >
            <Trash2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? (isRtl ? 'flex-row-reverse' : 'flex-row-reverse') : ''
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Tool calls indicator */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    {message.toolCalls.length} {language === 'he' ? 'כלים הופעלו' : 'tools used'}
                  </div>
                </div>
              )}
              
              {/* Copy button */}
              <button
                onClick={() => copyMessage(index, message.content)}
                className={`absolute -top-2 ${isRtl ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm transition-opacity`}
              >
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>
              
              {/* Timestamp */}
              <div className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString(
                  language === 'he' ? 'he-IL' : 'en-US',
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        
        {/* Streaming message with progress */}
        {isStreaming && streamedText && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-[80%]">
              <StreamingMessage text={streamedText} isStreaming={isStreaming} />
            </div>
          </div>
        )}
        
        {/* Loading indicator with progress */}
        {(loading || isStreaming) && (
          <ProgressIndicator 
            isActive={loading || isStreaming}
            currentStep={currentProgress}
            toolsExecuted={toolsExecuted}
            className="mx-4"
          />
        )}
        
        {/* Error message */}
        {displayError && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-lg px-4 py-3">
            <AlertCircle className="w-5 h-5" />
            <span>{displayError}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'he' ? 'הקלד הודעה...' : 'Type a message...'}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          {language === 'he' 
            ? 'מופעל על ידי Hotel Booking AI'
            : 'Powered by Hotel Booking AI'}
        </p>
      </div>
    </div>
  );
}

export default HotelBookingChat;
