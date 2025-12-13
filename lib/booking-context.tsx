"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { BookingSearch, SelectedRoom, GuestDetails, Hotel } from "@/types/booking"
import { addDays } from "@/lib/date-utils"
import type { HotelSearchResult } from "@/lib/api/medici-client"

interface ApiBookingData {
  code: string
  hotelId: number
  hotelName: string
  roomName: string
  roomId: string
  boardId: number
  price: number
  currency: string
  dateFrom: string
  dateTo: string
  adults: number
  children: number[]
  prebookToken?: string
  priceConfirmed?: number
}

interface BookingContextType {
  hotel: Hotel | null
  setHotel: (hotel: Hotel) => void
  search: BookingSearch
  setSearch: (search: BookingSearch) => void
  selectedRooms: SelectedRoom[]
  addRoom: (room: SelectedRoom) => void
  removeRoom: (roomId: string, ratePlanId: string) => void
  updateRoomQuantity: (roomId: string, ratePlanId: string, quantity: number) => void
  clearRooms: () => void
  guestDetails: GuestDetails | null
  setGuestDetails: (details: GuestDetails) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  nights: number
  totalPrice: number
  searchResults: HotelSearchResult[]
  setSearchResults: (results: HotelSearchResult[]) => void
  isSearching: boolean
  setIsSearching: (loading: boolean) => void
  searchError: string | null
  setSearchError: (error: string | null) => void
  apiBookingData: ApiBookingData | null
  setApiBookingData: (data: ApiBookingData | null) => void
  isPreBooking: boolean
  setIsPreBooking: (loading: boolean) => void
  preBookError: string | null
  setPreBookError: (error: string | null) => void
  bookingConfirmation: { confirmationCode: string; bookingId: string } | null
  setBookingConfirmation: (data: { confirmationCode: string; bookingId: string } | null) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children, initialHotel }: { children: ReactNode; initialHotel?: Hotel }) {
  const [hotel, setHotel] = useState<Hotel | null>(initialHotel || null)
  const [search, setSearch] = useState<BookingSearch>({
    hotelId: initialHotel?.id || "",
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
    adults: 2,
    children: 0,
    childrenAges: [],
    rooms: 1,
    city: "",
    hotelName: "",
  })
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([])
  const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [apiBookingData, setApiBookingData] = useState<ApiBookingData | null>(null)
  const [isPreBooking, setIsPreBooking] = useState(false)
  const [preBookError, setPreBookError] = useState<string | null>(null)
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    confirmationCode: string
    bookingId: string
  } | null>(null)

  const nights = Math.ceil(
    (new Date(search.checkOut).getTime() - new Date(search.checkIn).getTime()) / (1000 * 60 * 60 * 24),
  )

  const totalPrice =
    apiBookingData?.priceConfirmed ||
    apiBookingData?.price ||
    selectedRooms.reduce((sum, sr) => sum + sr.ratePlan.price * sr.quantity * nights, 0)

  const addRoom = (room: SelectedRoom) => {
    setSelectedRooms((prev) => {
      const existing = prev.find((r) => r.room.id === room.room.id && r.ratePlan.id === room.ratePlan.id)
      if (existing) {
        return prev.map((r) =>
          r.room.id === room.room.id && r.ratePlan.id === room.ratePlan.id
            ? { ...r, quantity: r.quantity + room.quantity }
            : r,
        )
      }
      return [...prev, room]
    })
  }

  const removeRoom = (roomId: string, ratePlanId: string) => {
    setSelectedRooms((prev) => prev.filter((r) => !(r.room.id === roomId && r.ratePlan.id === ratePlanId)))
  }

  const updateRoomQuantity = (roomId: string, ratePlanId: string, quantity: number) => {
    if (quantity <= 0) {
      removeRoom(roomId, ratePlanId)
      return
    }
    setSelectedRooms((prev) =>
      prev.map((r) => (r.room.id === roomId && r.ratePlan.id === ratePlanId ? { ...r, quantity } : r)),
    )
  }

  const clearRooms = () => setSelectedRooms([])

  return (
    <BookingContext.Provider
      value={{
        hotel,
        setHotel,
        search,
        setSearch,
        selectedRooms,
        addRoom,
        removeRoom,
        updateRoomQuantity,
        clearRooms,
        guestDetails,
        setGuestDetails,
        currentStep,
        setCurrentStep,
        nights,
        totalPrice,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        searchError,
        setSearchError,
        apiBookingData,
        setApiBookingData,
        isPreBooking,
        setIsPreBooking,
        preBookError,
        setPreBookError,
        bookingConfirmation,
        setBookingConfirmation,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
