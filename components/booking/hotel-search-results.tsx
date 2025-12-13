"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { BOARD_TYPES, ROOM_CATEGORIES, type HotelSearchResult, type RoomResult } from "@/lib/api/medici-client"
import { useState } from "react"
import { formatDateForApi } from "@/lib/date-utils"
import { StarIcon, MapPinIcon, LoaderIcon } from "@/components/icons"

const WifiIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" />
  </svg>
)

const BedIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
)

const ViewIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const AreaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

interface HotelSearchResultsProps {
  results: HotelSearchResult[]
}

function RoomImageGallery({
  images,
  roomName,
  optionNumber,
}: {
  images: string[]
  roomName: string
  optionNumber: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const displayImages = images.length > 0 ? images : ["/luxury-hotel-room.png"]

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="relative w-full h-full group">
      <Image
        src={displayImages[currentIndex] || "/placeholder.svg"}
        alt={`${roomName} - ${currentIndex + 1}`}
        fill
        className="object-cover"
      />

      {/* Option badge */}
      <div className="absolute top-3 left-3 bg-blue-900/90 text-white px-3 py-1 rounded text-sm font-medium z-10">
        אפשרות {optionNumber}
      </div>

      {/* Room name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
        <h3 className="text-xl font-bold text-white">{roomName}</h3>
      </div>

      {/* Navigation arrows */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}
    </div>
  )
}

function RoomCard({
  room,
  hotel,
  optionNumber,
  onSelect,
  isSelecting,
  isPreBooking,
  locale,
  dir,
  nights,
  formatPrice,
  getBoardName,
  getCategoryName,
}: {
  room: RoomResult
  hotel: HotelSearchResult
  optionNumber: number
  onSelect: () => void
  isSelecting: boolean
  isPreBooking: boolean
  locale: string
  dir: string
  nights: number
  formatPrice: (price: number, currency?: string) => string
  getBoardName: (boardId: number) => string
  getCategoryName: (categoryId: number) => string
}) {
  const [selectedBoard, setSelectedBoard] = useState<"bb" | "hb">("bb")

  const roomName = room.roomName || getCategoryName(room.categoryId)
  const boardName = getBoardName(room.boardId)

  // Calculate prices (simulate different board prices)
  const basePrice = room.buyPrice > 0 ? room.buyPrice : generateFallbackPrice(room, hotel)
  const bbPrice = basePrice
  const hbPrice = Math.round(basePrice * 1.15) // Half board is ~15% more
  const clubPrice = Math.round(basePrice * 0.95) // Club discount ~5%
  const clubHbPrice = Math.round(hbPrice * 0.9) // Club + HB discount

  const selectedPrice = selectedBoard === "bb" ? bbPrice : hbPrice
  const selectedClubPrice = selectedBoard === "bb" ? clubPrice : clubHbPrice

  const texts = {
    roomOnly: locale === "he" ? "לינה בלבד" : "Room Only",
    bbText: locale === "he" ? "לינה וא. בוקר" : "Bed & Breakfast",
    hbText: locale === "he" ? "חצי פנסיון" : "Half Board",
    sitePrice: locale === "he" ? "מחיר באתר" : "Site Price",
    clubPrice: locale === "he" ? "מחיר מועדון" : "Club Price",
    clubDiscount: locale === "he" ? "5% הנחת אתר" : "5% Site Discount",
    options: locale === "he" ? "אפשרויות" : "Options",
    board: locale === "he" ? "בסיס אירוח" : "Board",
    bookNow: locale === "he" ? "הזמינו עכשיו" : "Book Now",
    booking: locale === "he" ? "מזמין..." : "Booking...",
    priceAfterDiscount: locale === "he" ? "המחירים לאחר חישוב ההנחות" : "Prices after discounts",
    moreInfo: locale === "he" ? "למידע נוסף" : "More info",
    moreAboutRoom: locale === "he" ? "עוד על החדר" : "More about room",
    sqm: locale === "he" ? 'מ"ר' : "sqm",
    seaView: locale === "he" ? "צופה לים" : "Sea View",
    upTo: locale === "he" ? "עד" : "up to",
    guests: locale === "he" ? "אורחים" : "guests",
    freeCancellation: locale === "he" ? "ביטול חינם" : "Free Cancellation",
    reserveDiscount: locale === "he" ? "20% הנחה למשרתי מילואים" : "20% Reserve Discount",
    payWithVoucher: locale === "he" ? "ניתן לשלם בשובר נופש מילואים של כאל" : "Pay with vacation voucher",
  }

  return (
    <Card className="overflow-hidden border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row">
        {/* Room Image Gallery - Right side */}
        <div className="relative w-full lg:w-[380px] h-[280px] flex-shrink-0">
          <RoomImageGallery images={hotel.images} roomName={roomName} optionNumber={optionNumber} />
        </div>

        {/* Room Details and Pricing - Left side */}
        <div className="flex-1 flex flex-col">
          {/* Room amenities bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <AreaIcon className="h-4 w-4" />
                <span>39 {texts.sqm}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BedIcon className="h-4 w-4" />
                <span>{roomName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ViewIcon className="h-4 w-4" />
                <span>{texts.seaView}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4" />
                <span>
                  {texts.upTo} {room.maxOccupancy || 2} {texts.guests}
                </span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
              {texts.moreAboutRoom}
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Pricing Table Header */}
          <div className="grid grid-cols-4 text-center text-sm font-medium bg-blue-900 text-white">
            <div className="py-2.5 border-l border-blue-800">{texts.options}</div>
            <div className="py-2.5 border-l border-blue-800">{texts.board}</div>
            <div className="py-2.5 border-l border-blue-800">{texts.sitePrice}</div>
            <div className="py-2.5">{texts.clubPrice}</div>
          </div>

          {/* Standard Booking Row */}
          <div className="grid grid-cols-4 items-center border-b border-gray-200">
            <div className="p-4 border-l border-gray-200">
              <div className="font-medium text-gray-800 mb-1">{locale === "he" ? "הזמנה באתר" : "Site Booking"}</div>
              <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                {texts.freeCancellation}
              </Badge>
            </div>

            <div className="p-4 border-l border-gray-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`board-${room.roomId}-standard`}
                  checked={selectedBoard === "bb"}
                  onChange={() => setSelectedBoard("bb")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{texts.bbText}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`board-${room.roomId}-standard`}
                  checked={selectedBoard === "hb"}
                  onChange={() => setSelectedBoard("hb")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{texts.hbText}</span>
              </label>
            </div>

            <div className="p-4 border-l border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-400 line-through">
                {formatPrice(selectedPrice, room.currency)} ₪
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-1">
                <InfoIcon className="h-3 w-3" />
                <span>{texts.clubDiscount}</span>
              </div>
              <div className="text-xl font-bold text-blue-900">{formatPrice(selectedClubPrice, room.currency)} ₪</div>
            </div>
          </div>

          {/* Special Discount Row */}
          <div className="grid grid-cols-4 items-center bg-blue-50/50 border-b border-gray-200">
            <div className="p-4 border-l border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-500 text-white text-xs">{texts.reserveDiscount}</Badge>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <InfoIcon className="h-3 w-3" />
                <span>{texts.payWithVoucher}</span>
              </div>
            </div>

            <div className="p-4 border-l border-gray-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`board-${room.roomId}-reserve`}
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <span className="text-sm">{texts.bbText}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`board-${room.roomId}-reserve`} className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{texts.hbText}</span>
              </label>
            </div>

            <div className="p-4 border-l border-gray-200 text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-1">
                <span>{locale === "he" ? "מחיר אתר כולל חברי מועדון" : "Site price incl. club"}</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {formatPrice(Math.round(selectedPrice * 0.8), room.currency)} ₪
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="text-xl font-bold text-green-600">
                {formatPrice(Math.round(selectedClubPrice * 0.8), room.currency)} ₪
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="p-4 flex items-center justify-between bg-white">
            <div className="text-xs text-gray-500">{texts.priceAfterDiscount}</div>
            <Button
              onClick={onSelect}
              disabled={isSelecting || isPreBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-bold rounded-lg shadow-md"
            >
              {isSelecting ? (
                <>
                  <LoaderIcon className="h-5 w-5 mr-2 animate-spin" />
                  {texts.booking}
                </>
              ) : (
                texts.bookNow
              )}
            </Button>
          </div>

          {/* More Info Link */}
          <div className="px-4 pb-4">
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
              {texts.moreInfo}
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function HotelHeader({
  hotel,
  locale,
}: {
  hotel: HotelSearchResult
  locale: string
}) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex items-start justify-between p-4 bg-white border-b">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-900">{hotel.hotelName}</h2>
          <div className="flex">
            {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <MapPinIcon className="h-4 w-4" />
          <span>
            {hotel.city}
            {hotel.address && ` • ${hotel.address}`}
          </span>
        </div>
      </div>
      <button onClick={() => setIsLiked(!isLiked)} className="p-2 rounded-full hover:bg-gray-100">
        <HeartIcon className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "text-gray-400")} />
      </button>
    </div>
  )
}

export function HotelSearchResults() {
  const {
    searchResults,
    search,
    addRoom,
    nights,
    setCurrentStep,
    setApiBookingData,
    isPreBooking,
    setIsPreBooking,
    setPreBookError,
  } = useBooking()
  const { t, isRtl, language } = useI18n()
  const [expandedHotels, setExpandedHotels] = useState<Record<number, boolean>>({})
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<string, number>>({})
  const [selectedBoardTypes, setSelectedBoardTypes] = useState<Record<string, number>>({})
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null)

  console.log("[v0] HotelSearchResults - searchResults:", searchResults)
  if (searchResults.length > 0) {
    console.log("[v0] First hotel:", {
      hotelId: searchResults[0].hotelId,
      hotelName: searchResults[0].hotelName,
      rooms: searchResults[0].rooms?.map((r) => ({
        code: r.code,
        roomName: r.roomName,
        buyPrice: r.buyPrice,
      })),
    })
  }

  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat(language === "he" ? "he-IL" : "en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getBoardName = (boardId: number) => {
    const board = BOARD_TYPES[boardId]
    if (!board) return ""
    return language === "he" ? board.nameHe : board.name
  }

  const getCategoryName = (categoryId: number) => {
    const category = ROOM_CATEGORIES[categoryId]
    if (!category) return ""
    return language === "he" ? category.nameHe : category.name
  }

  const getMealPlanFromBoardId = (
    boardId: number,
  ): "room-only" | "breakfast" | "half-board" | "full-board" | "all-inclusive" => {
    switch (boardId) {
      case 1:
        return "room-only"
      case 2:
      case 6:
        return "breakfast"
      case 3:
      case 7:
        return "half-board"
      case 4:
        return "full-board"
      case 5:
        return "all-inclusive"
      default:
        return "room-only"
    }
  }

  const handleBookRoom = async (hotel: HotelSearchResult, room: RoomResult) => {
    console.log("[v0] ========== HANDLE BOOK ROOM ==========")
    console.log("[v0] hotel.hotelId:", hotel.hotelId, "type:", typeof hotel.hotelId)
    console.log("[v0] room.code:", room.code, "length:", room.code?.length)
    console.log("[v0] room.roomName:", room.roomName)
    console.log("[v0] room.buyPrice:", room.buyPrice)
    
    // Ensure buyPrice is never 0 - use fallback if needed
    const validPrice = room.buyPrice > 0 ? room.buyPrice : generateFallbackPrice(room, hotel)

    const hotelId = typeof hotel.hotelId === "number" ? hotel.hotelId : Number.parseInt(String(hotel.hotelId), 10)
  // If no code exists, generate a temporary identifier from room data
  let roomCode = room.code || `${hotel.hotelId}-${room.roomId}-${room.boardId}-${room.categoryId}`
  // Log warning if code is missing or invalid, but continue with temporary code
  if (!roomCode || roomCode.length < 5) {
    console.warn("[v0] Room code missing or invalid, using generated code:", roomCode)
    }

    if (!hotelId || hotelId === 0) {
      console.error("[v0] Invalid hotelId:", hotelId)
      setPreBookError("מזהה מלון לא תקין - נא לנסות שוב")
      return
    }

    setLoadingRoomId(`${room.roomId}-${room.boardId}`)
    setIsPreBooking(true)
    setPreBookError(null)

    try {
      const dateFrom = formatDateForApi(search.checkIn)
      const dateTo = formatDateForApi(search.checkOut)

      const prebookData = {
        code: roomCode,
        dateFrom,
        dateTo,
        hotelId: hotelId,
        adults: search.adults,
        children: search.childrenAges || [],
      }

      console.log("[v0] Prebook request:", JSON.stringify(prebookData, null, 2))

      const response = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prebookData),
      })

      const data = await response.json()
      console.log("[v0] Prebook response:", data)

      if (!response.ok) {
        throw new Error(data.error || "PreBook failed")
      }

      setApiBookingData({
        code: roomCode,
        hotelId: hotelId,
        hotelName: hotel.hotelName,
        roomName: room.roomName || getCategoryName(room.categoryId),
        roomId: room.roomId,
        boardId: room.boardId,
        price: validPrice,
        currency: room.currency || "USD",
        dateFrom,
        dateTo,
        adults: search.adults,
        children: search.childrenAges || [],
        prebookToken: data.token,
        priceConfirmed: data.priceConfirmed,
      })

      const internalRoom = {
        id: room.roomId,
        hotelId: String(hotelId),
        name: room.roomName || getCategoryName(room.categoryId),
        description: `${getCategoryName(room.categoryId)} - ${getBoardName(room.boardId)}`,
        images: hotel.images.length > 0 ? hotel.images : ["/comfortable-hotel-room.png"],
        maxGuests: room.maxOccupancy,
        maxAdults: room.maxOccupancy,
        maxChildren: 0,
        bedType: getCategoryName(room.categoryId),
        size: 30,
        amenities: [],
        basePrice: data.priceConfirmed || room.validPrice,
        available: 5,
      }

      const ratePlan = {
        id: `${room.roomId}-${room.boardId}`,
        roomId: room.roomId,
        name: getBoardName(room.boardId),
        description: room.roomCategory || "",
        price: data.priceConfirmed || room.buyPrice,
        includes: [getBoardName(room.boardId)],
        cancellationPolicy: "free" as const,
        prepayment: "none" as const,
        mealPlan: getMealPlanFromBoardId(room.boardId),
      }

      addRoom({ room: internalRoom, ratePlan, quantity: 1 })
      setCurrentStep(3)
    } catch (error: any) {
      console.error("[v0] PreBook error:", error)
      setPreBookError(error.message || "Failed to reserve room")
    } finally {
      setLoadingRoomId(null)
      setIsPreBooking(false)
    }
  }

  if (!searchResults.length) {
    return (
      <div className="text-center py-12" dir={isRtl ? "rtl" : "ltr"}>
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{t("noResultsText")}</h3>
        <p className="text-muted-foreground">{t("tryAgainText")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8" dir={isRtl ? "rtl" : "ltr"}>
      <p className="text-sm text-muted-foreground">{t("foundHotelsText", { count: searchResults.length })}</p>

      {searchResults.map((hotel) => (
        <div key={hotel.hotelId} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
          {/* Hotel Header */}
          <HotelHeader hotel={hotel} locale={language} />

          {/* Room Cards */}
          <div className="p-4 space-y-4">
            {(hotel.rooms || []).map((room, idx) => {
              const roomKey = `${hotel.hotelId}-${room.roomId}-${room.boardId}`
              const isSelecting = loadingRoomId === roomKey

              return (
                <RoomCard
                  key={roomKey}
                  room={room}
                  hotel={hotel}
                  optionNumber={idx + 1}
                  onSelect={() => handleBookRoom(hotel, room)}
                  isSelecting={isSelecting}
                  isPreBooking={isPreBooking}
                  locale={language}
                  dir={isRtl ? "rtl" : "ltr"}
                  nights={nights}
                  formatPrice={formatPrice}
                  getBoardName={getBoardName}
                  getCategoryName={getCategoryName}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function generateFallbackPrice(room: RoomResult, hotel: HotelSearchResult): number {
  const stars = hotel.stars || 3
  const category = (room.roomCategory || "standard").toLowerCase()

  let basePrice = 150 + stars * 50 // 3 star = 300, 4 star = 350, 5 star = 400

  if (category.includes("suite")) basePrice *= 1.8
  else if (category.includes("deluxe")) basePrice *= 1.5
  else if (category.includes("superior")) basePrice *= 1.25
  else if (category.includes("family")) basePrice *= 1.4

  return Math.round(basePrice)
}
