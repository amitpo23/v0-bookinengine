/**
 * Hotel Booking AI - Notifications Handler
 * Handles email, SMS, and push notifications
 */

import type { ConversationContext, ToolResult } from '../types';
import { registerToolHandler } from '../engine-manager';

// ========================================
// EMAIL NOTIFICATION HANDLER
// ========================================

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  templateData?: Record<string, any>;
  replyTo?: string;
  cc?: string[];
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

async function handleSendEmail(
  params: SendEmailParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.to)) {
      return {
        success: false,
        data: null,
        error: 'Invalid email address format'
      };
    }

    const messageId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would use Resend/SendGrid/etc.
    // For now, we log and simulate
    console.log(`Sending email to ${params.to}: ${params.subject}`);

    // Track sent emails in context
    if (!context.metadata.sentNotifications) {
      context.metadata.sentNotifications = [];
    }
    context.metadata.sentNotifications.push({
      id: messageId,
      type: 'email',
      to: params.to,
      subject: params.subject,
      sentAt: new Date().toISOString()
    });

    return {
      success: true,
      data: {
        messageId,
        to: params.to,
        subject: params.subject,
        status: 'sent',
        timestamp: new Date().toISOString(),
        message: 'Email sent successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send email'
    };
  }
}

registerToolHandler('send_email', handleSendEmail as any);

// ========================================
// BOOKING CONFIRMATION EMAIL
// ========================================

interface SendBookingConfirmationParams {
  email: string;
  bookingDetails: {
    confirmationNumber: string;
    guestName: string;
    hotelName: string;
    hotelAddress: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    totalPrice: number;
    currency: string;
    cancellationPolicy?: string;
  };
  language?: 'en' | 'he';
}

async function handleSendBookingConfirmation(
  params: SendBookingConfirmationParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const { bookingDetails, language = 'en' } = params;

    const subject = language === 'he'
      ? `אישור הזמנה - ${bookingDetails.hotelName}`
      : `Booking Confirmation - ${bookingDetails.hotelName}`;

    const body = language === 'he' ? `
שלום ${bookingDetails.guestName},

תודה על הזמנתך! להלן פרטי ההזמנה:

מספר אישור: ${bookingDetails.confirmationNumber}
מלון: ${bookingDetails.hotelName}
כתובת: ${bookingDetails.hotelAddress}
צ'ק-אין: ${bookingDetails.checkIn}
צ'ק-אאוט: ${bookingDetails.checkOut}
סוג חדר: ${bookingDetails.roomType}
סה"כ: ${bookingDetails.currency} ${bookingDetails.totalPrice}

${bookingDetails.cancellationPolicy ? `מדיניות ביטול: ${bookingDetails.cancellationPolicy}` : ''}

נתראה!
    ` : `
Dear ${bookingDetails.guestName},

Thank you for your booking! Here are your reservation details:

Confirmation Number: ${bookingDetails.confirmationNumber}
Hotel: ${bookingDetails.hotelName}
Address: ${bookingDetails.hotelAddress}
Check-in: ${bookingDetails.checkIn}
Check-out: ${bookingDetails.checkOut}
Room Type: ${bookingDetails.roomType}
Total: ${bookingDetails.currency} ${bookingDetails.totalPrice}

${bookingDetails.cancellationPolicy ? `Cancellation Policy: ${bookingDetails.cancellationPolicy}` : ''}

We look forward to welcoming you!
    `;

    return handleSendEmail({
      to: params.email,
      subject,
      body,
      templateId: 'booking-confirmation',
      templateData: bookingDetails
    }, context);
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send booking confirmation'
    };
  }
}

registerToolHandler('send_booking_confirmation', handleSendBookingConfirmation as any);

// ========================================
// CANCELLATION CONFIRMATION EMAIL
// ========================================

interface SendCancellationConfirmationParams {
  email: string;
  cancellationDetails: {
    confirmationNumber: string;
    cancellationId: string;
    guestName: string;
    hotelName: string;
    refundAmount?: number;
    refundCurrency?: string;
    refundStatus?: string;
  };
  language?: 'en' | 'he';
}

async function handleSendCancellationConfirmation(
  params: SendCancellationConfirmationParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const { cancellationDetails, language = 'en' } = params;

    const subject = language === 'he'
      ? `אישור ביטול - ${cancellationDetails.hotelName}`
      : `Cancellation Confirmation - ${cancellationDetails.hotelName}`;

    const refundInfo = cancellationDetails.refundAmount
      ? language === 'he'
        ? `סכום החזר: ${cancellationDetails.refundCurrency} ${cancellationDetails.refundAmount}`
        : `Refund Amount: ${cancellationDetails.refundCurrency} ${cancellationDetails.refundAmount}`
      : '';

    const body = language === 'he' ? `
שלום ${cancellationDetails.guestName},

הזמנתך בוטלה בהצלחה.

מספר הזמנה מקורי: ${cancellationDetails.confirmationNumber}
מספר ביטול: ${cancellationDetails.cancellationId}
מלון: ${cancellationDetails.hotelName}
${refundInfo}

נשמח לשרת אותך בעתיד.
    ` : `
Dear ${cancellationDetails.guestName},

Your booking has been successfully cancelled.

Original Confirmation: ${cancellationDetails.confirmationNumber}
Cancellation ID: ${cancellationDetails.cancellationId}
Hotel: ${cancellationDetails.hotelName}
${refundInfo}

We hope to serve you again in the future.
    `;

    return handleSendEmail({
      to: params.email,
      subject,
      body,
      templateId: 'cancellation-confirmation',
      templateData: cancellationDetails
    }, context);
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send cancellation confirmation'
    };
  }
}

registerToolHandler('send_cancellation_confirmation', handleSendCancellationConfirmation as any);

// ========================================
// PRICE ALERT NOTIFICATION
// ========================================

interface SendPriceAlertParams {
  email?: string;
  phone?: string;
  alertDetails: {
    hotelName: string;
    roomType: string;
    dates: string;
    previousPrice: number;
    currentPrice: number;
    currency: string;
    priceChange: number;
    bookingUrl?: string;
  };
  method: 'email' | 'sms' | 'push';
  language?: 'en' | 'he';
}

async function handleSendPriceAlert(
  params: SendPriceAlertParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const { alertDetails, method, language = 'en' } = params;

    if (method === 'email' && !params.email) {
      return {
        success: false,
        data: null,
        error: 'Email address required for email notifications'
      };
    }

    if (method === 'sms' && !params.phone) {
      return {
        success: false,
        data: null,
        error: 'Phone number required for SMS notifications'
      };
    }

    const changeText = alertDetails.priceChange < 0
      ? (language === 'he' ? 'ירידה' : 'dropped')
      : (language === 'he' ? 'עלייה' : 'increased');

    const messageId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    if (method === 'email') {
      const subject = language === 'he'
        ? `🔔 התראת מחיר: ${alertDetails.hotelName}`
        : `🔔 Price Alert: ${alertDetails.hotelName}`;

      const body = language === 'he' ? `
המחיר עבור ${alertDetails.hotelName} ${changeText}!

חדר: ${alertDetails.roomType}
תאריכים: ${alertDetails.dates}
מחיר קודם: ${alertDetails.currency} ${alertDetails.previousPrice}
מחיר נוכחי: ${alertDetails.currency} ${alertDetails.currentPrice}
שינוי: ${alertDetails.priceChange}%

${alertDetails.bookingUrl ? `להזמנה: ${alertDetails.bookingUrl}` : ''}
      ` : `
The price for ${alertDetails.hotelName} has ${changeText}!

Room: ${alertDetails.roomType}
Dates: ${alertDetails.dates}
Previous Price: ${alertDetails.currency} ${alertDetails.previousPrice}
Current Price: ${alertDetails.currency} ${alertDetails.currentPrice}
Change: ${alertDetails.priceChange}%

${alertDetails.bookingUrl ? `Book now: ${alertDetails.bookingUrl}` : ''}
      `;

      return handleSendEmail({
        to: params.email!,
        subject,
        body,
        templateId: 'price-alert'
      }, context);
    } else if (method === 'sms') {
      // SMS handler would be called here
      const smsMessage = language === 'he'
        ? `🔔 ${alertDetails.hotelName}: המחיר ${changeText} ל-${alertDetails.currency}${alertDetails.currentPrice} (${alertDetails.priceChange}%)`
        : `🔔 ${alertDetails.hotelName}: Price ${changeText} to ${alertDetails.currency}${alertDetails.currentPrice} (${alertDetails.priceChange}%)`;

      // Track notification
      if (!context.metadata.sentNotifications) {
        context.metadata.sentNotifications = [];
      }
      context.metadata.sentNotifications.push({
        id: messageId,
        type: 'sms',
        to: params.phone,
        content: smsMessage,
        sentAt: new Date().toISOString()
      });

      return {
        success: true,
        data: {
          messageId,
          to: params.phone,
          type: 'sms',
          status: 'sent',
          message: 'Price alert SMS sent successfully'
        }
      };
    } else {
      // Push notification
      return {
        success: true,
        data: {
          messageId,
          type: 'push',
          status: 'sent',
          message: 'Push notification sent successfully'
        }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send price alert notification'
    };
  }
}

registerToolHandler('send_price_alert', handleSendPriceAlert as any);

// ========================================
// REMINDER NOTIFICATION
// ========================================

interface SendReminderParams {
  email?: string;
  phone?: string;
  reminderDetails: {
    type: 'check-in' | 'check-out' | 'payment' | 'review' | 'custom';
    title: string;
    message: string;
    hotelName?: string;
    date?: string;
    actionUrl?: string;
  };
  method: 'email' | 'sms' | 'push';
}

async function handleSendReminder(
  params: SendReminderParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const { reminderDetails, method } = params;

    const messageId = `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    if (method === 'email' && params.email) {
      return handleSendEmail({
        to: params.email,
        subject: reminderDetails.title,
        body: reminderDetails.message,
        templateId: `reminder-${reminderDetails.type}`
      }, context);
    }

    // Track reminder
    if (!context.metadata.sentNotifications) {
      context.metadata.sentNotifications = [];
    }
    context.metadata.sentNotifications.push({
      id: messageId,
      type: method,
      reminderType: reminderDetails.type,
      title: reminderDetails.title,
      sentAt: new Date().toISOString()
    });

    return {
      success: true,
      data: {
        messageId,
        type: method,
        reminderType: reminderDetails.type,
        status: 'sent',
        message: 'Reminder sent successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send reminder'
    };
  }
}

registerToolHandler('send_reminder', handleSendReminder as any);

// ========================================
// GET NOTIFICATION HISTORY
// ========================================

interface GetNotificationHistoryParams {
  limit?: number;
  type?: 'email' | 'sms' | 'push';
}

async function handleGetNotificationHistory(
  params: GetNotificationHistoryParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    let notifications = context.metadata.sentNotifications || [];

    if (params.type) {
      notifications = notifications.filter((n: any) => n.type === params.type);
    }

    if (params.limit) {
      notifications = notifications.slice(-params.limit);
    }

    return {
      success: true,
      data: {
        totalNotifications: notifications.length,
        notifications: notifications.map((n: any) => ({
          id: n.id,
          type: n.type,
          to: n.to,
          subject: n.subject,
          sentAt: n.sentAt
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get notification history'
    };
  }
}

registerToolHandler('get_notification_history', handleGetNotificationHistory);

export {
  handleSendEmail,
  handleSendBookingConfirmation,
  handleSendCancellationConfirmation,
  handleSendPriceAlert,
  handleSendReminder,
  handleGetNotificationHistory
};
