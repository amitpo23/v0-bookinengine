"use client";

import { useState, useRef, useEffect } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles,
  Loader2,
  MessageSquare,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Globe,
  Shield
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function KnowaachatTemplate() {
  return (
    <I18nProvider>
      <KnowaachatContent />
    </I18nProvider>
  );
}

function KnowaachatContent() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What is Knowaachat?",
    "How does AI chat work?",
    "Tell me about your features",
    "How can this help my business?",
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Welcome to Knowaachat! I'm an AI-powered chat assistant designed to provide intelligent, context-aware responses. I can help you with knowledge management, customer support, and business automation. This is a template demonstration showcasing the chat interface and capabilities.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Knowaachat
                </h1>
                <p className="text-sm text-slate-600">AI-Powered Knowledge Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-0">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Features */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Smart AI</p>
                    <p className="text-xs text-slate-600">Advanced language understanding</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Contextual</p>
                    <p className="text-xs text-slate-600">Remembers conversation history</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-pink-50 to-indigo-50">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fast Response</p>
                    <p className="text-xs text-slate-600">Real-time AI processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <MessageSquare className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="font-bold text-lg mb-2">Enterprise Ready</h3>
                <p className="text-sm opacity-90 mb-4">
                  Scale your customer support and knowledge management with AI
                </p>
                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-slate-100">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">AL</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Join 10,000+ users</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Free trial available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <Card className="lg:col-span-2 shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="border-b bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                    <AvatarFallback className="bg-white text-indigo-600">
                      <Bot className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold text-lg">AI Assistant</p>
                    <p className="text-indigo-100 text-sm flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online • Ready to help
                    </p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Badge className="bg-white/20 text-white border-0">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="text-center max-w-lg mb-8">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 mb-6">
                        <Sparkles className="w-12 h-12 text-indigo-600" />
                      </div>
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome to Knowaachat
                      </h2>
                      <p className="text-slate-600 text-lg mb-6">
                        Your intelligent AI assistant for knowledge management and customer support
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <Shield className="w-4 h-4" />
                        <span>Secure & Private • Enterprise-grade encryption</span>
                      </div>
                    </div>

                    {/* Suggested Questions */}
                    <div className="w-full max-w-2xl">
                      <p className="text-sm text-slate-500 mb-3 text-center font-medium">Try asking:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto py-4 px-4 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                            onClick={() => handleSendMessage(question)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                            <span className="text-sm text-left">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="w-10 h-10 flex-shrink-0 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-2xl px-5 py-4 max-w-[80%] shadow-lg ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                              : "bg-white text-slate-900 border border-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.role === "user" ? "text-indigo-200" : "text-slate-400"
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-10 h-10 flex-shrink-0 shadow-lg">
                            <AvatarFallback className="bg-slate-200">
                              <User className="w-5 h-5 text-slate-700" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10 flex-shrink-0 shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl px-5 py-4 bg-white border border-slate-200 shadow-lg">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-5">
                <div className="flex gap-3 items-end">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Press Enter to send)"
                    className="flex-1 min-h-[56px] max-h-[120px] border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none rounded-xl"
                    rows={2}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-[56px] px-8 rounded-xl shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">
                  Powered by advanced AI • Responses are generated in real-time
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">10K+</p>
              <p className="text-sm text-slate-600">Active Users</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">1M+</p>
              <p className="text-sm text-slate-600">Messages Processed</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-3">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">99.9%</p>
              <p className="text-sm text-slate-600">Uptime</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">95%</p>
              <p className="text-sm text-slate-600">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
