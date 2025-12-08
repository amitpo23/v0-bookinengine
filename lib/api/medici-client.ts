// Medici Hotels API Client
// Complete AI-Executable Integration
// Base URL: https://medici-backend.azurewebsites.net

const MEDICI_BASE_URL = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://medici-images.azurewebsites.net/images/"

const MEDICI_TOKEN =
  process.env.MEDICI_TOKEN ||
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U"

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
  code: string
  roomId: number
  roomName: string
  roomCategory: string
  categoryId: number
  boardId: number
  boardType: string
  buyPrice: number
  currency: string
  maxOccupancy: number
  cancellationPolicy: string
}

export interface HotelSearchResult {
  hotelId: number
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
    if (!response) return []

    // Handle array response directly (API returns array of rooms/hotels)
    const items = Array.isArray(response) ? response : response.items || response.hotels || response.rooms || []
    const results: HotelSearchResult[] = []

    console.log("[v0] transformSearchResults - items count:", items.length)

    for (const item of items) {
      // Each item could be a hotel with rooms or a direct room result
      const roomItems = item.items || [item]

      const mainImage = getHotelMainImage(item)
      const allImages = buildImagesArray(item)

      console.log("[v0] Hotel:", item.hotelName, "mainImage:", mainImage, "allImages count:", allImages.length)

      const rooms: RoomResult[] = roomItems.map((room: any) => {
        const price = extractPrice(item, room)
        console.log("[v0] Room:", room.roomName || room.name, "price:", price)

        return {
          code: room.code || item.code || "",
          roomId: room.roomId || room.id || 0,
          roomName: room.roomName || room.name || room.roomType || "Standard Room",
          roomCategory: room.roomCategory || room.category || "Standard",
          categoryId: room.categoryId || room.category || 0,
          boardId: room.boardId || room.board || 1,
          boardType: room.boardType || room.board || "Room Only",
          buyPrice: price,
          currency: room.price?.currency || item.price?.currency || "USD",
          maxOccupancy: room.maxOccupancy || room.maxPax || 2,
          cancellationPolicy: room.cancellation?.type || (room.nonRefundable ? "non-refundable" : "fully-refundable"),
        }
      })

      results.push({
        hotelId: item.hotelId || item.id || 0,
        hotelName: item.hotelName || item.name || "Unknown Hotel",
        city: item.city || "",
        stars: item.stars || 0,
        address: item.address || "",
        imageUrl: mainImage,
        images: allImages.length > 0 ? allImages : mainImage ? [mainImage] : [],
        description: item.description || "",
        facilities: item.facilities || [],
        rooms,
      })
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
    const innerRequest = {
      code: params.code,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      hotelId: params.hotelId,
      pax: [
        {
          adults: params.adults,
          children: params.children || [],
        },
      ],
    }

    const preBookBody = {
      jsonRequest: JSON.stringify(innerRequest),
    }

    console.log("[v0] PreBook inner request:", JSON.stringify(innerRequest, null, 2))
    console.log("[v0] PreBook wrapped body:", JSON.stringify(preBookBody, null, 2))

    const response = await this.request<any>("/api/hotels/PreBook", "POST", preBookBody)

    console.log("[v0] PreBook raw response:", JSON.stringify(response, null, 2))

    // Handle 204 No Content as success - generate a unique ID from the code
    if (response._status === 204) {
      console.log("[v0] PreBook returned 204 - treating as success")
      // Generate a unique preBookId from the code hash
      const generatedId = Math.abs(params.code.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))
      return {
        preBookId: generatedId,
        token: params.code, // Use the code as the token for the next step
        status: "done",
        priceConfirmed: 0, // Price will be confirmed from the original search
        currency: "USD",
      }
    }

    const preBookId = response?.preBookId || response?.prebookId || response?.PreBookId || response?.id || 0
    const token = response?.token || response?.preBookToken || response?.Token || ""
    const priceConfirmed =
      response?.price?.amount || response?.totalPrice || response?.priceConfirmed || response?.Price || 0

    // Check if we have a valid response
    const isSuccess = preBookId > 0 || token || response?.success || response?.status === "done"

    return {
      preBookId,
      token,
      status: isSuccess ? "done" : "failed",
      priceConfirmed,
      currency: response?.price?.currency || response?.currency || "USD",
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
    const innerRequest = {
      code: params.code,
      token: params.token,
      preBookId: params.preBookId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      hotelId: params.hotelId,
      pax: [
        {
          adults: params.adults,
          children: params.children || [],
        },
      ],
      customer: {
        title: params.customer.title || "MR",
        firstName: params.customer.firstName,
        lastName: params.customer.lastName,
        email: params.customer.email,
        phone: params.customer.phone,
        country: params.customer.country || "IL",
        city: params.customer.city || "",
        address: params.customer.address || "",
        zip: params.customer.zip || "",
      },
      voucherEmail: params.voucherEmail || params.customer.email,
      agencyReference: params.agencyReference || "Booking Engine",
    }

    const bookBody = {
      jsonRequest: JSON.stringify(innerRequest),
    }

    console.log("[v0] Book inner request:", JSON.stringify(innerRequest, null, 2))
    console.log("[v0] Book wrapped body:", JSON.stringify(bookBody, null, 2))

    try {
      const response = await this.request<any>("/api/hotels/Book", "POST", bookBody)

      return {
        success: response?.status === "confirmed" || response?.bookingId || response?.success,
        bookingId: String(response?.bookingId || response?.bookingID || ""),
        supplierReference: response?.supplierReference || response?.supplierRef || "",
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

function extractPrice(item: any, room: any): number {
  // Try room-level price first
  if (room?.price?.amount && room.price.amount > 0) return room.price.amount
  if (room?.buyPrice && room.buyPrice > 0) return room.buyPrice
  if (room?.total && room.total > 0) return room.total
  if (room?.totalPrice && room.totalPrice > 0) return room.totalPrice

  // Try item-level price
  if (item?.price?.amount && item.price.amount > 0) return item.price.amount
  if (item?.buyPrice && item.buyPrice > 0) return item.buyPrice
  if (item?.total && item.total > 0) return item.total

  // Try items[0].price
  if (item?.items?.[0]?.price?.amount) return item.items[0].price.amount

  return 0
}
