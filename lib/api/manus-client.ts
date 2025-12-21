/**
 * MANUS API Client (Primary)
 * Wrapper/proxy service for Medici Hotels API
 */

import { logger } from "@/lib/logger"

const MANUS_BASE_URL = process.env.MANUS_BASE_URL || process.env.NEXT_PUBLIC_MANUS_BASE_URL
const MANUS_API_KEY = process.env.MANUS_API_KEY

// Warn if not set but don't throw during build
if (!MANUS_API_KEY && typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  MANUS_API_KEY not set. Will use Medici Direct API as fallback.")
  } else {
    console.warn("⚠️  MANUS_API_KEY not set. Add it to .env.local to use MANUS API (optional).")
  }
}

export interface ManusSearchParams {
  dateFrom: string
  dateTo: string
  hotelName?: string
  city?: string
  adults?: number
  children?: number[]
  stars?: number
  limit?: number
}

export interface ManusPreBookParams {
  code: string
  dateFrom: string
  dateTo: string
  hotelId: number
  adults: number
  children: number[]
}

export interface ManusBookingParams {
  code: string
  token: string
  preBookId?: number
  dateFrom: string
  dateTo: string
  hotelId: number
  adults: number
  children: number[]
  customer: {
    title: string
    firstName: string
    lastName: string
    email: string
    phone: string
    country?: string
    city?: string
    address?: string
    zip?: string
  }
  voucherEmail?: string
  agencyReference?: string
}

export class ManusAPIError extends Error {
  public status: number
  public response?: any

  constructor(message: string, status: number, response?: any) {
    super(message)
    this.name = "ManusAPIError"
    this.status = status
    this.response = response
  }
}

class ManusClient {
  private baseUrl: string | undefined
  private apiKey: string | undefined

  constructor() {
    this.baseUrl = MANUS_BASE_URL
    this.apiKey = MANUS_API_KEY
  }

  /**
   * Generic request method
   */
  private async request<T>(endpoint: string, method: "GET" | "POST" | "DELETE", body?: any): Promise<T> {
    if (!this.baseUrl || !this.apiKey) {
      throw new ManusAPIError("MANUS API is not configured", 501)
    }

    const url = `${this.baseUrl}${endpoint}`

    logger.debug(`[MANUS] ${method} ${endpoint}`)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && method !== "GET") {
      options.body = JSON.stringify(body)
      logger.debug(`[MANUS] Request body:`, body)
    }

    try {
      const response = await fetch(url, options)

      logger.debug(`[MANUS] Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any

        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        logger.warn(`[MANUS] API Error: ${response.status}`, { error: errorData })

        throw new ManusAPIError(
          `MANUS API error: ${response.status} - ${errorData.message || errorText}`,
          response.status,
          errorData
        )
      }

      const data = await response.json()
      logger.debug(`[MANUS] Response received successfully`)

      return data as T
    } catch (error) {
      if (error instanceof ManusAPIError) {
        throw error
      }

      logger.error("[MANUS] Request failed", error)
      throw new ManusAPIError(
        error instanceof Error ? error.message : "MANUS request failed",
        500,
        error
      )
    }
  }

  /**
   * Search hotels via MANUS
   */
  async searchHotels(params: ManusSearchParams): Promise<any> {
    logger.info("[MANUS] Searching hotels", {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      city: params.city,
      hotelName: params.hotelName,
    })

    const result = await this.request<any>("/api/hotels/search", "POST", params)

    logger.info("[MANUS] Search completed", {
      resultsCount: result?.results?.length || 0,
    })

    return result
  }

  /**
   * PreBook via MANUS
   */
  async preBook(params: ManusPreBookParams): Promise<any> {
    logger.info("[MANUS] PreBook request", {
      hotelId: params.hotelId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    })

    const result = await this.request<any>("/api/hotels/prebook", "POST", params)

    logger.info("[MANUS] PreBook completed", {
      preBookId: result.preBookId,
      status: result.status,
    })

    return result
  }

  /**
   * Book via MANUS
   */
  async book(params: ManusBookingParams): Promise<any> {
    logger.info("[MANUS] Booking request", {
      hotelId: params.hotelId,
      customerEmail: params.customer.email,
    })

    const result = await this.request<any>("/api/hotels/book", "POST", params)

    logger.info("[MANUS] Booking completed", {
      bookingId: result.bookingId,
      status: result.status,
    })

    // Normalize response format
    return {
      success: result.status === "confirmed" || !!result.bookingId,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
      error: result.error,
      ...result,
    }
  }

  /**
   * Cancel via MANUS
   */
  async cancelRoom(prebookId: number): Promise<{ success: boolean; error?: string }> {
    logger.info("[MANUS] Cancel request", { prebookId })

    try {
      const result = await this.request<any>(`/api/hotels/cancel/${prebookId}`, "DELETE")

      logger.info("[MANUS] Cancel completed", {
        success: true,
      })

      // Normalize response format
      return {
        success: true,
        ...result,
      }
    } catch (error: any) {
      logger.error("[MANUS] Cancel failed", error)
      return {
        success: false,
        error: error.message || "Cancellation failed",
      }
    }
  }

  /**
   * Check if MANUS client is configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.apiKey)
  }
}

// Export singleton instance
export const manusClient = new ManusClient()

// Export class for testing
export { ManusClient }
