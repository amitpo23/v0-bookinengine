// Medici Hotels API Client
// Complete AI-Executable Integration
// Base URL: https://medici-backend.azurewebsites.net

const MEDICI_BASE_URL = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://medici-images.azurewebsites.net/images/"

// CRITICAL: Token must be set in environment variables
// In production (Vercel), add MEDICI_TOKEN to Environment Variables
const MEDICI_TOKEN = process.env.MEDICI_TOKEN

// Warn if not set (but don't throw during build time)
if (!MEDICI_TOKEN && typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    console.error("⚠️  MEDICI_TOKEN not set in production! Add it to Vercel Environment Variables.")
  } else {
    console.warn("⚠️  MEDICI_TOKEN not set. Add it to .env.local for local development.")
  }
}

// =====================
// TYPES
// =====================

export interface SearchParams {
  dateFrom: string // YYYY-MM-DD
  dateTo: string // YYYY-MM-DD
  hotelName?: string
  city?: string
  pax?: { adults: number; children: number[] }[]
  stars?: number | null
  limit?: number | null
  showExtendedData?: boolean
}

export interface SearchRoomResult {
  code: string // CRITICAL: Save this for booking
  hotelId: number
  hotelName: string
  city: string
  stars: number
  address?: string
  imageUrl?: string
  images?: string[]
  description?: string
  facilities?: string[]
  roomName: string
  roomCategory: string
  boardType: string
  boardCode: string
  price: {
    amount: number
    currency: string
  }
  cancellation: {
    type: "fully-refundable" | "non-refundable" | "partial"
    deadline?: string
    penalty?: number
  }
  maxOccupancy: number
}

export interface RoomResult {
  code: string // This is the critical booking code from API
  roomId: string // Changed to string for consistency
  roomName: string
  roomCategory: string
  categoryId: number
  boardId: number
  boardType: string
  buyPrice: number
  currency: string
  maxOccupancy: number
  cancellationPolicy: string
  // Additional fields
  size?: number
  view?: string
  bedding?: string
  amenities?: string[]
  images?: string[]
  available?: number
  originalPrice?: number
}

export interface HotelSearchResult {
  hotelId: number // Must be number for API calls
  hotelName: string
  city: string
  stars: number
  address: string
  imageUrl: string
  images: string[]
  description: string
  facilities: string[]
  rooms: RoomResult[]
}

export interface PreBookResult {
  preBookId: number
  token: string
  status: "done" | "failed"
  priceConfirmed: number
  currency: string
}

export interface BookingParams {
  code: string // From search
  token: string // From prebook
  preBookId?: number
  dateFrom: string
  dateTo: string
  hotelId: number
  adults: number
  children: number[] // From search
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

export interface BookingResult {
  success: boolean
  bookingId?: string
  supplierReference?: string
  status?: "confirmed" | "pending" | "failed"
  error?: string
}

export interface ActiveRoom {
  prebookId: number
  hotelName: string
  hotelId: number
  city: string
  stars: number
  roomCategory: string
  boardType: string
  checkIn: string
  checkOut: string
  buyPrice: number
  pushPrice: number
  profit: number
  guestName?: string
  status: string
  provider?: string
}

export interface SoldRoom extends ActiveRoom {
  saleDate: string
  salePrice: number
}

export interface CancelledRoom extends ActiveRoom {
  cancelDate: string
  refundAmount?: number
}

export interface Opportunity {
  opportunityId: number
  hotelId?: number
  hotelName?: string
  destinationId?: number
  city?: string
  startDate: string
  endDate: string
  boardId: number
  categoryId: number
  buyPrice: number
  pushPrice: number
  maxRooms: number
  status: string
  createdAt: string
}

export interface InsertOpportunityParams {
  hotelId?: number
  startDateStr: string
  endDateStr: string
  boardId: number
  categoryId: number
  buyPrice: number
  pushPrice: number
  maxRooms: number
  paxAdults?: number
  paxChildren?: number[]
}

export interface DashboardInfo {
  opportunities: number
  rooms: number
  totalInvestments: number
  profit: number
  cancellations: number
  topProfitableRooms: ActiveRoom[]
  topNonProfitableRooms: ActiveRoom[]
}

// =====================
// REFERENCE TABLES
// =====================

export const BOARD_TYPES: Record<number, { code: string; name: string; nameHe: string }> = {
  1: { code: "RO", name: "Room Only", nameHe: "לינה בלבד" },
  2: { code: "BB", name: "Bed & Breakfast", nameHe: "ארוחת בוקר" },
  3: { code: "HB", name: "Half Board", nameHe: "חצי פנסיון" },
  4: { code: "FB", name: "Full Board", nameHe: "פנסיון מלא" },
  5: { code: "AI", name: "All Inclusive", nameHe: "הכל כלול" },
}

export const ROOM_CATEGORIES: Record<number, { name: string; nameHe: string }> = {
  1: { name: "Standard", nameHe: "סטנדרט" },
  2: { name: "Superior", nameHe: "סופריור" },
  3: { name: "Deluxe", nameHe: "דלוקס" },
  4: { name: "Suite", nameHe: "סוויטה" },
  5: { name: "Junior Suite", nameHe: "סוויטת ג'וניור" },
  6: { name: "Family", nameHe: "משפחתי" },
}

// =====================
// API CLIENT CLASS
// =====================

class MediciApiClient {
  private baseUrl: string
  private token: string

  constructor(baseUrl?: string, token?: string) {
    this.baseUrl = baseUrl || MEDICI_BASE_URL
    this.token = token || MEDICI_TOKEN
  }

  private async request<T>(endpoint: string, method = "POST", body?: object): Promise<T & { _status?: number }> {
    const url = `${this.baseUrl}${endpoint}`

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
    }

    console.log(`[v0] Medici API Request: ${method} ${endpoint}`)
    console.log(`[v0] Request body:`, JSON.stringify(body, null, 2))

    try {
      const response = await fetch(url, options)

      console.log(`[v0] Response status: ${response.status}`)

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text()
        console.log(`[v0] Error response:`, errorText)
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }

      // Handle 204 No Content as success with empty object
      if (response.status === 204) {
        console.log(`[v0] Response 204 No Content - treating as success`)
        return { _status: 204 } as T & { _status: number }
      }

      const text = await response.text()
      const result = text ? JSON.parse(text) : ({} as T)
      console.log(`[v0] Response data (first 1000 chars):`, JSON.stringify(result, null, 2).substring(0, 1000))
      return { ...result, _status: response.status }
    } catch (error) {
      console.error(`[v0] Medici API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // =====================
  // STEP 1: SEARCH HOTELS
  // =====================
  async searchHotels(params: {
    dateFrom: string
    dateTo: string
    hotelName?: string
    city?: string
    adults?: number
    children?: number[]
    stars?: number
    limit?: number
  }): Promise<HotelSearchResult[]> {
    // IMPORTANT: adults must be a STRING per API documentation
    // Also: use hotelName OR city, NOT both
    const pax = [
      {
        adults: params.adults || 2,
        children: params.children || [],
      },
    ]

    // Build request - only include hotelName OR city, not both
    const searchBody: any = {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pax,
      showExtendedData: params.showExtendedData || true,
      stars: params.stars || null,
      limit: params.limit || null,
    }

    // Add either hotelName or city (not both)
    if (params.hotelName) {
      searchBody.hotelName = params.hotelName
    } else if (params.city) {
      searchBody.city = params.city
    }

    const response = await this.request<any>("/api/hotels/GetInnstantSearchPrice", "POST", searchBody)
    return this.transformSearchResults(response)
  }

  private transformSearchResults(response: any): HotelSearchResult[] {
    console.log("[v0] ====== TRANSFORM SEARCH RESULTS ======")
    console.log("[v0] Raw API response type:", typeof response)
    console.log("[v0] Raw API response keys:", response ? Object.keys(response) : "null")
    console.log("[v0] Raw API response (first 3000 chars):", JSON.stringify(response, null, 2).substring(0, 3000))

    if (!response) {
      console.log("[v0] No response from API")
      return []
    }

    // Handle different response formats
    let items: any[] = []

    if (Array.isArray(response)) {
      items = response
    } else if (response.items && Array.isArray(response.items)) {
      items = response.items
    } else if (response.data && Array.isArray(response.data)) {
      items = response.data
    }

    console.log("[v0] Items count:", items.length)
    if (items.length > 0) {
      console.log("[v0] First item FULL structure:", JSON.stringify(items[0], null, 2))
      console.log("[v0] First item keys:", Object.keys(items[0]))

      if (items[0].items && Array.isArray(items[0].items)) {
        console.log("[v0] First item has nested items, count:", items[0].items.length)
        if (items[0].items[0]) {
          console.log("[v0] First nested item FULL:", JSON.stringify(items[0].items[0], null, 2))
          console.log("[v0] First nested item keys:", Object.keys(items[0].items[0]))
        }
      }
    }

    const hotelMap = new Map<number, HotelSearchResult>()

    for (const item of items) {
      const hotelIdRaw = item.id || item.hotelId || item.hotelCode || item.HotelId || item.hotel_id || 0
      const hotelId = typeof hotelIdRaw === "number" ? hotelIdRaw : Number.parseInt(String(hotelIdRaw), 10) || 0
      const hotelName = item.name || item.hotelName || item.HotelName || "Unknown Hotel"

      console.log(`[v0] Processing hotel: ${hotelName}`)
      console.log(`[v0] - hotelId raw: ${hotelIdRaw}, parsed: ${hotelId}`)

      if (!hotelMap.has(hotelId)) {
        hotelMap.set(hotelId, {
          hotelId,
          hotelName,
          hotelImage: getHotelMainImage(item),
          images: buildImagesArray(item),
          location: item.address || item.location || "",
          city: item.city || "",
          stars: item.stars || item.rating || 0,
          address: item.address || "",
          description: item.description || "",
          facilities: item.facilities || item.amenities || [],
          rooms: [],
        })
      }

      const hotel = hotelMap.get(hotelId)!

      // Process rooms from nested items array
      const roomItems = item.items || [item]
      console.log(`[v0] Hotel ${hotelName} has ${roomItems.length} room items`)

      for (let roomIdx = 0; roomIdx < roomItems.length; roomIdx++) {
        const roomItem = roomItems[roomIdx]

        const possibleCodeFields = [
          roomItem.code,
          roomItem.Code,
          roomItem.roomCode,
          roomItem.RoomCode,
          roomItem.rateKey,
          roomItem.RateKey,
          roomItem.bookingCode,
          roomItem.BookingCode,
          roomItem.optionCode,
          roomItem.OptionCode,
          roomItem.key,
          roomItem.Key,
          roomItem.id?.toString(),
        ]

        console.log(`[v0] Room ${roomIdx} - All possible code fields:`, possibleCodeFields)
        console.log(`[v0] Room ${roomIdx} - ALL keys:`, Object.keys(roomItem))
        console.log(`[v0] Room ${roomIdx} - FULL data:`, JSON.stringify(roomItem, null, 2).substring(0, 1500))

        // Find the first valid string code (length > 5)
        let roomCode = ""
        for (const codeField of possibleCodeFields) {
          if (codeField && typeof codeField === "string" && codeField.length > 5) {
            roomCode = codeField
            console.log(`[v0] ✅ Found valid room code: ${roomCode.substring(0, 50)}...`)
            break
          }
        }

        // If still no code, use the full object as string if it looks like a code
        if (!roomCode) {
          // Sometimes the code is in a nested property
          if (roomItem.rate?.code) roomCode = roomItem.rate.code
          else if (roomItem.option?.code) roomCode = roomItem.option.code
          else if (roomItem.booking?.code) roomCode = roomItem.booking.code
        }

        if (!roomCode) {
          console.error(`[v0] ❌ WARNING: No room code found for room ${roomItem.name || "unnamed"}!`)
          console.error(`[v0] This room will not be bookable. Check API response format.`)
          console.log(`[v0] Available room data keys:`, Object.keys(roomItem))

          // As a last resort, try to use the entire roomItem as JSON if it contains the data
          // This is a fallback and may not work with all providers
          if (roomItem.code === undefined && Object.keys(roomItem).length > 0) {
            console.log(`[v0] Attempting to use roomItem data as fallback code`)
            // Don't set roomCode here - we want to leave it empty to catch this in booking
          }
        } else {
          console.log(`[v0] ✅ Final room code for ${roomItem.name || "unnamed"}: ${roomCode.substring(0, 50)}...`)
        }

        const price = extractPriceFromRoom(roomItem)
        console.log(`[v0] Extracted price: ${price}`)

        hotel.rooms.push({
          code: roomCode || "", // Store empty string if no code found - will be caught in booking validation
          roomId: String(roomItem.id || roomItem.roomId || `${hotel.hotelId}-${hotel.rooms.length + 1}`),
          roomName: roomItem.name || roomItem.roomName || "Standard Room",
          roomType: roomItem.category || roomItem.roomType || "standard",
          roomCategory: roomItem.category || roomItem.roomType || "standard",
          categoryId: roomItem.categoryId || roomItem.category_id || 1,
          roomImage: getRoomMainImage(roomItem),
          images: buildRoomImagesArray(roomItem),
          bedding: roomItem.bedding || "",
          board: roomItem.board || "RO",
          boardId: roomItem.boardId || getBoardIdFromCode(roomItem.board || "RO"),
          boardType: roomItem.board || "RO",
          maxOccupancy: roomItem.pax?.adults || roomItem.maxOccupancy || 2,
          size: roomItem.size || roomItem.roomSize || 0,
          view: roomItem.view || "",
          amenities: roomItem.amenities || roomItem.facilities || [],
          price: price,
          buyPrice: price,
          originalPrice: price > 0 ? Math.round(price * 1.15) : 0,
          currency: roomItem.currency || "ILS",
          cancellationPolicy: roomItem.cancellationPolicy || roomItem.cancellation || "free",
          available: roomItem.quantity?.max || roomItem.available || 1,
        })
      }
    }

    const results = Array.from(hotelMap.values())
    console.log("[v0] ====== TRANSFORM COMPLETE ======")
    console.log("[v0] Total hotels:", results.length)

    // Log summary of each hotel and its rooms with codes
    for (const hotel of results) {
      console.log(`[v0] Hotel: ${hotel.hotelName} (ID: ${hotel.hotelId})`)
      for (const room of hotel.rooms) {
        console.log(`[v0]   - Room: ${room.roomName}, Code: ${room.code?.substring(0, 30)}..., Price: ${room.buyPrice}`)
      }
    }

    return results
  }

  // =====================
  // STEP 2: PRE-BOOK
  // =====================
  async preBook(params: {
    code: string
    dateFrom: string
    dateTo: string
    hotelId: number
    adults: number
    children?: number[]
  }): Promise<PreBookResult> {
    // Build the inner request according to Medici API documentation
    const innerRequest = {
      services: [
        {
          searchCodes: [
            {
              code: params.code,
              pax: [
                {
                  adults: params.adults,
                  children: params.children || [],
                },
              ],
            },
          ],
          searchRequest: {
            currencies: ["USD"],
            customerCountry: "IL",
            dates: {
              from: params.dateFrom,
              to: params.dateTo,
            },
            destinations: [
              {
                id: params.hotelId,
                type: "hotel",
              },
            ],
            filters: [
              { name: "payAtTheHotel", value: true },
              { name: "onRequest", value: false },
              { name: "showSpecialDeals", value: true },
            ],
            pax: [
              {
                adults: params.adults,
                children: params.children || [],
              },
            ],
            service: "hotels",
          },
        },
      ],
    }

    const preBookBody = {
      jsonRequest: JSON.stringify(innerRequest),
    }

    console.log("[v0] PreBook inner request:", JSON.stringify(innerRequest, null, 2))

    const response = await this.request<any>("/api/hotels/PreBook", "POST", preBookBody)

    console.log("[v0] PreBook raw response:", JSON.stringify(response, null, 2))

    // Handle 204 No Content as success
    if (response._status === 204) {
      console.log("[v0] PreBook returned 204 - treating as success")
      const generatedId = Math.abs(params.code.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))
      return {
        preBookId: generatedId,
        token: params.code,
        status: "done",
        priceConfirmed: 0,
        currency: "USD",
      }
    }

    // Extract token and price from response according to API documentation
    const token = response?.token || response?.preBookToken || response?.Token || params.code
    const preBookId = response?.preBookId || response?.prebookId || response?.PreBookId || response?.id || 0
    const priceConfirmed =
      response?.price?.amount || response?.netPrice?.amount || response?.totalPrice || response?.priceConfirmed || 0
    const currency = response?.price?.currency || response?.netPrice?.currency || response?.currency || "USD"

    const isSuccess = token || preBookId > 0 || response?.success || response?.status === "done"

    return {
      preBookId,
      token,
      status: isSuccess ? "done" : "failed",
      priceConfirmed,
      currency,
    }
  }

  // =====================
  // STEP 3: BOOK
  // =====================
  async book(params: {
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
  }): Promise<BookingResult> {
    // Build adults array with lead passenger
    const adultsArray: any[] = [
      {
        lead: true,
        title: params.customer.title || "MR",
        name: {
          first: params.customer.firstName,
          last: params.customer.lastName,
        },
        contact: {
          address: params.customer.address || "",
          city: params.customer.city || "",
          country: params.customer.country || "IL",
          email: params.customer.email,
          phone: params.customer.phone,
          state: "IL",
          zip: params.customer.zip || "",
        },
      },
    ]

    // Add additional adults if needed (params.adults - 1 more)
    for (let i = 1; i < params.adults; i++) {
      adultsArray.push({
        lead: false,
        title: "MR",
        name: {
          first: `Guest${i + 1}`,
          last: params.customer.lastName,
        },
      })
    }

    // Build children array
    const childrenArray = (params.children || []).map((age, index) => ({
      age,
      name: {
        first: `Child${index + 1}`,
        last: params.customer.lastName,
      },
    }))

    // Build the inner request according to Medici API documentation
    const innerRequest = {
      customer: {
        title: params.customer.title || "MR",
        name: {
          first: params.customer.firstName,
          last: params.customer.lastName,
        },
        birthDate: "1990-01-01", // Default birthdate
        contact: {
          address: params.customer.address || "",
          city: params.customer.city || "",
          country: params.customer.country || "IL",
          email: params.customer.email,
          phone: params.customer.phone,
          state: "IL",
          zip: params.customer.zip || "",
        },
      },
      paymentMethod: {
        methodName: "account_credit",
      },
      reference: {
        agency: params.agencyReference || "BookingEngine",
        voucherEmail: params.voucherEmail || params.customer.email,
      },
      services: [
        {
          bookingRequest: [
            {
              code: params.code,
              pax: [
                {
                  adults: adultsArray,
                  children: childrenArray,
                },
              ],
            },
          ],
          token: params.token,
        },
      ],
      searchRequest: {
        currencies: ["USD"],
        customerCountry: "IL",
        dates: {
          from: params.dateFrom,
          to: params.dateTo,
        },
        destinations: [
          {
            id: params.hotelId,
            type: "hotel",
          },
        ],
        filters: [
          { name: "payAtTheHotel", value: true },
          { name: "onRequest", value: false },
          { name: "showSpecialDeals", value: true },
        ],
        pax: [
          {
            adults: params.adults,
            children: params.children || [],
          },
        ],
        service: "hotels",
      },
    }

    const bookBody = {
      jsonRequest: JSON.stringify(innerRequest),
    }

    console.log("[v0] Book inner request:", JSON.stringify(innerRequest, null, 2))

    try {
      const response = await this.request<any>("/api/hotels/Book", "POST", bookBody)

      console.log("[v0] Book raw response:", JSON.stringify(response, null, 2))

      // Check response according to API documentation
      const isSuccess =
        response?.status === "done" ||
        response?.bookRes?.content?.status === "confirmed" ||
        response?.bookingId ||
        response?.bookingID ||
        response?.success

      return {
        success: isSuccess,
        bookingId: String(response?.bookingId || response?.bookingID || response?.bookRes?.content?.bookingId || ""),
        supplierReference:
          response?.supplierReference || response?.supplierRef || response?.bookRes?.content?.supplierReference || "",
        status: isSuccess ? "confirmed" : "failed",
      }
    } catch (error: any) {
      console.error("[v0] Book error:", error)
      return {
        success: false,
        error: error.message || "Booking failed",
        status: "failed",
      }
    }
  }

  // =====================
  // MANUAL BOOK (by code)
  // =====================
  async manualBook(params: { opportunityId: number; code: string }): Promise<BookingResult> {
    try {
      const response = await this.request<any>("/api/hotels/ManualBook", "POST", {
        opportunityId: params.opportunityId,
        code: params.code,
      })

      return {
        success: response?.success || response?.bookingId,
        bookingId: String(response?.bookingId || ""),
        status: "confirmed",
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // =====================
  // CANCEL BOOKING
  // =====================
  async cancelBooking(preBookId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.request(`/api/hotels/CancelRoomActive?prebookId=${preBookId}`, "DELETE")
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // =====================
  // ROOM MANAGEMENT
  // =====================

  async getActiveRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
    hotelStars?: number
    city?: string
    roomBoard?: string
    roomCategory?: string
    provider?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsActive", "POST", params || {})
    return Array.isArray(response) ? response : []
  }

  async getSoldRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsSales", "POST", params || {})
    return Array.isArray(response) ? response : []
  }

  async getCancelledRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsCancel", "POST", params || {})
    return Array.isArray(response) ? response : []
  }

  // =====================
  // DASHBOARD
  // =====================
  async getDashboardInfo(params?: {
    hotelStars?: number
    city?: string
    hotelName?: string
    reservationMonthDate?: string
    checkInMonthDate?: string
    provider?: string
  }): Promise<any> {
    const response = await this.request<any>("/api/hotels/GetDashboardInfo", "POST", params || {})
    return response || {}
  }

  // =====================
  // OPPORTUNITIES
  // =====================

  async getOpportunities(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetOpportunities", "POST", params || {})
    return Array.isArray(response) ? response : []
  }

  async insertOpportunity(params: {
    hotelId?: number
    startDateStr: string
    endDateStr: string
    boardId: number
    categoryId: number
    buyPrice: number
    pushPrice: number
    maxRooms: number
    paxAdults?: number
    paxChildren?: number[]
  }): Promise<{ success: boolean; opportunityId?: number; error?: string }> {
    try {
      const response = await this.request<any>("/api/hotels/InsertOpportunity", "POST", params)
      return { success: true, opportunityId: response?.opportunityId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // =====================
  // PRICE UPDATE
  // =====================
  async updatePushPrice(preBookId: number, pushPrice: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.request("/api/hotels/UpdateRoomsActivePushPrice", "POST", {
        preBookId,
        pushPrice,
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // =====================
  // ARCHIVE
  // =====================
  async getRoomArchive(params: {
    stayFrom?: string
    stayTo?: string
    hotelName?: string
    minPrice?: number
    maxPrice?: number
    city?: string
    roomBoard?: string
    roomCategory?: string
    pageNumber?: number
    pageSize?: number
  }): Promise<{ data: any[]; totalCount: number }> {
    const response = await this.request<any>("/api/hotels/GetRoomArchiveData", "POST", {
      ...params,
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 50,
    })

    return {
      data: response?.data || [],
      totalCount: response?.totalCount || 0,
    }
  }
}

// Export singleton instance
export const mediciApi = new MediciApiClient()

// Export class for custom instances
export { MediciApiClient }

// =====================
// HELPER FUNCTIONS
// =====================

function buildFullImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ""
  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  // Build full URL from relative path
  return `${MEDICI_IMAGES_BASE}${imagePath}`
}

function getHotelMainImage(item: any): string {
  // Try different image sources
  if (item.imageUrl) return buildFullImageUrl(item.imageUrl)
  if (item.image) return buildFullImageUrl(item.image)
  if (item.mainImage) return buildFullImageUrl(item.mainImage)

  // Try images array
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0]
    if (typeof firstImage === "string") return buildFullImageUrl(firstImage)
    if (firstImage?.url) return buildFullImageUrl(firstImage.url)
    if (firstImage?.path) return buildFullImageUrl(firstImage.path)
  }

  // Try items[0].images
  if (item.items && item.items[0]?.images && item.items[0].images.length > 0) {
    return buildFullImageUrl(item.items[0].images[0])
  }

  return ""
}

function buildImagesArray(item: any): string[] {
  const images: string[] = []

  // Add from images array
  if (item.images && Array.isArray(item.images)) {
    for (const img of item.images) {
      if (typeof img === "string") {
        images.push(buildFullImageUrl(img))
      } else if (img?.url) {
        images.push(buildFullImageUrl(img.url))
      } else if (img?.path) {
        images.push(buildFullImageUrl(img.path))
      }
    }
  }

  // Add from items[0].images
  if (item.items && item.items[0]?.images) {
    for (const img of item.items[0].images) {
      if (typeof img === "string") {
        images.push(buildFullImageUrl(img))
      }
    }
  }

  return images.filter(Boolean)
}

function extractPriceFromRoom(room: any): number {
  console.log("[v0] extractPriceFromRoom - Full room object keys:", Object.keys(room || {}))
  console.log("[v0] extractPriceFromRoom - Room data sample:", JSON.stringify(room, null, 2).substring(0, 800))

  // Try all possible price locations based on API documentation
  const priceLocations = [
    { name: "price.amount", value: room.price?.amount },
    { name: "price.value", value: room.price?.value },
    { name: "price (direct)", value: room.price },
    { name: "buyPrice", value: room.buyPrice },
    { name: "sellPrice", value: room.sellPrice },
    { name: "totalPrice", value: room.totalPrice },
    { name: "amount", value: room.amount },
    { name: "rate.amount", value: room.rate?.amount },
    { name: "rate.value", value: room.rate?.value },
    { name: "rate (direct)", value: room.rate },
    { name: "cost", value: room.cost },
    { name: "netPrice", value: room.netPrice },
    { name: "grossPrice", value: room.grossPrice },
    { name: "Price", value: room.Price },
    { name: "BuyPrice", value: room.BuyPrice },
    { name: "SellPrice", value: room.SellPrice },
    { name: "TotalPrice", value: room.TotalPrice },
  ]

  console.log("[v0] All price locations checked:", priceLocations.map((p) => `${p.name}: ${p.value}`).join(", "))

  for (const { name, value } of priceLocations) {
    if (typeof value === "number" && value > 0) {
      console.log(`[v0] Found price at ${name}: ${value}`)
      return value
    }
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value)
      if (!isNaN(parsed) && parsed > 0) {
        console.log(`[v0] Found price at ${name} (parsed from string): ${parsed}`)
        return parsed
      }
    }
  }

  console.log("[v0] No price found in room object")
  return 0
}

function getRoomMainImage(room: any): string {
  // Try different image sources
  if (room.imageUrl) return buildFullImageUrl(room.imageUrl)
  if (room.image) return buildFullImageUrl(room.image)
  if (room.mainImage) return buildFullImageUrl(room.mainImage)

  // Try images array
  if (room.images && Array.isArray(room.images) && room.images.length > 0) {
    const firstImage = room.images[0]
    if (typeof firstImage === "string") return buildFullImageUrl(firstImage)
    if (firstImage?.url) return buildFullImageUrl(firstImage.url)
    if (firstImage?.path) return buildFullImageUrl(firstImage.path)
  }

  return ""
}

function buildRoomImagesArray(room: any): string[] {
  const images: string[] = []

  // Add from images array
  if (room.images && Array.isArray(room.images)) {
    for (const img of room.images) {
      if (typeof img === "string") {
        images.push(buildFullImageUrl(img))
      } else if (img?.url) {
        images.push(buildFullImageUrl(img.url))
      } else if (img?.path) {
        images.push(buildFullImageUrl(img.path))
      }
    }
  }

  return images.filter(Boolean)
}

function getBoardIdFromCode(boardCode: string): number {
  for (const [id, board] of Object.entries(BOARD_TYPES)) {
    if (board.code === boardCode) {
      return Number.parseInt(id, 10)
    }
  }
  return 0
}
