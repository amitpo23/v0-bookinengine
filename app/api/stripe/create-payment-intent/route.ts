import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(request: Request) {
  try {
    const { amount, currency, metadata, customerEmail, customerName } = await request.json()

    // Create or retrieve customer
    let customer: Stripe.Customer | undefined

    if (customerEmail) {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            source: "booking-engine",
          },
        })
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/agorot
      currency: currency.toLowerCase(),
      customer: customer?.id,
      metadata: {
        ...metadata,
        booking_source: "hotel-booking-engine",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
