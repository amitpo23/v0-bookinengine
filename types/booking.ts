/**
 * Hotel Booking System - TypeScript Type Definitions
 * 
 * This file contains all type definitions for the hotel booking engine
 * integrating CMS data (rooms) with Medici API (rates and availability)
 */

// ============================================================================
// Base Types & Enums
// ============================================================================

/**
 * Board type codes from Medici API
 */
export type BoardCode = "RO" | "BB" | "HB" | "FB" | "AI";

/**
 * Board type names in Hebrew
 */
export type BoardName = 
  | "לינה בלבד" 
  | "לינה וארוחת בוקר" 
  | "חצי פנסיון" 
  | "פנסיון מלא"
  | "אול אינקלוסיב";

/**
 * Bed type options
 */
export type BedType = 
  | "מיטה זוגית" 
  | "מיטה קינג" 
  | "מיטה קווין"
  | "שתי מיטות נפרדות"
  | "מיטה יחיד";

/**
 * Payment timing
 */
export type PaymentType = "pre" | "post";

/**
 * Payment methods
 */
export type PaymentMethod = "creditcard" | "hotel";

/**
 * Booking status
 */
export type BookingStatus = "confirmed" | "pending" | "failed" | "cancelled";

/**
 * Currency codes
 */
export type Currency = "ILS" | "USD" | "EUR" | "GBP";

// ============================================================================
// Room Types (from CMS)
// ============================================================================

/**
 * Room amenities/facilities
 */
export interface RoomAmenity {
  /** Amenity name in Hebrew */
  name: string;
  /** Optional icon identifier */
  icon?: string;
}

/**
 * Room image
 */
export interface RoomImage {
  /** Image URL */
  url: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Is this the main/featured image */
  isPrimary?: boolean;
}

/**
 * Room data from CMS
 * Contains all static room information managed in the content management system
 */
export interface Room {
  /** Unique room ID in CMS */
  id: string;
  
  /** Parent hotel ID */
  hotelId: string;
  
  /** Room name in Hebrew */
  name: string;
  
  /** Room description in Hebrew (supports HTML) */
  description: string;
  
  /** Array of room image URLs */
  images: string[];
  
  /** Detailed image objects with metadata */
  imageDetails?: RoomImage[];
  
  /** List of room amenities in Hebrew */
  amenities: string[];
  
  /** Structured amenity objects */
  amenityDetails?: RoomAmenity[];
  
  /** Bed type(s) available in room */
  bedType: BedType | BedType[];
  
  /** Room size in square meters */
  size: number;
  
  /** Maximum number of adult guests */
  maxGuests: number;
  
  /** Maximum number of children allowed */
  maxChildren: number;
  
  /** Floor number (optional) */
  floor?: number;
  
  /** View type (optional) */
  view?: string;
  
  /** Is room accessible for disabled guests */
  accessible?: boolean;
  
  /** CMS metadata */
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

// ============================================================================
// Rate Types (from CMS + Medici API)
// ============================================================================

/**
 * Cancellation policy details
 */
export interface CancellationPolicy {
  /** Is the rate cancellable */
  cancellable: boolean;
  
  /** Policy description in Hebrew */
  description: string;
  
  /** Deadline for free cancellation */
  deadline?: Date;
  
  /** Cancellation fee amount (if applicable) */
  fee?: number;
  
  /** Cancellation fee currency */
  feeCurrency?: Currency;
}

/**
 * Rate/Price option for a room
 * Combines CMS room data with Medici API pricing and availability
 */
export interface Rate {
  /** Unique rate ID (generated) */
  id: string;
  
  /** Reference to Room ID from CMS */
  roomId: string;
  
  /** Medici API room/rate code */
  mediciCode: string;
  
  /** Board/meal plan code */
  boardCode: BoardCode;
  
  /** Board/meal plan name in Hebrew */
  boardName: BoardName;
  
  /** Total price for entire stay */
  priceTotal: number;
  
  /** Price per night (average) */
  pricePerNight: number;
  
  /** Currency code */
  currency: Currency;
  
  /** Number of nights */
  nights: number;
  
  /** Is rate cancellable */
  cancellable: boolean;
  
  /** Cancellation policy text in Hebrew */
  cancellationPolicy: string;
  
  /** Cancellation deadline (if applicable) */
  cancellationDeadline?: Date;
  
  /** Full cancellation policy object */
  cancellationDetails?: CancellationPolicy;
  
  /** Payment timing: prepay or pay at hotel */
  paymentType: PaymentType;
  
  /** Pre-booking token from Medici (after PreBook call) */
  token?: string;
  
  /** Token expiration time */
  tokenExpiresAt?: Date;
  
  /** Special offer flag */
  isSpecialOffer?: boolean;
  
  /** Discount percentage (if applicable) */
  discountPercent?: number;
  
  /** Original price before discount */
  originalPrice?: number;
  
  /** Minimum length of stay required */
  minStay?: number;
  
  /** Maximum length of stay allowed */
  maxStay?: number;
  
  /** Room available count */
  availableRooms?: number;
  
  /** Tax included flag */
  taxIncluded?: boolean;
  
  /** Tax amount */
  taxAmount?: number;
}

// ============================================================================
// Search Request Types
// ============================================================================

/**
 * Search parameters for availability check
 */
export interface SearchRequest {
  /** Hotel ID to search in */
  hotelId: string;
  
  /** Check-in date */
  checkIn: Date;
  
  /** Check-out date */
  checkOut: Date;
  
  /** Number of adult guests */
  adults: number;
  
  /** Number of children */
  children: number;
  
  /** Ages of children (if required by API) */
  childrenAges?: number[];
  
  /** Number of rooms needed */
  rooms?: number;
  
  /** Preferred currency for results */
  currency?: Currency;
  
  /** Specific board codes to filter by */
  boardCodes?: BoardCode[];
}

/**
 * Search response containing available rooms and rates
 */
export interface SearchResponse {
  /** Hotel ID searched */
  hotelId: string;
  
  /** Search request parameters */
  searchParams: SearchRequest;
  
  /** Available rooms with their rates */
  rooms: RoomWithRates[];
  
  /** Search timestamp */
  searchedAt: Date;
  
  /** Search session ID (for tracking) */
  sessionId?: string;
}

/**
 * Room with its available rates
 */
export interface RoomWithRates {
  /** Room information from CMS */
  room: Room;
  
  /** Available rates for this room */
  rates: Rate[];
  
  /** Is room currently available */
  isAvailable: boolean;
}

// ============================================================================
// Pre-Booking Request Types
// ============================================================================

/**
 * Guest information for booking
 */
export interface GuestInfo {
  /** Number of adult guests */
  adults: number;
  
  /** Number of children */
  children: number;
  
  /** Ages of children */
  childrenAges?: number[];
}

/**
 * Pre-booking request (to lock rate and get token)
 */
export interface PreBookRequest {
  /** Rate ID to pre-book */
  rateId: string;
  
  /** Check-in date */
  checkIn: Date;
  
  /** Check-out date */
  checkOut: Date;
  
  /** Guest information */
  guests: GuestInfo;
  
  /** Optional room preferences */
  preferences?: string;
}

/**
 * Pre-booking response from Medici
 */
export interface PreBookResponse {
  /** Success flag */
  success: boolean;
  
  /** Pre-booking token */
  token: string;
  
  /** Token expiration time */
  expiresAt: Date;
  
  /** Rate information confirmed */
  rate: Rate;
  
  /** Final price confirmed */
  finalPrice: number;
  
  /** Currency */
  currency: Currency;
  
  /** Any error message */
  error?: string;
}

// ============================================================================
// Booking Request Types
// ============================================================================

/**
 * Guest contact details for booking
 */
export interface GuestDetails {
  /** Guest title (optional) */
  title?: "Mr" | "Mrs" | "Ms" | "Dr";
  
  /** First name */
  firstName: string;
  
  /** Last name */
  lastName: string;
  
  /** Email address */
  email: string;
  
  /** Phone number (international format preferred) */
  phone: string;
  
  /** Additional guest name (if multiple guests) */
  additionalGuests?: string[];
  
  /** Special requests */
  specialRequests?: string;
  
  /** Estimated arrival time */
  arrivalTime?: string;
}

/**
 * Credit card details (for prepayment)
 */
export interface CreditCardDetails {
  /** Cardholder name */
  cardholderName: string;
  
  /** Card number (will be tokenized) */
  cardNumber: string;
  
  /** Expiry month (1-12) */
  expiryMonth: number;
  
  /** Expiry year (YYYY) */
  expiryYear: number;
  
  /** CVV code */
  cvv: string;
}

/**
 * Final booking request
 */
export interface BookingRequest {
  /** Rate ID being booked */
  rateId: string;
  
  /** Pre-booking token from PreBook */
  token: string;
  
  /** Guest contact details */
  guestDetails: GuestDetails;
  
  /** Payment method */
  paymentMethod: PaymentMethod;
  
  /** Credit card details (if paying by card) */
  creditCard?: CreditCardDetails;
  
  /** Marketing consent */
  marketingConsent?: boolean;
  
  /** Terms and conditions acceptance */
  termsAccepted: boolean;
  
  /** Internal notes (optional) */
  internalNotes?: string;
}

// ============================================================================
// Booking Response Types
// ============================================================================

/**
 * Final booking response
 */
export interface BookingResponse {
  /** Unique booking ID in our system */
  bookingId: string;
  
  /** Booking status */
  status: BookingStatus;
  
  /** Hotel confirmation number */
  confirmationNumber: string;
  
  /** Supplier reference (Medici) */
  supplierReference?: string;
  
  /** Check-in date */
  checkIn: Date;
  
  /** Check-out date */
  checkOut: Date;
  
  /** Room name booked */
  roomName: string;
  
  /** Board/meal plan booked */
  boardName: BoardName;
  
  /** Total price paid/to be paid */
  totalPrice: number;
  
  /** Currency */
  currency: Currency;
  
  /** Guest details */
  guestDetails: GuestDetails;
  
  /** Payment type used */
  paymentType: PaymentType;
  
  /** Was payment successful (for prepay) */
  paymentSuccess?: boolean;
  
  /** Cancellation policy */
  cancellationPolicy: string;
  
  /** Booking timestamp */
  bookedAt: Date;
  
  /** Voucher URL (if available) */
  voucherUrl?: string;
  
  /** Error message (if status is failed) */
  error?: string;
  
  /** Additional booking details */
  metadata?: Record<string, any>;
}

/**
 * Booking confirmation email data
 */
export interface BookingConfirmation extends BookingResponse {
  /** Hotel name */
  hotelName: string;
  
  /** Hotel address */
  hotelAddress: string;
  
  /** Hotel phone */
  hotelPhone: string;
  
  /** Hotel email */
  hotelEmail?: string;
  
  /** Room image URL */
  roomImageUrl?: string;
  
  /** Check-in time */
  checkInTime?: string;
  
  /** Check-out time */
  checkOutTime?: string;
  
  /** Amenities list */
  amenities?: string[];
  
  /** Directions to hotel */
  directions?: string;
  
  /** Parking information */
  parkingInfo?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * API error response
 */
export interface ApiError {
  /** Error code */
  code: string;
  
  /** Error message in Hebrew */
  message: string;
  
  /** English message for logging */
  messageEn?: string;
  
  /** Additional error details */
  details?: Record<string, any>;
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number;
  
  /** Items per page */
  limit: number;
  
  /** Sort field */
  sortBy?: string;
  
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Items in current page */
  items: T[];
  
  /** Total items count */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Items per page */
  limit: number;
  
  /** Total pages */
  totalPages: number;
  
  /** Has next page */
  hasNext: boolean;
  
  /** Has previous page */
  hasPrev: boolean;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if booking is confirmed
 */
export function isBookingConfirmed(response: BookingResponse): boolean {
  return response.status === "confirmed" && !!response.confirmationNumber;
}

/**
 * Check if rate is cancellable
 */
export function isRateCancellable(rate: Rate): boolean {
  return rate.cancellable && (!rate.cancellationDeadline || rate.cancellationDeadline > new Date());
}

/**
 * Check if payment is prepaid
 */
export function isPrePayment(rate: Rate): boolean {
  return rate.paymentType === "pre";
}

// ============================================================================
// Exports
// ============================================================================

export default {
  isBookingConfirmed,
  isRateCancellable,
  isPrePayment,
};
