// Types and constants for Medici API - safe for client-side use
// No environment variables accessed here

export interface HotelSearchResult {
  hotelId: number
  hotelName: string
  hotelImage: string
  images: string[]
  location: string
  city: string
  stars: number
  address: string
  description: string
  facilities: string[]
  rooms: RoomResult[]
  requestJson?: string // Original requestJson from API response - used for PreBook
  responseJson?: any // Original responseJson from API response
}

export interface RoomResult {
  code: string // The booking code from API (e.g., "697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t")
  roomId: string
  roomName: string
  roomCategory: string
  categoryId: number
  roomImage: string
  images: string[]
  bedding: string
  board: string
  boardId: number
  boardType: string
  maxOccupancy: number
  size: number
  view: string
  amenities: string[]
  price: number
  buyPrice: number
  originalPrice: number
  currency: string
  cancellationPolicy: string
  available: number
  requestJson?: string // Room code for prebook
  pax?: { adults: number; children: number[] } // Occupancy info
}

export interface PreBookResponse {
  success: boolean
  preBookId: number
  token: string // The token from content.services.hotels[0].token
  status: string // Status from API (e.g., "done")
  priceConfirmed: number
  currency: string
  requestJson?: string // The requestJson from PreBook response
  responseJson?: string // The responseJson from PreBook response
  error?: string
}

export interface BookResponse {
  success: boolean
  bookingId: string // bookingID from bookRes.content.bookingID
  supplierReference: string // supplier.reference from bookRes.content.services[0].supplier.reference
  status: string // Status from API (e.g., "confirmed")
  error?: string
}

// Board type translations
export const BOARD_TYPES: Record<number, string> = {
  1: "Room Only",
  2: "Bed & Breakfast",
  3: "Half Board",
  4: "Full Board",
  5: "All Inclusive",
}

// Room category translations
export const ROOM_CATEGORIES: Record<number, string> = {
  1: "Standard",
  2: "Superior",
  3: "Deluxe",
  4: "Suite",
  5: "Executive",
}
