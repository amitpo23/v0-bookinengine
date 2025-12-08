"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useHotelConfig } from "@/lib/hotel-config-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookingFlow } from "./booking-flow"
import {
  Wifi,
  Waves,
  UtensilsCrossed,
  Wine,
  Car,
  Dumbbell,
  Sparkles,
  Wind,
  Ban,
  Coffee,
  Building2,
  MapPin,
  Star,
  Bed,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Check,
} from "lucide-react"

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
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  const images = hotel.images?.length > 0 ? hotel.images : hotel.image ? [hotel.image] : []

  const hasImages = images.length > 0 && !imageError
  const currentImage = hasImages ? images[currentImageIndex] : null
  const placeholderImage = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotel.name + " hotel")}`

  const facilityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="h-4 w-4" />,
    internet: <Wifi className="h-4 w-4" />,
    "free internet": <Wifi className="h-4 w-4" />,
    pool: <Waves className="h-4 w-4" />,
    "swimming pool": <Waves className="h-4 w-4" />,
    restaurant: <UtensilsCrossed className="h-4 w-4" />,
    bar: <Wine className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
    gym: <Dumbbell className="h-4 w-4" />,
    fitness: <Dumbbell className="h-4 w-4" />,
    spa: <Sparkles className="h-4 w-4" />,
    "air condition": <Wind className="h-4 w-4" />,
    "no smoking": <Ban className="h-4 w-4" />,
    breakfast: <Coffee className="h-4 w-4" />,
  }

  const facilities = hotel.facilities || []
  const rating = hotel.rating || hotel.stars || 4
  const description = hotel.description || ""

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
      image: currentImage || placeholderImage,
    })
  }

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const bgColor = darkMode ? "bg-slate-800/90" : "bg-white"
  const textColor = darkMode ? "text-white" : "text-gray-900"
  const subtextColor = darkMode ? "text-gray-300" : "text-gray-600"
  const borderColor = darkMode ? "border-slate-700" : "border-gray-200"

  return (
    <div
      className={`rounded-xl overflow-hidden ${bgColor} border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-slate-700">
        {hasImages ? (
          <>
            <img
              src={currentImage || "/placeholder.svg"}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.slice(0, 5).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                  {images.length > 5 && <span className="text-white text-xs ml-1">+{images.length - 5}</span>}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
            <Building2 className="h-16 w-16 text-slate-500" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {hotel.cancellation === "fully-refundable" && (
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {isRtl ? "ביטול חינם" : "Free Cancel"}
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-full transition-colors"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-emerald-400 font-bold text-xl">${hotel.price}</span>
          <span className="text-gray-300 text-sm">/{isRtl ? "לילה" : "night"}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-4 ${textColor}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className={isRtl ? "text-right" : "text-left"}>
            <h3 className="font-bold text-lg">{hotel.hotelName || hotel.name}</h3>
            <div className={`flex items-center gap-1 ${subtextColor} text-sm`}>
              <MapPin className="h-3.5 w-3.5" />
              <span>{hotel.location || hotel.address}</span>
            </div>
          </div>
          {/* Star Rating */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        {/* Room Type & Board */}
        <div className={`flex items-center gap-2 ${subtextColor} text-sm mb-3`}>
          <Bed className="h-4 w-4" />
          <span>{hotel.roomType}</span>
          <span className="text-gray-500">•</span>
          <span>
            {hotel.board === "RO"
              ? isRtl
                ? "ללא ארוחות"
                : "Room Only"
              : hotel.board === "BB"
                ? isRtl
                  ? "ארוחת בוקר"
                  : "Breakfast"
                : hotel.board}
          </span>
        </div>

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {facilities.slice(0, 5).map((facility: string, idx: number) => {
              const icon = facilityIcons[facility.toLowerCase()]
              return (
                <span
                  key={idx}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    darkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {icon || <Check className="h-3 w-3" />}
                  <span className="capitalize">{facility}</span>
                </span>
              )
            })}
          </div>
        )}

        {/* Description (expandable) */}
        {description && (
          <div className="mb-3">
            <p className={`text-sm ${subtextColor} ${showDetails ? "" : "line-clamp-2"}`}>{description}</p>
            {description.length > 100 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-emerald-500 text-sm hover:underline mt-1"
              >
                {showDetails ? (isRtl ? "הצג פחות" : "Show less") : isRtl ? "קרא עוד" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleSelectRoom}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isRtl ? "בחר והמשך" : "Select & Continue"}
          <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
        </button>
      </div>
    </div>
  )
}

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
                <ArrowLeft className="h-4 w-4" />
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
                  <ArrowLeft className="h-4 w-4" />
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
                      <ArrowLeft className="h-4 w-4" />
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
                <ArrowLeft className="h-4 w-4" />
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
                <ArrowLeft className="h-4 w-4" />
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
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
