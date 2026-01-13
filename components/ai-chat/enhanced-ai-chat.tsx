"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  skillsUsed?: string[]
  suggestions?: string[]
  confidence?: number
}

interface EnhancedAIChatProps {
  sessionId: string
  onBookingUpdate?: (booking: any) => void
  className?: string
}

export function EnhancedAIChat({
  sessionId,
  onBookingUpdate,
  className,
}: EnhancedAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversation history
  useEffect(() => {
    loadHistory()
  }, [sessionId])

  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/ai-chat?sessionId=${sessionId}`)
      const data = await response.json()

      if (data.success && data.data.messages) {
        setMessages(
          data.data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        )
      }
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: `msg_${Date.now()}_bot`,
          role: "assistant",
          content: data.response.message,
          timestamp: new Date(),
          skillsUsed: data.response.skillsUsed,
          suggestions: data.response.suggestions,
          confidence: data.response.confidence,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setBookingStatus(data.status)

        if (onBookingUpdate && data.status.bookingStage) {
          onBookingUpdate(data.status)
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content: "מצטער, נתקלתי בבעיה. אפשר לנסות שוב?",
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const resetConversation = async () => {
    try {
      await fetch(`/api/ai-chat?sessionId=${sessionId}`, {
        method: "DELETE",
      })
      setMessages([])
      setBookingStatus(null)
    } catch (error) {
      console.error("Failed to reset:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">עוזר AI חכם</h3>
            <p className="text-xs opacity-90">מופעל ב-Skills, Memory & Prediction</p>
          </div>
        </div>

        {bookingStatus && (
          <Badge variant="secondary" className="bg-white/20">
            {bookingStatus.bookingStage || "חיפוש"}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={resetConversation}
          className="text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">שלום! אני כאן לעזור</p>
            <p className="text-sm">ספר לי מה אתה מחפש ואעזור לך למצוא את המלון המושלם</p>
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("אני מחפש מלון בתל אביב לסוף השבוע")
                }}
              >
                מלון בתל אביב
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("מה התאריכים הכי טובים להזמנה?")
                }}
              >
                תאריכים טובים?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("המלץ לי על מלון רומנטי")
                }}
              >
                מלון רומנטי
              </Button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="bg-blue-100 p-2 rounded-full h-fit">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Skills used */}
              {message.skillsUsed && message.skillsUsed.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.skillsUsed.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs"
                    >
                      🔧 {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-white/50 rounded px-2 py-1"
                    >
                      💡 {suggestion}
                    </div>
                  ))}
                </div>
              )}

              {/* Confidence indicator */}
              {message.confidence !== undefined && (
                <div className="mt-2 text-xs opacity-70">
                  ביטחון: {Math.round(message.confidence * 100)}%
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="bg-blue-600 p-2 rounded-full h-fit">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-blue-100 p-2 rounded-full h-fit">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="כתוב הודעה..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Booking status bar */}
        {bookingStatus && bookingStatus.bookingStage && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    ({
                      search: 25,
                      prebook: 50,
                      details: 75,
                      confirmed: 100,
                    } as Record<string, number>)[bookingStatus.bookingStage] || 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs">
              {bookingStatus.messageCount} הודעות
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
