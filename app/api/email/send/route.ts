import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email/email-service"
import { logger } from "@/lib/logger"

/**
 * POST /api/email/send
 * Manually trigger email sending (for testing or admin use)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...emailData } = body

    if (!emailService.isEnabled()) {
      return NextResponse.json(
        {
          error: "Email service not configured. Set RESEND_API_KEY in environment variables.",
        },
        { status: 503 }
      )
    }

    logger.info("[Email API] Sending email", { type })

    let result

    switch (type) {
      case "booking-confirmation":
        result = await emailService.sendBookingConfirmation(emailData)
        break

      case "cancellation-confirmation":
        result = await emailService.sendCancellationConfirmation(emailData)
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        emailId: result.emailId,
      })
    } else {
      return NextResponse.json(
        {
          error: result.error || "Failed to send email",
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    logger.error("[Email API] Error", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to send email",
      },
      { status: 500 }
    )
  }
}
