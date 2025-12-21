/**
 * WhatsApp Service with Twilio Integration
 * Sends booking confirmations, updates, and notifications via WhatsApp
 */

import twilio from "twilio"
import { logger } from "@/lib/logger"

// Environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886" // Twilio Sandbox

interface WhatsAppMessage {
  to: string // Phone number with country code (e.g., "+972501234567")
  message: string
  mediaUrl?: string // Optional image/PDF URL
}

interface BookingNotification {
  to: string
  customerName: string
  bookingId: string
  hotelName: string
  checkIn: string
  checkOut: string
  totalPrice: number
  currency: string
  language?: "en" | "he" | "ar" | "ru"
}

class WhatsAppService {
  private client: twilio.Twilio | null = null
  private enabled: boolean = false

  constructor() {
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      try {
        this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        this.enabled = true
        logger.info("[WhatsApp] Service initialized successfully")
      } catch (error: any) {
        logger.error("[WhatsApp] Failed to initialize", error)
        this.enabled = false
      }
    } else {
      logger.warn("[WhatsApp] Not configured - set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN")
      this.enabled = false
    }
  }

  /**
   * Check if WhatsApp service is enabled and configured
   */
  isEnabled(): boolean {
    return this.enabled && this.client !== null
  }

  /**
   * Send a WhatsApp message
   */
  async sendMessage({ to, message, mediaUrl }: WhatsAppMessage): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: "WhatsApp service not configured",
      }
    }

    try {
      // Ensure phone number has whatsapp: prefix
      const whatsappTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`

      const messageOptions: any = {
        from: TWILIO_WHATSAPP_FROM,
        to: whatsappTo,
        body: message,
      }

      if (mediaUrl) {
        messageOptions.mediaUrl = [mediaUrl]
      }

      const result = await this.client!.messages.create(messageOptions)

      logger.info("[WhatsApp] Message sent", {
        messageId: result.sid,
        to: whatsappTo,
      })

      return {
        success: true,
        messageId: result.sid,
      }
    } catch (error: any) {
      logger.error("[WhatsApp] Failed to send message", error)
      return {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
      }
    }
  }

  /**
   * Send booking confirmation via WhatsApp
   */
  async sendBookingConfirmation(params: BookingNotification): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    const { to, customerName, bookingId, hotelName, checkIn, checkOut, totalPrice, currency, language = "en" } = params

    const messages = {
      en: `🎉 Booking Confirmed!

Dear ${customerName},

Your reservation is confirmed!

📋 Booking Details:
• Booking ID: ${bookingId}
• Hotel: ${hotelName}
• Check-in: ${checkIn}
• Check-out: ${checkOut}
• Total: ${currency} ${totalPrice.toFixed(2)}

We look forward to welcoming you!

Questions? Reply to this message.`,

      he: `🎉 ההזמנה אושרה!

${customerName} שלום,

ההזמנה שלך אושרה!

📋 פרטי הזמנה:
• מספר הזמנה: ${bookingId}
• מלון: ${hotelName}
• צ'ק-אין: ${checkIn}
• צ'ק-אאוט: ${checkOut}
• סה"כ: ${currency} ${totalPrice.toFixed(2)}

אנחנו מצפים לארח אותך!

שאלות? השב להודעה זו.`,

      ar: `🎉 تم تأكيد الحجز!

عزيزي ${customerName}،

تم تأكيد حجزك!

📋 تفاصيل الحجز:
• رقم الحجز: ${bookingId}
• الفندق: ${hotelName}
• تسجيل الوصول: ${checkIn}
• تسجيل المغادرة: ${checkOut}
• المجموع: ${currency} ${totalPrice.toFixed(2)}

نتطلع لاستقبالك!

أسئلة؟ رد على هذه الرسالة.`,

      ru: `🎉 Бронирование подтверждено!

Уважаемый ${customerName},

Ваше бронирование подтверждено!

📋 Детали бронирования:
• Номер брони: ${bookingId}
• Отель: ${hotelName}
• Заезд: ${checkIn}
• Выезд: ${checkOut}
• Итого: ${currency} ${totalPrice.toFixed(2)}

Мы с нетерпением ждем встречи с вами!

Вопросы? Ответьте на это сообщение.`,
    }

    const message = messages[language] || messages.en

    return this.sendMessage({ to, message })
  }

  /**
   * Send booking cancellation notification
   */
  async sendCancellationNotification(params: {
    to: string
    customerName: string
    bookingId: string
    hotelName: string
    refundAmount?: number
    currency?: string
    language?: "en" | "he" | "ar" | "ru"
  }): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    const { to, customerName, bookingId, hotelName, refundAmount, currency, language = "en" } = params

    const messages = {
      en: `❌ Booking Cancelled

Dear ${customerName},

Your booking has been cancelled.

Booking ID: ${bookingId}
Hotel: ${hotelName}
${refundAmount && currency ? `Refund: ${currency} ${refundAmount.toFixed(2)}` : ""}

${refundAmount ? "Refund will be processed within 5-7 business days." : ""}

If you didn't request this cancellation, please contact us immediately.`,

      he: `❌ ההזמנה בוטלה

${customerName} שלום,

ההזמנה שלך בוטלה.

מספר הזמנה: ${bookingId}
מלון: ${hotelName}
${refundAmount && currency ? `החזר כספי: ${currency} ${refundAmount.toFixed(2)}` : ""}

${refundAmount ? "ההחזר יעובד תוך 5-7 ימי עסקים." : ""}

אם לא ביקשת את הביטול, נא ליצור קשר מיד.`,

      ar: `❌ تم إلغاء الحجز

عزيزي ${customerName}،

تم إلغاء حجزك.

رقم الحجز: ${bookingId}
الفندق: ${hotelName}
${refundAmount && currency ? `الاسترداد: ${currency} ${refundAmount.toFixed(2)}` : ""}

${refundAmount ? "سيتم معالجة الاسترداد في غضون 5-7 أيام عمل." : ""}

إذا لم تطلب هذا الإلغاء، يرجى الاتصال بنا على الفور.`,

      ru: `❌ Бронирование отменено

Уважаемый ${customerName},

Ваше бронирование было отменено.

Номер брони: ${bookingId}
Отель: ${hotelName}
${refundAmount && currency ? `Возврат: ${currency} ${refundAmount.toFixed(2)}` : ""}

${refundAmount ? "Возврат будет обработан в течение 5-7 рабочих дней." : ""}

Если вы не запрашивали эту отмену, пожалуйста, свяжитесь с нами немедленно.`,
    }

    const message = messages[language] || messages.en

    return this.sendMessage({ to, message })
  }

  /**
   * Send check-in reminder (1 day before)
   */
  async sendCheckInReminder(params: {
    to: string
    customerName: string
    hotelName: string
    checkIn: string
    language?: "en" | "he" | "ar" | "ru"
  }): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    const { to, customerName, hotelName, checkIn, language = "en" } = params

    const messages = {
      en: `🏨 Check-in Tomorrow!

Hi ${customerName},

Your stay at ${hotelName} starts tomorrow!

Check-in: ${checkIn}

Have a great trip! 🎉`,

      he: `🏨 צ'ק-אין מחר!

${customerName} שלום,

השהייה שלך ב${hotelName} מתחילה מחר!

צ'ק-אין: ${checkIn}

טיול נעים! 🎉`,

      ar: `🏨 تسجيل الوصول غدًا!

مرحبا ${customerName}،

تبدأ إقامتك في ${hotelName} غدًا!

تسجيل الوصول: ${checkIn}

رحلة سعيدة! 🎉`,

      ru: `🏨 Заезд завтра!

Здравствуйте ${customerName},

Ваше пребывание в ${hotelName} начинается завтра!

Заезд: ${checkIn}

Хорошей поездки! 🎉`,
    }

    const message = messages[language] || messages.en

    return this.sendMessage({ to, message })
  }

  /**
   * Send custom message
   */
  async sendCustomMessage(params: {
    to: string
    message: string
    mediaUrl?: string
  }): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    return this.sendMessage(params)
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService()

// Export class for testing
export { WhatsAppService }
