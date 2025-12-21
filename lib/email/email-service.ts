/**
 * Email Service - Handles sending emails via Resend
 * Renders React Email templates and sends them
 */

import { Resend } from "resend"
import { render } from "@react-email/render"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/db/prisma"
import BookingConfirmationEmail from "@/emails/booking-confirmation"
import CancellationConfirmationEmail from "@/emails/cancellation-confirmation"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "bookings@example.com"
const FROM_NAME = process.env.FROM_NAME || "Booking Engine"

class EmailService {
  private resend: Resend | null = null
  private enabled: boolean = false

  constructor() {
    if (RESEND_API_KEY) {
      this.resend = new Resend(RESEND_API_KEY)
      this.enabled = true
      logger.info("[Email] Service initialized with Resend")
    } else {
      logger.warn("[Email] RESEND_API_KEY not configured - emails disabled")
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(params: {
    to: string
    customerName: string
    bookingId: string
    supplierReference: string
    hotelName: string
    roomType: string
    checkIn: string
    checkOut: string
    nights: number
    adults: number
    children: number
    totalPrice: number
    currency: string
    hotelAddress?: string
    hotelPhone?: string
    cancellationPolicy?: string
    language?: "he" | "en"
  }) {
    if (!this.enabled || !this.resend) {
      logger.warn("[Email] Cannot send email - service not configured")
      return { success: false, error: "Email service not configured" }
    }

    try {
      const isHebrew = params.language === "he"
      const subject = isHebrew ? `אישור הזמנה ${params.bookingId}` : `Booking Confirmation ${params.bookingId}`

      const html = render(BookingConfirmationEmail(params))

      logger.info("[Email] Sending booking confirmation", {
        to: params.to,
        bookingId: params.bookingId,
      })

      const result = await this.resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.to,
        subject,
        html,
      })

      logger.info("[Email] ✅ Booking confirmation sent", {
        to: params.to,
        emailId: result.data?.id,
      })

      return { success: true, emailId: result.data?.id }
    } catch (error: any) {
      logger.error("[Email] ❌ Failed to send booking confirmation", {
        to: params.to,
        error: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  /**
   * Send cancellation confirmation email
   */
  async sendCancellationConfirmation(params: {
    to: string
    customerName: string
    bookingId: string
    hotelName: string
    checkIn: string
    checkOut: string
    totalPrice: number
    currency: string
    refundAmount?: number
    refundDate?: string
    cancellationReason?: string
    language?: "he" | "en"
  }) {
    if (!this.enabled || !this.resend) {
      logger.warn("[Email] Cannot send email - service not configured")
      return { success: false, error: "Email service not configured" }
    }

    try {
      const isHebrew = params.language === "he"
      const subject = isHebrew ? `אישור ביטול הזמנה ${params.bookingId}` : `Booking Cancellation ${params.bookingId}`

      const html = render(CancellationConfirmationEmail(params))

      logger.info("[Email] Sending cancellation confirmation", {
        to: params.to,
        bookingId: params.bookingId,
      })

      const result = await this.resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.to,
        subject,
        html,
      })

      logger.info("[Email] ✅ Cancellation confirmation sent", {
        to: params.to,
        emailId: result.data?.id,
      })

      return { success: true, emailId: result.data?.id }
    } catch (error: any) {
      logger.error("[Email] ❌ Failed to send cancellation confirmation", {
        to: params.to,
        error: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  /**
   * Process email queue (run periodically)
   * Sends pending emails from the queue
   */
  async processEmailQueue(limit: number = 10) {
    if (!this.enabled) {
      return { processed: 0, failed: 0 }
    }

    try {
      // Get pending emails
      const emails = await prisma.emailQueue.findMany({
        where: {
          status: "PENDING",
        },
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
      })

      logger.info("[Email Queue] Processing emails", { count: emails.length })

      let processed = 0
      let failed = 0

      for (const email of emails) {
        try {
          // Mark as sending
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: { status: "SENDING" },
          })

          let result: { success: boolean; error?: string; emailId?: string } = {
            success: false,
            error: "Unknown email type",
          }

          // Send based on type
          switch (email.emailType) {
            case "BOOKING_CONFIRMATION":
              result = await this.sendBookingConfirmation({
                to: email.to,
                ...(email.templateData as any),
              })
              break

            case "CANCELLATION_CONFIRMATION":
              result = await this.sendCancellationConfirmation({
                to: email.to,
                ...(email.templateData as any),
              })
              break

            default:
              logger.warn("[Email Queue] Unknown email type", {
                type: email.emailType,
              })
          }

          if (result.success) {
            // Mark as sent
            await prisma.emailQueue.update({
              where: { id: email.id },
              data: {
                status: "SENT",
                sentAt: new Date(),
              },
            })
            processed++
          } else {
            // Mark as failed
            await prisma.emailQueue.update({
              where: { id: email.id },
              data: {
                status: "FAILED",
                attempts: email.attempts + 1,
                lastError: result.error,
              },
            })
            failed++
          }
        } catch (error: any) {
          logger.error("[Email Queue] Failed to process email", {
            emailId: email.id,
            error: error.message,
          })

          await prisma.emailQueue.update({
            where: { id: email.id },
            data: {
              status: "FAILED",
              attempts: email.attempts + 1,
              lastError: error.message,
            },
          })
          failed++
        }
      }

      logger.info("[Email Queue] Processing complete", { processed, failed })

      return { processed, failed }
    } catch (error: any) {
      logger.error("[Email Queue] Failed to process queue", {
        error: error.message,
      })
      return { processed: 0, failed: 0 }
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails(limit: number = 5) {
    if (!this.enabled) {
      return { retried: 0 }
    }

    try {
      // Get failed emails that haven't exceeded max attempts
      const emails = await prisma.emailQueue.findMany({
        where: {
          status: "FAILED",
          attempts: {
            lt: 3, // maxAttempts
          },
        },
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
      })

      // Reset to pending
      for (const email of emails) {
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: "PENDING" },
        })
      }

      logger.info("[Email Queue] Retrying failed emails", {
        count: emails.length,
      })

      return { retried: emails.length }
    } catch (error: any) {
      logger.error("[Email Queue] Failed to retry emails", {
        error: error.message,
      })
      return { retried: 0 }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export class for testing
export { EmailService }
