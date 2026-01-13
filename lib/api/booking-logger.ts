// Booking Logger - מעקב אחר תהליך ההזמנה
import { format } from 'date-fns'

export type BookingEventType = 
  | 'search_started'
  | 'search_completed'
  | 'search_failed'
  | 'prebook_started'
  | 'prebook_completed'
  | 'prebook_failed'
  | 'prebook_expired'
  | 'book_started'
  | 'book_completed'
  | 'book_failed'
  | 'booking_cancelled'
  | 'email_sent'
  | 'email_failed'

export interface BookingLogEntry {
  timestamp: Date
  eventType: BookingEventType
  sessionId: string
  userId?: string
  hotelId?: string
  roomCode?: string
  preBookId?: string
  bookingId?: string
  price?: number
  currency?: string
  error?: string
  metadata?: Record<string, any>
}

class BookingLogger {
  private logs: BookingLogEntry[] = []
  private sessionId: string = this.generateSessionId()

  /**
   * רישום אירוע
   */
  log(event: Omit<BookingLogEntry, 'timestamp' | 'sessionId'>): void {
    const entry: BookingLogEntry = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    this.logs.push(entry)
    
    // הדפסה לקונסול בפיתוח
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Booking] ${entry.eventType}`, {
        time: format(entry.timestamp, 'HH:mm:ss'),
        ...entry
      })
    }

    // שליחה ל-Analytics (אופציונלי)
    this.sendToAnalytics(entry)
  }

  /**
   * חיפוש החל
   */
  logSearchStarted(params: any): void {
    this.log({
      eventType: 'search_started',
      metadata: {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        hotelName: params.hotelName,
        city: params.city,
        adults: params.adults,
        children: params.children?.length || 0
      }
    })
  }

  /**
   * חיפוש הושלם
   */
  logSearchCompleted(resultsCount: number, duration: number): void {
    this.log({
      eventType: 'search_completed',
      metadata: {
        resultsCount,
        durationMs: duration
      }
    })
  }

  /**
   * PreBook החל
   */
  logPreBookStarted(roomCode: string, hotelId: string): void {
    this.log({
      eventType: 'prebook_started',
      hotelId,
      roomCode
    })
  }

  /**
   * PreBook הושלם
   */
  logPreBookCompleted(data: {
    roomCode: string
    hotelId: string
    preBookId: string
    token: string
    price: number
    currency: string
  }): void {
    this.log({
      eventType: 'prebook_completed',
      hotelId: data.hotelId,
      roomCode: data.roomCode,
      preBookId: data.preBookId,
      price: data.price,
      currency: data.currency,
      metadata: {
        token: data.token.substring(0, 4) + '****' // מסתירים את מרבית הטוקן
      }
    })
  }

  /**
   * PreBook נכשל
   */
  logPreBookFailed(roomCode: string, error: string): void {
    this.log({
      eventType: 'prebook_failed',
      roomCode,
      error
    })
  }

  /**
   * PreBook פג תוקף
   */
  logPreBookExpired(roomCode: string, preBookId: string): void {
    this.log({
      eventType: 'prebook_expired',
      roomCode,
      preBookId
    })
  }

  /**
   * הזמנה החלה
   */
  logBookStarted(data: {
    roomCode: string
    preBookId: string
    guestEmail: string
  }): void {
    this.log({
      eventType: 'book_started',
      roomCode: data.roomCode,
      preBookId: data.preBookId,
      metadata: {
        guestEmail: data.guestEmail
      }
    })
  }

  /**
   * הזמנה הושלמה
   */
  logBookCompleted(data: {
    bookingId: string
    supplierReference: string
    price: number
    currency: string
    guestEmail: string
  }): void {
    this.log({
      eventType: 'book_completed',
      bookingId: data.bookingId,
      price: data.price,
      currency: data.currency,
      metadata: {
        supplierReference: data.supplierReference,
        guestEmail: data.guestEmail
      }
    })
  }

  /**
   * הזמנה נכשלה
   */
  logBookFailed(preBookId: string, error: string): void {
    this.log({
      eventType: 'book_failed',
      preBookId,
      error
    })
  }

  /**
   * הזמנה בוטלה
   */
  logBookingCancelled(bookingId: string, reason?: string): void {
    this.log({
      eventType: 'booking_cancelled',
      bookingId,
      metadata: { reason }
    })
  }

  /**
   * אימייל נשלח
   */
  logEmailSent(bookingId: string, to: string): void {
    this.log({
      eventType: 'email_sent',
      bookingId,
      metadata: { to }
    })
  }

  /**
   * אימייל נכשל
   */
  logEmailFailed(bookingId: string, error: string): void {
    this.log({
      eventType: 'email_failed',
      bookingId,
      error
    })
  }

  /**
   * קבלת כל הלוגים לסשן
   */
  getSessionLogs(): BookingLogEntry[] {
    return this.logs.filter(log => log.sessionId === this.sessionId)
  }

  /**
   * קבלת סטטיסטיקות
   */
  getStats(): {
    totalSearches: number
    successfulPreBooks: number
    failedPreBooks: number
    successfulBookings: number
    failedBookings: number
    averageSearchDuration?: number
  } {
    const logs = this.getSessionLogs()
    
    return {
      totalSearches: logs.filter(l => l.eventType === 'search_started').length,
      successfulPreBooks: logs.filter(l => l.eventType === 'prebook_completed').length,
      failedPreBooks: logs.filter(l => l.eventType === 'prebook_failed').length,
      successfulBookings: logs.filter(l => l.eventType === 'book_completed').length,
      failedBookings: logs.filter(l => l.eventType === 'book_failed').length
    }
  }

  /**
   * ייצוא ל-CSV לצורך ניתוח
   */
  exportToCsv(): string {
    const headers = [
      'Timestamp',
      'Event Type',
      'Session ID',
      'Hotel ID',
      'Room Code',
      'PreBook ID',
      'Booking ID',
      'Price',
      'Currency',
      'Error'
    ]

    const rows = this.logs.map(log => [
      format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      log.eventType,
      log.sessionId,
      log.hotelId || '',
      log.roomCode || '',
      log.preBookId || '',
      log.bookingId || '',
      log.price?.toString() || '',
      log.currency || '',
      log.error || ''
    ])

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
  }

  /**
   * שליחה ל-Analytics (placeholder)
   */
  private sendToAnalytics(entry: BookingLogEntry): void {
    // TODO: שלח ל-Google Analytics / Mixpanel / etc
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', entry.eventType, {
        event_category: 'booking',
        event_label: entry.roomCode,
        value: entry.price
      })
    }
  }

  /**
   * יצירת Session ID ייחודי
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  /**
   * איפוס הסשן (למשתמש חדש)
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId()
  }
}

export const bookingLogger = new BookingLogger()
