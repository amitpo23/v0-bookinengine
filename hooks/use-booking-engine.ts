"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"

// Types for the booking engine
export interface SearchParams {
  checkIn: Date
  checkOut: Date
  adults: number
  children: number[]
  hotelName?: string
  city?: string
}

export interface RoomResult {
  code: string
  roomId: string
  roomName: string
  roomCategory: string
  categoryId: number
  boardId: number
  boardType: string
  buyPrice: number
  originalPrice: number
  currency: string
  maxOccupancy: number
  size: number
  view: string
  bedding: string
  amenities: string[]
  images: string[]
  cancellationPolicy: string
  available: number
}

export interface HotelResult {
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

export interface GuestInfo {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country?: string
  city?: string
  address?: string
  zip?: string
  specialRequests?: string
}

export interface BookingState {
  step: "search" | "results" | "details" | "payment" | "confirmation"
  searchParams: SearchParams | null
  searchResults: HotelResult[]
  selectedHotel: HotelResult | null
  selectedRoom: RoomResult | null
  guestInfo: GuestInfo | null
  prebookData: {
    token: string
    preBookId: number
    priceConfirmed: number
    currency: string
  } | null
  bookingConfirmation: {
    bookingId: string
    supplierReference: string
    status: string
  } | null
  isLoading: boolean
  error: string | null
}

export function useBookingEngine() {
  const [state, setState] = useState<BookingState>({
    step: "search",
    searchParams: null,
    searchResults: [],
    selectedHotel: null,
    selectedRoom: null,
    guestInfo: null,
    prebookData: null,
    bookingConfirmation: null,
    isLoading: false,
    error: null,
  })

  // Step 1: Search hotels
  const searchHotels = useCallback(async (params: SearchParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, searchParams: params }))

    try {
      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateFrom: format(params.checkIn, "yyyy-MM-dd"),
          dateTo: format(params.checkOut, "yyyy-MM-dd"),
          hotelName: params.hotelName,
          city: params.city,
          adults: params.adults,
          children: params.children,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Search failed")
      }

      setState((prev) => ({
        ...prev,
        searchResults: data.data || [],
        step: "results",
        isLoading: false,
      }))

      return data.data || []
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Search failed",
        isLoading: false,
      }))
      return []
    }
  }, [])

  // Step 2: Select room and prebook
  const selectRoom = useCallback(
    async (hotel: HotelResult, room: RoomResult) => {
      setState((prev) => ({
        ...prev,
        selectedHotel: hotel,
        selectedRoom: room,
        isLoading: true,
        error: null,
      }))

      try {
        // Call prebook API
        const response = await fetch("/api/booking/prebook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: room.code,
            dateFrom: state.searchParams ? format(state.searchParams.checkIn, "yyyy-MM-dd") : "",
            dateTo: state.searchParams ? format(state.searchParams.checkOut, "yyyy-MM-dd") : "",
            hotelId: hotel.hotelId,
            adults: state.searchParams?.adults || 2,
            children: state.searchParams?.children || [],
          }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Prebook failed")
        }

        setState((prev) => ({
          ...prev,
          prebookData: {
            token: data.token,
            preBookId: data.preBookId,
            priceConfirmed: data.priceConfirmed || room.buyPrice,
            currency: data.currency || room.currency,
          },
          step: "details",
          isLoading: false,
        }))

        return true
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || "Room selection failed",
          isLoading: false,
        }))
        return false
      }
    },
    [state.searchParams],
  )

  // Step 3: Set guest info
  const setGuestInfo = useCallback((info: GuestInfo) => {
    setState((prev) => ({
      ...prev,
      guestInfo: info,
      step: "payment",
    }))
  }, [])

  // Step 4: Complete booking
  const completeBooking = useCallback(async () => {
    if (!state.selectedRoom || !state.selectedHotel || !state.guestInfo || !state.prebookData || !state.searchParams) {
      setState((prev) => ({ ...prev, error: "Missing booking information" }))
      return false
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: state.selectedRoom.code,
          token: state.prebookData.token,
          preBookId: state.prebookData.preBookId,
          dateFrom: format(state.searchParams.checkIn, "yyyy-MM-dd"),
          dateTo: format(state.searchParams.checkOut, "yyyy-MM-dd"),
          hotelId: state.selectedHotel.hotelId,
          adults: state.searchParams.adults,
          children: state.searchParams.children,
          customer: {
            title: state.guestInfo.title,
            firstName: state.guestInfo.firstName,
            lastName: state.guestInfo.lastName,
            email: state.guestInfo.email,
            phone: state.guestInfo.phone,
            country: state.guestInfo.country || "IL",
            city: state.guestInfo.city || "",
            address: state.guestInfo.address || "",
            zip: state.guestInfo.zip || "",
          },
          voucherEmail: state.guestInfo.email,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Booking failed")
      }

      setState((prev) => ({
        ...prev,
        bookingConfirmation: {
          bookingId: data.bookingId,
          supplierReference: data.supplierReference,
          status: data.status,
        },
        step: "confirmation",
        isLoading: false,
      }))

      return true
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Booking failed",
        isLoading: false,
      }))
      return false
    }
  }, [state])

  // Navigation helpers
  const goToStep = useCallback((step: BookingState["step"]) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const reset = useCallback(() => {
    setState({
      step: "search",
      searchParams: null,
      searchResults: [],
      selectedHotel: null,
      selectedRoom: null,
      guestInfo: null,
      prebookData: null,
      bookingConfirmation: null,
      isLoading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  // Calculate nights
  const nights =
    state.searchParams?.checkIn && state.searchParams?.checkOut
      ? Math.ceil(
          (state.searchParams.checkOut.getTime() - state.searchParams.checkIn.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 1

  // Calculate total price
  const totalPrice = state.prebookData?.priceConfirmed || state.selectedRoom?.buyPrice || 0

  return {
    ...state,
    nights,
    totalPrice,
    searchHotels,
    selectRoom,
    setGuestInfo,
    completeBooking,
    goToStep,
    reset,
    clearError,
  }
}
