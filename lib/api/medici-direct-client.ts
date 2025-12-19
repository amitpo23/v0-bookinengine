/**
 * Medici Hotels Direct API Client
 * Direct connection to Medici backend as fallback
 * Base URL: https://medici-backend.azurewebsites.net
 */

import { logger } from "@/lib/logger"

const MEDICI_DIRECT_BASE_URL = "https://medici-backend.azurewebsites.net"
const MEDICI_BEARER_TOKEN = process.env.MEDICI_BEARER_TOKEN

/**
 * Custom error class for Medici Direct API errors
 */
export class MediciDirectAPIError extends Error {
  public status: number
  public response?: any

  constructor(message: string, status: number, response?: any) {
    super(message)
    this.name = "MediciDirectAPIError"
    this.status = status
    this.response = response
  }
}

// Warn if not set but don't throw during build
if (!MEDICI_BEARER_TOKEN && typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    console.error("⚠️  MEDICI_BEARER_TOKEN not set! Add to Vercel Environment Variables.")
  } else {
    console.warn("⚠️  MEDICI_BEARER_TOKEN not set. Add it to .env.local for fallback support.")
  }
}

export interface MediciSearchParams {
  dateFrom: string // YYYY-MM-DD
  dateTo: string // YYYY-MM-DD
  hotelName?: string
  city?: string
  pax?: Array<{ adults: number; children: number[] }>
  stars?: number | null
  limit?: number | null
  showExtendedData?: boolean
}

export interface MediciPreBookParams {
  code: string
  dateFrom: string
  dateTo: string
  hotelId: number
  adults: number
  children: number[]
}

export interface MediciBookingParams {
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

export interface MediciCancelParams {
  prebookId: number
}

class MediciDirectClient {
  private baseUrl: string
  private token: string | undefined

  constructor() {
    this.baseUrl = MEDICI_DIRECT_BASE_URL
    this.token = MEDICI_BEARER_TOKEN
  }

  /**
   * Generic request method
   */
  private async request<T>(endpoint: string, method: "GET" | "POST" | "DELETE", body?: any): Promise<T> {
    if (!this.token) {
      throw new Error("MEDICI_BEARER_TOKEN is not configured. Cannot use Medici Direct API.")
    }

    const url = `${this.baseUrl}${endpoint}`

    logger.debug(`[Medici Direct] ${method} ${endpoint}`)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && method !== "GET") {
      options.body = JSON.stringify(body)
      logger.debug(`[Medici Direct] Request body:`, body)
    }

    try {
      const response = await fetch(url, options)

      logger.debug(`[Medici Direct] Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`[Medici Direct] API Error: ${response.status}`, new Error(errorText))
        throw new MediciDirectAPIError(
          `Medici Direct API error: ${response.status} - ${errorText}`,
          response.status,
          errorText
        )
      }

      const data = await response.json()
      logger.debug(`[Medici Direct] Response received`)

      return data as T
    } catch (error) {
      logger.error("[Medici Direct] Request failed", error)
      throw error
    }
  }

  /**
   * Search hotels
   * POST /api/hotels/GetInnstantSearchPrice
   */
  async searchHotels(params: MediciSearchParams): Promise<any> {
    logger.info("[Medici Direct] Searching hotels", {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      city: params.city,
      hotelName: params.hotelName,
    })

    const pax = params.pax || [
      {
        adults: 2,
        children: [],
      },
    ]

    const requestBody = {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pax,
      showExtendedData: params.showExtendedData !== false,
      stars: params.stars || null,
      limit: params.limit || null,
      ...(params.hotelName ? { hotelName: params.hotelName } : {}),
      ...(params.city ? { city: params.city } : {}),
    }

    const result = await this.request<any>("/api/hotels/GetInnstantSearchPrice", "POST", requestBody)

    logger.info("[Medici Direct] Search completed", {
      resultsCount: Array.isArray(result) ? result.length : result?.items?.length || 0,
    })

    return result
  }

  /**
   * PreBook a room
   * POST /api/hotels/PreBook
   */
  async preBook(params: MediciPreBookParams): Promise<any> {
    logger.info("[Medici Direct] PreBook request", {
      hotelId: params.hotelId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    })

    const result = await this.request<any>("/api/hotels/PreBook", "POST", {
      code: params.code,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      hotelId: params.hotelId,
      adults: params.adults,
      children: params.children,
    })

    logger.info("[Medici Direct] PreBook completed", {
      preBookId: result.preBookId,
      status: result.status,
    })

    return result
  }

  /**
   * Book a room
   * POST /api/hotels/Book
   */
  async book(params: MediciBookingParams): Promise<any> {
    logger.info("[Medici Direct] Booking request", {
      hotelId: params.hotelId,
      customerEmail: params.customer.email,
    })

    const result = await this.request<any>("/api/hotels/Book", "POST", params)

    logger.info("[Medici Direct] Booking completed", {
      bookingId: result.bookingId,
      status: result.status,
    })

    return {
      success: result.status === "confirmed" || result.bookingId,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
      error: result.error,
    }
  }

  /**
   * Cancel a room
   * DELETE /api/hotels/CancelRoomDirectJson
   */
  async cancelRoom(params: MediciCancelParams): Promise<any> {
    logger.info("[Medici Direct] Cancel request", {
      prebookId: params.prebookId,
    })

    const result = await this.request<any>(
      `/api/hotels/CancelRoomDirectJson?prebookId=${params.prebookId}`,
      "DELETE"
    )

    logger.info("[Medici Direct] Cancel completed", {
      success: result.success,
    })

    return result
  }

  /**
   * Check if client is configured
   */
  isConfigured(): boolean {
    return !!this.token
  }
}

// Export singleton instance
export const mediciDirectClient = new MediciDirectClient()

// Export class for testing
export { MediciDirectClient }
