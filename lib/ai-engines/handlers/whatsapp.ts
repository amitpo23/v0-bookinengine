/**
 * WhatsApp Bot Handler
 * WhatsApp Business API integration for booking notifications and support
 */

// Types
export interface WhatsAppContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface WhatsAppMessage {
  messageId: string
  from: string
  to: string
  type: "text" | "template" | "image" | "document" | "interactive"
  content: string | WhatsAppTemplate | WhatsAppInteractive
  timestamp: Date
  status: "sent" | "delivered" | "read" | "failed"
}

export interface WhatsAppTemplate {
  name: string
  language: string
  components: {
    type: "header" | "body" | "button"
    parameters: { type: string; text?: string; image?: { link: string } }[]
  }[]
}

export interface WhatsAppInteractive {
  type: "button" | "list"
  header?: { type: "text"; text: string }
  body: { text: string }
  footer?: { text: string }
  action: {
    buttons?: { type: "reply"; reply: { id: string; title: string } }[]
    sections?: { title: string; rows: { id: string; title: string; description?: string }[] }[]
  }
}

export interface WhatsAppConversation {
  conversationId: string
  customerPhone: string
  customerName?: string
  bookingId?: string
  status: "active" | "resolved" | "pending_human"
  messages: WhatsAppMessage[]
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
}

// Message templates
const MESSAGE_TEMPLATES = {
  bookingConfirmation: {
    name: "booking_confirmation",
    languages: ["en", "he"],
  },
  checkInReminder: {
    name: "checkin_reminder",
    languages: ["en", "he"],
  },
  paymentReceipt: {
    name: "payment_receipt",
    languages: ["en", "he"],
  },
  cancellationConfirmation: {
    name: "cancellation_confirmation",
    languages: ["en", "he"],
  },
}

// In-memory conversation store
const conversations: Map<string, WhatsAppConversation> = new Map()

/**
 * Send WhatsApp message
 */
export async function sendWhatsAppMessage(
  params: {
    to: string
    type: "text" | "template" | "interactive"
    content: string | WhatsAppTemplate | WhatsAppInteractive
  },
  context?: WhatsAppContext
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log("[WhatsApp] Sending message", { to: params.to, type: params.type })

  // Validate phone number
  const phone = params.to.replace(/\D/g, "")
  if (phone.length < 10) {
    return { success: false, error: "Invalid phone number" }
  }

  // In production, would call WhatsApp Business API
  // const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_ID}/messages`, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ messaging_product: 'whatsapp', to: phone, type: params.type, ... })
  // })

  const message: WhatsAppMessage = {
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    from: process.env.WHATSAPP_PHONE_ID || "BUSINESS",
    to: phone,
    type: params.type,
    content: params.content,
    timestamp: new Date(),
    status: "sent",
  }

  console.log("[WhatsApp] Message sent", { messageId: message.messageId })

  return { success: true, messageId: message.messageId }
}

/**
 * Send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmation(
  params: {
    phone: string
    customerName: string
    bookingId: string
    hotelName: string
    checkIn: string | Date
    checkOut: string | Date
    confirmationNumber: string
  },
  context?: WhatsAppContext
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log("[WhatsApp] Sending booking confirmation", { bookingId: params.bookingId })

  const locale = context?.locale || "en"
  const checkIn = new Date(params.checkIn)
  const checkOut = new Date(params.checkOut)

  const messageText = locale === "he"
    ? `שלום ${params.customerName}! 🎉

ההזמנה שלך אושרה!

🏨 ${params.hotelName}
📅 צ'ק-אין: ${checkIn.toLocaleDateString("he-IL")}
📅 צ'ק-אאוט: ${checkOut.toLocaleDateString("he-IL")}
🔢 מספר אישור: ${params.confirmationNumber}

תודה שהזמנת דרכנו!`
    : `Hello ${params.customerName}! 🎉

Your booking is confirmed!

🏨 ${params.hotelName}
📅 Check-in: ${checkIn.toLocaleDateString("en-US")}
📅 Check-out: ${checkOut.toLocaleDateString("en-US")}
🔢 Confirmation: ${params.confirmationNumber}

Thank you for booking with us!`

  return sendWhatsAppMessage({
    to: params.phone,
    type: "text",
    content: messageText,
  }, context)
}

/**
 * Send check-in reminder
 */
export async function sendCheckInReminder(
  params: {
    phone: string
    customerName: string
    hotelName: string
    hotelAddress: string
    checkIn: string | Date
    confirmationNumber: string
  },
  context?: WhatsAppContext
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log("[WhatsApp] Sending check-in reminder")

  const locale = context?.locale || "en"
  const checkIn = new Date(params.checkIn)

  const messageText = locale === "he"
    ? `שלום ${params.customerName}! ⏰

תזכורת: הצ'ק-אין שלך מחר!

🏨 ${params.hotelName}
📍 ${params.hotelAddress}
📅 ${checkIn.toLocaleDateString("he-IL")}
🔢 מספר אישור: ${params.confirmationNumber}

נסיעה טובה! 🚗`
    : `Hello ${params.customerName}! ⏰

Reminder: Your check-in is tomorrow!

🏨 ${params.hotelName}
📍 ${params.hotelAddress}
📅 ${checkIn.toLocaleDateString("en-US")}
🔢 Confirmation: ${params.confirmationNumber}

Safe travels! 🚗`

  return sendWhatsAppMessage({
    to: params.phone,
    type: "text",
    content: messageText,
  }, context)
}

/**
 * Send interactive booking options
 */
export async function sendBookingOptions(
  params: {
    phone: string
    customerName: string
    bookingId: string
  },
  context?: WhatsAppContext
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log("[WhatsApp] Sending booking options")

  const locale = context?.locale || "en"

  const interactive: WhatsAppInteractive = {
    type: "button",
    body: {
      text: locale === "he"
        ? `שלום ${params.customerName}, איך אפשר לעזור?`
        : `Hello ${params.customerName}, how can I help you?`,
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: `view_booking_${params.bookingId}`,
            title: locale === "he" ? "צפה בהזמנה" : "View Booking",
          },
        },
        {
          type: "reply",
          reply: {
            id: `modify_booking_${params.bookingId}`,
            title: locale === "he" ? "שנה הזמנה" : "Modify Booking",
          },
        },
        {
          type: "reply",
          reply: {
            id: `contact_support`,
            title: locale === "he" ? "דבר עם נציג" : "Contact Support",
          },
        },
      ],
    },
  }

  return sendWhatsAppMessage({
    to: params.phone,
    type: "interactive",
    content: interactive,
  }, context)
}

/**
 * Handle incoming WhatsApp message
 */
export async function handleIncomingMessage(
  params: {
    from: string
    messageId: string
    type: string
    text?: string
    buttonId?: string
  },
  context?: WhatsAppContext
): Promise<{
  response: string
  action?: string
  requiresHuman?: boolean
}> {
  console.log("[WhatsApp] Handling incoming message", { from: params.from, type: params.type })

  const phone = params.from.replace(/\D/g, "")
  
  // Find or create conversation
  let conversation = Array.from(conversations.values()).find(c => c.customerPhone === phone && c.status === "active")
  
  if (!conversation) {
    conversation = {
      conversationId: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      customerPhone: phone,
      status: "active",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    conversations.set(conversation.conversationId, conversation)
  }

  // Handle button clicks
  if (params.buttonId) {
    if (params.buttonId.startsWith("view_booking_")) {
      const bookingId = params.buttonId.replace("view_booking_", "")
      return {
        response: `Here are the details for booking ${bookingId}. I'll send you the full information shortly.`,
        action: "fetch_booking_details",
      }
    }
    
    if (params.buttonId.startsWith("modify_booking_")) {
      return {
        response: "What would you like to change? You can modify dates, room type, or add special requests.",
        action: "start_modification",
      }
    }
    
    if (params.buttonId === "contact_support") {
      conversation.status = "pending_human"
      conversations.set(conversation.conversationId, conversation)
      return {
        response: "I'm connecting you with a human agent. Please wait a moment.",
        action: "transfer_to_human",
        requiresHuman: true,
      }
    }
  }

  // Simple intent detection
  const text = (params.text || "").toLowerCase()
  
  if (text.includes("book") || text.includes("reserve") || text.includes("הזמ")) {
    return {
      response: "I'd be happy to help you make a booking! Where would you like to stay and for what dates?",
      action: "start_booking",
    }
  }
  
  if (text.includes("cancel") || text.includes("ביטול")) {
    return {
      response: "I can help you cancel your booking. Please provide your confirmation number.",
      action: "start_cancellation",
    }
  }
  
  if (text.includes("help") || text.includes("support") || text.includes("עזר")) {
    return {
      response: "How can I assist you today? I can help with bookings, modifications, cancellations, or general questions.",
      action: "show_help",
    }
  }

  // Default response
  return {
    response: "Thanks for your message! How can I help you today? Reply with 'help' to see available options.",
    action: "default",
  }
}

/**
 * Get conversation history
 */
export async function getConversation(
  params: { conversationId?: string; phone?: string },
  context?: WhatsAppContext
): Promise<WhatsAppConversation | null> {
  if (params.conversationId) {
    return conversations.get(params.conversationId) || null
  }
  
  if (params.phone) {
    const phone = params.phone.replace(/\D/g, "")
    return Array.from(conversations.values()).find(c => c.customerPhone === phone) || null
  }
  
  return null
}

/**
 * Transfer conversation to human agent
 */
export async function transferToHuman(
  params: {
    conversationId: string
    reason: string
    priority?: "low" | "medium" | "high"
  },
  context?: WhatsAppContext
): Promise<{ success: boolean; ticketId?: string }> {
  console.log("[WhatsApp] Transferring to human", { conversationId: params.conversationId })

  const conversation = conversations.get(params.conversationId)
  if (!conversation) {
    return { success: false }
  }

  conversation.status = "pending_human"
  conversations.set(conversation.conversationId, conversation)

  // In production, would create support ticket
  const ticketId = `ticket_${Date.now()}`

  return { success: true, ticketId }
}

/**
 * Send bulk notifications
 */
export async function sendBulkNotification(
  params: {
    phones: string[]
    templateName: string
    templateParams: Record<string, string>
  },
  context?: WhatsAppContext
): Promise<{
  sent: number
  failed: number
  errors: { phone: string; error: string }[]
}> {
  console.log("[WhatsApp] Sending bulk notification", { 
    count: params.phones.length, 
    template: params.templateName 
  })

  const results = {
    sent: 0,
    failed: 0,
    errors: [] as { phone: string; error: string }[],
  }

  for (const phone of params.phones) {
    const result = await sendWhatsAppMessage({
      to: phone,
      type: "text", // Would use template in production
      content: `Notification: ${params.templateName}`,
    }, context)

    if (result.success) {
      results.sent++
    } else {
      results.failed++
      results.errors.push({ phone, error: result.error || "Unknown error" })
    }
  }

  return results
}

/**
 * Get WhatsApp analytics
 */
export async function getWhatsAppStats(
  params: { startDate?: Date; endDate?: Date },
  context?: WhatsAppContext
): Promise<{
  totalConversations: number
  activeConversations: number
  messagesReceived: number
  messagesSent: number
  averageResponseTime: number
  humanTransferRate: number
}> {
  const allConversations = Array.from(conversations.values())
  const active = allConversations.filter(c => c.status === "active")
  const humanTransfers = allConversations.filter(c => c.status === "pending_human")

  return {
    totalConversations: allConversations.length,
    activeConversations: active.length,
    messagesReceived: allConversations.reduce((sum, c) => sum + c.messages.length, 0),
    messagesSent: allConversations.reduce((sum, c) => sum + c.messages.filter(m => m.from === "BUSINESS").length, 0),
    averageResponseTime: 30, // seconds - would calculate from actual data
    humanTransferRate: allConversations.length > 0 
      ? (humanTransfers.length / allConversations.length) * 100 
      : 0,
  }
}

// Export handlers map for registry
export const whatsappHandlers = {
  sendWhatsAppMessage,
  sendBookingConfirmation,
  sendCheckInReminder,
  sendBookingOptions,
  handleIncomingMessage,
  getConversation,
  transferToHuman,
  sendBulkNotification,
  getWhatsAppStats,
}
