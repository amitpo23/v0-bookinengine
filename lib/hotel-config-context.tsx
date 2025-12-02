"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { HotelConfig } from "@/types/saas"

interface HotelConfigContextType {
  currentHotel: HotelConfig | null
  setCurrentHotel: (hotel: HotelConfig) => void
  hotels: HotelConfig[]
  addHotel: (hotel: HotelConfig) => void
  updateHotel: (hotel: HotelConfig) => void
  deleteHotel: (hotelId: string) => void
  isWidgetEnabled: boolean
  isAiChatEnabled: boolean
}

const defaultHotel: HotelConfig = {
  id: "demo-hotel",
  name: "מלון הדגמה",
  hotelId: "demo-1",
  hotelName: "Demo Hotel",
  city: "Tel Aviv",
  stars: 5,
  currency: "₪",
  enableWidget: true,
  enableAiChat: true,
  plan: "enterprise",
  apiSettings: {
    mediciHotelId: "",
    mediciHotelName: "",
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

const HotelConfigContext = createContext<HotelConfigContextType | undefined>(undefined)

export function HotelConfigProvider({ children }: { children: ReactNode }) {
  const [hotels, setHotels] = useState<HotelConfig[]>([defaultHotel])
  const [currentHotel, setCurrentHotelState] = useState<HotelConfig | null>(defaultHotel)

  useEffect(() => {
    const saved = localStorage.getItem("hotelConfigs")
    if (saved) {
      const parsed = JSON.parse(saved)
      setHotels(parsed)
      setCurrentHotelState(parsed[0] || defaultHotel)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("hotelConfigs", JSON.stringify(hotels))
  }, [hotels])

  const setCurrentHotel = (hotel: HotelConfig) => {
    setCurrentHotelState(hotel)
  }

  const addHotel = (hotel: HotelConfig) => {
    setHotels((prev) => [...prev, hotel])
  }

  const updateHotel = (hotel: HotelConfig) => {
    setHotels((prev) => prev.map((h) => (h.id === hotel.id ? hotel : h)))
    if (currentHotel?.id === hotel.id) {
      setCurrentHotelState(hotel)
    }
  }

  const deleteHotel = (hotelId: string) => {
    setHotels((prev) => prev.filter((h) => h.id !== hotelId))
    if (currentHotel?.id === hotelId) {
      setCurrentHotelState(hotels[0] || null)
    }
  }

  return (
    <HotelConfigContext.Provider
      value={{
        currentHotel,
        setCurrentHotel,
        hotels,
        addHotel,
        updateHotel,
        deleteHotel,
        isWidgetEnabled: currentHotel?.enableWidget ?? false,
        isAiChatEnabled: currentHotel?.enableAiChat ?? false,
      }}
    >
      {children}
    </HotelConfigContext.Provider>
  )
}

export function useHotelConfig() {
  const context = useContext(HotelConfigContext)
  if (!context) {
    throw new Error("useHotelConfig must be used within HotelConfigProvider")
  }
  return context
}
