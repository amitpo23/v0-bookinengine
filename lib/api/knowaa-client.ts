// Knowaa Hotels API Client - Token-based Authentication
// Handles bearer token retrieval and all hotel API calls via Knowaa credentials

import axios, { AxiosInstance } from "axios"
import type { HotelSearchResult, PreBookResponse, BookResponse } from "./medici-types"
import "server-only"

const MEDICI_BASE_URL = "https://medici-backend.azurewebsites.net"
const TOKEN_ENDPOINT = "/api/auth/OnlyNightUsersTokenAPI"

// Knowaa credentials
const KNOWAA_CLIENT_SECRET = process.env.KNOWAA_CLIENT_SECRET || "zlbgGGxz~|l3.Q?XXAT)uT!Lty,kJC>R?`:k?oQH$I=P7rL<R:Em:qDaM1G(jFU7"
const KNOWAA_EMAIL = process.env.KNOWAA_EMAIL || "partnerships@knowaaglobal.com"

// Token cache with expiry
interface TokenCache {
  token: string
  expiresAt: number
}

let tokenCache: TokenCache | null = null

// =====================
// TOKEN MANAGEMENT
// =====================

async function getKnowaaBearerToken(): Promise<string> {
  // If env token provided, use it (testing override)
  const ENV_TOKEN = process.env.KNOWAA_BEARER_TOKEN
  if (ENV_TOKEN) {
    if (!tokenCache) {
      tokenCache = { token: ENV_TOKEN, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }
    }
    return tokenCache.token
  }

  // Return cached token if still valid
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }

  try {
    console.log("🔐 [Knowaa] Requesting bearer token...")
    const tokenUrl = `${MEDICI_BASE_URL}${TOKEN_ENDPOINT}`
    console.log("🔐 [Knowaa] Token URL:", tokenUrl)

    const formData = new URLSearchParams({
      client_secret: KNOWAA_CLIENT_SECRET,
      email: KNOWAA_EMAIL,
    })

    const response = await axios.post(tokenUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 15000,
    })

    console.log("🔐 [Knowaa] Token response status:", response.status)

    // Response format: { "email1": "token1", "email2": "token2", ... }
    const token = response.data[KNOWAA_EMAIL] || response.data.token || response.data.access_token

    if (!token) {
      console.error("🔐 [Knowaa] Response data:", JSON.stringify(response.data).substring(0, 200))
      throw new Error("No token received from Knowaa auth endpoint")
    }

    // Cache token for 55 minutes (typical JWT expiry is 1 hour)
    tokenCache = {
      token,
      expiresAt: Date.now() + 55 * 60 * 1000,
    }

    console.log("✅ Knowaa Bearer Token acquired successfully")
    return tokenCache.token
  } catch (error: any) {
    console.error("❌ Failed to get Knowaa Bearer Token:")
    console.error("Error message:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
    throw new Error(`Authentication failed: ${error.message}`)
  }
}

// =====================
// API CLIENT CLASS
// =====================

export class KnowaaMediciClient {
  private client: AxiosInstance
  private baseUrl: string

  constructor() {
    this.baseUrl = MEDICI_BASE_URL
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    })
  }

  /**
   * Create request with Knowaa bearer token
   */
  private async getAuthHeaders() {
    const token = await getKnowaaBearerToken()
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  /**
   * STEP 1: Search Hotels
   * GET /api/hotels/GetInnstantSearchPrice
   */
  async searchHotels(params: {
    dateFrom: string // "2025-02-01"
    dateTo: string // "2025-02-05"
    hotelName?: string // Search by hotel name
    city?: string // Search by city
    adults?: number
    children?: number[]
    stars?: number | null
    limit?: number | null
  }): Promise<HotelSearchResult[]> {
    try {
      const headers = await this.getAuthHeaders()

      const pax = {
        adults: params.adults || 2,
        children: params.children?.length || 0,
      }

      const body: any = {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        pax,
        stars: params.stars || null,
        limit: params.limit || null,
        ShowExtendedData: true, // Get images, description, facilities
      }

      if (params.hotelName) {
        body.hotelName = params.hotelName
      } else if (params.city) {
        body.city = params.city
      }

      console.log("🔍 [Knowaa] Searching hotels:", { dateFrom: params.dateFrom, dateTo: params.dateTo, ...body })

      const response = await this.client.post("/api/hotels/GetInnstantSearchPrice", body, {
        headers,
      })

      const hotels = this.transformSearchResults(response.data)

      console.log(`✅ [Knowaa] Found ${hotels.length} hotels`)

      return hotels.map((hotel) => ({
        ...hotel,
        requestJson: JSON.stringify(body),
        responseJson: response.data,
      }))
    } catch (error) {
      console.error("❌ [Knowaa] Search Hotels Error:", error)
      throw error
    }
  }

  /**
   * STEP 2: Pre-Book
   * POST /api/hotels/PreBook
   */
  async preBook(params: { jsonRequest: string }): Promise<PreBookResponse> {
    try {
      const headers = await this.getAuthHeaders()

      const body = {
        jsonRequest: params.jsonRequest,
      }

      console.log("📋 [Knowaa] Pre-booking room...")

      const response = await this.client.post("/api/hotels/PreBook", body, {
        headers,
      })

      if (response.status === 204) {
        return {
          success: true,
          preBookId: 0,
          token: "",
          status: "done",
          priceConfirmed: 0,
          currency: "USD",
          requestJson: params.jsonRequest,
          responseJson: "",
        }
      }

      const token = response.data?.content?.services?.hotels?.[0]?.token || response.data?.token || ""
      const preBookId = response.data?.opportunityId || response.data?.preBookId || response.data?.id || 0
      const priceConfirmed = response.data?.content?.services?.hotels?.[0]?.price?.amount || 0
      const currency = response.data?.content?.services?.hotels?.[0]?.price?.currency || "USD"

      console.log(`✅ [Knowaa] Pre-book successful: ID ${preBookId}`)

      return {
        success: true,
        preBookId,
        token,
        status: response.data?.status || "done",
        priceConfirmed,
        currency,
        requestJson: params.jsonRequest,
        responseJson: response.data,
      }
    } catch (error) {
      console.error("❌ [Knowaa] Pre-Book Error:", error)
      throw error
    }
  }

  /**
   * STEP 3: Book
   * POST /api/hotels/Book
   */
  async book(params: { jsonRequest: string }): Promise<BookResponse> {
    try {
      const headers = await this.getAuthHeaders()

      const body = {
        jsonRequest: params.jsonRequest,
      }

      console.log("🎫 [Knowaa] Booking room...")

      const response = await this.client.post("/api/hotels/Book", body, {
        headers,
      })

      const bookingId = response.data?.content?.bookingID || response.data?.bookingId || ""
      const supplierReference = response.data?.content?.services?.[0]?.supplier?.reference || ""
      const status = response.data?.status || "confirmed"

      console.log(`✅ [Knowaa] Booking confirmed: ${bookingId}`)

      return {
        success: true,
        bookingId,
        supplierReference,
        status,
      }
    } catch (error) {
      console.error("❌ [Knowaa] Book Error:", error)
      throw error
    }
  }

  /**
   * Transform Medici API search response to HotelSearchResult[]
   */
  private transformSearchResults(response: any): HotelSearchResult[] {
    const hotelMap = new Map<string, HotelSearchResult>()

    const items = response?.items || []

    for (const item of items) {
      if (!item.name) continue

      const hotelId = String(item.id || item.hotelId || "0")
      const roomKey = `${hotelId}-${item.name}`

      if (!hotelMap.has(roomKey)) {
        hotelMap.set(roomKey, {
          hotelId: Number(hotelId),
          hotelName: item.items?.[0]?.hotelName || item.name || "Unknown",
          city: item.city || "Unknown",
          stars: item.stars || 0,
          address: item.address || "",
          description: item.description || "",
          hotelImage: item.imageUrl || "",
          images: item.images?.map((img: any) => img.url || "") || [],
          location: item.city || "",
          facilities: item.facilities?.list || [],
          rooms: [],
        })
      }

      const hotel = hotelMap.get(roomKey)!

      // Add rooms
      if (item.items && Array.isArray(item.items)) {
        for (const roomItem of item.items) {
          const price = item.price?.amount || item.netPrice?.amount || 0

          hotel.rooms.push({
            roomId: roomItem.code || `${hotelId}-room-${Math.random()}`,
            roomName: roomItem.name || "Standard",
            roomCategory: roomItem.category || "standard",
            categoryId: 1,
            roomImage: "",
            images: [],
            bedding: roomItem.bedding || "double",
            board: roomItem.board || "RO",
            boardId: 1,
            boardType: roomItem.boardType || "RO",
            maxOccupancy: roomItem.pax?.adults || 2,
            size: 0,
            view: "",
            amenities: [],
            price,
            buyPrice: price,
            originalPrice: price > 0 ? Math.round(price * 1.15) : 0,
            currency: item.price?.currency || "USD",
            cancellationPolicy: "refundable",
            available: roomItem.quantity?.max || 1,
            requestJson: item.code,
            pax: roomItem.pax || { adults: 2, children: [] },
          })
        }
      }
    }

    return Array.from(hotelMap.values())
  }
}

// =====================
// SINGLETON INSTANCE
// =====================

export const knowaaClient = new KnowaaMediciClient()

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Clear token cache (useful for testing or manual refresh)
 */
export function clearTokenCache() {
  tokenCache = null
  console.log("🔄 Token cache cleared")
}

/**
 * Get current token cache status
 */
export function getTokenCacheStatus() {
  if (!tokenCache) {
    return { cached: false, token: null, expiresIn: null }
  }

  const expiresIn = tokenCache.expiresAt - Date.now()
  return {
    cached: true,
    token: tokenCache.token?.substring(0, 20) + "...", // Only show first 20 chars
    expiresIn: expiresIn > 0 ? Math.floor(expiresIn / 1000) + "s" : "expired",
  }
}
