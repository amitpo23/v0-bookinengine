// SaaS Types for Hotel Booking Engine

export type PlanType = "starter" | "professional" | "enterprise"
export type EngineType = "widget" | "ai-chat" | "both"

export interface SaaSPlan {
  id: PlanType
  name: string
  nameHe: string
  price: number
  priceYearly: number
  currency: string
  features: string[]
  featuresHe: string[]
  engineType: EngineType
  maxBookingsPerMonth: number
  aiChatIncluded: boolean
  widgetIncluded: boolean
  customBranding: boolean
  prioritySupport: boolean
  analytics: boolean
  multipleHotels: boolean
  maxHotels: number
}

export interface HotelConfig {
  id: string
  name: string
  hotelId: string
  hotelName: string
  city: string
  stars: number
  currency: string
  logo?: string
  // Engine settings
  enableWidget: boolean
  enableAiChat: boolean
  plan: PlanType
  // API Configuration
  apiSettings: {
    mediciHotelId: string
    mediciHotelName: string
  }
  // Widget-specific settings
  widgetSettings: {
    language: "he" | "en" | "both"
    showPrices: boolean
    showAvailability: boolean
    primaryColor: string
    secondaryColor: string
  }
  // AI Chat-specific settings
  aiChatSettings: {
    welcomeMessage: string
    welcomeMessageHe: string
    personality: "professional" | "friendly" | "luxury"
    language: "he" | "en" | "both"
    primaryColor: string
  }
}

export interface Tenant {
  id: string
  name: string
  email: string
  plan: PlanType
  hotels: HotelConfig[]
  createdAt: Date
  billingStatus: "active" | "trial" | "suspended"
  trialEndsAt?: Date
}

// SaaS Plans Configuration
export const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "starter",
    name: "Starter - Widget Only",
    nameHe: "התחלתי - מנוע הזמנות בלבד",
    price: 199,
    priceYearly: 1990,
    currency: "₪",
    features: [
      "Standard booking widget",
      "Up to 100 bookings/month",
      "Email notifications",
      "Basic analytics",
      "1 hotel",
    ],
    featuresHe: ["מנוע הזמנות סטנדרטי", "עד 100 הזמנות בחודש", "התראות במייל", "אנליטיקס בסיסי", "מלון אחד"],
    engineType: "widget",
    maxBookingsPerMonth: 100,
    aiChatIncluded: false,
    widgetIncluded: true,
    customBranding: false,
    prioritySupport: false,
    analytics: true,
    multipleHotels: false,
    maxHotels: 1,
  },
  {
    id: "professional",
    name: "Professional - AI Chat Only",
    nameHe: "מקצועי - צ'אט AI בלבד",
    price: 399,
    priceYearly: 3990,
    currency: "₪",
    features: [
      "AI-powered chat booking",
      "Up to 500 bookings/month",
      "Conversational booking experience",
      "Advanced analytics",
      "Custom branding",
      "Up to 3 hotels",
    ],
    featuresHe: [
      "הזמנות דרך צ'אט AI",
      "עד 500 הזמנות בחודש",
      "חווית הזמנה שיחתית",
      "אנליטיקס מתקדם",
      "מיתוג מותאם אישית",
      "עד 3 מלונות",
    ],
    engineType: "ai-chat",
    maxBookingsPerMonth: 500,
    aiChatIncluded: true,
    widgetIncluded: false,
    customBranding: true,
    prioritySupport: true,
    analytics: true,
    multipleHotels: true,
    maxHotels: 3,
  },
  {
    id: "enterprise",
    name: "Enterprise - Both Engines",
    nameHe: "ארגוני - שני המנועים",
    price: 699,
    priceYearly: 6990,
    currency: "₪",
    features: [
      "Standard booking widget",
      "AI-powered chat booking",
      "Unlimited bookings",
      "Full analytics suite",
      "Custom branding",
      "Priority support",
      "Unlimited hotels",
      "API access",
    ],
    featuresHe: [
      "מנוע הזמנות סטנדרטי",
      "הזמנות דרך צ'אט AI",
      "הזמנות ללא הגבלה",
      "חבילת אנליטיקס מלאה",
      "מיתוג מותאם אישית",
      "תמיכה עדיפה",
      "מלונות ללא הגבלה",
      "גישת API",
    ],
    engineType: "both",
    maxBookingsPerMonth: -1,
    aiChatIncluded: true,
    widgetIncluded: true,
    customBranding: true,
    prioritySupport: true,
    analytics: true,
    multipleHotels: true,
    maxHotels: -1,
  },
]
