/**
 * Hotel Booking Engine - Type Definitions
 *
 * This file contains all TypeScript interfaces and types used throughout the booking system.
 * Import these types in your components for type safety and better developer experience.
 */

// ============================================================================
// CORE BOOKING TYPES
// ============================================================================

/**
 * Represents a guest in the booking
 */
export interface Guest {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: Date
  nationality?: string
  passportNumber?: string
  specialRequests?: string
}

/**
 * Represents the number of guests by category
 */
export interface GuestCount {
  adults: number
  children: number
  infants?: number
}

/**
 * Represents a date range for the stay
 */
export interface DateRange {
  checkIn: Date
  checkOut: Date
  nights: number
}

/**
 * Represents basic hotel information
 */
export interface HotelInfo {
  id: string
  name: string
  nameHe: string
  address: string
  addressHe: string
  city: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  starRating?: number
  description?: string
  descriptionHe?: string
  images?: string[]
  amenities?: string[]
}

// ============================================================================
// ROOM & RATE TYPES
// ============================================================================

/**
 * Represents a room image
 */
export interface RoomImage {
  url: string
  alt: string
  altHe?: string
  caption?: string
  captionHe?: string
  isPrimary?: boolean
  displayOrder?: number
}

/**
 * Represents a room amenity with icon
 */
export interface Amenity {
  id: string
  name: string
  nameHe: string
  icon?: string
  category?: "basic" | "entertainment" | "food" | "bathroom" | "other"
}

/**
 * Represents a rate/tariff option for a room
 */
export interface RateOption {
  id: string
  name: string
  nameHe: string
  description?: string
  descriptionHe?: string
  price: number
  originalPrice?: number
  currency: string
  features: string[]
  featuresHe: string[]
  refundable: boolean
  cancellationPolicy?: string
  cancellationPolicyHe?: string
  mealPlan?: "room_only" | "breakfast" | "half_board" | "full_board" | "all_inclusive"
  availableQuantity?: number
  restrictions?: {
    minNights?: number
    maxNights?: number
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
  }
}

/**
 * Represents a hotel room
 */
export interface Room {
  id: string
  name: string
  nameHe: string
  description: string
  descriptionHe: string
  images: RoomImage[]
  size: number // in square meters
  maxOccupancy: number
  bedConfiguration?: {
    kingBeds?: number
    queenBeds?: number
    singleBeds?: number
    sofaBeds?: number
  }
  amenities: string[]
  rateOptions: RateOption[]
  rating?: number
  reviewCount?: number
  roomType?: "standard" | "deluxe" | "suite" | "family" | "executive"
  view?: "sea" | "city" | "garden" | "pool" | "mountain"
  floor?: number
  accessible?: boolean
  petFriendly?: boolean
}

// ============================================================================
// BOOKING FLOW TYPES
// ============================================================================

/**
 * Represents a step in the booking process
 */
export interface BookingStep {
  id: number
  title: string
  titleHe: string
  subtitle?: string
  subtitleHe?: string
  path?: string
  isComplete?: boolean
}

/**
 * Represents the complete booking information
 */
export interface Booking {
  id?: string
  hotel: HotelInfo
  room: Room
  rate: RateOption
  dates: DateRange
  guests: GuestCount
  primaryGuest?: Guest
  additionalGuests?: Guest[]
  totalPrice: number
  currency: string
  specialRequests?: string
  promoCode?: string
  discount?: number
  status?: "pending" | "confirmed" | "cancelled" | "completed"
  paymentMethod?: "pay_at_hotel" | "credit_card" | "bank_transfer"
  confirmationNumber?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Represents booking summary data for the sticky header
 */
export interface BookingSummary {
  hotelName: string
  hotelNameHe: string
  checkIn: Date
  checkOut: Date
  guests: GuestCount
  nights: number
  totalPrice?: number
  currency?: string
}

// ============================================================================
// FILTER & SORT TYPES
// ============================================================================

/**
 * Represents filter options for room search
 */
export interface FilterOptions {
  priceRange: [number, number]
  maxOccupancy: number[]
  amenities: string[]
  roomTypes: ("standard" | "deluxe" | "suite" | "family" | "executive")[]
  refundableOnly: boolean
  views?: ("sea" | "city" | "garden" | "pool" | "mountain")[]
  bedTypes?: string[]
  accessible?: boolean
  petFriendly?: boolean
}

/**
 * Sort options for room listing
 */
export type SortOption = "recommended" | "price_low" | "price_high" | "rating" | "size" | "name"

/**
 * Represents a search query for rooms
 */
export interface RoomSearchQuery {
  hotelId: string
  checkIn: Date
  checkOut: Date
  guests: GuestCount
  filters?: Partial<FilterOptions>
  sortBy?: SortOption
  promoCode?: string
}

// ============================================================================
// UI COMPONENT PROPS TYPES
// ============================================================================

/**
 * Common props for bilingual components
 */
export interface BilingualProps {
  language?: "en" | "he"
}

/**
 * Props for RoomCard component
 */
export interface RoomCardProps extends BilingualProps {
  room: Room
  nights: number
  onBook: (roomId: string, rateId: string) => void
  isCompareMode?: boolean
  isSelected?: boolean
  onToggleCompare?: (roomId: string) => void
}

/**
 * Props for FilterSort component
 */
export interface FilterSortProps extends BilingualProps {
  onFilterChange: (filters: FilterOptions) => void
  onSortChange: (sortBy: SortOption) => void
  initialFilters?: Partial<FilterOptions>
  initialSort?: SortOption
}

/**
 * Props for BookingStepper component
 */
export interface BookingStepperProps extends BilingualProps {
  currentStep: number
  steps: BookingStep[]
  onStepClick?: (stepId: number) => void
}

/**
 * Props for BookingSummary component
 */
export interface BookingSummaryProps extends BookingSummary, BilingualProps {
  onEdit?: () => void
  showPrice?: boolean
}

/**
 * Props for ConfirmationModal component
 */
export interface ConfirmationModalProps extends BilingualProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  bookingDetails: BookingConfirmationDetails
}

/**
 * Booking details for confirmation modal
 */
export interface BookingConfirmationDetails {
  roomName: string
  roomNameHe: string
  rateName: string
  rateNameHe: string
  checkIn: Date
  checkOut: Date
  nights: number
  guests: GuestCount
  price: number
  currency?: string
  refundable: boolean
  mealPlan?: string
  specialRequests?: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    perPage?: number
    total?: number
  }
}

/**
 * Room availability response
 */
export interface RoomAvailabilityResponse {
  rooms: Room[]
  totalCount: number
  searchQuery: RoomSearchQuery
  appliedFilters: FilterOptions
}

/**
 * Booking creation response
 */
export interface BookingCreationResponse {
  booking: Booking
  confirmationNumber: string
  paymentRequired: boolean
  paymentUrl?: string
}

/**
 * Booking confirmation response
 */
export interface BookingConfirmationResponse {
  booking: Booking
  confirmationEmail: string
  cancellationDeadline?: Date
  policies: {
    cancellation: string
    checkIn: string
    checkOut: string
    payment: string
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Represents price breakdown
 */
export interface PriceBreakdown {
  basePrice: number
  taxes: number
  serviceFee: number
  discount?: number
  total: number
  currency: string
  pricePerNight: number
}

/**
 * Represents cancellation policy
 */
export interface CancellationPolicy {
  isRefundable: boolean
  deadlineDate?: Date
  penaltyPercentage?: number
  penaltyAmount?: number
  description: string
  descriptionHe: string
}

/**
 * Represents special offer
 */
export interface SpecialOffer {
  id: string
  title: string
  titleHe: string
  description: string
  descriptionHe: string
  discountType: "percentage" | "fixed_amount"
  discountValue: number
  validFrom: Date
  validTo: Date
  minNights?: number
  applicableRoomTypes?: string[]
  promoCode?: string
}

/**
 * Represents a review/rating
 */
export interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  authorName?: string
  authorCountry?: string
  stayDate?: Date
  createdAt: Date
  helpful?: number
  verified?: boolean
  categories?: {
    cleanliness?: number
    comfort?: number
    location?: number
    service?: number
    valueForMoney?: number
  }
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string | undefined
}

/**
 * Guest details form data
 */
export interface GuestDetailsFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  confirmEmail: string
  country: string
  specialRequests?: string
  arrivalTime?: string
  agreeToTerms: boolean
  subscribeNewsletter?: boolean
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  eventName: string
  eventCategory: "booking" | "search" | "user_action" | "error"
  eventLabel?: string
  eventValue?: number
  customData?: Record<string, any>
}

/**
 * Booking funnel tracking
 */
export interface BookingFunnelStep {
  step: "search" | "room_selection" | "guest_details" | "confirmation" | "payment"
  timestamp: Date
  data?: Record<string, any>
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Re-export for convenience
  Guest,
  GuestCount,
  DateRange,
  HotelInfo,
  RoomImage,
  Amenity,
  RateOption,
  Room,
  BookingStep,
  Booking,
  FilterOptions,
  SortOption,
  BilingualProps,
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a date is valid
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Type guard to check if a booking is confirmed
 */
export function isConfirmedBooking(booking: Booking): boolean {
  return booking.status === "confirmed" && !!booking.confirmationNumber
}

/**
 * Type guard to check if a rate is refundable
 */
export function isRefundableRate(rate: RateOption): boolean {
  return rate.refundable === true
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Supported currencies
 */
export const SUPPORTED_CURRENCIES = ["ILS", "USD", "EUR", "GBP"] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = ["en", "he"] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

/**
 * Booking statuses
 */
export const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/**
 * Payment methods
 */
export const PAYMENT_METHODS = ["pay_at_hotel", "credit_card", "bank_transfer"] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
