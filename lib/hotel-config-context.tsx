"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { HotelConfig } from "@/types/saas"
import { scarletHotelConfig } from "@/lib/hotels/scarlet-config"
import { 
  scarletKnowledgeBase, 
  scarletSystemInstructions, 
  scarletAISkills 
} from "@/lib/hotels/scarlet-ai-knowledge"

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

// Scarlet Hotel configuration
const scarletHotelConfigData: HotelConfig = {
  id: "scarlet-hotel",
  name: "מלון סקרלט תל אביב",
  hotelId: "863233",
  hotelName: "Scarlet Hotel",
  city: "Tel Aviv",
  stars: 5,
  currency: "₪",
  enableWidget: true,
  enableAiChat: true,
  plan: "enterprise",
  apiSettings: {
    provider: "medici" as const,
    mediciHotelId: "863233",
    mediciHotelName: "Scarlet Hotel",
    mediciCity: "Tel Aviv",
  },
  widgetSettings: {
    language: "he",
    showPrices: true,
    showAvailability: true,
    primaryColor: "#f43f5e",
    secondaryColor: "#ec4899",
  },
  aiChatSettings: {
    welcomeMessage: "Hello! I'm Scarlet Hotel Tel Aviv concierge. How can I help you book the perfect room?",
    welcomeMessageHe: "שלום! אני הקונסיירז׳ של מלון סקרלט תל אביב. איך אוכל לעזור לך למצוא את החדר המושלם?",
    personality: "luxury",
    language: "he",
    primaryColor: "#f43f5e",
    suggestedQuestions: [
      "מה החדרים הזמינים לסוף השבוע הקרוב?",
      "איזה חדר מתאים לזוג?",
      "האם יש מבצעים פעילים?",
      "מה כולל החדר הרומנטי?"
    ],
    systemInstructions: `אתה קונסיירז׳ וירטואלי של מלון סקרלט תל אביב, מלון בוטיק יוקרתי ורומנטי בלב העיר.

מידע על המלון:
- מיקום: רחוב ג'ורדון 17, תל אביב
- טלפון: 052-473-4940
- סגנון: מלון בוטיק רומנטי עם עיצוב נועז וצבעוני
- מחירים: 450-2500 ₪ ללילה
- ID במערכת: 863233

סוגי חדרים:
1. הקלאסי הזוגי (Classic Double) - 450₪ - חדר נעים ומעוצב, 15 מ"ר
2. הרומנטי הזוגי (Romantic Double) - 650₪ - מיטה עגולה ואמבטיה Free-standing, 18 מ"ר
3. האקונומי הזוגי (Economy Double) - 390₪ - חדר קומפקטי, 12 מ"ר
4. הקלאסי עם מרפסת (Classic Balcony) - 520₪ - עם מרפסת אורבנית, 16 מ"ר
5. הדלוקס (Deluxe) - 800₪ - חדר מרווח עם פינת ישיבה, 22 מ"ר
6. הדלוקס עם מרפסת ואמבטיה (Deluxe Balcony Bathtub) - 1200₪ - מרפסת גדולה ואמבטיה יוקרתית, 28 מ"ר
7. הסוויטה (Suite) - 2500₪ - שני חדרים נפרדים, 45 מ"ר

מבצעים פעילים:
- למילואימניקים: 20% הנחה
- לילה שלישי: 25% הנחה
- סופ"ש: 15% הנחה
- הזמנה מוקדמת (30+ ימים): 30% הנחה

סגנון תקשורת:
- חם, מקצועי ומסביר פנים
- התמקד בחוויה האישית של האורח
- המלץ על חדרים בהתאם לצרכים
- הדגש את המבצעים הרלוונטיים
- שאל שאלות מבררות כדי להבין את הצרכים`,
    systemInstructions: scarletSystemInstructions,
    knowledgeBase: JSON.stringify(scarletKnowledgeBase),
    aiSkills: scarletAISkills,
  },
}

const HotelConfigContext = createContext<HotelConfigContextType | undefined>(undefined)

export function HotelConfigProvider({ children, hotelId }: { children: ReactNode; hotelId?: string }) {
  // Determine the initial hotel based on hotelId prop
  const initialHotel = hotelId === "scarlet-hotel" ? scarletHotelConfigData : defaultHotel
  const [hotels, setHotels] = useState<HotelConfig[]>([defaultHotel, scarletHotelConfigData])
  const [currentHotel, setCurrentHotelState] = useState<HotelConfig | null>(initialHotel)

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
