// Medici Hotels API Client
// Complete AI-Executable Integration
// Base URL: https://medici-backend.azurewebsites.net

const MEDICI_BASE_URL = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"

const MEDICI_TOKEN =
  process.env.MEDICI_TOKEN ||
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U"

// Cancel operations token (UserID 14)
const MEDICI_CANCEL_TOKEN =
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxNCIsIm5iZiI6MTc1NDQxNjA5NiwiZXhwIjoyMDY5OTQ4ODk2LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.SVB1ZRljxG09FWA96xuMKUfY3J8lu1-SMGZwJJhTt5g"

// =====================
// TYPES
// =====================

export interface SearchParams {
  dateFrom: string // YYYY-MM-DD
  dateTo: string // YYYY-MM-DD
  hotelName?: string
  city?: string
  pax: { adults: string; children: number[] }[]
  stars?: number | null
  limit?: number | null
}

export interface SearchRoomResult {
  code: string // CRITICAL: Save this for booking
  hotelId: number
  hotelName: string
  city: string
  stars: number
  address?: string
  imageUrl?: string
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

// Room details for grouped hotel results
export interface RoomResult {
  code: string
  roomId: string
  roomName?: string
  roomCategory: string
  categoryId: number
  boardType: string
  boardId: number
  buyPrice: number
  pushPrice?: number
  currency?: string
  maxOccupancy: number
  nonRefundable?: boolean
  cancellationDeadline?: string
}

// Hotel with grouped rooms
export interface HotelSearchResult {
  hotelId: number
  hotelName: string
  city: string
  stars: number
  address?: string
  imageUrl?: string
  rooms?: RoomResult[]
}

export interface PreBookResult {
  token: string // CRITICAL: Save this for booking
  status: "done" | "failed"
  priceConfirmed: number
  currency: string
}

export interface BookingParams {
  code: string // From search
  token: string // From prebook
  searchRequest: {
    dateFrom: string
    dateTo: string
    hotelId: number
    pax: { adults: number; children: number[] }[]
  }
  customer: {
    title: "MR" | "MRS" | "MS"
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    city: string
    address: string
    zip: string
    birthDate?: string
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
  destinationId?: number
  startDateStr: string
  endDateStr: string
  boardId: number
  categoryId: number
  buyPrice: number
  pushPrice: number
  maxRooms: number
  reservationFullName?: string
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
  6: { code: "CB", name: "Continental Breakfast", nameHe: "ארוחת בוקר קונטיננטלית" },
  7: { code: "BD", name: "Bed & Dinner", nameHe: "לינה וארוחת ערב" },
}

export const ROOM_CATEGORIES: Record<number, { name: string; nameHe: string }> = {
  1: { name: "Standard", nameHe: "סטנדרט" },
  2: { name: "Superior", nameHe: "סופריור" },
  3: { name: "Deluxe", nameHe: "דלוקס" },
  4: { name: "Suite", nameHe: "סוויטה" },
  5: { name: "Junior Suite", nameHe: "סוויטת ג'וניור" },
  6: { name: "Family", nameHe: "משפחתי" },
  7: { name: "Single", nameHe: "יחיד" },
  8: { name: "Double", nameHe: "זוגי" },
  9: { name: "Twin", nameHe: "טווין" },
  10: { name: "Triple", nameHe: "שלישייה" },
  11: { name: "Quad", nameHe: "רביעייה" },
  12: { name: "Studio", nameHe: "סטודיו" },
  13: { name: "Apartment", nameHe: "דירה" },
  14: { name: "Villa", nameHe: "וילה" },
  15: { name: "Executive", nameHe: "אקזקוטיב" },
}

// =====================
// API CLIENT CLASS
// =====================

class MediciApiClient {
  private baseUrl: string
  private token: string
  private cancelToken: string

  constructor(baseUrl?: string, token?: string) {
    this.baseUrl = baseUrl || MEDICI_BASE_URL
    this.token = token || MEDICI_TOKEN
    this.cancelToken = MEDICI_CANCEL_TOKEN
  }

  private async request<T>(endpoint: string, method = "POST", body?: object, useCancelToken = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = useCancelToken ? this.cancelToken : this.token

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`[v0] Error response:`, errorText)
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }

      const text = await response.text()
      const result = text ? JSON.parse(text) : ({} as T)
      console.log(`[v0] Response data:`, JSON.stringify(result, null, 2).substring(0, 500))
      return result
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
        adults: String(params.adults || 2),
        children: params.children || [],
      },
    ]

    // Build request - only include hotelName OR city, not both
    const searchBody: any = {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pax,
      ShowExtendedData: true, // Added ShowExtendedData for full hotel info with images
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
    if (!response) return []

    // The API returns: { items: [ { items: [...rooms], hotelName, ... } ] }
    // Extract the hotels array
    const hotels = response.items || []
    
    // Group rooms by hotel
    const hotelMap = new Map<number, HotelSearchResult>()

    for (const hotel of hotels) {
      // Each hotel has: { items: [...rooms], hotelName, hotelId, ... }
      const hotelId = parseInt(hotel.hotelId) || hotel.id || 0
      const hotelName = hotel.hotelName || hotel.name || "Unknown Hotel"
      const city = hotel.city || hotel.destination || ""
      const stars = hotel.stars || 0
      const address = hotel.address || ""
      const imageUrl = hotel.imageUrl || hotel.image || ""
      const rooms = hotel.items || [] // The rooms are in hotel.items

      // Create or get hotel entry
      if (!hotelMap.has(hotelId)) {
        hotelMap.set(hotelId, {
          hotelId,
          hotelName,
          city,
          stars,
          address,
          imageUrl,
          rooms: [],
        })
      }

      const hotelEntry = hotelMap.get(hotelId)!

      // Process each room in hotel.items
      for (const room of rooms) {
        hotelEntry.rooms!.push(this.mapRoomToRoomResult(room, hotel))
      }
    }

    return Array.from(hotelMap.values())
  }

  private mapRoomToRoomResult(room: any, hotel: any): RoomResult {
    // Check if room already has a code, otherwise build one
    // Format: hotelId:category:bedding:board:uniqueId
    let code = room.code
    if (!code) {
      // Generate a unique code if not provided
      const uniqueId = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`
      code = `${hotel.hotelId}:${room.category}:${room.bedding}:${room.board}:${uniqueId}`
    }
    
    return {
      code,
      roomId: String(room.roomId || room.id || Math.random().toString(36).substring(7)),
      roomName: room.roomName || room.name || room.roomType,
      roomCategory: room.roomCategory || room.category || "Standard",
      categoryId: room.categoryId || 1,
      boardType: room.boardType || room.board || BOARD_TYPES[room.boardId]?.name || "Room Only",
      boardId: room.boardId || 1,
      buyPrice: room.price?.amount || room.buyPrice || room.total || 0,
      pushPrice: room.pushPrice || room.sellPrice,
      currency: room.price?.currency || room.currency || hotel.currency || "USD",
      maxOccupancy: room.maxOccupancy || room.maxPax || 2,
      nonRefundable: room.nonRefundable || room.cancellation?.type === "non-refundable",
      cancellationDeadline: room.cancellation?.deadline || room.cancellationDeadline,
    }
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
    // Build the nested JSON request structure
    const innerRequest = {
      services: [
        {
          searchCodes: [
            {
              code: params.code,
              pax: [
                {
                  adults: Number(params.adults), // Ensure it's a number
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
                id: Number(params.hotelId),
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
                adults: Number(params.adults), // Ensure it's a number
                children: params.children || [],
              },
            ],
            service: "hotels",
          },
        },
      ],
    }

    const response = await this.request<any>("/api/hotels/PreBook", "POST", {
      jsonRequest: JSON.stringify(innerRequest),
    })

    return {
      token: response?.token || response?.preBookToken || "",
      status: response?.status === "done" ? "done" : "failed",
      priceConfirmed: response?.price?.amount || response?.totalPrice || 0,
      currency: response?.price?.currency || "USD",
    }
  }

  // =====================
  // STEP 3: BOOK
  // =====================
  async book(params: BookingParams): Promise<BookingResult> {
    // Create adults array - one guest object per adult
    const adultsCount = params.searchRequest.pax[0]?.adults || 2
    const adultsArray = Array.from({ length: adultsCount }, (_, index) => ({
      lead: index === 0, // First adult is the lead guest
      title: params.customer.title,
      name: {
        first: params.customer.firstName,
        last: params.customer.lastName,
      },
      contact: {
        address: params.customer.address,
        city: params.customer.city,
        country: params.customer.country,
        email: params.customer.email,
        phone: params.customer.phone,
        state: params.customer.country,
        zip: params.customer.zip,
      },
    }))

    const innerRequest = {
      customer: {
        title: params.customer.title,
        name: {
          first: params.customer.firstName,
          last: params.customer.lastName,
        },
        birthDate: params.customer.birthDate || "1985-01-01",
        contact: {
          address: params.customer.address,
          city: params.customer.city,
          country: params.customer.country,
          email: params.customer.email,
          phone: params.customer.phone,
          state: params.customer.country,
          zip: params.customer.zip,
        },
      },
      paymentMethod: {
        methodName: "account_credit",
      },
      reference: {
        agency: params.agencyReference || "Booking Engine",
        voucherEmail: params.voucherEmail || params.customer.email,
      },
      services: [
        {
          bookingRequest: [
            {
              code: params.code,
              token: params.token,
              pax: [
                {
                  adults: adultsArray,
                  children: params.searchRequest.pax[0]?.children || [],
                },
              ],
            },
          ],
          searchRequest: {
            currencies: ["USD"],
            customerCountry: params.customer.country,
            dates: {
              from: params.searchRequest.dateFrom,
              to: params.searchRequest.dateTo,
            },
            destinations: [
              {
                id: Number(params.searchRequest.hotelId),
                type: "hotel",
              },
            ],
            filters: [
              { name: "payAtTheHotel", value: true },
              { name: "onRequest", value: false },
              { name: "showSpecialDeals", value: true },
            ],
            pax: params.searchRequest.pax.map((p) => ({
              adults: Number(p.adults),
              children: p.children || [],
            })),
            service: "hotels",
          },
        },
      ],
    }

    try {
      const response = await this.request<any>("/api/hotels/Book", "POST", {
        jsonRequest: JSON.stringify(innerRequest),
      })

      return {
        success: response?.status === "confirmed" || response?.bookingID,
        bookingId: String(response?.bookingID || response?.bookingId || ""),
        supplierReference: response?.supplier?.reference || response?.supplierRef,
        status: response?.status || "confirmed",
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // =====================
  // STEP 4: CANCEL BOOKING
  // =====================
  async cancelBooking(bookingId: number, reason?: string): Promise<{ success: boolean; error?: string }> {
    const innerRequest = {
      BookingID: bookingId,
      CancelReason: reason || "",
      Force: false,
      IsManual: false,
    }

    try {
      await this.request(
        "/api/hotels/CancelRoomDirectJson",
        "DELETE",
        {
          jsonRequest: JSON.stringify(innerRequest),
        },
        true,
      ) // Use cancel token

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
    destinationId?: number
    hotelId?: number
    boardId?: number
    categoryId?: number
    stars?: number
  }): Promise<ActiveRoom[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsActive", "POST", params || {})
    return this.transformActiveRooms(response)
  }

  private transformActiveRooms(response: any): ActiveRoom[] {
    if (!response || !Array.isArray(response)) return []

    return response.map((room: any) => ({
      prebookId: room.prebookId,
      hotelName: room.hotelName,
      hotelId: room.hotelId,
      city: room.city,
      stars: room.stars,
      roomCategory: room.roomCategory,
      boardType: room.boardType,
      checkIn: room.checkIn,
      checkOut: room.checkOut,
      buyPrice: room.buyPrice,
      pushPrice: room.pushPrice,
      profit: room.pushPrice - room.buyPrice,
      guestName: room.guestName,
      status: room.status || "active",
      provider: room.provider,
    }))
  }

  async getSoldRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<SoldRoom[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsSales", "POST", params || {})
    return response || []
  }

  async getCancelledRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<CancelledRoom[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsCancel", "POST", params || {})
    return response || []
  }

  // =====================
  // DASHBOARD & ANALYTICS
  // =====================

  async getDashboardInfo(params?: {
    startDate?: string
    endDate?: string
    destinationId?: number
    hotelId?: number
    boardId?: number
    categoryId?: number
  }): Promise<DashboardInfo> {
    const response = await this.request<any>("/api/hotels/GetDashboardInfo", "POST", params || {})
    return {
      opportunities: response?.opportunities || 0,
      rooms: response?.rooms || 0,
      totalInvestments: response?.totalInvestments || 0,
      profit: response?.profit || 0,
      cancellations: response?.cancellations || 0,
      topProfitableRooms: response?.topProfitableRooms || [],
      topNonProfitableRooms: response?.topNonProfitableRooms || [],
    }
  }

  // =====================
  // OPPORTUNITIES
  // =====================

  async getOpportunities(params?: {
    startDate?: string
    endDate?: string
  }): Promise<Opportunity[]> {
    const response = await this.request<any>("/api/hotels/GetOpportunities", "POST", params || {})
    return response || []
  }

  async insertOpportunity(
    params: InsertOpportunityParams,
  ): Promise<{ success: boolean; opportunityId?: number; error?: string }> {
    try {
      const response = await this.request<any>("/api/hotels/InsertOpportunity", "POST", params)
      return { success: true, opportunityId: response?.opportunityId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // =====================
  // PRICE MANAGEMENT
  // =====================

  async updatePushPrice(prebookId: number, newPushPrice: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.request("/api/hotels/UpdateRoomsActivePushPrice", "POST", {
        prebookId,
        newPushPrice,
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
    startDate?: string
    endDate?: string
    hotelName?: string
    pageNumber?: number
    pageSize?: number
  }): Promise<{ data: any[]; totalCount: number; pageNumber: number; pageSize: number }> {
    const response = await this.request<any>("/api/hotels/GetRoomArchiveData", "POST", {
      ...params,
      pageNumber: params.pageNumber || 1,
      pageSize: Math.min(params.pageSize || 50, 100),
    })

    return {
      data: response?.data || [],
      totalCount: response?.totalCount || 0,
      pageNumber: response?.pageNumber || 1,
      pageSize: response?.pageSize || 50,
    }
  }

  // Cancel active room by prebookId
  async cancelRoomActive(prebookId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.request(`/api/hotels/CancelRoomActive?prebookId=${prebookId}`, "DELETE", undefined, true)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const mediciApi = new MediciApiClient()

// Export class for custom instances
export { MediciApiClient }

export { MediciApiClient as MediciClient }
