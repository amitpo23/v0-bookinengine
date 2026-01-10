"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Plane, 
  MapPin, 
  Hotel, 
  Sparkles,
  MessageSquare,
  Database,
  LayoutDashboard,
  Calendar,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AITravelAgentTemplate() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedPrompts = [
    { 
      icon: <Plane className="w-4 h-4" />, 
      text: "Help me plan a vacation", 
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
    },
    { 
      icon: <MapPin className="w-4 h-4" />, 
      text: "Best destinations for summer", 
      color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
    },
    { 
      icon: <Hotel className="w-4 h-4" />, 
      text: "Find hotels in Paris", 
      color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" 
    },
    { 
      icon: <Sparkles className="w-4 h-4" />, 
      text: "Recommend activities", 
      color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" 
    },
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
        content: "I'd be happy to help you with your travel plans! Based on your interests, I can recommend some amazing destinations and hotels that would be perfect for your trip. What type of experience are you looking for?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Travel Agent Platform
          </h1>
          <p className="text-slate-600 text-lg">
            Your intelligent travel companion powered by AI
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <MessageSquare className="w-3 h-3 mr-1" />
              24/7 Available
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Database className="w-3 h-3 mr-1" />
              Knowledge Base
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart Recommendations
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          {sidebarOpen && (
            <Card className="lg:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                    <Bot className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">AI Agents</p>
                      <p className="text-xs text-slate-600">Custom personalities & behaviors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50">
                    <Database className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Knowledge Base</p>
                      <p className="text-xs text-slate-600">Rich travel information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                    <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Booking System</p>
                      <p className="text-xs text-slate-600">Real-time availability</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <p className="text-sm font-medium mb-2">✨ Demo Mode</p>
                  <p className="text-xs opacity-90">
                    This is a template demonstration of the AI Travel Agent Platform
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Area */}
          <Card className="lg:col-span-3 shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="border-b bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src="/placeholder-agent.png" alt="Agent" />
                    <AvatarFallback className="bg-white text-blue-600">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">Travel Agent AI</p>
                    <p className="text-blue-100 text-sm">Online • Ready to help</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="text-center max-w-2xl mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
                        <Sparkles className="w-10 h-10 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                      <p className="text-slate-600">
                        Ask me anything about travel destinations, hotel bookings, or planning your perfect vacation
                      </p>
                    </div>

                    {/* Suggested Prompts */}
                    <div className="w-full max-w-2xl">
                      <p className="text-sm text-slate-500 mb-3 text-center">Try asking:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {suggestedPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className={`justify-start gap-2 h-auto py-3 px-4 ${prompt.color} border`}
                            onClick={() => handleSendMessage(prompt.text)}
                          >
                            {prompt.icon}
                            <span className="text-sm">{prompt.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-slate-200">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl px-4 py-3 bg-slate-100">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Agents</h3>
              <p className="text-slate-600 text-sm">
                Create intelligent chatbots with custom personalities and specialized knowledge for travel and hospitality
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Rich Knowledge Base</h3>
              <p className="text-slate-600 text-sm">
                Build comprehensive databases with hotel information, travel policies, and destination guides
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Booking Integration</h3>
              <p className="text-slate-600 text-sm">
                Seamlessly integrate with booking systems and manage reservations through conversational AI
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
