"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { HotelConfig, Tenant } from "@/types/saas"

interface SaaSContextType {
  tenant: Tenant | null
  currentHotel: HotelConfig | null
  setCurrentHotel: (hotel: HotelConfig) => void
  hotels: HotelConfig[]
  isLoading: boolean
  updateHotelConfig: (hotelId: string, config: Partial<HotelConfig>) => void
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined)

// Mock tenant data - in production this would come from API/DB
const mockTenant: Tenant = {
  id: "tenant-1",
  name: "מלונות ישראל בע״מ",
  email: "admin@hotels-israel.com",
  plan: "professional",
  billingStatus: "active",
  createdAt: new Date(),
  hotels: [
    {
      id: "hotel-1",
      name: "מלון דן תל אביב",
      hotelId: "medici-12345",
      hotelName: "Dan Tel Aviv",
      city: "Tel Aviv",
      stars: 5,
      currency: "ILS",
      primaryColor: "#1e3a5f",
      secondaryColor: "#d4af37",
      enableWidget: true,
      enableAiChat: true,
      plan: "professional",
      apiSettings: {
        mediciHotelId: "12345",
        mediciHotelName: "Dan Tel Aviv",
      },
      widgetSettings: {
        language: "both",
        showPrices: true,
        showAvailability: true,
        primaryColor: "#1e3a5f",
      },
      aiChatSettings: {
        welcomeMessage: "Hello! I'm your personal booking assistant for Dan Tel Aviv Hotel. How can I help you today?",
        welcomeMessageHe: "שלום! אני העוזר האישי שלך להזמנות במלון דן תל אביב. איך אוכל לעזור לך היום?",
        personality: "luxury",
        language: "both",
      },
    },
    {
      id: "hotel-2",
      name: "מלון הרודס אילת",
      hotelId: "medici-67890",
      hotelName: "Herods Eilat",
      city: "Eilat",
      stars: 5,
      currency: "ILS",
      primaryColor: "#0066cc",
      secondaryColor: "#ff6600",
      enableWidget: true,
      enableAiChat: false,
      plan: "basic",
      apiSettings: {
        mediciHotelId: "67890",
        mediciHotelName: "Herods Eilat",
      },
      widgetSettings: {
        language: "he",
        showPrices: true,
        showAvailability: true,
        primaryColor: "#0066cc",
      },
      aiChatSettings: {
        welcomeMessage: "Welcome to Herods Eilat!",
        welcomeMessageHe: "ברוכים הבאים למלון הרודס אילת!",
        personality: "friendly",
        language: "he",
      },
    },
    {
      id: "hotel-scarlet",
      name: "מלון סקרלט תל אביב",
      hotelId: "scarlet-tlv",
      hotelName: "Scarlet Hotel Tel Aviv",
      city: "Tel Aviv",
      stars: 5,
      currency: "ILS",
      primaryColor: "#DC143C",
      secondaryColor: "#2C3E50",
      enableWidget: true,
      enableAiChat: true,
      plan: "enterprise",
      apiSettings: {
        mediciHotelId: "scarlet-001",
        mediciHotelName: "Scarlet Hotel Tel Aviv",
      },
      widgetSettings: {
        language: "both",
        showPrices: true,
        showAvailability: true,
        primaryColor: "#DC143C",
        secondaryColor: "#E74C3C",
      },
      aiChatSettings: {
        welcomeMessage: "Welcome to Scarlet Hotel Tel Aviv! Where urban meets romance. How can I create an unforgettable experience for you today?",
        welcomeMessageHe: "ברוכים הבאים למלון סקרלט תל אביב! היכן שהאורבני פוגש את הרומנטי. איך אוכל ליצור לכם חוויה בלתי נשכחת היום?",
        personality: "romantic",
        language: "both",
        primaryColor: "#DC143C",
      },
    },
  ],
}

export function SaaSProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [currentHotel, setCurrentHotel] = useState<HotelConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading tenant data
    setTimeout(() => {
      setTenant(mockTenant)
      setCurrentHotel(mockTenant.hotels[0])
      setIsLoading(false)
    }, 500)
  }, [])

  const updateHotelConfig = (hotelId: string, config: Partial<HotelConfig>) => {
    if (!tenant) return

    const updatedHotels = tenant.hotels.map((hotel) => (hotel.id === hotelId ? { ...hotel, ...config } : hotel))

    setTenant({ ...tenant, hotels: updatedHotels })

    if (currentHotel?.id === hotelId) {
      setCurrentHotel({ ...currentHotel, ...config })
    }
  }

  return (
    <SaaSContext.Provider
      value={{
        tenant,
        currentHotel,
        setCurrentHotel,
        hotels: tenant?.hotels || [],
        isLoading,
        updateHotelConfig,
      }}
    >
      {children}
    </SaaSContext.Provider>
  )
}

export function useSaaS() {
  const context = useContext(SaaSContext)
  if (!context) {
    throw new Error("useSaaS must be used within SaaSProvider")
  }
  return context
}
