/**
 * Abandoned Cart Recovery Handler
 * Track and recover abandoned bookings
 */

// Types
export interface CartContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface AbandonedCart {
  cartId: string
  sessionId: string
  userId?: string
  customerEmail?: string
  customerName?: string
  
  // Booking details
  hotelId: string
  hotelName: string
  roomCode: string
  roomType: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  currency: string
  
  // Cart state
  stage: "search" | "room_selected" | "prebook" | "checkout" | "payment"
  createdAt: Date
  updatedAt: Date
  abandonedAt?: Date
  
  // Recovery attempts
  recoveryAttempts: RecoveryAttempt[]
  recovered: boolean
  recoveredAt?: Date
  
  // Metadata
  source?: string
  device?: string
  referrer?: string
}

export interface RecoveryAttempt {
  attemptId: string
  type: "email" | "sms" | "push" | "whatsapp"
  sentAt: Date
  opened?: boolean
  clicked?: boolean
  converted?: boolean
  discount?: {
    code: string
    percentage: number
    expiresAt: Date
  }
}

export interface CartRecoveryStats {
  totalAbandoned: number
  totalRecovered: number
  recoveryRate: number
  revenueRecovered: number
  averageCartValue: number
  topAbandonmentStages: { stage: string; count: number }[]
  recoveryByChannel: { channel: string; recovered: number; rate: number }[]
}

// In-memory store (would use Supabase in production)
const abandonedCarts: Map<string, AbandonedCart> = new Map()

// Recovery email templates
const RECOVERY_TEMPLATES = {
  initial: {
    subject: "You left something behind! 🏨",
    subjectHe: "שכחת משהו! 🏨",
    delay: 1 * 60 * 60 * 1000, // 1 hour
  },
  reminder: {
    subject: "Your room is still available - but not for long!",
    subjectHe: "החדר שלך עדיין זמין - אבל לא לאורך זמן!",
    delay: 24 * 60 * 60 * 1000, // 24 hours
  },
  lastChance: {
    subject: "Last chance: 10% off your booking",
    subjectHe: "הזדמנות אחרונה: 10% הנחה להזמנה שלך",
    delay: 72 * 60 * 60 * 1000, // 72 hours
    discount: 10,
  },
}

/**
 * Track cart activity (called on each booking step)
 */
export async function trackCartActivity(
  params: {
    sessionId: string
    userId?: string
    customerEmail?: string
    customerName?: string
    stage: AbandonedCart["stage"]
    hotelId: string
    hotelName: string
    roomCode?: string
    roomType?: string
    checkIn: string | Date
    checkOut: string | Date
    guests: number
    totalPrice: number
    currency: string
    source?: string
    device?: string
  },
  context?: CartContext
): Promise<{ cartId: string; isNew: boolean }> {
  console.log("[Cart] Tracking activity", { sessionId: params.sessionId, stage: params.stage })

  // Find or create cart
  let cart = Array.from(abandonedCarts.values()).find(c => c.sessionId === params.sessionId)
  const isNew = !cart

  if (!cart) {
    cart = {
      cartId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      sessionId: params.sessionId,
      userId: params.userId,
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      hotelId: params.hotelId,
      hotelName: params.hotelName,
      roomCode: params.roomCode || "",
      roomType: params.roomType || "",
      checkIn: new Date(params.checkIn),
      checkOut: new Date(params.checkOut),
      guests: params.guests,
      totalPrice: params.totalPrice,
      currency: params.currency,
      stage: params.stage,
      createdAt: new Date(),
      updatedAt: new Date(),
      recoveryAttempts: [],
      recovered: false,
      source: params.source,
      device: params.device,
    }
  } else {
    // Update existing cart
    cart.stage = params.stage
    cart.updatedAt = new Date()
    cart.customerEmail = params.customerEmail || cart.customerEmail
    cart.customerName = params.customerName || cart.customerName
    cart.roomCode = params.roomCode || cart.roomCode
    cart.roomType = params.roomType || cart.roomType
    cart.totalPrice = params.totalPrice
  }

  abandonedCarts.set(cart.cartId, cart)

  return { cartId: cart.cartId, isNew }
}

/**
 * Mark cart as abandoned (called after inactivity timeout)
 */
export async function markCartAbandoned(
  params: {
    cartId?: string
    sessionId?: string
  },
  context?: CartContext
): Promise<{ success: boolean; cartId?: string }> {
  let cart: AbandonedCart | undefined

  if (params.cartId) {
    cart = abandonedCarts.get(params.cartId)
  } else if (params.sessionId) {
    cart = Array.from(abandonedCarts.values()).find(c => c.sessionId === params.sessionId)
  }

  if (!cart) {
    return { success: false }
  }

  cart.abandonedAt = new Date()
  abandonedCarts.set(cart.cartId, cart)

  console.log("[Cart] Marked as abandoned", { cartId: cart.cartId, stage: cart.stage })

  return { success: true, cartId: cart.cartId }
}

/**
 * Get abandoned carts for recovery
 */
export async function getAbandonedCarts(
  params: {
    minAge?: number // Minimum age in minutes
    maxAge?: number // Maximum age in hours
    stage?: AbandonedCart["stage"]
    hasEmail?: boolean
    limit?: number
  },
  context?: CartContext
): Promise<AbandonedCart[]> {
  console.log("[Cart] Getting abandoned carts", params)

  const now = Date.now()
  const minAgeMs = (params.minAge || 30) * 60 * 1000 // Default 30 minutes
  const maxAgeMs = (params.maxAge || 72) * 60 * 60 * 1000 // Default 72 hours

  let carts = Array.from(abandonedCarts.values()).filter(cart => {
    // Must be abandoned
    if (!cart.abandonedAt) return false
    
    // Not already recovered
    if (cart.recovered) return false

    // Age filter
    const age = now - cart.abandonedAt.getTime()
    if (age < minAgeMs || age > maxAgeMs) return false

    // Stage filter
    if (params.stage && cart.stage !== params.stage) return false

    // Email filter
    if (params.hasEmail && !cart.customerEmail) return false

    return true
  })

  // Sort by most recent
  carts.sort((a, b) => (b.abandonedAt?.getTime() || 0) - (a.abandonedAt?.getTime() || 0))

  // Limit
  if (params.limit) {
    carts = carts.slice(0, params.limit)
  }

  return carts
}

/**
 * Send recovery email
 */
export async function sendRecoveryEmail(
  params: {
    cartId: string
    templateType: "initial" | "reminder" | "lastChance"
    customMessage?: string
  },
  context?: CartContext
): Promise<{ success: boolean; attemptId?: string; error?: string }> {
  const cart = abandonedCarts.get(params.cartId)
  if (!cart) {
    return { success: false, error: "Cart not found" }
  }

  if (!cart.customerEmail) {
    return { success: false, error: "No customer email" }
  }

  console.log("[Cart] Sending recovery email", { 
    cartId: params.cartId, 
    template: params.templateType,
    to: cart.customerEmail 
  })

  const template = RECOVERY_TEMPLATES[params.templateType]
  const locale = context?.locale || "en"

  // Generate discount code for last chance
  let discount: RecoveryAttempt["discount"]
  if (params.templateType === "lastChance" && "discount" in template) {
    discount = {
      code: `COMEBACK${cart.cartId.slice(-6).toUpperCase()}`,
      percentage: template.discount,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    }
  }

  // Create recovery attempt
  const attempt: RecoveryAttempt = {
    attemptId: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: "email",
    sentAt: new Date(),
    discount,
  }

  // In production, would send actual email via Resend
  // await sendEmail({ to: cart.customerEmail, subject: locale === "he" ? template.subjectHe : template.subject, ... })

  cart.recoveryAttempts.push(attempt)
  abandonedCarts.set(cart.cartId, cart)

  console.log("[Cart] Recovery email sent", { attemptId: attempt.attemptId })

  return { success: true, attemptId: attempt.attemptId }
}

/**
 * Mark cart as recovered (when booking completes)
 */
export async function markCartRecovered(
  params: {
    cartId?: string
    sessionId?: string
    bookingId: string
  },
  context?: CartContext
): Promise<{ success: boolean; wasAbandoned: boolean }> {
  let cart: AbandonedCart | undefined

  if (params.cartId) {
    cart = abandonedCarts.get(params.cartId)
  } else if (params.sessionId) {
    cart = Array.from(abandonedCarts.values()).find(c => c.sessionId === params.sessionId)
  }

  if (!cart) {
    return { success: true, wasAbandoned: false }
  }

  const wasAbandoned = !!cart.abandonedAt

  cart.recovered = true
  cart.recoveredAt = new Date()
  abandonedCarts.set(cart.cartId, cart)

  console.log("[Cart] Marked as recovered", { cartId: cart.cartId, wasAbandoned })

  return { success: true, wasAbandoned }
}

/**
 * Get recovery link for cart
 */
export async function getRecoveryLink(
  params: { cartId: string },
  context?: CartContext
): Promise<{ link: string; expiresAt: Date }> {
  const cart = abandonedCarts.get(params.cartId)
  if (!cart) {
    throw new Error("Cart not found")
  }

  const token = Buffer.from(JSON.stringify({
    cartId: cart.cartId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  })).toString("base64url")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://v0-bookinengine.vercel.app"

  return {
    link: `${baseUrl}/recover?token=${token}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
}

/**
 * Get cart recovery statistics
 */
export async function getRecoveryStats(
  params: { startDate?: Date; endDate?: Date },
  context?: CartContext
): Promise<CartRecoveryStats> {
  console.log("[Cart] Getting recovery stats")

  const carts = Array.from(abandonedCarts.values())
  
  const abandoned = carts.filter(c => c.abandonedAt)
  const recovered = abandoned.filter(c => c.recovered)
  
  const revenueRecovered = recovered.reduce((sum, c) => sum + c.totalPrice, 0)
  const totalValue = abandoned.reduce((sum, c) => sum + c.totalPrice, 0)

  // Count by stage
  const stageCounts: Record<string, number> = {}
  abandoned.forEach(c => {
    stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1
  })

  // Count by channel
  const channelCounts: Record<string, { total: number; recovered: number }> = {}
  abandoned.forEach(c => {
    c.recoveryAttempts.forEach(a => {
      if (!channelCounts[a.type]) {
        channelCounts[a.type] = { total: 0, recovered: 0 }
      }
      channelCounts[a.type].total++
      if (c.recovered) {
        channelCounts[a.type].recovered++
      }
    })
  })

  return {
    totalAbandoned: abandoned.length,
    totalRecovered: recovered.length,
    recoveryRate: abandoned.length > 0 ? (recovered.length / abandoned.length) * 100 : 0,
    revenueRecovered,
    averageCartValue: abandoned.length > 0 ? totalValue / abandoned.length : 0,
    topAbandonmentStages: Object.entries(stageCounts)
      .map(([stage, count]) => ({ stage, count }))
      .sort((a, b) => b.count - a.count),
    recoveryByChannel: Object.entries(channelCounts)
      .map(([channel, data]) => ({
        channel,
        recovered: data.recovered,
        rate: data.total > 0 ? (data.recovered / data.total) * 100 : 0,
      })),
  }
}

/**
 * Run automated recovery campaign
 */
export async function runRecoveryCampaign(
  params: { dryRun?: boolean },
  context?: CartContext
): Promise<{
  cartsProcessed: number
  emailsSent: number
  errors: string[]
}> {
  console.log("[Cart] Running recovery campaign", { dryRun: params.dryRun })

  const results = {
    cartsProcessed: 0,
    emailsSent: 0,
    errors: [] as string[],
  }

  const carts = await getAbandonedCarts({ hasEmail: true }, context)

  for (const cart of carts) {
    results.cartsProcessed++

    // Determine which template to use based on time
    const ageHours = (Date.now() - (cart.abandonedAt?.getTime() || 0)) / (1000 * 60 * 60)
    const attemptCount = cart.recoveryAttempts.filter(a => a.type === "email").length

    let templateType: "initial" | "reminder" | "lastChance" | null = null

    if (attemptCount === 0 && ageHours >= 1) {
      templateType = "initial"
    } else if (attemptCount === 1 && ageHours >= 24) {
      templateType = "reminder"
    } else if (attemptCount === 2 && ageHours >= 72) {
      templateType = "lastChance"
    }

    if (templateType && !params.dryRun) {
      const result = await sendRecoveryEmail({ cartId: cart.cartId, templateType }, context)
      if (result.success) {
        results.emailsSent++
      } else if (result.error) {
        results.errors.push(`${cart.cartId}: ${result.error}`)
      }
    }
  }

  console.log("[Cart] Campaign complete", results)

  return results
}

// Export handlers map for registry
export const abandonedCartHandlers = {
  trackCartActivity,
  markCartAbandoned,
  getAbandonedCarts,
  sendRecoveryEmail,
  markCartRecovered,
  getRecoveryLink,
  getRecoveryStats,
  runRecoveryCampaign,
}
