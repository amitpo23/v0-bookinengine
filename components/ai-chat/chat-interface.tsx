"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useHotelConfig } from "@/lib/hotel-config-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookingFlow } from "./booking-flow"

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
  agentName?: string
  agentAvatar?: string
  darkMode?: boolean
}

// SVG Icons
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const BotIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={cn("w-3.5 h-3.5", filled ? "fill-amber-400 text-amber-400" : "fill-slate-600 text-slate-600")}
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const WifiIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
)

const PoolIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16s1-1 4-1 5 2 8 2 4-1 4-1M4 20s1-1 4-1 5 2 8 2 4-1 4-1M12 4v4m-4 0h8"
    />
  </svg>
)

const BreakfastIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
    />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

interface BookingRoom {
  code: string
  name: string
  hotelName: string
  hotelId: number
  roomType: string
  price: number
  currency: string
  board: string
  cancellation: string
  dateFrom: string
  dateTo: string
  adults: number
  children: number[]
  image?: string
}

function HotelCard({
  hotel,
  isRtl,
  onSelect,
  searchContext,
  darkMode = true,
}: {
  hotel: any
  isRtl: boolean
  onSelect: (room: BookingRoom) => void
  searchContext?: { dateFrom: string; dateTo: string; adults: number; children: number[] }
  darkMode?: boolean
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)

  const images =
    hotel.images?.length > 0
      ? hotel.images
      : [hotel.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(hotel.name + " hotel room")}`]

  const facilities = hotel.facilities || hotel.amenities || []
  const facilityIcons: Record<string, React.ReactNode> = {
    wifi: <WifiIcon />,
    pool: <PoolIcon />,
    breakfast: <BreakfastIcon />,
  }

  const rating = hotel.rating || hotel.stars || 4

  const handleSelectRoom = () => {
    onSelect({
      code: hotel.code || "",
      name: hotel.name,
      hotelName: hotel.hotelName || hotel.name,
      hotelId: hotel.hotelId || 0,
      roomType: hotel.roomType || hotel.room_type || "Standard Room",
      price: hotel.price || hotel.pricePerNight || 0,
      currency: hotel.currency || "USD",
      board: hotel.board || hotel.meals || "RO",
      cancellation: hotel.cancellation?.type || hotel.cancellation || "non-refundable",
      dateFrom: searchContext?.dateFrom || "",
      dateTo: searchContext?.dateTo || "",
      adults: searchContext?.adults || 2,
      children: searchContext?.children || [],
      image: images[0],
    })
  }

  return (
    <Card
      className={cn(
        "overflow-hidden backdrop-blur-sm border transition-all duration-300 group hover:shadow-xl",
        darkMode
          ? "bg-slate-800/80 border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
          : "bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20",
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(hotel.name + " hotel")}`
          }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
            darkMode ? "from-slate-900/90" : "from-black/60",
          )}
        />

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75",
                )}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            liked ? "bg-rose-500 text-white" : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50",
          )}
        >
          <HeartIcon />
        </button>

        {(hotel.cancellation?.type === "free" || hotel.cancellation === "fully-refundable") && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-medium bg-emerald-500/90 text-white rounded-full backdrop-blur-sm">
            {isRtl ? "ביטול חינם" : "Free Cancel"}
          </span>
        )}

        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-2xl font-bold text-white drop-shadow-lg">
            ${hotel.price?.toFixed(0) || hotel.pricePerNight?.toFixed(0) || "---"}
          </p>
          <p className="text-[10px] text-white/80">{isRtl ? "ללילה" : "/night"}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold text-sm truncate", darkMode ? "text-white" : "text-slate-900")}>
              {hotel.name}
            </h4>
            {hotel.location && (
              <p
                className={cn("flex items-center gap-1 text-xs mt-0.5", darkMode ? "text-slate-400" : "text-slate-500")}
              >
                <LocationIcon />
                <span className="truncate">{hotel.location}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < rating} />
            ))}
          </div>
        </div>

        {hotel.description && (
          <p className={cn("text-xs line-clamp-2", darkMode ? "text-slate-400" : "text-slate-600")}>
            {hotel.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {facilities.slice(0, 4).map((facility: string, idx: number) => {
            const facilityLower = facility.toLowerCase()
            const icon = Object.entries(facilityIcons).find(([key]) => facilityLower.includes(key))?.[1]
            return (
              <span
                key={idx}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-[10px] rounded-full",
                  darkMode ? "text-slate-400 bg-slate-700/50" : "text-slate-600 bg-slate-100",
                )}
              >
                {icon || <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/30" />}
                <span className="truncate max-w-[80px]">{facility}</span>
              </span>
            )
          })}
        </div>

        <div
          className={cn(
            "flex items-center justify-between text-xs pt-1 border-t",
            darkMode ? "text-slate-400 border-white/5" : "text-slate-500 border-slate-200",
          )}
        >
          <span>{hotel.roomType || hotel.room_type || (isRtl ? "חדר סטנדרטי" : "Standard Room")}</span>
          <span className="flex items-center gap-1">
            <BreakfastIcon />
            {hotel.meals || hotel.board || (isRtl ? "לינה בלבד" : "Room Only")}
          </span>
        </div>

        <Button
          className="w-full h-10 text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          onClick={handleSelectRoom}
        >
          {isRtl ? "בחר והמשך" : "Select & Continue"}
        </Button>
      </div>
    </Card>
  )
}

export function ChatInterface({
  hotelId,
  language = "he",
  embedded = false,
  agentName,
  agentAvatar,
  darkMode = true,
}: ChatInterfaceProps) {
  const { currentHotel } = useHotelConfig()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<BookingRoom | null>(null)
  const [searchContext, setSearchContext] = useState<{
    dateFrom: string
    dateTo: string
    adults: number
    children: number[]
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isRtl = language === "he"
  const hotel = currentHotel || {
    id: "demo-hotel",
    name: agentName || (isRtl ? "מלון הדוגמה" : "Demo Hotel"),
    city: isRtl ? "תל אביב" : "Tel Aviv",
    apiSettings: {
      provider: "medici" as const,
      mediciHotelName: "Dizengoff Inn",
      mediciCity: "Tel Aviv",
    },
    aiChatSettings: {
      welcomeMessage: "Hello! I'm your AI booking assistant. How can I help you find the perfect room?",
      welcomeMessageHe: "שלום! אני העוזר החכם שלך להזמנות. איך אוכל לעזור לך למצוא את החדר המושלם?",
      suggestedQuestions: [],
      systemInstructions: "",
      knowledgeBase: "",
    },
  }

  useEffect(() => {
    if (messages.length === 0 && hotel) {
      const displayName = agentName || hotel.name
      const welcomeMessage = isRtl
        ? hotel.aiChatSettings?.welcomeMessageHe || `שלום! אני ${displayName}. איך אוכל לעזור לך היום?`
        : hotel.aiChatSettings?.welcomeMessage || `Hello! I'm ${displayName}. How can I help you today?`

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [hotel, isRtl, messages.length, agentName])

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

      if (data.searchContext) {
        setSearchContext(data.searchContext)
      }

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

  const handleSelectRoom = (room: BookingRoom) => {
    setSelectedRoom(room)
  }

  const handleBookingComplete = (result: { success: boolean; confirmationNumber?: string; error?: string }) => {
    if (result.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: isRtl
            ? `מעולה! ההזמנה אושרה בהצלחה! מספר אישור: ${result.confirmationNumber}. אישור נשלח לאימייל שלך.`
            : `Excellent! Your booking is confirmed! Confirmation number: ${result.confirmationNumber}. Confirmation sent to your email.`,
          timestamp: new Date(),
          bookingData: {
            type: "booking_confirmation",
            data: { confirmationNumber: result.confirmationNumber },
          },
        },
      ])
    }
    setSelectedRoom(null)
  }

  const quickActions = isRtl
    ? ["חפש חדר בדובאי", "מה הזמינות לסוף השבוע?", "כמה עולה חדר זוגי?", "האם יש בריכה?"]
    : ["Search room in Dubai", "Weekend availability?", "Double room price?", "Is there a pool?"]

  if (selectedRoom) {
    return (
      <div
        className={cn(
          "flex flex-col h-full p-4",
          darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-slate-50",
          embedded ? "rounded-2xl overflow-hidden shadow-2xl" : "",
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <BookingFlow
          room={selectedRoom}
          isRtl={isRtl}
          onComplete={handleBookingComplete}
          onCancel={() => setSelectedRoom(null)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        darkMode ? "bg-black" : "bg-slate-50",
        embedded ? "rounded-2xl overflow-hidden shadow-2xl" : "",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header with Agent Info */}
      <div className={cn("relative overflow-hidden border-b", darkMode ? "border-white/10" : "border-slate-200")}>
        <div
          className={cn(
            "absolute inset-0",
            darkMode
              ? "bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-emerald-600/10"
              : "bg-gradient-to-r from-emerald-50 to-cyan-50",
          )}
        />
        <div className="relative flex items-center gap-4 p-5 backdrop-blur-xl">
          <div className="relative">
            {agentAvatar ? (
              <img
                src={agentAvatar || "/placeholder.svg"}
                alt={agentName || "Agent"}
                className="w-12 h-12 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <BotIcon />
              </div>
            )}
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full",
                darkMode ? "border-2 border-black" : "border-2 border-white",
              )}
            />
          </div>
          <div className="flex-1">
            <h3 className={cn("font-bold text-lg", darkMode ? "text-white" : "text-slate-900")}>
              {agentName || hotel?.name || "AI Assistant"}
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {isRtl ? "מקוון" : "Online"}
              </span>
              <span className={darkMode ? "text-slate-600" : "text-slate-400"}>•</span>
              <span className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
                {isRtl ? "זמן תגובה: מיידי" : "Response: Instant"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" &&
              (agentAvatar ? (
                <img
                  src={agentAvatar || "/placeholder.svg"}
                  alt={agentName || "Agent"}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <BotIcon />
                </div>
              ))}

            <div className={cn("max-w-[85%] space-y-3")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 shadow-lg",
                  message.role === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-br-md"
                    : darkMode
                      ? "bg-slate-800/80 backdrop-blur-sm text-slate-100 border border-white/5 rounded-bl-md"
                      : "bg-white text-slate-900 border border-slate-200 rounded-bl-md",
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.bookingData?.type === "search_results" && message.bookingData.data.rooms && (
                <div className="grid gap-4 mt-4">
                  {message.bookingData.data.rooms.map((room: any, idx: number) => (
                    <HotelCard
                      key={idx}
                      hotel={room}
                      isRtl={isRtl}
                      onSelect={handleSelectRoom}
                      searchContext={searchContext || message.bookingData?.data.searchContext}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}

              {message.bookingData?.type === "booking_confirmation" && (
                <Card
                  className={cn(
                    "mt-3 p-5 backdrop-blur-sm",
                    darkMode
                      ? "bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200",
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        darkMode ? "bg-emerald-500/20" : "bg-emerald-100",
                      )}
                    >
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-500 text-lg">
                        {isRtl ? "ההזמנה אושרה!" : "Booking Confirmed!"}
                      </p>
                      <p className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-600")}>
                        {isRtl
                          ? `מספר אישור: ${message.bookingData.data.confirmationNumber}`
                          : `Confirmation: ${message.bookingData.data.confirmationNumber}`}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <p className={cn("text-[10px] px-1", darkMode ? "text-slate-600" : "text-slate-400")}>
                {message.timestamp.toLocaleTimeString(isRtl ? "he-IL" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {message.role === "user" && (
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center",
                  darkMode
                    ? "bg-gradient-to-br from-slate-600 to-slate-700"
                    : "bg-gradient-to-br from-slate-200 to-slate-300",
                )}
              >
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            {agentAvatar ? (
              <img
                src={agentAvatar || "/placeholder.svg"}
                alt={agentName || "Agent"}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BotIcon />
              </div>
            )}
            <div
              className={cn(
                "rounded-2xl rounded-bl-md px-4 py-3 border",
                darkMode ? "bg-slate-800/80 backdrop-blur-sm border-white/5" : "bg-white border-slate-200",
              )}
            >
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full transition-colors border",
                  darkMode
                    ? "text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border-white/5"
                    : "text-slate-600 bg-white hover:bg-slate-100 border-slate-200",
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={cn(
          "p-4 border-t backdrop-blur-xl",
          darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-white/50",
        )}
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRtl ? "כתוב הודעה..." : "Type a message..."}
            className={cn(
              "flex-1 rounded-xl px-4 py-3 focus:outline-none transition-colors border",
              darkMode
                ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:border-emerald-500/50"
                : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50",
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon />
          </Button>
        </form>
      </div>
    </div>
  )
}
