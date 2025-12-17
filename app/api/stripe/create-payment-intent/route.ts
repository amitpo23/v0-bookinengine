import { NextResponse } from "next/server"
import Stripe from "stripe"
import { PaymentIntentSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const body = await request.json()

    logger.apiRequest("POST", "/api/stripe/create-payment-intent", {
      amount: body.amount,
      currency: body.currency,
      customerEmail: body.customerEmail,
    })

    // Validate input with Zod
    const validated = PaymentIntentSchema.parse(body)

    // Additional security: Validate amount is reasonable
    if (validated.amount < 10) {
      logger.warn("Payment amount too low", { amount: validated.amount })
      return NextResponse.json(
        { error: "Payment amount too low. Minimum: 10 ILS" },
        { status: 400 }
      )
    }

    if (validated.amount > 100000) {
      logger.warn("Payment amount too high", { amount: validated.amount })
      return NextResponse.json(
        { error: "Payment amount exceeds maximum allowed (100,000 ILS)" },
        { status: 400 }
      )
    }

    logger.debug("Creating payment intent", {
      amount: validated.amount,
      currency: validated.currency,
      customerEmail: validated.customerEmail,
    })

    // Create or retrieve customer
    let customer: Stripe.Customer | undefined

    if (validated.customerEmail) {
      const existingCustomers = await stripe.customers.list({
        email: validated.customerEmail,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
        logger.debug("Found existing Stripe customer", { customerId: customer.id })
      } else {
        customer = await stripe.customers.create({
          email: validated.customerEmail,
          name: validated.customerName,
          metadata: {
            source: "booking-engine",
          },
        })
        logger.debug("Created new Stripe customer", { customerId: customer.id })
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validated.amount * 100), // Convert to cents/agorot
      currency: validated.currency.toLowerCase(),
      customer: customer?.id,
      metadata: {
        ...validated.metadata,
        booking_source: "hotel-booking-engine",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    logger.debug("Payment intent created successfully", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
    })

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/stripe/create-payment-intent", 200, duration)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      logger.warn("Payment intent validation failed", { errors: error.errors })
      logger.apiResponse("POST", "/api/stripe/create-payment-intent", 400, duration)

      return NextResponse.json(
        {
          error: "Invalid payment parameters",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error("Error creating payment intent", error)
    logger.apiResponse("POST", "/api/stripe/create-payment-intent", 500, duration)

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
      },
      { status: 500 }
    )
  }
}
