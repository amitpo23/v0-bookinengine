"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useHotelConfig } from "@/lib/hotel-config-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  bookingData?: {
    type: "search_results" | "booking_confirmation" | "room_selection"
    data: any
  }
}

interface ChatInterfaceProps {
  hotelId?: string
  language?: "he" | "en"
  embedded?: boolean
}

export function ChatInterface({ hotelId, language = "he", embedded = false }: ChatInterfaceProps) {
  const { currentHotel } = useHotelConfig()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isRtl = language === "he"
  const hotel = currentHotel || {
    id: "dizengoff-inn",
    name: "Dizengoff Inn",
    city: "Tel Aviv",
    apiSettings: {
      provider: "medici" as const,
      mediciHotelName: "Dizengoff Inn",
      mediciCity: "Tel Aviv",
    },
    aiChatSettings: {
      welcomeMessage:
        "Hello! Welcome to Dizengoff Inn. I'm here to help you book a room. When would you like to arrive?",
      welcomeMessageHe: "שלום! ברוכים הבאים ל-Dizengoff Inn. אני כאן לעזור לך להזמין חדר. מתי תרצו להגיע?",
      suggestedQuestions: [],
    },
  }

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && hotel) {
      const welcomeMessage = isRtl ? hotel.aiChatSettings.welcomeMessageHe : hotel.aiChatSettings.welcomeMessage

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            welcomeMessage ||
            (isRtl
              ? `שלום! ברוכים הבאים ל${hotel.name}. אני כאן לעזור לך להזמין חדר. מתי תרצו להגיע?`
              : `Hello! Welcome to ${hotel.name}. I'm here to help you book a room. When would you like to arrive?`),
          timestamp: new Date(),
        },
      ])
    }
  }, [hotel, isRtl, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/booking-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          hotelConfig: hotel,
          language,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        bookingData: data.bookingData,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: isRtl ? "מצטער, אירעה שגיאה. אנא נסה שוב." : "Sorry, an error occurred. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = isRtl
    ? ["אני רוצה להזמין חדר", "מה הזמינות לסוף השבוע?", "כמה עולה חדר זוגי?", "האם יש חניה במלון?"]
    : ["I want to book a room", "What's available this weekend?", "How much is a double room?", "Do you have parking?"]

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        embedded ? "rounded-2xl overflow-hidden" : "",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{hotel?.name || "AI Booking Assistant"}</h3>
          <p className="text-xs text-slate-400">{isRtl ? "מוכן לעזור לך" : "Ready to help you"}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "bg-slate-800 text-slate-100",
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Booking Data Cards */}
              {message.bookingData?.type === "search_results" && (
                <div className="mt-3 space-y-2">
                  {message.bookingData.data.rooms?.map((room: any, idx: number) => (
                    <Card key={idx} className="p-3 bg-slate-700/50 border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{room.name}</p>
                          <p className="text-xs text-slate-400">{room.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{room.price} ₪</p>
                          <p className="text-xs text-slate-400">{isRtl ? "ללילה" : "/night"}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setInput(isRtl ? `אני רוצה להזמין ${room.name}` : `I want to book ${room.name}`)}
                      >
                        {isRtl ? "בחר חדר זה" : "Select Room"}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {message.bookingData?.type === "booking_confirmation" && (
                <Card className="mt-3 p-4 bg-emerald-900/30 border-emerald-700">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium text-emerald-400">
                      {isRtl ? "ההזמנה אושרה!" : "Booking Confirmed!"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {isRtl
                      ? `מספר הזמנה: ${message.bookingData.data.confirmationNumber}`
                      : `Confirmation #: ${message.bookingData.data.confirmationNumber}`}
                  </p>
                </Card>
              )}

              <p className="text-[10px] text-slate-500 mt-1.5">
                {message.timestamp.toLocaleTimeString(isRtl ? "he-IL" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="bg-slate-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-500 mb-2">{isRtl ? "הצעות מהירות:" : "Quick suggestions:"}</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRtl ? "כתוב הודעה..." : "Type a message..."}
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          {isRtl ? "מופעל על ידי AI • הזמנות מאובטחות" : "Powered by AI • Secure Booking"}
        </p>
      </form>
    </div>
  )
}
