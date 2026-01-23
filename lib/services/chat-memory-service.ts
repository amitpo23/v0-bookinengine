/**
 * Chat Memory Service
 * Manages conversation history and context for AI chat sessions
 * Includes admin mode for dynamic system instructions updates
 */

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ConversationMemory {
  sessionId: string
  hotelId: string
  messages: Message[]
  context: {
    userPreferences?: {
      roomType?: string
      budget?: string
      purpose?: string
      adults?: number
      children?: number
    }
    searchHistory?: any[]
    bookingAttempts?: number
    isAdminMode?: boolean
    customInstructions?: string // Custom instructions set by admin
  }
  metadata: {
    startedAt: number
    lastActivityAt: number
    messageCount: number
  }
}

// In-memory storage (replace with Redis/DB in production)
const conversationStore = new Map<string, ConversationMemory>()

// Admin trigger phrases
const ADMIN_TRIGGERS = [
  'זה מנהל המלון',
  'אני מנהל המלון',
  'זה האדמין',
  'אני האדמין',
  'admin mode',
  'manager mode'
]

// Instruction update triggers
const INSTRUCTION_KEYWORDS = [
  'הנחיות חדשות',
  'עדכן הנחיות',
  'שנה הנחיות',
  'הגדרות חדשות',
  'new instructions',
  'update instructions'
]

export class ChatMemoryService {
  /**
   * Initialize or retrieve conversation memory
   */
  static getOrCreateMemory(sessionId: string, hotelId: string): ConversationMemory {
    if (!conversationStore.has(sessionId)) {
      const memory: ConversationMemory = {
        sessionId,
        hotelId,
        messages: [],
        context: {},
        metadata: {
          startedAt: Date.now(),
          lastActivityAt: Date.now(),
          messageCount: 0
        }
      }
      conversationStore.set(sessionId, memory)
      console.log(`[Memory] Created new memory for session ${sessionId}`)
    }
    return conversationStore.get(sessionId)!
  }

  /**
   * Add message to conversation history
   */
  static addMessage(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string
  ): void {
    const memory = conversationStore.get(sessionId)
    if (!memory) return

    memory.messages.push({
      role,
      content,
      timestamp: Date.now()
    })

    memory.metadata.lastActivityAt = Date.now()
    memory.metadata.messageCount++

    // Keep only last 50 messages to prevent memory overflow
    if (memory.messages.length > 50) {
      memory.messages = memory.messages.slice(-50)
    }

    console.log(`[Memory] Added ${role} message to session ${sessionId} (total: ${memory.messages.length})`)
  }

  /**
   * Check if message contains admin trigger
   */
  static isAdminTrigger(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim()
    return ADMIN_TRIGGERS.some(trigger => 
      lowerMessage.includes(trigger.toLowerCase())
    )
  }

  /**
   * Activate admin mode for session
   */
  static activateAdminMode(sessionId: string): void {
    const memory = conversationStore.get(sessionId)
    if (!memory) return

    memory.context.isAdminMode = true
    console.log(`[Memory] 🔐 Admin mode ACTIVATED for session ${sessionId}`)
  }

  /**
   * Check if session is in admin mode
   */
  static isAdminMode(sessionId: string): boolean {
    const memory = conversationStore.get(sessionId)
    return memory?.context.isAdminMode === true
  }

  /**
   * Extract and save custom instructions from admin message
   */
  static extractAndSaveInstructions(sessionId: string, message: string): string | null {
    const memory = conversationStore.get(sessionId)
    if (!memory || !memory.context.isAdminMode) return null

    // Check if message contains instruction keywords
    const hasInstructionKeyword = INSTRUCTION_KEYWORDS.some(keyword =>
      message.includes(keyword)
    )

    if (!hasInstructionKeyword) return null

    // Extract instructions (everything after the keyword)
    let instructions = ''
    for (const keyword of INSTRUCTION_KEYWORDS) {
      if (message.includes(keyword)) {
        const parts = message.split(keyword)
        if (parts.length > 1) {
          instructions = parts[1].trim()
          break
        }
      }
    }

    if (instructions) {
      memory.context.customInstructions = instructions
      console.log(`[Memory] 📝 Saved custom instructions for session ${sessionId}:`, instructions.substring(0, 100) + '...')
      return instructions
    }

    return null
  }

  /**
   * Get custom instructions for session
   */
  static getCustomInstructions(sessionId: string): string | null {
    const memory = conversationStore.get(sessionId)
    return memory?.context.customInstructions || null
  }

  /**
   * Get conversation history formatted for AI
   */
  static getFormattedHistory(sessionId: string, maxMessages: number = 10): Message[] {
    const memory = conversationStore.get(sessionId)
    if (!memory) return []

    // Return last N messages (excluding system messages)
    return memory.messages
      .filter(msg => msg.role !== 'system')
      .slice(-maxMessages)
  }

  /**
   * Get conversation summary for context
   */
  static getSummary(sessionId: string): string {
    const memory = conversationStore.get(sessionId)
    if (!memory || memory.messages.length === 0) {
      return 'שיחה חדשה - אין היסטוריה קודמת.'
    }

    const userMessages = memory.messages.filter(m => m.role === 'user').length
    const assistantMessages = memory.messages.filter(m => m.role === 'assistant').length
    const preferences = memory.context.userPreferences

    let summary = `היסטוריית שיחה: ${userMessages} הודעות ממשתמש, ${assistantMessages} תגובות.\n`

    if (preferences) {
      summary += 'העדפות שזוהו:\n'
      if (preferences.roomType) summary += `- סוג חדר: ${preferences.roomType}\n`
      if (preferences.budget) summary += `- תקציב: ${preferences.budget}\n`
      if (preferences.purpose) summary += `- מטרת שהייה: ${preferences.purpose}\n`
      if (preferences.adults) summary += `- מספר מבוגרים: ${preferences.adults}\n`
    }

    if (memory.context.isAdminMode) {
      summary += '\n🔐 מצב מנהל פעיל - ניתן לעדכן הנחיות מערכת.\n'
    }

    if (memory.context.customInstructions) {
      summary += `\n📝 הנחיות מותאמות אישית קיימות: ${memory.context.customInstructions.substring(0, 50)}...\n`
    }

    return summary
  }

  /**
   * Update user preferences from conversation
   */
  static updatePreferences(
    sessionId: string,
    preferences: Partial<ConversationMemory['context']['userPreferences']>
  ): void {
    const memory = conversationStore.get(sessionId)
    if (!memory) return

    memory.context.userPreferences = {
      ...memory.context.userPreferences,
      ...preferences
    }

    console.log(`[Memory] Updated preferences for session ${sessionId}:`, preferences)
  }

  /**
   * Add search to history
   */
  static addSearchToHistory(sessionId: string, searchData: any): void {
    const memory = conversationStore.get(sessionId)
    if (!memory) return

    if (!memory.context.searchHistory) {
      memory.context.searchHistory = []
    }

    memory.context.searchHistory.push({
      ...searchData,
      timestamp: Date.now()
    })

    // Keep only last 10 searches
    if (memory.context.searchHistory.length > 10) {
      memory.context.searchHistory = memory.context.searchHistory.slice(-10)
    }
  }

  /**
   * Increment booking attempts
   */
  static incrementBookingAttempts(sessionId: string): number {
    const memory = conversationStore.get(sessionId)
    if (!memory) return 0

    memory.context.bookingAttempts = (memory.context.bookingAttempts || 0) + 1
    return memory.context.bookingAttempts
  }

  /**
   * Clear conversation memory (e.g., for privacy)
   */
  static clearMemory(sessionId: string): void {
    conversationStore.delete(sessionId)
    console.log(`[Memory] Cleared memory for session ${sessionId}`)
  }

  /**
   * Get all active sessions (for monitoring)
   */
  static getActiveSessions(): string[] {
    return Array.from(conversationStore.keys())
  }

  /**
   * Cleanup old sessions (older than 24 hours)
   */
  static cleanupOldSessions(): number {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    let cleaned = 0

    for (const [sessionId, memory] of conversationStore.entries()) {
      if (now - memory.metadata.lastActivityAt > maxAge) {
        conversationStore.delete(sessionId)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`[Memory] Cleaned up ${cleaned} old sessions`)
    }

    return cleaned
  }
}

// Auto-cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    ChatMemoryService.cleanupOldSessions()
  }, 60 * 60 * 1000)
}

export default ChatMemoryService
