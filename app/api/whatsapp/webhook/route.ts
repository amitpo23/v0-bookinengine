import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { logger } from "@/lib/logger"
import { whatsappService } from "@/lib/whatsapp/whatsapp-service"

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

/**
 * POST /api/whatsapp/webhook
 * Twilio webhook for incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    // Verify Twilio signature for security
    const twilioSignature = request.headers.get("x-twilio-signature") || ""
    const url = request.url
    const formData = await request.formData()

    // Convert FormData to object
    const params: Record<string, string> = {}
    formData.forEach((value, key) => {
      params[key] = value.toString()
    })

    // Validate Twilio signature
    if (TWILIO_AUTH_TOKEN) {
      const isValid = twilio.validateRequest(TWILIO_AUTH_TOKEN, twilioSignature, url, params)

      if (!isValid) {
        logger.warn("[WhatsApp Webhook] Invalid Twilio signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
      }
    }

    // Extract message details
    const from = params.From // Customer's WhatsApp number
    const body = params.Body // Message text
    const mediaUrl = params.MediaUrl0 // Optional media attachment

    logger.info("[WhatsApp Webhook] Incoming message", {
      from,
      body: body.substring(0, 50), // Log first 50 chars
      hasMedia: !!mediaUrl,
    })

    // Process the message
    const response = await processIncomingMessage({
      from,
      body,
      mediaUrl,
    })

    // Respond with TwiML
    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message(response)

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error: any) {
    logger.error("[WhatsApp Webhook] Error", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to process WhatsApp message",
      },
      { status: 500 }
    )
  }
}

/**
 * Process incoming WhatsApp message and generate response
 */
async function processIncomingMessage({
  from,
  body,
  mediaUrl,
}: {
  from: string
  body: string
  mediaUrl?: string
}): Promise<string> {
  const messageLower = body.toLowerCase().trim()

  // Simple command handling
  if (messageLower.includes("help") || messageLower === "?") {
    return `👋 Welcome to our Hotel Booking Service!

Available commands:
• "status [booking-id]" - Check your booking status
• "cancel [booking-id]" - Cancel a booking
• "help" - Show this message

Or just ask us anything! Our team will respond shortly.`
  }

  if (messageLower.startsWith("status")) {
    const bookingId = messageLower.replace("status", "").trim()
    if (bookingId) {
      // TODO: Look up booking in database
      return `📋 Looking up booking ${bookingId}...\n\nPlease wait while we retrieve your booking details.`
    } else {
      return `To check your booking status, please send:\nstatus [your-booking-id]`
    }
  }

  if (messageLower.startsWith("cancel")) {
    const bookingId = messageLower.replace("cancel", "").trim()
    if (bookingId) {
      // TODO: Process cancellation
      return `⚠️ To cancel booking ${bookingId}, please confirm by replying:\nCONFIRM CANCEL ${bookingId}`
    } else {
      return `To cancel your booking, please send:\ncancel [your-booking-id]`
    }
  }

  // Default response for general inquiries
  return `Thank you for your message! 🙏

Our customer support team will respond as soon as possible.

Need immediate assistance?
📞 Call us: +1-234-567-8900
📧 Email: support@yourbooking.com

Or send "help" to see available commands.`
}
