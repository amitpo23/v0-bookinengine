"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Settings,
  Download,
  Upload,
  Trash2,
  Plus,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  Loader2,
  Code,
  FileText,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatbotUITemplate() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState("1");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm a demo chatbot template. In a real implementation, this would connect to your preferred LLM provider (OpenAI, Anthropic, etc.) and provide intelligent responses based on the conversation context.",
        timestamp: new Date(),
      };

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, aiMessage] }
            : session
        )
      );
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
    };
    setSessions([...sessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    if (sessions.length === 1) return;
    setSessions(sessions.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(sessions[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-slate-950/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-white">ChatBot UI</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={createNewSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2">
              <p className="text-xs text-slate-400 px-3 py-2 uppercase tracking-wider">
                Conversations
              </p>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer mb-1 ${
                    currentSessionId === session.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">
                    {session.title}
                  </span>
                  {sessions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center bg-slate-800 text-slate-300 border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Demo Template
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 border-b border-slate-700/50 bg-slate-950/30 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h2 className="text-white font-semibold">ChatBot UI</h2>
                <p className="text-xs text-slate-400">Open-source chat interface</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {!currentSession || currentSession.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="max-w-3xl text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 mb-6">
                    <Bot className="w-10 h-10 text-blue-400" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Welcome to ChatBot UI
                  </h1>
                  <p className="text-slate-400 text-lg mb-8">
                    A modern, customizable chat interface for AI conversations
                  </p>

                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm mb-1">Open Source</p>
                        <p className="text-slate-400 text-xs">
                          Fully customizable and extensible
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm mb-1">Fast & Modern</p>
                        <p className="text-slate-400 text-xs">
                          Built with latest technologies
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm mb-1">AI-Powered</p>
                        <p className="text-slate-400 text-xs">
                          Connect to any LLM provider
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-6 space-y-6">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-white border border-slate-700/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-slate-700 text-white">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl px-4 py-3 bg-slate-800 border border-slate-700/50">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 bg-slate-950/30 backdrop-blur-xl p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 min-h-[60px] max-h-[200px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 h-[60px] px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                This is a template demonstration • Messages are simulated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
