// PreBook Manager - מנהל את תוקף ה-PreBook (30 דקות)
import { mediciApi } from './medici-client'

interface PreBookData {
  token: string
  priceConfirmed: number
  requestJson: string
  expiresAt: Date
  roomCode: string
}

class PreBookManager {
  private preBooks = new Map<string, PreBookData>()
  private readonly PREBOOK_VALIDITY_MINUTES = 30

  /**
   * שמירת PreBook עם זמן תפוגה
   */
  savePreBook(roomCode: string, preBookResult: any): PreBookData {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + this.PREBOOK_VALIDITY_MINUTES)

    const data: PreBookData = {
      token: preBookResult.token,
      priceConfirmed: preBookResult.priceConfirmed,
      requestJson: preBookResult.requestJson,
      expiresAt,
      roomCode
    }

    this.preBooks.set(roomCode, data)
    
    // מחיקה אוטומטית אחרי 30 דקות
    setTimeout(() => {
      this.preBooks.delete(roomCode)
    }, this.PREBOOK_VALIDITY_MINUTES * 60 * 1000)

    return data
  }

  /**
   * קבלת PreBook אם תקף
   */
  getPreBook(roomCode: string): PreBookData | null {
    const data = this.preBooks.get(roomCode)
    
    if (!data) {
      return null
    }

    // בדיקה אם תקף
    if (new Date() > data.expiresAt) {
      this.preBooks.delete(roomCode)
      return null
    }

    return data
  }

  /**
   * בדיקה אם PreBook תקף
   */
  isValid(roomCode: string): boolean {
    const data = this.getPreBook(roomCode)
    return data !== null
  }

  /**
   * זמן שנותר לתוקף (בדקות)
   */
  getTimeRemaining(roomCode: string): number {
    const data = this.getPreBook(roomCode)
    if (!data) return 0

    const now = new Date()
    const diff = data.expiresAt.getTime() - now.getTime()
    return Math.max(0, Math.floor(diff / 1000 / 60))
  }

  /**
   * רענון PreBook אם קרוב לפוג
   */
  async refreshIfNeeded(roomCode: string, searchParams: any): Promise<PreBookData | null> {
    const timeRemaining = this.getTimeRemaining(roomCode)
    
    // אם נשארו פחות מ-5 דקות, עשה PreBook חדש
    if (timeRemaining < 5) {
      try {
        const newPreBook = await mediciApi.preBook({
          jsonRequest: searchParams.requestJson
        })
        
        if (newPreBook.success) {
          return this.savePreBook(roomCode, newPreBook)
        }
      } catch (error) {
        console.error('Failed to refresh PreBook:', error)
      }
    }

    return this.getPreBook(roomCode)
  }

  /**
   * ניקוי כל ה-PreBooks שפג תוקפם
   */
  cleanup(): void {
    const now = new Date()
    for (const [roomCode, data] of this.preBooks.entries()) {
      if (now > data.expiresAt) {
        this.preBooks.delete(roomCode)
      }
    }
  }
}

export const preBookManager = new PreBookManager()

// ניקוי אוטומטי כל 5 דקות
if (typeof window === 'undefined') {
  setInterval(() => {
    preBookManager.cleanup()
  }, 5 * 60 * 1000)
}
