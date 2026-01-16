/**
 * Payment Handler
 * Stripe integration for processing booking payments
 */

import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
})

// Types
export interface PaymentContext {
  userId?: string
  sessionId?: string
  locale?: string
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
  bookingId?: string
  customerId?: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  status?: string
  error?: string
  requiresAction?: boolean
  actionUrl?: string
  receiptUrl?: string
}

/**
 * Create a Stripe payment intent for a booking
 */
export async function createPaymentIntent(
  params: {
    bookingId: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    description?: string
    metadata?: Record<string, string>
  },
  context?: PaymentContext
): Promise<PaymentIntent> {
  console.log("[Payment] Creating payment intent", { bookingId: params.bookingId, amount: params.amount })

  try {
    // Create or retrieve Stripe customer
    let customerId: string | undefined
    
    const existingCustomers = await stripe.customers.list({
      email: params.customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: params.customerEmail,
        name: params.customerName,
        metadata: {
          source: "booking-engine",
          bookingId: params.bookingId,
        },
      })
      customerId = customer.id
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount, // Amount in cents
      currency: params.currency.toLowerCase(),
      customer: customerId,
      description: params.description || `Booking ${params.bookingId}`,
      metadata: {
        bookingId: params.bookingId,
        customerEmail: params.customerEmail,
        ...params.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Enable 3D Secure when required
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
    })

    console.log("[Payment] Payment intent created", { id: paymentIntent.id, status: paymentIntent.status })

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || "",
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      bookingId: params.bookingId,
      customerId,
    }
  } catch (error: any) {
    console.error("[Payment] Failed to create payment intent", error.message)
    throw new Error(`Payment intent creation failed: ${error.message}`)
  }
}

/**
 * Process a payment using an existing payment intent
 */
export async function processPayment(
  params: {
    paymentIntentId: string
    paymentMethodId: string
    returnUrl?: string
  },
  context?: PaymentContext
): Promise<PaymentResult> {
  console.log("[Payment] Processing payment", { paymentIntentId: params.paymentIntentId })

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(params.paymentIntentId, {
      payment_method: params.paymentMethodId,
      return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-bookinengine.vercel.app"}/booking/complete`,
    })

    const result: PaymentResult = {
      success: paymentIntent.status === "succeeded",
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
    }

    // Check if 3D Secure is required
    if (paymentIntent.status === "requires_action" && paymentIntent.next_action?.type === "redirect_to_url") {
      result.requiresAction = true
      result.actionUrl = paymentIntent.next_action.redirect_to_url?.url || undefined
    }

    console.log("[Payment] Payment processed", { id: paymentIntent.id, status: paymentIntent.status })

    return result
  } catch (error: any) {
    console.error("[Payment] Payment processing failed", error.message)
    return {
      success: false,
      paymentId: params.paymentIntentId,
      error: error.message,
    }
  }
}

/**
 * Verify a payment was successful
 */
export async function verifyPayment(
  params: { paymentIntentId: string },
  context?: PaymentContext
): Promise<{
  verified: boolean
  status: string
  amount?: number
  currency?: string
  bookingId?: string
  error?: string
}> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId)

    return {
      verified: paymentIntent.status === "succeeded",
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      bookingId: paymentIntent.metadata.bookingId,
    }
  } catch (error: any) {
    console.error("[Payment] Payment verification failed", error.message)
    return {
      verified: false,
      status: "error",
      error: error.message,
    }
  }
}

/**
 * Get current status of a payment
 */
export async function getPaymentStatus(
  params: { paymentIntentId: string },
  context?: PaymentContext
): Promise<{
  id: string
  status: string
  amount: number
  currency: string
  created: Date
  paymentMethod?: string
  receiptUrl?: string
  bookingId?: string
}> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId, {
      expand: ["latest_charge"],
    })

    const charge = paymentIntent.latest_charge as Stripe.Charge | null

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: new Date(paymentIntent.created * 1000),
      paymentMethod: typeof paymentIntent.payment_method === "string" 
        ? paymentIntent.payment_method 
        : paymentIntent.payment_method?.id,
      receiptUrl: charge?.receipt_url || undefined,
      bookingId: paymentIntent.metadata.bookingId,
    }
  } catch (error: any) {
    console.error("[Payment] Failed to get payment status", error.message)
    throw error
  }
}

/**
 * Cancel a pending payment intent
 */
export async function cancelPayment(
  params: {
    paymentIntentId: string
    reason?: string
  },
  context?: PaymentContext
): Promise<{ success: boolean; error?: string }> {
  try {
    await stripe.paymentIntents.cancel(params.paymentIntentId, {
      cancellation_reason: "requested_by_customer",
    })

    console.log("[Payment] Payment cancelled", { id: params.paymentIntentId, reason: params.reason })

    return { success: true }
  } catch (error: any) {
    console.error("[Payment] Failed to cancel payment", error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Get list of payments for a booking
 */
export async function getBookingPayments(
  params: { bookingId: string },
  context?: PaymentContext
): Promise<PaymentIntent[]> {
  try {
    const paymentIntents = await stripe.paymentIntents.search({
      query: `metadata["bookingId"]:"${params.bookingId}"`,
      limit: 10,
    })

    return paymentIntents.data.map(pi => ({
      id: pi.id,
      clientSecret: pi.client_secret || "",
      amount: pi.amount,
      currency: pi.currency,
      status: pi.status,
      bookingId: params.bookingId,
      customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    }))
  } catch (error: any) {
    console.error("[Payment] Failed to get booking payments", error.message)
    return []
  }
}

// Export handlers map for registry
export const paymentHandlers = {
  createPaymentIntent,
  processPayment,
  verifyPayment,
  getPaymentStatus,
  cancelPayment,
  getBookingPayments,
}
