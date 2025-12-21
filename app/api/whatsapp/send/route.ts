import { type NextRequest, NextResponse } from "next/server"
import { whatsappService } from "@/lib/whatsapp/whatsapp-service"
import { logger } from "@/lib/logger"

/**
 * POST /api/whatsapp/send
 * Send WhatsApp message (booking confirmation, cancellation, custom message)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...messageData } = body

    if (!whatsappService.isEnabled()) {
      return NextResponse.json(
        {
          error: "WhatsApp service not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in environment variables.",
        },
        { status: 503 }
      )
    }

    logger.info("[WhatsApp API] Sending message", { type })

    let result

    switch (type) {
      case "booking-confirmation":
        result = await whatsappService.sendBookingConfirmation(messageData)
        break

      case "cancellation":
        result = await whatsappService.sendCancellationNotification(messageData)
        break

      case "check-in-reminder":
        result = await whatsappService.sendCheckInReminder(messageData)
        break

      case "custom":
        result = await whatsappService.sendCustomMessage(messageData)
        break

      default:
        return NextResponse.json({ error: "Invalid message type" }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        {
          error: result.error || "Failed to send WhatsApp message",
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    logger.error("[WhatsApp API] Error", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to send WhatsApp message",
      },
      { status: 500 }
    )
  }
}
