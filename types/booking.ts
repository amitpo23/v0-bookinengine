export interface Hotel {
  id: string
  name: string
  slug: string
  description: string
  address: string
  city: string
  country: string
  stars: number
  images: string[]
  amenities: string[]
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
  }
  currency: string
  primaryColor: string
  logo?: string
}

export interface Room {
  id: string
  hotelId: string
  name: string
  description: string
  images: string[]
  maxGuests: number
  maxAdults: number
  maxChildren: number
  bedType: string
  size: number
  amenities: string[]
  basePrice: number
  available: number
}

export interface RatePlan {
  id: string
  roomId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  includes: string[]
  cancellationPolicy: "free" | "non-refundable" | "partial"
  prepayment: "full" | "partial" | "none"
  mealPlan: "room-only" | "breakfast" | "half-board" | "full-board" | "all-inclusive"
}

export interface BookingSearch {
  hotelId: string
  checkIn: Date
  checkOut: Date
  adults: number
  children: number
  childrenAges: number[]
  rooms: number
  promoCode?: string
  city?: string
  hotelName?: string
}

export interface SelectedRoom {
  room: Room
  ratePlan: RatePlan
  quantity: number
}

export interface GuestDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  specialRequests?: string
  arrivalTime?: string
}

export interface Booking {
  id: string
  hotelId: string
  confirmationNumber: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  checkIn: Date
  checkOut: Date
  nights: number
  guests: {
    adults: number
    children: number
  }
  rooms: SelectedRoom[]
  guestDetails: GuestDetails
  pricing: {
    subtotal: number
    taxes: number
    fees: number
    discount: number
    total: number
    currency: string
  }
  createdAt: Date
}
