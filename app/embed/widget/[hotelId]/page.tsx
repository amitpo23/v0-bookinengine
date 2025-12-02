"use client"

import { useParams } from "next/navigation"
import { BookingProvider } from "@/lib/booking-context"
import { I18nProvider } from "@/lib/i18n/context"
import { HotelConfigProvider, useHotelConfig } from "@/lib/hotel-config-context"
import { WidgetSearchForm } from "@/components/booking/widget-search-form"
import type { HotelConfig } from "@/types/saas"

// Demo hotel config for embed
const demoHotelConfig: HotelConfig = {
  id: "demo",
  name: "מלון הדגמה",
  hotelId: "demo-1",
  hotelName: "Demo Hotel",
  city: "Tel Aviv",
  stars: 5,
  currency: "₪",
  enableWidget: true,
  enableAiChat: false,
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
    welcomeMessage: "Hello!",
    welcomeMessageHe: "שלום!",
    personality: "professional",
    language: "he",
    primaryColor: "#10b981",
  },
}

function WidgetContent() {
  const params = useParams()
  const hotelId = params.hotelId as string
  const { hotels } = useHotelConfig()

  // Find hotel config or use demo
  const hotelConfig = hotels.find((h) => h.id === hotelId) || demoHotelConfig

  if (!hotelConfig.enableWidget) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-muted-foreground">מנוע ההזמנות אינו פעיל עבור מלון זה</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4">
      <div className="max-w-3xl mx-auto">
        <BookingProvider>
          <I18nProvider>
            <WidgetSearchForm hotelConfig={hotelConfig} />
          </I18nProvider>
        </BookingProvider>
      </div>
    </div>
  )
}

export default function EmbedWidgetPage() {
  return (
    <HotelConfigProvider>
      <WidgetContent />
    </HotelConfigProvider>
  )
}
