// Booking Retry Handler - ניסיונות חוזרים חכמים
import { mediciApi } from './medici-client'
import { preBookManager } from './prebook-manager'

export interface RetryConfig {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
}

export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: string
  attempts: number
}

export class BookingRetryHandler {
  private defaultConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    backoffMultiplier: 2 // exponential backoff
  }

  /**
   * ניסיון חוזר עם Exponential Backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.defaultConfig, ...config }
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        const result = await operation()
        return {
          success: true,
          data: result,
          attempts: attempt
        }
      } catch (error: any) {
        lastError = error
        console.warn(`[Retry] Attempt ${attempt}/${finalConfig.maxRetries} failed:`, error.message)

        // אל תנסה שוב אם זו שגיאת 400/401/403 (לא זמנית)
        if (this.isNonRetryableError(error)) {
          break
        }

        // המתן לפני ניסיון הבא
        if (attempt < finalConfig.maxRetries) {
          const delay = finalConfig.retryDelay * Math.pow(finalConfig.backoffMultiplier, attempt - 1)
          await this.sleep(delay)
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Operation failed after retries',
      attempts: finalConfig.maxRetries
    }
  }

  /**
   * PreBook עם ניסיונות חוזרים
   */
  async preBookWithRetry(params: {
    jsonRequest: string
    roomCode: string
  }): Promise<RetryResult<any>> {
    return this.retryWithBackoff(async () => {
      const result = await mediciApi.preBook({
        jsonRequest: params.jsonRequest
      })

      if (!result.success || !result.token) {
        throw new Error('PreBook failed: ' + (result.error || 'No token received'))
      }

      // שמירה במנהל PreBook
      preBookManager.savePreBook(params.roomCode, result)

      return result
    })
  }

  /**
   * Book עם ניסיונות חוזרים
   */
  async bookWithRetry(params: {
    jsonRequest: string
  }): Promise<RetryResult<any>> {
    return this.retryWithBackoff(async () => {
      const result = await mediciApi.book({
        jsonRequest: params.jsonRequest
      })

      if (!result.success) {
        throw new Error('Booking failed: ' + (result.error || 'Unknown error'))
      }

      return result
    }, {
      maxRetries: 2, // Book רק 2 ניסיונות (כדי למנוע הזמנה כפולה)
      retryDelay: 2000
    })
  }

  /**
   * Search עם ניסיונות חוזרים
   */
  async searchWithRetry(params: any): Promise<RetryResult<any>> {
    return this.retryWithBackoff(async () => {
      const results = await mediciApi.searchHotels(params)
      
      if (!results || results.length === 0) {
        throw new Error('No results found')
      }

      return results
    })
  }

  /**
   * בדיקה אם השגיאה לא זמנית (אל תנסה שוב)
   */
  private isNonRetryableError(error: any): boolean {
    const message = error.message?.toLowerCase() || ''
    const status = error.status || error.statusCode

    // שגיאות שלא כדאי לנסות שוב
    const nonRetryableStatuses = [400, 401, 403, 404]
    if (nonRetryableStatuses.includes(status)) {
      return true
    }

    // הודעות שגיאה שלא כדאי לנסות שוב
    const nonRetryableMessages = [
      'not available',
      'sold out',
      'invalid token',
      'expired',
      'unauthorized',
      'forbidden'
    ]

    return nonRetryableMessages.some(msg => message.includes(msg))
  }

  /**
   * המתנה עם Promise
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * ניסיון לשחזר מכשל PreBook
   */
  async recoverFromPreBookFailure(params: {
    roomCode: string
    originalSearchParams: any
  }): Promise<RetryResult<any>> {
    console.log('[Recovery] Attempting to recover from PreBook failure...')

    // נסה לחפש שוב
    const searchResult = await this.searchWithRetry(params.originalSearchParams)
    
    if (!searchResult.success || !searchResult.data) {
      return searchResult
    }

    // מצא את החדר המקורי
    const matchingRoom = searchResult.data.find((hotel: any) => 
      hotel.rooms.some((room: any) => room.code === params.roomCode)
    )

    if (!matchingRoom) {
      return {
        success: false,
        error: 'Room no longer available',
        attempts: 1
      }
    }

    // נסה PreBook שוב
    const room = matchingRoom.rooms.find((r: any) => r.code === params.roomCode)
    return this.preBookWithRetry({
      jsonRequest: room.requestJson,
      roomCode: params.roomCode
    })
  }
}

export const retryHandler = new BookingRetryHandler()
