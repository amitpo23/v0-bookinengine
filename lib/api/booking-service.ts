// Booking Service - Handles the complete 4-step booking workflow
import { mediciApi, type SearchRoomResult, type BookingResult } from "./medici-client"

export interface BookingFlowState {
  step: "search" | "prebook" | "book" | "confirmed" | "error"
  searchResults?: SearchRoomResult[]
  selectedRoom?: SearchRoomResult
  preBookToken?: string
  confirmedPrice?: number
  bookingId?: string
  supplierReference?: string
  error?: string
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
  // Step 1: Search for available rooms
  async search(params: BookingRequest): Promise<SearchRoomResult[]> {
    return await mediciApi.searchHotels({
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      hotelName: params.hotelName,
      city: params.city,
      adults: params.adults,
      children: params.children,
      stars: params.stars,
    })
  }

  // Step 2: PreBook - verify availability and get token
  async preBook(
    room: SearchRoomResult,
    dateFrom: string,
    dateTo: string,
    adults: number,
    children?: number[],
  ): Promise<{ token: string; priceConfirmed: number } | { error: string }> {
    const result = await mediciApi.preBook({
      code: room.code,
      dateFrom,
      dateTo,
      hotelId: room.hotelId,
      adults,
      children,
    })

    if (result.status !== "done" || !result.token) {
      return { error: "Room is no longer available" }
    }

    return {
      token: result.token,
      priceConfirmed: result.priceConfirmed,
    }
  }

  // Step 3: Book - complete the reservation
  async book(
    room: SearchRoomResult,
    token: string,
    dateFrom: string,
    dateTo: string,
    adults: number,
    children: number[],
    guest: GuestDetails,
  ): Promise<BookingResult> {
    return await mediciApi.book({
      code: room.code,
      token,
      searchRequest: {
        dateFrom,
        dateTo,
        hotelId: room.hotelId,
        pax: [{ adults, children }],
      },
      customer: guest,
      voucherEmail: guest.email,
    })
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
