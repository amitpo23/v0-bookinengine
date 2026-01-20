// Medici Hotels API Client
// Complete AI-Executable Integration
// Base URL: https://medici-backend.azurewebsites.net

import type { HotelSearchResult, PreBookResponse, BookResponse } from "./medici-types"
import "server-only"
export * from "./medici-types"

// Import logger
import { apiLogger } from "@/lib/logging/api-logger"

const MEDICI_BASE_URL = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://medici-images.azurewebsites.net/images/"

// IMPORTANT: Use hardcoded token (UserId:11, expires 2066) - DO NOT use env variable as it may have old token
const MEDICI_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE"

// =====================
// TYPES
// =====================

// Types are imported from medici-types.ts

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

export class MediciApiClient {
  private baseUrl: string
  private token: string
  private retries: number
  private maxRetries: number

  constructor(token?: string) {
    this.token = token || MEDICI_TOKEN
    this.baseUrl = MEDICI_BASE_URL
    this.retries = 0
    this.maxRetries = 2
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const startTime = Date.now()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ...(options.headers as Record<string, string>),
    }

    // Log request start
    apiLogger.debug("medici", `Medici API Request: ${endpoint}`, {
      url,
      method: options.method || "GET",
    })

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const duration = Date.now() - startTime

      if (response.status === 204) {
        apiLogger.info("medici", `Medici API Success (204 No Content)`, {
          endpoint,
          duration,
        })
        return { _status: 204 } as T
      }

      if (!response.ok) {
        const errorBody = await response.text()

        // Log error
        await apiLogger.logMediciCall({
          action: "Medici API Error",
          endpoint,
          requestBody: options.body ? JSON.parse(options.body as string) : undefined,
          statusCode: response.status,
          duration,
          error: errorBody,
        })

        if (response.status === 401 && this.retries < this.maxRetries) {
          this.retries++
          apiLogger.warn("medici", `Token expired, refreshing (attempt ${this.retries})`)
          await this.refreshToken()
          return this.request<T>(endpoint, options)
        }

        throw new Error(`API Error ${response.status}: ${errorBody}`)
      }

      const data = await response.json()
      this.retries = 0

      // Log successful response
      await apiLogger.logMediciCall({
        action: "Medici API Success",
        endpoint,
        requestBody: options.body ? JSON.parse(options.body as string) : undefined,
        responseBody: { itemCount: Array.isArray(data) ? data.length : (data?.items?.length || 1) },
        statusCode: response.status,
        duration,
      })

      return data
    } catch (error) {
      const duration = Date.now() - startTime
      
      if (error instanceof Error) {
        apiLogger.error("medici", `Medici API Exception: ${endpoint}`, error.message, { duration })
        throw error
      }
      throw new Error("Unknown error occurred")
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
    rooms?: Array<{ adults: number; children: number[] }> // Array of rooms
    adults?: number // Fallback for single room
    children?: number[] // Fallback for single room
    stars?: number
    limit?: number
  }): Promise<HotelSearchResult[]> {
    const pax = params.rooms || [
      {
        adults: params.adults || 2,
        children: params.children || [],
      },
    ]

    const searchBody: any = {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pax,
      stars: params.stars || null,
      limit: params.limit || null,
      ShowExtendedData: true, // Get images, description, facilities from Medici
    }

    if (params.hotelName) {
      searchBody.hotelName = params.hotelName
    } else if (params.city) {
      searchBody.city = params.city
    }

    const response = await this.request<any>("/api/hotels/GetInnstantSearchPrice", {
      method: "POST",
      body: JSON.stringify(searchBody),
    })

    const hotels = this.transformSearchResults(response)

    return hotels.map((hotel) => ({
      ...hotel,
      requestJson: params,
      responseJson: response,
    }))
  }

  // =====================
  // STEP 2: PRE-BOOK
  // =====================
  async preBook(params: {
    jsonRequest: string
  }): Promise<PreBookResponse> {
    const preBookBody = {
      jsonRequest: params.jsonRequest,
    }

    const response = await this.request<any>("/api/hotels/PreBook", {
      method: "POST",
      body: JSON.stringify(preBookBody),
    })

    if (response._status === 204) {
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

    const token = response?.content?.services?.hotels?.[0]?.token || response?.token || response?.preBookToken || ""

    const preBookId = response?.opportunityId || response?.preBookId || response?.id || 0

    const priceConfirmed =
      response?.content?.services?.hotels?.[0]?.netPrice?.amount ||
      response?.content?.services?.hotels?.[0]?.price?.amount ||
      response?.price?.amount ||
      0

    const currency =
      response?.content?.services?.hotels?.[0]?.netPrice?.currency ||
      response?.content?.services?.hotels?.[0]?.price?.currency ||
      "USD"

    const isSuccess = token || response?.status === "done"

    return {
      success: isSuccess,
      preBookId,
      token,
      status: response?.status || (isSuccess ? "done" : "failed"),
      priceConfirmed,
      currency,
      requestJson: params.jsonRequest,
      responseJson: response,
    }
  }

  // =====================
  // STEP 3: BOOK
  // =====================
  async book(params: {
    jsonRequest: string
  }): Promise<BookResponse> {
    const bookBody = {
      jsonRequest: params.jsonRequest,
    }

    try {
      const response = await this.request<any>("/api/hotels/Book", {
        method: "POST",
        body: JSON.stringify(bookBody),
      })

      console.log('[DEBUG] Book API Response:', JSON.stringify(response, null, 2))

      const bookingID =
        response?.bookRes?.content?.bookingID ||
        response?.content?.bookingID ||
        response?.bookingId ||
        response?.bookingID ||
        ""

      const supplierReference =
        response?.bookRes?.content?.services?.[0]?.supplier?.reference ||
        response?.content?.services?.[0]?.supplier?.reference ||
        response?.supplierReference ||
        ""

      const status = response?.bookRes?.content?.status || response?.content?.status || response?.status || ""

      console.log('[DEBUG] Parsed:', { bookingID, supplierReference, status })

      const isSuccess = status === "confirmed"

      return {
        success: isSuccess,
        bookingId: String(bookingID),
        supplierReference,
        status,
      }
    } catch (error: any) {
      return {
        success: false,
        bookingId: "",
        supplierReference: "",
        status: "failed",
        error: error.message,
      }
    }
  }

  // =====================
  // MANUAL BOOK (by code)
  // =====================
  async manualBook(params: { opportunityId: number; code: string }): Promise<BookResponse> {
    try {
      const response = await this.request<any>("/api/hotels/ManualBook", {
        method: "POST",
        body: JSON.stringify({
          opportunityId: params.opportunityId,
          code: params.code,
        }),
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
      await this.request(`/api/hotels/CancelRoomActive?prebookId=${preBookId}`, {
        method: "DELETE",
      })
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
    const response = await this.request<any>("/api/hotels/GetRoomsActive", {
      method: "POST",
      body: JSON.stringify(params || {}),
    })
    return Array.isArray(response) ? response : []
  }

  async getSoldRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsSales", {
      method: "POST",
      body: JSON.stringify(params || {}),
    })
    return Array.isArray(response) ? response : []
  }

  async getCancelledRooms(params?: {
    startDate?: string
    endDate?: string
    hotelName?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetRoomsCancel", {
      method: "POST",
      body: JSON.stringify(params || {}),
    })
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
    const response = await this.request<any>("/api/hotels/GetDashboardInfo", {
      method: "POST",
      body: JSON.stringify(params || {}),
    })
    return response || {}
  }

  // =====================
  // OPPORTUNITIES
  // =====================

  async getOpportunities(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any[]> {
    const response = await this.request<any>("/api/hotels/GetOpportunities", {
      method: "POST",
      body: JSON.stringify(params || {}),
    })
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
      const response = await this.request<any>("/api/hotels/InsertOpportunity", {
        method: "POST",
        body: JSON.stringify(params),
      })
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
      await this.request("/api/hotels/UpdateRoomsActivePushPrice", {
        method: "POST",
        body: JSON.stringify({
          preBookId,
          pushPrice,
        }),
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
    const response = await this.request<any>("/api/hotels/GetRoomArchiveData", {
      method: "POST",
      body: JSON.stringify({
        ...params,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 50,
      }),
    })

    return {
      data: response?.data || [],
      totalCount: response?.totalCount || 0,
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const formData = new URLSearchParams()
      formData.append(
        "client_secret",
        process.env.MEDICI_CLIENT_SECRET || "zlbgGGxz~|l3.Q?XXAT)uT!Lty,kJC>R?`:k?oQH$I=P7rL<R:Em:qDaM1G(jFU7",
      )

      const response = await fetch(`${this.baseUrl}/api/auth/OnlyNightUsersTokenAPI`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      this.token = data.token || data.access_token || data.aether_access_token
      return this.token
    } catch (error: any) {
      console.error("Failed to refresh token:", error.message)
      throw error
    }
  }

  private transformSearchResults(response: any): HotelSearchResult[] {
    if (!response) {
      return []
    }

    let items: any[] = []

    if (Array.isArray(response)) {
      items = response
    } else if (response.items && Array.isArray(response.items)) {
      items = response.items
    } else if (response.data && Array.isArray(response.data)) {
      items = response.data
    }

    const hotelMap = new Map<number, HotelSearchResult>()

    for (const item of items) {
      // Support new Medici format with ShowExtendedData
      const hotelIdRaw = item.id || item.hotelId || item.hotelCode || item.HotelId || item.hotel_id || 
        (item.items?.[0]?.hotelId) || 0
      const hotelId = typeof hotelIdRaw === "number" ? hotelIdRaw : Number.parseInt(String(hotelIdRaw), 10) || 0
      const hotelName = item.name || item.hotelName || item.HotelName || item.items?.[0]?.hotelName || "Unknown Hotel"

      // Extract facilities from new format (facilities.list or facilities.tags)
      let facilitiesList: string[] = []
      if (item.facilities) {
        if (Array.isArray(item.facilities)) {
          facilitiesList = item.facilities
        } else if (item.facilities.list && Array.isArray(item.facilities.list)) {
          facilitiesList = item.facilities.list
        } else if (item.facilities.tags && Array.isArray(item.facilities.tags)) {
          facilitiesList = item.facilities.tags
        }
      }

      if (!hotelMap.has(hotelId)) {
        hotelMap.set(hotelId, {
          hotelId,
          hotelName,
          hotelImage: getHotelMainImage(item),
          images: buildImagesArray(item),
          location: item.address || item.location || "",
          city: item.city || extractCityFromDestinations(item) || "",
          stars: item.stars || item.rating || 0,
          address: item.address || "",
          description: item.description || "",
          facilities: facilitiesList,
          phone: item.phone || "",
          fax: item.fax || "",
          lat: item.lat || 0,
          lon: item.lon || 0,
          seoname: item.seoname || "",
          rooms: [],
        })
      }

      const hotel = hotelMap.get(hotelId)!

      const roomItems = item.items || [item]

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
          roomItem.rate?.code,
          roomItem.rate?.key,
          roomItem.option?.code,
          roomItem.booking?.code,
        ]

        let roomCode = ""
        for (const codeField of possibleCodeFields) {
          if (codeField && typeof codeField === "string" && codeField.length > 0) {
            roomCode = codeField
            break
          }
        }

        if (!roomCode) {
          const tempCode = `TEMP-${hotelId}-${roomItem.id || Date.now()}-${roomIdx}`
          roomCode = tempCode
        }

        // Extract price from room item first, then fallback to parent item (hotel level)
        let price = extractPriceFromRoom(roomItem)
        if (price === 0) {
          price = extractPriceFromRoom(item) // Fallback to hotel-level price
        }

        hotel.rooms.push({
          code: roomCode,
          roomId: String(roomItem.id || roomItem.roomId || `${hotel.hotelId}-${hotel.rooms.length + 1}`),
          roomName: roomItem.name || roomItem.roomName || "Standard Room",
          roomCategory: roomItem.category || roomItem.roomType || "standard",
          categoryId: roomItem.categoryId || roomItem.category_id || 1,
          roomImage: getRoomMainImage(roomItem) || hotel.hotelImage, // Fallback to hotel image
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
          currency: roomItem.currency || item.price?.currency || item.netPrice?.currency || "USD",
          cancellationPolicy: formatCancellationPolicy(item.cancellation) || roomItem.cancellationPolicy || "free",
          cancellation: item.cancellation || null,
          available: roomItem.quantity?.max || roomItem.available || 1,
          requestJson: item.code || roomItem.code || roomCode, // Use hotel-level code for prebook
          pax: roomItem.pax || { adults: 2, children: [] },
          confirmation: item.confirmation || "on_request",
          paymentType: item.paymentType || "pre",
          providers: item.providers || [],
          specialOffers: item.specialOffers || [],
        })
      }
    }

    const results = Array.from(hotelMap.values())
    return results
  }
}

export const mediciApi = new MediciApiClient()

// =====================
// HELPER FUNCTIONS
// =====================

function buildFullImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ""
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  return `${MEDICI_IMAGES_BASE}${imagePath}`
}

function getHotelMainImage(item: any): string {
  if (item.imageUrl) return buildFullImageUrl(item.imageUrl)
  if (item.image) return buildFullImageUrl(item.image)
  if (item.mainImage) return buildFullImageUrl(item.mainImage)

  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0]
    if (typeof firstImage === "string") return buildFullImageUrl(firstImage)
    if (firstImage?.url) return buildFullImageUrl(firstImage.url)
    if (firstImage?.path) return buildFullImageUrl(firstImage.path)
  }

  if (item.items && item.items[0]?.images && item.items[0].images.length > 0) {
    return buildFullImageUrl(item.items[0].images[0])
  }

  return ""
}

function buildImagesArray(item: any): string[] {
  const images: string[] = []

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
  const priceLocations = [
    // Medici API uses netPrice as primary price field
    { name: "netPrice.amount", value: room.netPrice?.amount },
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

  for (const { name, value } of priceLocations) {
    if (typeof value === "number" && value > 0) {
      return value
    }
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value)
      if (!isNaN(parsed) && parsed > 0) {
        return parsed
      }
    }
  }

  return 0
}

function getRoomMainImage(room: any): string {
  if (room.imageUrl) return buildFullImageUrl(room.imageUrl)
  if (room.image) return buildFullImageUrl(room.image)
  if (room.mainImage) return buildFullImageUrl(room.mainImage)

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

// Extract city from destinations array (new Medici format)
function extractCityFromDestinations(item: any): string {
  if (item.destinations && Array.isArray(item.destinations)) {
    const cityDest = item.destinations.find((d: any) => d.type === "city")
    if (cityDest?.destinationId) {
      return `City-${cityDest.destinationId}` // Will be resolved by enrichment
    }
  }
  if (item.surroundings && Array.isArray(item.surroundings)) {
    const citySurr = item.surroundings.find((s: any) => s.type === "city")
    if (citySurr?.destinationId) {
      return `City-${citySurr.destinationId}`
    }
  }
  return ""
}

// Format cancellation policy from new Medici format
function formatCancellationPolicy(cancellation: any): string {
  if (!cancellation) return "free"
  
  if (cancellation.type === "fully-refundable") {
    return "free"
  } else if (cancellation.type === "non-refundable") {
    return "non-refundable"
  } else if (cancellation.type === "partially-refundable") {
    return "partial"
  }
  
  // Check frames for deadline
  if (cancellation.frames && Array.isArray(cancellation.frames)) {
    const freeFrame = cancellation.frames.find((f: any) => 
      f.penalty?.amount === 0
    )
    if (freeFrame) {
      const deadline = new Date(freeFrame.to)
      return `Free cancellation until ${deadline.toLocaleDateString()}`
    }
  }
  
  return cancellation.type || "free"
}
