// Booking Service - Enhanced with validation, retry, logging
import { mediciApi } from "./medici-client"
import { preBookManager } from "./prebook-manager"
import { bookingValidator } from "./booking-validator"
import { retryHandler } from "./booking-retry-handler"
import { bookingLogger } from "./booking-logger"
import type { HotelSearchResult } from "./medici-types"

export interface BookingFlowState {
  step: "search" | "prebook" | "book" | "confirmed" | "error"
  searchResults?: HotelSearchResult[]
  selectedRoom?: any
  preBookToken?: string
  preBookExpiresAt?: Date
  timeRemaining?: number
  confirmedPrice?: number
  bookingId?: string
  supplierReference?: string
  error?: string
  warnings?: string[]
}

export interface GuestDetails {
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

export interface BookingRequest {
  dateFrom: string
  dateTo: string
  hotelName?: string
  city?: string
  adults: number
  children?: number[]
  stars?: number
}

class BookingService {
  // Step 1: Search for available rooms with retry
  async search(params: BookingRequest): Promise<HotelSearchResult[]> {
    bookingLogger.logSearchStarted(params)
    const startTime = Date.now()

    try {
      const result = await retryHandler.searchWithRetry({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        hotelName: params.hotelName,
        city: params.city,
        adults: params.adults,
        children: params.children,
        stars: params.stars,
      })

      if (!result.success) {
        bookingLogger.log({
          eventType: 'search_failed',
          error: result.error
        })
        throw new Error(result.error)
      }

      const duration = Date.now() - startTime
      bookingLogger.logSearchCompleted(result.data.length, duration)

      return result.data
    } catch (error: any) {
      bookingLogger.log({
        eventType: 'search_failed',
        error: error.message
      })
      throw error
    }
  }

  // Step 2: PreBook - verify availability and get token with retry
  async preBook(
    room: any,
    dateFrom: string,
    dateTo: string,
    adults: number,
    children?: number[],
  ): Promise<{ token: string; priceConfirmed: number; expiresAt: Date; timeRemaining: number } | { error: string }> {
    bookingLogger.logPreBookStarted(room.code, room.hotelId)

    try {
      // Check if we already have a valid PreBook
      const existingPreBook = preBookManager.getPreBook(room.code)
      if (existingPreBook) {
        const timeRemaining = preBookManager.getTimeRemaining(room.code)
        
        bookingLogger.log({
          eventType: 'prebook_completed',
          roomCode: room.code,
          hotelId: room.hotelId,
          preBookId: existingPreBook.token,
          price: existingPreBook.priceConfirmed,
          currency: 'USD',
          metadata: { cached: true, timeRemaining }
        })

        return {
          token: existingPreBook.token,
          priceConfirmed: existingPreBook.priceConfirmed,
          expiresAt: existingPreBook.expiresAt,
          timeRemaining
        }
      }

      // Perform new PreBook with retry
      const result = await retryHandler.preBookWithRetry({
        jsonRequest: room.requestJson,
        roomCode: room.code
      })

      if (!result.success || !result.data) {
        bookingLogger.logPreBookFailed(room.code, result.error || 'Unknown error')
        return { error: result.error || "Room is no longer available" }
      }

      const preBookData = preBookManager.getPreBook(room.code)
      if (!preBookData) {
        return { error: "Failed to save PreBook data" }
      }

      bookingLogger.logPreBookCompleted({
        roomCode: room.code,
        hotelId: room.hotelId,
        preBookId: result.data.preBookId?.toString() || 'unknown',
        token: result.data.token,
        price: result.data.priceConfirmed,
        currency: result.data.currency || 'USD'
      })

      return {
        token: preBookData.token,
        priceConfirmed: preBookData.priceConfirmed,
        expiresAt: preBookData.expiresAt,
        timeRemaining: preBookManager.getTimeRemaining(room.code)
      }
    } catch (error: any) {
      bookingLogger.logPreBookFailed(room.code, error.message)
      return { error: error.message }
    }
  }

  // Step 3: Book - complete the reservation with validation
  async book(
    room: any,
    token: string,
    dateFrom: string,
    dateTo: string,
    adults: number,
    children: number[],
    guest: GuestDetails,
  ): Promise<any> {
    // Validate before booking
    const validation = await bookingValidator.validateBooking({
      roomCode: room.code,
      token,
      guestDetails: guest,
      priceConfirmed: room.price
    })

    if (!validation.valid) {
      bookingLogger.logBookFailed(token, validation.errors.join(', '))
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('[Booking Warnings]', validation.warnings)
    }

    bookingLogger.logBookStarted({
      roomCode: room.code,
      preBookId: token,
      guestEmail: guest.email
    })

    try {
      // Get PreBook data
      const preBookData = preBookManager.getPreBook(room.code)
      if (!preBookData) {
        throw new Error('PreBook data not found or expired')
      }

      // Perform booking with retry
      const result = await retryHandler.bookWithRetry({
        jsonRequest: preBookData.requestJson
      })

      if (!result.success || !result.data) {
        bookingLogger.logBookFailed(token, result.error || 'Unknown error')
        throw new Error(result.error || 'Booking failed')
      }

      bookingLogger.logBookCompleted({
        bookingId: result.data.bookingId,
        supplierReference: result.data.supplierReference,
        price: preBookData.priceConfirmed,
        currency: 'USD',
        guestEmail: guest.email
      })

      return result.data
    } catch (error: any) {
      bookingLogger.logBookFailed(token, error.message)
      throw error
    }
  }

  // Step 4: Cancel booking (if needed)
  async cancel(bookingId: number, reason?: string): Promise<{ success: boolean; error?: string }> {
    return await mediciApi.cancelBooking(bookingId, reason)
  }

  // Full booking flow in one call
  async completeBooking(
    room: SearchRoomResult,
    dateFrom: string,
    dateTo: string,
    adults: number,
    children: number[],
    guest: GuestDetails,
  ): Promise<BookingFlowState> {
    try {
      // Step 2: PreBook
      const preBookResult = await this.preBook(room, dateFrom, dateTo, adults, children)

      if ("error" in preBookResult) {
        return { step: "error", error: preBookResult.error }
      }

      // Step 3: Book
      const bookResult = await this.book(room, preBookResult.token, dateFrom, dateTo, adults, children, guest)

      if (!bookResult.success) {
        return { step: "error", error: bookResult.error || "Booking failed" }
      }

      return {
        step: "confirmed",
        selectedRoom: room,
        preBookToken: preBookResult.token,
        confirmedPrice: preBookResult.priceConfirmed,
        bookingId: bookResult.bookingId,
        supplierReference: bookResult.supplierReference,
      }
    } catch (error: any) {
      return { step: "error", error: error.message }
    }
  }
}

export const bookingService = new BookingService()
