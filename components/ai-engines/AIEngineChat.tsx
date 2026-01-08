'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ChevronDown, Settings, Phone, MessageSquare, TrendingUp, Users, Headphones, Building2, Sparkles } from 'lucide-react';

// Engine type icons
const engineIcons: Record<string, React.ReactNode> = {
  'hotel-booking': <Building2 className="w-5 h-5" />,
  'travel-agent': <Sparkles className="w-5 h-5" />,
  'concierge': <MessageSquare className="w-5 h-5" />,
  'voice-agent': <Phone className="w-5 h-5" />,
  'price-monitor': <TrendingUp className="w-5 h-5" />,
  'support-agent': <Headphones className="w-5 h-5" />,
  'group-booking': <Users className="w-5 h-5" />,
  'multi-agent': <Bot className="w-5 h-5" />
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsExecuted?: { name: string; success: boolean }[];
}

interface Engine {
  instanceId: string;
  templateId: string;
  name: string;
  type: string;
  status: string;
  activeConversations: number;
}

interface Persona {
  name: string;
  nameHe?: string;
  role: string;
  roleHe?: string;
}

export function AIEngineChat() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<Engine | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch available engines
  useEffect(() => {
    async function fetchEngines() {
      try {
        const response = await fetch('/api/ai-engines?action=engines');
        const data = await response.json();
        if (data.success) {
          setEngines(data.engines);
        }
      } catch (error) {
        console.error('Failed to fetch engines:', error);
      }
    }
    fetchEngines();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start conversation with selected engine
  async function startConversation(engine: Engine) {
    setSelectedEngine(engine);
    setIsLoading(true);
    setMessages([]);

    try {
      const response = await fetch('/api/ai-engines?action=start-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineId: engine.instanceId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConversationId(data.conversation.conversationId);
        setPersona(data.conversation.persona);
        
        // Add greeting message
        const greeting = language === 'he' && data.greetingHe 
          ? data.greetingHe 
          : data.greeting;
        
        setMessages([{
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: greeting,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsLoading(false);
      setIsEngineDropdownOpen(false);
    }
  }

  // Send message
  async function sendMessage() {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-engines/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content,
          language
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-resp`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          toolsExecuted: data.toolsExecuted
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Error message
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: `שגיאה: ${data.error}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'מצטער, אירעה שגיאה. אנא נסה שוב.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        {/* Engine Selector */}
        <div className="relative">
          <button
            onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {selectedEngine ? (
              <>
                <span className="text-purple-400">
                  {engineIcons[selectedEngine.type] || <Bot className="w-5 h-5" />}
                </span>
                <span className="text-white font-medium">{selectedEngine.name}</span>
              </>
            ) : (
              <>
                <Bot className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">בחר מנוע AI</span>
              </>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown */}
          {isEngineDropdownOpen && (
            <div className="absolute top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-2">
                {engines.map(engine => (
                  <button
                    key={engine.instanceId}
                    onClick={() => startConversation(engine)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedEngine?.instanceId === engine.instanceId
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <span className="text-purple-400">
                      {engineIcons[engine.type] || <Bot className="w-5 h-5" />}
                    </span>
                    <div className="flex-1 text-right">
                      <div className="font-medium">{engine.name}</div>
                      <div className="text-xs text-slate-400">{engine.type}</div>
                    </div>
                    {engine.status === 'active' && (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            {language === 'he' ? 'EN' : 'עב'}
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Persona Info */}
      {persona && (
        <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {(language === 'he' ? persona.nameHe?.[0] : persona.name[0]) || 'A'}
          </div>
          <div>
            <div className="text-white font-medium">
              {language === 'he' ? persona.nameHe || persona.name : persona.name}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'he' ? persona.roleHe || persona.role : persona.role}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !selectedEngine && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'he' ? 'מנועי AI להזמנות' : 'AI Booking Engines'}
            </h2>
            <p className="text-slate-400 max-w-md">
              {language === 'he' 
                ? 'בחר מנוע AI מהתפריט למעלה כדי להתחיל שיחה. כל מנוע מתמחה בתחום אחר.'
                : 'Select an AI engine from the menu above to start a conversation. Each engine specializes in different areas.'}
            </p>
            
            {/* Quick engine selection */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {engines.slice(0, 4).map(engine => (
                <button
                  key={engine.instanceId}
                  onClick={() => startConversation(engine)}
                  className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-all hover:border-purple-500/50"
                >
                  <span className="text-purple-400">
                    {engineIcons[engine.type] || <Bot className="w-6 h-6" />}
                  </span>
                  <span className="text-white font-medium text-sm">{engine.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              {message.role === 'user' 
                ? <User className="w-4 h-4 text-white" />
                : <Bot className="w-4 h-4 text-white" />}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-left' : 'text-right'}`}>
              <div className={`inline-block p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-slate-700/70 text-slate-100 rounded-bl-md'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {/* Tool execution badges */}
              {message.toolsExecuted && message.toolsExecuted.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.toolsExecuted.map((tool, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tool.success 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-slate-500 mt-1">
                {message.timestamp.toLocaleTimeString(language === 'he' ? 'he-IL' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-700/70 rounded-2xl rounded-bl-md p-3">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'he' ? 'הקלד הודעה...' : 'Type a message...'}
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={!conversationId || isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || !conversationId || isLoading}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
