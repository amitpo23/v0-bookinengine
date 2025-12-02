"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { HotelConfig } from "@/types/saas"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  bookingData?: {
    checkIn?: string
    checkOut?: string
    guests?: number
    roomType?: string
    price?: number
  }
}

interface AiChatWidgetProps {
  hotelConfig: HotelConfig
  language?: "he" | "en"
  embedded?: boolean
}

// SVG Icons as inline components
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

const BotIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
  </svg>
)

export function AiChatWidget({ hotelConfig, language = "he", embedded = false }: AiChatWidgetProps) {
  const isRtl = language === "he"
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(embedded)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const t = {
    he: {
      placeholder: "הקלד הודעה...",
      send: "שלח",
      typing: "מקליד...",
      welcome: hotelConfig.aiChatSettings.welcomeMessageHe,
      quickActions: ["בדוק זמינות", "מחירים", "שירותי המלון", "צור קשר"],
      bookNow: "הזמן עכשיו",
      poweredBy: "מופעל על ידי AI",
    },
    en: {
      placeholder: "Type a message...",
      send: "Send",
      typing: "Typing...",
      welcome: hotelConfig.aiChatSettings.welcomeMessage,
      quickActions: ["Check Availability", "Prices", "Hotel Services", "Contact"],
      bookNow: "Book Now",
      poweredBy: "Powered by AI",
    },
  }

  const texts = t[language]

  useEffect(() => {
    // Add welcome message on mount
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: texts.welcome,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response - in production this would call the AI API
    setTimeout(() => {
      const aiResponse = generateAiResponse(input, language, hotelConfig)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse.content,
          timestamp: new Date(),
          bookingData: aiResponse.bookingData,
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    handleSend()
  }

  if (!embedded && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        style={{ backgroundColor: hotelConfig.primaryColor }}
      >
        <SparklesIcon className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <Card
      className={cn(
        "flex flex-col bg-background shadow-2xl",
        embedded ? "w-full h-full" : "fixed bottom-6 left-6 z-50 w-96 h-[600px] rounded-2xl",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-2xl text-white"
        style={{ backgroundColor: hotelConfig.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <BotIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">{hotelConfig.name}</h3>
            <p className="text-xs opacity-80">{texts.poweredBy}</p>
          </div>
        </div>
        {!embedded && (
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "assistant" ? "bg-primary/10" : "bg-muted",
              )}
            >
              {message.role === "assistant" ? (
                <BotIcon className="w-4 h-4 text-primary" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2",
                message.role === "assistant"
                  ? "bg-muted rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none",
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Booking Card */}
              {message.bookingData && (
                <div className="mt-3 p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {message.bookingData.checkIn} - {message.bookingData.checkOut}
                    </span>
                  </div>
                  {message.bookingData.roomType && (
                    <p className="text-sm text-muted-foreground">{message.bookingData.roomType}</p>
                  )}
                  {message.bookingData.price && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${message.bookingData.price}</span>
                      <Button size="sm" style={{ backgroundColor: hotelConfig.primaryColor }}>
                        {texts.bookNow}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BotIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {texts.quickActions.map((action) => (
              <Badge
                key={action}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={texts.placeholder}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping}
            style={{ backgroundColor: hotelConfig.primaryColor }}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

// Helper function to generate AI responses
function generateAiResponse(
  input: string,
  language: "he" | "en",
  hotelConfig: HotelConfig,
): { content: string; bookingData?: Message["bookingData"] } {
  const lowerInput = input.toLowerCase()

  // Detect intent and respond accordingly
  if (lowerInput.includes("זמינות") || lowerInput.includes("availability") || lowerInput.includes("בדוק")) {
    if (language === "he") {
      return {
        content: `מצוין! אשמח לבדוק זמינות ב${hotelConfig.name}. לאילו תאריכים אתה מחפש? וכמה אורחים יהיו?`,
      }
    }
    return {
      content: `Great! I'd be happy to check availability at ${hotelConfig.name}. What dates are you looking for? And how many guests?`,
    }
  }

  if (lowerInput.includes("מחיר") || lowerInput.includes("price") || lowerInput.includes("עלות")) {
    if (language === "he") {
      return {
        content: `המחירים ב${hotelConfig.name} משתנים לפי סוג החדר והתאריכים. הנה דוגמה לחדר זמין:`,
        bookingData: {
          checkIn: "15/12/2025",
          checkOut: "18/12/2025",
          guests: 2,
          roomType: "חדר דלוקס עם נוף לים",
          price: 450,
        },
      }
    }
    return {
      content: `Prices at ${hotelConfig.name} vary by room type and dates. Here's an example of an available room:`,
      bookingData: {
        checkIn: "Dec 15, 2025",
        checkOut: "Dec 18, 2025",
        guests: 2,
        roomType: "Deluxe Room with Sea View",
        price: 450,
      },
    }
  }

  if (lowerInput.includes("שירות") || lowerInput.includes("service") || lowerInput.includes("amenities")) {
    if (language === "he") {
      return {
        content: `${hotelConfig.name} מציע מגוון שירותים:\n\n🏊 בריכה מחוממת\n🍽️ מסעדה כשרה\n💆 ספא ועיסויים\n🏋️ חדר כושר\n🅿️ חניה חינם\n📶 WiFi מהיר\n\nהאם יש שירות ספציפי שמעניין אותך?`,
      }
    }
    return {
      content: `${hotelConfig.name} offers a variety of services:\n\n🏊 Heated Pool\n🍽️ Restaurant\n💆 Spa & Massage\n🏋️ Fitness Center\n🅿️ Free Parking\n📶 High-Speed WiFi\n\nIs there a specific service you'd like to know more about?`,
    }
  }

  // Default response
  if (language === "he") {
    return {
      content: `תודה על פנייתך! אני כאן לעזור לך להזמין חדר ב${hotelConfig.name}. אתה יכול לשאול אותי על:\n\n• זמינות ומחירים\n• סוגי חדרים\n• שירותי המלון\n• מדיניות ביטולים\n\nאיך אוכל לעזור?`,
    }
  }
  return {
    content: `Thank you for reaching out! I'm here to help you book a room at ${hotelConfig.name}. You can ask me about:\n\n• Availability & Prices\n• Room Types\n• Hotel Services\n• Cancellation Policy\n\nHow can I assist you?`,
  }
}
