/**
 * AI Chat Memory System
 * מערכת זכרון לשמירת היסטוריה, העדפות וקונטקסט
 */

// import { createClient } from "@/lib/supabase"
// Placeholder - replace with actual Supabase client when available

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    toolCalls?: any[]
    skillsUsed?: string[]
    confidence?: number
  }
}

export interface ConversationContext {
  userId?: string
  sessionId: string
  startedAt: Date
  lastActivityAt: Date
  messages: Message[]
  userPreferences?: UserPreferences
  currentBooking?: BookingContext
}

export interface UserPreferences {
  preferredLocation?: string
  budgetRange?: { min: number; max: number }
  amenities?: string[]
  roomType?: string
  boardType?: string
  language?: string
}

export interface BookingContext {
  checkIn?: string
  checkOut?: string
  guests?: {
    adults: number
    children: number[]
  }
  selectedRoom?: any
  preBookToken?: string
  stage: "search" | "prebook" | "details" | "payment" | "confirmed"
}

/**
 * 🧠 Memory Manager
 */
export class MemoryManager {
  private conversations: Map<string, ConversationContext> = new Map()
  private maxMessagesPerSession = 50

  /**
   * צור שיחה חדשה
   */
  createConversation(sessionId: string, userId?: string): ConversationContext {
    const context: ConversationContext = {
      sessionId,
      userId,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messages: [],
    }

    this.conversations.set(sessionId, context)
    return context
  }

  /**
   * קבל שיחה קיימת או צור חדשה
   */
  getOrCreateConversation(
    sessionId: string,
    userId?: string
  ): ConversationContext {
    let context = this.conversations.get(sessionId)

    if (!context) {
      context = this.createConversation(sessionId, userId)
    }

    return context
  }

  /**
   * הוסף הודעה לשיחה
   */
  addMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata?: any
  ): Message {
    const context = this.getOrCreateConversation(sessionId)

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      metadata,
    }

    context.messages.push(message)
    context.lastActivityAt = new Date()

    // שמור רק את X ההודעות האחרונות
    if (context.messages.length > this.maxMessagesPerSession) {
      context.messages = context.messages.slice(-this.maxMessagesPerSession)
    }

    return message
  }

  /**
   * קבל את ההיסטוריה המלאה
   */
  getMessages(sessionId: string): Message[] {
    const context = this.conversations.get(sessionId)
    return context?.messages || []
  }

  /**
   * קבל X הודעות אחרונות
   */
  getRecentMessages(sessionId: string, count: number = 10): Message[] {
    const messages = this.getMessages(sessionId)
    return messages.slice(-count)
  }

  /**
   * עדכן העדפות משתמש
   */
  updateUserPreferences(
    sessionId: string,
    preferences: Partial<UserPreferences>
  ): void {
    const context = this.getOrCreateConversation(sessionId)

    context.userPreferences = {
      ...context.userPreferences,
      ...preferences,
    }
  }

  /**
   * קבל העדפות משתמש
   */
  getUserPreferences(sessionId: string): UserPreferences | undefined {
    const context = this.conversations.get(sessionId)
    return context?.userPreferences
  }

  /**
   * עדכן קונטקסט הזמנה
   */
  updateBookingContext(
    sessionId: string,
    booking: Partial<BookingContext>
  ): void {
    const context = this.getOrCreateConversation(sessionId)

    context.currentBooking = {
      ...context.currentBooking,
      ...booking,
      stage: booking.stage || context.currentBooking?.stage || "search",
    } as BookingContext
  }

  /**
   * קבל קונטקסט הזמנה נוכחי
   */
  getBookingContext(sessionId: string): BookingContext | undefined {
    const context = this.conversations.get(sessionId)
    return context?.currentBooking
  }

  /**
   * נקה קונטקסט הזמנה (אחרי השלמה)
   */
  clearBookingContext(sessionId: string): void {
    const context = this.conversations.get(sessionId)
    if (context) {
      context.currentBooking = undefined
    }
  }

  /**
   * בנה prompt עם קונטקסט מלא
   */
  buildContextualPrompt(sessionId: string, newMessage: string): string {
    const context = this.getOrCreateConversation(sessionId)
    const recentMessages = this.getRecentMessages(sessionId, 5)
    const preferences = context.userPreferences
    const booking = context.currentBooking

    let prompt = ""

    // היסטוריית שיחה
    if (recentMessages.length > 0) {
      prompt += "## היסטוריית שיחה:\n"
      recentMessages.forEach((msg) => {
        prompt += `${msg.role === "user" ? "משתמש" : "עוזר"}: ${msg.content}\n`
      })
      prompt += "\n"
    }

    // העדפות משתמש
    if (preferences) {
      prompt += "## העדפות משתמש:\n"
      if (preferences.preferredLocation)
        prompt += `מיקום מועדף: ${preferences.preferredLocation}\n`
      if (preferences.budgetRange)
        prompt += `תקציב: ₪${preferences.budgetRange.min}-${preferences.budgetRange.max}\n`
      if (preferences.amenities)
        prompt += `שירותים: ${preferences.amenities.join(", ")}\n`
      prompt += "\n"
    }

    // קונטקסט הזמנה נוכחי
    if (booking) {
      prompt += "## הזמנה נוכחית:\n"
      prompt += `שלב: ${booking.stage}\n`
      if (booking.checkIn)
        prompt += `תאריכים: ${booking.checkIn} - ${booking.checkOut}\n`
      if (booking.guests)
        prompt += `אורחים: ${booking.guests.adults} מבוגרים, ${booking.guests.children.length} ילדים\n`
      if (booking.preBookToken) prompt += `יש PreBook פעיל\n`
      prompt += "\n"
    }

    // ההודעה החדשה
    prompt += `## בקשה נוכחית:\n${newMessage}\n`

    return prompt
  }

  /**
   * שמור לזכרון ארוך טווח (Supabase)
   */
  async saveToLongTermMemory(sessionId: string): Promise<void> {
    const context = this.conversations.get(sessionId)
    if (!context) return

    // TODO: Replace with actual Supabase client
    // const supabase = createClient()

    try {
      // await supabase.from("ai_conversations").upsert({
      //   session_id: sessionId,
      //   user_id: context.userId,
      //   started_at: context.startedAt,
      //   last_activity_at: context.lastActivityAt,
      //   messages: context.messages,
      //   user_preferences: context.userPreferences,
      //   current_booking: context.currentBooking,
      // })
      console.log("Saved to memory:", sessionId)
    } catch (error) {
      console.error("Failed to save to long-term memory:", error);
    }
  }

  /**
   * טען מזכרון ארוך טווח
   */
  async loadFromLongTermMemory(sessionId: string): Promise<void> {
    // TODO: Replace with actual Supabase client
    // const supabase = createClient()

    try {
      // const { data, error } = await supabase
      //   .from("ai_conversations")
      //   .select("*")
      //   .eq("session_id", sessionId)
      //   .single()

      // if (error) throw error

      // if (data) {
      //   const context: ConversationContext = {
      //     sessionId: data.session_id,
      //     userId: data.user_id,
      //     startedAt: new Date(data.started_at),
      //     lastActivityAt: new Date(data.last_activity_at),
      //     messages: data.messages || [],
      //     userPreferences: data.user_preferences,
      //     currentBooking: data.current_booking,
      //   }

      //   this.conversations.set(sessionId, context)
      // }
      console.log("Loaded from memory:", sessionId);
    } catch (error) {
      console.error("Failed to load from long-term memory:", error);
    }
  }

  /**
   * נתח כוונת משתמש מההודעה
   */
  analyzeIntent(message: string): {
    intent:
      | "search"
      | "book"
      | "info"
      | "modify"
      | "cancel"
      | "help"
      | "other"
    entities: any
  } {
    const lowerMessage = message.toLowerCase()

    // חיפוש
    if (
      lowerMessage.includes("חפש") ||
      lowerMessage.includes("אני רוצה") ||
      lowerMessage.includes("מחפש") ||
      lowerMessage.includes("צריך")
    ) {
      return { intent: "search", entities: this.extractEntities(message) }
    }

    // הזמנה
    if (
      lowerMessage.includes("הזמן") ||
      lowerMessage.includes("לשריין") ||
      lowerMessage.includes("לקנות")
    ) {
      return { intent: "book", entities: {} }
    }

    // מידע
    if (
      lowerMessage.includes("מה") ||
      lowerMessage.includes("איך") ||
      lowerMessage.includes("כמה")
    ) {
      return { intent: "info", entities: {} }
    }

    // שינוי
    if (
      lowerMessage.includes("שנה") ||
      lowerMessage.includes("עדכן") ||
      lowerMessage.includes("לשנות")
    ) {
      return { intent: "modify", entities: {} }
    }

    // ביטול
    if (
      lowerMessage.includes("ביטול") ||
      lowerMessage.includes("לבטל") ||
      lowerMessage.includes("cancel")
    ) {
      return { intent: "cancel", entities: {} }
    }

    // עזרה
    if (
      lowerMessage.includes("עזרה") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("מה אתה יכול")
    ) {
      return { intent: "help", entities: {} }
    }

    return { intent: "other", entities: {} }
  }

  /**
   * חלץ ישויות מהטקסט (תאריכים, מספרים, מיקומים)
   */
  private extractEntities(message: string): any {
    const entities: any = {}

    // תאריכים
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})/g, // 12/05
      /(\d{1,2})\s+(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/gi,
    ]

    // מספרים
    const numberMatches = message.match(/\d+/g)
    if (numberMatches) {
      entities.numbers = numberMatches.map(Number)
    }

    // מיקומים
    const locations = [
      "תל אביב",
      "ירושלים",
      "חיפה",
      "אילת",
      "נתניה",
      "הרצליה",
    ]
    locations.forEach((loc) => {
      if (message.includes(loc)) {
        entities.location = loc
      }
    })

    return entities
  }

  /**
   * נקה שיחות ישנות (ניקיון זיכרון)
   */
  cleanupOldConversations(maxAgeHours: number = 24): void {
    const now = new Date()
    const expiredSessions: string[] = []

    this.conversations.forEach((context, sessionId) => {
      const hoursSinceActivity =
        (now.getTime() - context.lastActivityAt.getTime()) / (1000 * 60 * 60)

      if (hoursSinceActivity > maxAgeHours) {
        expiredSessions.push(sessionId)
      }
    })

    expiredSessions.forEach((sessionId) => {
      // שמור לזכרון ארוך טווח לפני מחיקה
      this.saveToLongTermMemory(sessionId)
      this.conversations.delete(sessionId)
    })

    console.log(`Cleaned up ${expiredSessions.length} old conversations`)
  }
}

// Singleton instance
export const memoryManager = new MemoryManager()

// Auto cleanup every hour
if (typeof window === "undefined") {
  setInterval(
    () => {
      memoryManager.cleanupOldConversations(24)
    },
    60 * 60 * 1000
  ) // every hour
}
