import { NextRequest, NextResponse } from "next/server"

// Types
interface TemplateSettings {
  id: string
  templateId: string
  hotelId: string
  hotelName: string
  
  // Terms & Policies
  termsAndConditions: string
  termsAndConditionsHe: string
  privacyPolicy: string
  cancellationPolicy: string
  cancellationPolicyHe: string
  
  // Booking Settings
  minAdvanceBookingDays: number
  maxAdvanceBookingDays: number
  defaultCurrency: string
  allowChildBooking: boolean
  maxGuests: number
  checkInTime: string
  checkOutTime: string
  
  // Contact Info
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  
  // AI & Notifications
  enableAiChat: boolean
  aiChatWelcomeMessage: string
  aiChatSystemPrompt: string
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  enableWhatsappNotifications: boolean
  
  // Design
  primaryColor: string
  accentColor: string
  logoUrl: string
  backgroundImageUrl: string
  customCss: string
  
  // Metadata
  createdAt: string
  updatedAt: string
}

// In-memory store (in production, use Supabase)
const templateSettings: Map<string, TemplateSettings> = new Map()

// Default settings for Scarlet
const defaultScarletSettings: TemplateSettings = {
  id: "settings_scarlet",
  templateId: "scarlet",
  hotelId: "scarlet_hotel",
  hotelName: "מלון סקרלט תל אביב",
  
  termsAndConditions: `Terms and Conditions for Scarlet Hotel Booking:

1. Check-in time: 3:00 PM | Check-out time: 11:00 AM
2. Valid ID or passport required at check-in
3. Credit card required for security deposit
4. Cancellation must be made 48 hours before arrival
5. No smoking in rooms
6. Pets are not allowed
7. Additional guests require prior approval
8. Hotel is not responsible for valuables left in rooms
9. Minimum age for check-in is 18 years
10. Rates are subject to availability`,

  termsAndConditionsHe: `תנאי שימוש להזמנה במלון סקרלט:

1. שעת כניסה: 15:00 | שעת יציאה: 11:00
2. נדרשת תעודה מזהה או דרכון בעת הצ'ק-אין
3. נדרש כרטיס אשראי לפיקדון
4. ביטול חייב להתבצע 48 שעות לפני ההגעה
5. אסור לעשן בחדרים
6. חיות מחמד אינן מורשות
7. אורחים נוספים דורשים אישור מראש
8. המלון אינו אחראי לחפצי ערך שנשכחו בחדרים
9. גיל מינימלי לצ'ק-אין הוא 18 שנים
10. המחירים בכפוף לזמינות`,

  privacyPolicy: "We respect your privacy and protect your personal data according to GDPR and Israeli privacy regulations. Your information is used solely for booking purposes and will not be shared with third parties without your consent.",
  
  cancellationPolicy: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours will be charged for the first night. No-shows will be charged the full booking amount.",
  
  cancellationPolicyHe: "ביטול חינם עד 48 שעות לפני הצ'ק-אין. ביטולים בתוך 48 שעות יחויבו בעלות לילה ראשון. אי-הגעה תחויב במלוא סכום ההזמנה.",
  
  minAdvanceBookingDays: 0,
  maxAdvanceBookingDays: 365,
  defaultCurrency: "ILS",
  allowChildBooking: true,
  maxGuests: 6,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  
  contactEmail: "reservations@scarlethotel.co.il",
  contactPhone: "03-1234567",
  whatsappNumber: "972501234567",
  
  enableAiChat: true,
  aiChatWelcomeMessage: "שלום! 👋 אני סקרלט, העוזרת הדיגיטלית של המלון. איך אוכל לעזור לך היום?",
  aiChatSystemPrompt: "You are Scarlet, a friendly AI assistant for Scarlet Hotel Tel Aviv. You help guests with booking inquiries, room information, amenities, and local recommendations. Always be helpful, professional, and provide accurate information about the hotel.",
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  enableWhatsappNotifications: false,
  
  primaryColor: "#dc2626",
  accentColor: "#f97316",
  logoUrl: "/placeholder-logo.png",
  backgroundImageUrl: "/scarlet-hero.jpg",
  customCss: "",
  
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Initialize with default settings
templateSettings.set("scarlet", defaultScarletSettings)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId") || "scarlet"

    const settings = templateSettings.get(templateId)
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: defaultScarletSettings,
        isDefault: true,
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching template settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const templateId = body.templateId || "scarlet"

    const existingSettings = templateSettings.get(templateId) || defaultScarletSettings

    const newSettings: TemplateSettings = {
      ...existingSettings,
      ...body,
      id: existingSettings.id,
      templateId,
      updatedAt: new Date().toISOString(),
    }

    templateSettings.set(templateId, newSettings)

    return NextResponse.json({ 
      success: true, 
      settings: newSettings 
    })
  } catch (error) {
    console.error("Error saving template settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const templateId = body.templateId || "scarlet"

    const existingSettings = templateSettings.get(templateId)
    
    if (!existingSettings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      )
    }

    const updatedSettings: TemplateSettings = {
      ...existingSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    templateSettings.set(templateId, updatedSettings)

    return NextResponse.json({ 
      success: true, 
      settings: updatedSettings 
    })
  } catch (error) {
    console.error("Error updating template settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
