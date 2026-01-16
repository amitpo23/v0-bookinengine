/**
 * Refund Handler
 * Stripe integration for processing refunds and cancellations
 */

import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
})

// Types
export interface RefundContext {
  userId?: string
  sessionId?: string
  isAdmin?: boolean
}

export interface RefundResult {
  success: boolean
  refundId?: string
  amount?: number
  currency?: string
  status?: string
  error?: string
}

export interface CancellationPolicy {
  bookingId: string
  isRefundable: boolean
  cancellationDeadline: Date | null
  refundPercentage: number
  refundAmount: number
  penaltyAmount: number
  currency: string
  policyDescription: string
  policyDescriptionHe: string
}

/**
 * Calculate refund amount based on cancellation policy
 */
export async function calculateRefundAmount(
  params: {
    bookingId: string
    paymentIntentId: string
    cancellationDate?: Date
  },
  context?: RefundContext
): Promise<CancellationPolicy> {
  console.log("[Refund] Calculating refund amount", { bookingId: params.bookingId })

  try {
    // Get original payment
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId)
    const originalAmount = paymentIntent.amount
    const currency = paymentIntent.currency

    // Get booking metadata to determine policy
    const checkInDate = paymentIntent.metadata.checkIn 
      ? new Date(paymentIntent.metadata.checkIn) 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 7 days from now

    const cancellationDate = params.cancellationDate || new Date()
    const daysUntilCheckIn = Math.floor((checkInDate.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60 * 24))

    // Cancellation policy logic
    let refundPercentage = 0
    let policyDescription = ""
    let policyDescriptionHe = ""

    if (daysUntilCheckIn >= 7) {
      // Full refund if cancelled 7+ days before
      refundPercentage = 100
      policyDescription = "Full refund - cancelled more than 7 days before check-in"
      policyDescriptionHe = "החזר מלא - ביטול יותר מ-7 ימים לפני הצ'ק-אין"
    } else if (daysUntilCheckIn >= 3) {
      // 50% refund if cancelled 3-7 days before
      refundPercentage = 50
      policyDescription = "50% refund - cancelled 3-7 days before check-in"
      policyDescriptionHe = "החזר של 50% - ביטול 3-7 ימים לפני הצ'ק-אין"
    } else if (daysUntilCheckIn >= 1) {
      // 25% refund if cancelled 1-3 days before
      refundPercentage = 25
      policyDescription = "25% refund - cancelled 1-3 days before check-in"
      policyDescriptionHe = "החזר של 25% - ביטול 1-3 ימים לפני הצ'ק-אין"
    } else {
      // No refund if cancelled on check-in day or after
      refundPercentage = 0
      policyDescription = "No refund - cancelled on or after check-in day"
      policyDescriptionHe = "אין החזר - ביטול ביום הצ'ק-אין או אחריו"
    }

    const refundAmount = Math.floor(originalAmount * refundPercentage / 100)
    const penaltyAmount = originalAmount - refundAmount

    return {
      bookingId: params.bookingId,
      isRefundable: refundPercentage > 0,
      cancellationDeadline: new Date(checkInDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      refundPercentage,
      refundAmount,
      penaltyAmount,
      currency,
      policyDescription,
      policyDescriptionHe,
    }
  } catch (error: any) {
    console.error("[Refund] Failed to calculate refund", error.message)
    throw new Error(`Failed to calculate refund: ${error.message}`)
  }
}

/**
 * Process a full refund
 */
export async function processRefund(
  params: {
    paymentIntentId: string
    bookingId: string
    reason?: string
  },
  context?: RefundContext
): Promise<RefundResult> {
  console.log("[Refund] Processing full refund", { paymentIntentId: params.paymentIntentId })

  try {
    // Get payment intent to find the charge
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId, {
      expand: ["latest_charge"],
    })

    if (paymentIntent.status !== "succeeded") {
      return {
        success: false,
        error: "Payment has not been completed, cannot refund",
      }
    }

    const charge = paymentIntent.latest_charge as Stripe.Charge
    if (!charge) {
      return {
        success: false,
        error: "No charge found for this payment",
      }
    }

    // Create refund
    const refund = await stripe.refunds.create({
      charge: charge.id,
      reason: "requested_by_customer",
      metadata: {
        bookingId: params.bookingId,
        originalPaymentIntent: params.paymentIntentId,
        reason: params.reason || "Customer requested cancellation",
      },
    })

    console.log("[Refund] Refund processed", { refundId: refund.id, amount: refund.amount })

    return {
      success: refund.status === "succeeded" || refund.status === "pending",
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status || "unknown",
    }
  } catch (error: any) {
    console.error("[Refund] Refund processing failed", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Process a partial refund
 */
export async function processPartialRefund(
  params: {
    paymentIntentId: string
    bookingId: string
    amount: number
    reason?: string
  },
  context?: RefundContext
): Promise<RefundResult> {
  console.log("[Refund] Processing partial refund", { 
    paymentIntentId: params.paymentIntentId, 
    amount: params.amount 
  })

  try {
    // Get payment intent to find the charge
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId, {
      expand: ["latest_charge"],
    })

    if (paymentIntent.status !== "succeeded") {
      return {
        success: false,
        error: "Payment has not been completed, cannot refund",
      }
    }

    const charge = paymentIntent.latest_charge as Stripe.Charge
    if (!charge) {
      return {
        success: false,
        error: "No charge found for this payment",
      }
    }

    // Validate amount
    if (params.amount > charge.amount) {
      return {
        success: false,
        error: `Refund amount (${params.amount}) exceeds original charge (${charge.amount})`,
      }
    }

    // Create partial refund
    const refund = await stripe.refunds.create({
      charge: charge.id,
      amount: params.amount,
      reason: "requested_by_customer",
      metadata: {
        bookingId: params.bookingId,
        originalPaymentIntent: params.paymentIntentId,
        reason: params.reason || "Partial refund requested",
        isPartial: "true",
      },
    })

    console.log("[Refund] Partial refund processed", { refundId: refund.id, amount: refund.amount })

    return {
      success: refund.status === "succeeded" || refund.status === "pending",
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status || "unknown",
    }
  } catch (error: any) {
    console.error("[Refund] Partial refund failed", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get refund status
 */
export async function getRefundStatus(
  params: { refundId: string },
  context?: RefundContext
): Promise<{
  id: string
  status: string
  amount: number
  currency: string
  created: Date
  bookingId?: string
  reason?: string
}> {
  try {
    const refund = await stripe.refunds.retrieve(params.refundId)

    return {
      id: refund.id,
      status: refund.status || "unknown",
      amount: refund.amount,
      currency: refund.currency,
      created: new Date(refund.created * 1000),
      bookingId: refund.metadata?.bookingId,
      reason: refund.metadata?.reason,
    }
  } catch (error: any) {
    console.error("[Refund] Failed to get refund status", error.message)
    throw error
  }
}

/**
 * List refunds for a booking
 */
export async function getBookingRefunds(
  params: { bookingId: string },
  context?: RefundContext
): Promise<RefundResult[]> {
  try {
    // Search for refunds by booking ID in metadata
    const refunds = await stripe.refunds.list({
      limit: 100,
    })

    // Filter by booking ID (Stripe doesn't support metadata search on refunds)
    const bookingRefunds = refunds.data.filter(
      refund => refund.metadata?.bookingId === params.bookingId
    )

    return bookingRefunds.map(refund => ({
      success: refund.status === "succeeded",
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status || "unknown",
    }))
  } catch (error: any) {
    console.error("[Refund] Failed to get booking refunds", error.message)
    return []
  }
}

/**
 * Auto-refund based on cancellation policy
 */
export async function autoRefundWithPolicy(
  params: {
    bookingId: string
    paymentIntentId: string
    reason?: string
  },
  context?: RefundContext
): Promise<RefundResult & { policy: CancellationPolicy }> {
  console.log("[Refund] Auto-refund with policy", { bookingId: params.bookingId })

  try {
    // Calculate refund amount based on policy
    const policy = await calculateRefundAmount({
      bookingId: params.bookingId,
      paymentIntentId: params.paymentIntentId,
    }, context)

    if (!policy.isRefundable) {
      return {
        success: false,
        error: policy.policyDescription,
        policy,
      }
    }

    // Process the refund
    const result = await processPartialRefund({
      paymentIntentId: params.paymentIntentId,
      bookingId: params.bookingId,
      amount: policy.refundAmount,
      reason: params.reason || policy.policyDescription,
    }, context)

    return {
      ...result,
      policy,
    }
  } catch (error: any) {
    console.error("[Refund] Auto-refund failed", error.message)
    throw error
  }
}

// Export handlers map for registry
export const refundHandlers = {
  calculateRefundAmount,
  processRefund,
  processPartialRefund,
  getRefundStatus,
  getBookingRefunds,
  autoRefundWithPolicy,
}
