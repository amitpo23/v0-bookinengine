/**
 * Email Service - Simplified version for sending emails via Resend
 * Renders React Email templates and sends them directly
 * No database queue - simple and safe
 */

import { Resend } from 'resend'
import { render } from '@react-email/render'
import BookingConfirmationEmail from '@/emails/booking-confirmation'
import CancellationConfirmationEmail from '@/emails/cancellation-confirmation'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'bookings@youraitravelagent.com'
const FROM_NAME = process.env.FROM_NAME || 'Booking Engine'

class EmailService {
  private resend: Resend | null = null
  private enabled: boolean = false

  constructor() {
    if (RESEND_API_KEY) {
      this.resend = new Resend(RESEND_API_KEY)
      this.enabled = true
      console.log('[Email] Service initialized with Resend')
    } else {
      console.warn('[Email] RESEND_API_KEY not configured - emails disabled')
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
    language?: 'he' | 'en'
  }) {
    if (!this.enabled || !this.resend) {
      console.warn('[Email] Cannot send email - service not configured')
      return { success: false, error: 'Email service not configured' }
    }

    try {
      const isHebrew = params.language === 'he'
      const subject = isHebrew
        ? `אישור הזמנה ${params.bookingId}`
        : `Booking Confirmation ${params.bookingId}`

      const html = render(BookingConfirmationEmail(params))

      console.log('[Email] Sending booking confirmation', {
        to: params.to,
        bookingId: params.bookingId,
      })

      const result = await this.resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.to,
        subject,
        html,
      })

      console.log('[Email] ✅ Booking confirmation sent', {
        to: params.to,
        emailId: result.data?.id,
      })

      return { success: true, emailId: result.data?.id }
    } catch (error: any) {
      console.error('[Email] ❌ Failed to send booking confirmation', {
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
    language?: 'he' | 'en'
  }) {
    if (!this.enabled || !this.resend) {
      console.warn('[Email] Cannot send email - service not configured')
      return { success: false, error: 'Email service not configured' }
    }

    try {
      const isHebrew = params.language === 'he'
      const subject = isHebrew
        ? `אישור ביטול הזמנה ${params.bookingId}`
        : `Booking Cancellation ${params.bookingId}`

      const html = render(CancellationConfirmationEmail(params))

      console.log('[Email] Sending cancellation confirmation', {
        to: params.to,
        bookingId: params.bookingId,
      })

      const result = await this.resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.to,
        subject,
        html,
      })

      console.log('[Email] ✅ Cancellation confirmation sent', {
        to: params.to,
        emailId: result.data?.id,
      })

      return { success: true, emailId: result.data?.id }
    } catch (error: any) {
      console.error('[Email] ❌ Failed to send cancellation confirmation', {
        to: params.to,
        error: error.message,
      })
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export class for testing
export { EmailService }
