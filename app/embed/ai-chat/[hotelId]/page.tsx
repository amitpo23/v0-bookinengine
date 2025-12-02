"use client"

import { useParams } from "next/navigation"
import { HotelConfigProvider, useHotelConfig } from "@/lib/hotel-config-context"
import { ChatInterface } from "@/components/ai-chat/chat-interface"
import type { HotelConfig } from "@/types/saas"

// Demo hotel config
const demoHotelConfig: HotelConfig = {
  id: "demo",
  name: "מלון הדגמה",
  hotelId: "demo-1",
  hotelName: "Demo Hotel",
  city: "Tel Aviv",
  stars: 5,
  currency: "₪",
  enableWidget: false,
  enableAiChat: true,
  plan: "enterprise",
  apiSettings: {
    mediciHotelId: "",
    mediciHotelName: "Grand Hotel",
  },
  widgetSettings: {
    language: "he",
    showPrices: true,
    showAvailability: true,
    primaryColor: "#1a56db",
    secondaryColor: "#7c3aed",
  },
  aiChatSettings: {
    welcomeMessage: "Hello! I'm your AI booking assistant. How can I help you today?",
    welcomeMessageHe: "שלום! אני העוזר החכם שלך להזמנות. איך אוכל לעזור לך היום?",
    personality: "professional",
    language: "he",
    primaryColor: "#10b981",
  },
}

function AiChatContent() {
  const params = useParams()
  const hotelId = params.hotelId as string
  const { hotels } = useHotelConfig()

  // Find hotel config or use demo
  const hotelConfig = hotels.find((h) => h.id === hotelId) || demoHotelConfig

  if (!hotelConfig.enableAiChat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="text-center text-slate-400">
          <p>צ'אט AI אינו פעיל עבור מלון זה</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <ChatInterface
        hotelId={hotelId}
        language={hotelConfig.aiChatSettings.language === "both" ? "he" : hotelConfig.aiChatSettings.language}
        embedded
      />
    </div>
  )
}

export default function EmbedAiChatPage() {
  return (
    <HotelConfigProvider>
      <AiChatContent />
    </HotelConfigProvider>
  )
}
