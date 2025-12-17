/**
 * Dual-Layer API Client
 * Primary: MANUS API (if configured)
 * Fallback: Medici Direct API
 *
 * Automatically falls back to Medici Direct on 401, 403, 500 errors from MANUS
 */

import { logger } from "@/lib/logger"
import { manusClient, ManusAPIError } from "./manus-client"
import { mediciDirectClient } from "./medici-direct-client"
import type { HotelSearchResult } from "./medici-client"

export interface APISearchParams {
  dateFrom: string
  dateTo: string
  hotelName?: string
  city?: string
  adults?: number
  children?: number[]
  stars?: number
  limit?: number
}

export interface APIPreBookParams {
  code: string
  dateFrom: string
  dateTo: string
  hotelId: number
  adults: number
  children: number[]
}

export interface APIBookingParams {
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

export interface APICancelParams {
  prebookId: number
}

/**
 * Check if error should trigger fallback
 */
function shouldFallback(error: any): boolean {
  if (error instanceof ManusAPIError) {
    const status = error.status
    // Fallback on authentication, authorization, or server errors
    return status === 401 || status === 403 || status === 500 || status === 501 || status === 503
  }
  return false
}

class DualLayerAPIClient {
  /**
   * Search hotels with automatic fallback
   */
  async searchHotels(params: APISearchParams): Promise<HotelSearchResult[]> {
    logger.debug("[API Client] Starting search", {
      primary: manusClient.isConfigured() ? "MANUS" : "None",
      fallback: mediciDirectClient.isConfigured() ? "Medici Direct" : "None",
    })

    // Try MANUS first if configured
    if (manusClient.isConfigured()) {
      try {
        logger.info("[API Client] Attempting search via MANUS (primary)")

        const result = await manusClient.searchHotels(params)

        logger.info("[API Client] ✅ Search successful via MANUS")

        // Transform MANUS response to expected format if needed
        return this.transformSearchResults(result)
      } catch (error) {
        if (shouldFallback(error)) {
          logger.warn("[API Client] ⚠️  MANUS failed, falling back to Medici Direct", {
            error: error instanceof Error ? error.message : String(error),
            status: error instanceof ManusAPIError ? error.status : "unknown",
          })
        } else {
          // Don't fallback for other errors (validation, etc.)
          logger.error("[API Client] ❌ MANUS search failed (no fallback)", error)
          throw error
        }
      }
    }

    // Fallback to Medici Direct
    if (mediciDirectClient.isConfigured()) {
      logger.info("[API Client] Using Medici Direct API (fallback)")

      const pax = [
        {
          adults: params.adults || 2,
          children: params.children || [],
        },
      ]

      const result = await mediciDirectClient.searchHotels({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        hotelName: params.hotelName,
        city: params.city,
        pax,
        stars: params.stars,
        limit: params.limit,
      })

      logger.info("[API Client] ✅ Search successful via Medici Direct")

      return this.transformSearchResults(result)
    }

    // Neither API is configured
    throw new Error(
      "No API configured. Please set either MANUS_API_KEY or MEDICI_BEARER_TOKEN in environment variables."
    )
  }

  /**
   * PreBook with automatic fallback
   */
  async preBook(params: APIPreBookParams): Promise<any> {
    logger.debug("[API Client] Starting preBook", {
      hotelId: params.hotelId,
    })

    // Try MANUS first if configured
    if (manusClient.isConfigured()) {
      try {
        logger.info("[API Client] Attempting preBook via MANUS (primary)")

        const result = await manusClient.preBook(params)

        logger.info("[API Client] ✅ PreBook successful via MANUS")

        return result
      } catch (error) {
        if (shouldFallback(error)) {
          logger.warn("[API Client] ⚠️  MANUS preBook failed, falling back to Medici Direct", {
            error: error instanceof Error ? error.message : String(error),
          })
        } else {
          logger.error("[API Client] ❌ MANUS preBook failed (no fallback)", error)
          throw error
        }
      }
    }

    // Fallback to Medici Direct
    if (mediciDirectClient.isConfigured()) {
      logger.info("[API Client] Using Medici Direct API for preBook (fallback)")

      const result = await mediciDirectClient.preBook(params)

      logger.info("[API Client] ✅ PreBook successful via Medici Direct")

      return result
    }

    throw new Error("No API configured for preBook")
  }

  /**
   * Book with automatic fallback
   */
  async book(params: APIBookingParams): Promise<any> {
    logger.debug("[API Client] Starting booking", {
      hotelId: params.hotelId,
      customerEmail: params.customer.email,
    })

    // Try MANUS first if configured
    if (manusClient.isConfigured()) {
      try {
        logger.info("[API Client] Attempting booking via MANUS (primary)")

        const result = await manusClient.book(params)

        logger.info("[API Client] ✅ Booking successful via MANUS")

        return result
      } catch (error) {
        if (shouldFallback(error)) {
          logger.warn("[API Client] ⚠️  MANUS booking failed, falling back to Medici Direct", {
            error: error instanceof Error ? error.message : String(error),
          })
        } else {
          logger.error("[API Client] ❌ MANUS booking failed (no fallback)", error)
          throw error
        }
      }
    }

    // Fallback to Medici Direct
    if (mediciDirectClient.isConfigured()) {
      logger.info("[API Client] Using Medici Direct API for booking (fallback)")

      const result = await mediciDirectClient.book(params)

      logger.info("[API Client] ✅ Booking successful via Medici Direct")

      return result
    }

    throw new Error("No API configured for booking")
  }

  /**
   * Cancel room with automatic fallback
   */
  async cancelRoom(params: APICancelParams): Promise<any> {
    logger.debug("[API Client] Starting cancellation", {
      prebookId: params.prebookId,
    })

    // Try MANUS first if configured
    if (manusClient.isConfigured()) {
      try {
        logger.info("[API Client] Attempting cancel via MANUS (primary)")

        const result = await manusClient.cancelRoom(params.prebookId)

        logger.info("[API Client] ✅ Cancel successful via MANUS")

        return result
      } catch (error) {
        if (shouldFallback(error)) {
          logger.warn("[API Client] ⚠️  MANUS cancel failed, falling back to Medici Direct", {
            error: error instanceof Error ? error.message : String(error),
          })
        } else {
          logger.error("[API Client] ❌ MANUS cancel failed (no fallback)", error)
          throw error
        }
      }
    }

    // Fallback to Medici Direct
    if (mediciDirectClient.isConfigured()) {
      logger.info("[API Client] Using Medici Direct API for cancel (fallback)")

      const result = await mediciDirectClient.cancelRoom(params)

      logger.info("[API Client] ✅ Cancel successful via Medici Direct")

      return result
    }

    throw new Error("No API configured for cancellation")
  }

  /**
   * Transform search results to expected format
   * Handles different response formats from MANUS and Medici Direct
   */
  private transformSearchResults(response: any): HotelSearchResult[] {
    logger.debug("[API Client] Transforming search results")

    // If already in correct format (from MANUS)
    if (response.results && Array.isArray(response.results)) {
      return response.results
    }

    // If it's a direct Medici response, we need to transform it
    // This would use the existing transformation logic from medici-client.ts
    // For now, return as is and let the caller handle it
    // TODO: Import and use transformSearchResults from medici-client.ts

    if (Array.isArray(response)) {
      return response
    }

    if (response.data && Array.isArray(response.data)) {
      return response.data
    }

    if (response.items && Array.isArray(response.items)) {
      return response.items
    }

    logger.warn("[API Client] Unexpected response format", {
      hasResults: !!response.results,
      hasData: !!response.data,
      hasItems: !!response.items,
      isArray: Array.isArray(response),
    })

    return []
  }

  /**
   * Get current API status
   */
  getStatus(): {
    primary: { name: string; configured: boolean }
    fallback: { name: string; configured: boolean }
  } {
    return {
      primary: {
        name: "MANUS",
        configured: manusClient.isConfigured(),
      },
      fallback: {
        name: "Medici Direct",
        configured: mediciDirectClient.isConfigured(),
      },
    }
  }
}

// Export singleton instance
export const apiClient = new DualLayerAPIClient()

// Export class for testing
export { DualLayerAPIClient }
