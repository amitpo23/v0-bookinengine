"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { BOARD_TYPES, ROOM_CATEGORIES, type HotelSearchResult, type RoomResult } from "@/lib/api/medici-client"
import { useState } from "react"
import { formatDateForApi } from "@/lib/date-utils"
import { StarIcon, MapPinIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon, LoaderIcon } from "@/components/icons"

// ... existing icon components ...

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

const ParkingIcon = ({ className }: { className?: string }) => (
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
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
)

const PoolIcon = ({ className }: { className?: string }) => (
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
    <path d="M2 12h20" />
    <path d="M2 16c.5.5 1 1 2 1s1.5-.5 2-1 1-1 2-1 1.5.5 2 1 1 1 2 1 1.5-.5 2-1 1-1 2-1 1.5.5 2 1 1 1 2 1" />
    <path d="M12 12V4" />
    <path d="M8 8h8" />
  </svg>
)

const RestaurantIcon = ({ className }: { className?: string }) => (
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
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
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

// ... existing icons (StarIcon, MapPinIcon, etc.) ...

interface HotelSearchResultsProps {
  results: HotelSearchResult[]
}

function ImageGallery({ images, hotelName }: { images: string[]; hotelName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const hasImages = images && images.length > 0
  const displayImages = hasImages ? images : ["/luxury-hotel-room.png"]

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
        alt={`${hotelName} - ${currentIndex + 1}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Like button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsLiked(!isLiked)
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
      >
        <HeartIcon className={cn("h-5 w-5", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
      </button>

      {/* Navigation arrows */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {displayImages.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75",
                )}
              />
            ))}
            {displayImages.length > 5 && <span className="text-white text-xs ml-1">+{displayImages.length - 5}</span>}
          </div>
        </>
      )}

      {/* Image count badge */}
      {displayImages.length > 1 && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs z-10">
          {currentIndex + 1} / {displayImages.length}
        </div>
      )}
    </div>
  )
}

function FacilitiesBar({ facilities }: { facilities: string[] }) {
  const facilityIcons: Record<string, React.ReactNode> = {
    wifi: <WifiIcon className="h-4 w-4" />,
    parking: <ParkingIcon className="h-4 w-4" />,
    pool: <PoolIcon className="h-4 w-4" />,
    restaurant: <RestaurantIcon className="h-4 w-4" />,
  }

  // Map common facility names
  const getFacilityIcon = (facility: string) => {
    const lower = facility.toLowerCase()
    if (lower.includes("wifi") || lower.includes("internet")) return facilityIcons.wifi
    if (lower.includes("parking")) return facilityIcons.parking
    if (lower.includes("pool") || lower.includes("swimming")) return facilityIcons.pool
    if (lower.includes("restaurant") || lower.includes("dining")) return facilityIcons.restaurant
    return null
  }

  const displayFacilities = facilities.slice(0, 4)

  if (!facilities.length) {
    // Show default facilities
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="flex items-center gap-1" title="WiFi">
          <WifiIcon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1" title="Parking">
          <ParkingIcon className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      {displayFacilities.map((facility, idx) => {
        const icon = getFacilityIcon(facility)
        return icon ? (
          <div key={idx} className="flex items-center gap-1" title={facility}>
            {icon}
          </div>
        ) : null
      })}
      {facilities.length > 4 && <span className="text-xs">+{facilities.length - 4}</span>}
    </div>
  )
}

export function HotelSearchResults({ results }: HotelSearchResultsProps) {
  const { locale, dir } = useI18n()
  const { addRoom, nights, search, setCurrentStep, setApiBookingData, isPreBooking, setIsPreBooking, setPreBookError } =
    useBooking()
  const [expandedHotel, setExpandedHotel] = useState<number | null>(null)
  const [selectingRoom, setSelectingRoom] = useState<string | null>(null)

  // ... existing text translations ...
  const noResultsText = locale === "he" ? "לא נמצאו תוצאות" : "No results found"
  const tryAgainText = locale === "he" ? "נסה לשנות את פרטי החיפוש" : "Try changing your search criteria"
  const roomsText = locale === "he" ? "חדרים זמינים" : "Available Rooms"
  const fromText = locale === "he" ? "החל מ-" : "From "
  const perNightText = locale === "he" ? "/ לילה" : "/ night"
  const selectText = locale === "he" ? "בחר והמשך" : "Select & Continue"
  const selectingText = locale === "he" ? "בודק זמינות..." : "Checking availability..."
  const showRoomsText = locale === "he" ? "הצג חדרים" : "Show Rooms"
  const hideRoomsText = locale === "he" ? "הסתר חדרים" : "Hide Rooms"
  const freeCancellationText = locale === "he" ? "ביטול חינם" : "Free Cancellation"

  // ... existing helper functions (formatPrice, getBoardName, etc.) ...

  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getBoardName = (boardId: number) => {
    const board = BOARD_TYPES[boardId]
    if (!board) return ""
    return locale === "he" ? board.nameHe : board.name
  }

  const getCategoryName = (categoryId: number) => {
    const category = ROOM_CATEGORIES[categoryId]
    if (!category) return ""
    return locale === "he" ? category.nameHe : category.name
  }

  const getLowestPrice = (rooms: RoomResult[]) => {
    if (!rooms.length) return 0
    const prices = rooms.map((r) => r.buyPrice).filter((p) => p > 0)
    return prices.length > 0 ? Math.min(...prices) : 0
  }

  // ... existing handleSelectRoom and getMealPlanFromBoardId functions ...

  const handleSelectRoom = async (hotel: HotelSearchResult, room: RoomResult) => {
    const roomKey = `${hotel.hotelId}-${room.roomId}-${room.boardId}`
    setSelectingRoom(roomKey)
    setIsPreBooking(true)
    setPreBookError(null)

    try {
      const dateFrom = formatDateForApi(search.checkIn)
      const dateTo = formatDateForApi(search.checkOut)

      const response = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: room.code,
          dateFrom,
          dateTo,
          hotelId: hotel.hotelId,
          adults: search.adults,
          children: search.childrenAges || [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "PreBook failed")
      }

      setApiBookingData({
        code: room.code,
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        roomName: room.roomName || getCategoryName(room.categoryId),
        roomId: room.roomId,
        boardId: room.boardId,
        price: room.buyPrice,
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
        hotelId: String(hotel.hotelId),
        name: room.roomName || getCategoryName(room.categoryId),
        description: `${getCategoryName(room.categoryId)} - ${getBoardName(room.boardId)}`,
        images: hotel.images.length > 0 ? hotel.images : ["/comfortable-hotel-room.png"],
        maxGuests: room.maxOccupancy,
        maxAdults: room.maxOccupancy,
        maxChildren: 0,
        bedType: getCategoryName(room.categoryId),
        size: 30,
        amenities: [],
        basePrice: data.priceConfirmed || room.buyPrice,
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
      setSelectingRoom(null)
      setIsPreBooking(false)
    }
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

  if (!results.length) {
    return (
      <div className="text-center py-12" dir={dir}>
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{noResultsText}</h3>
        <p className="text-muted-foreground">{tryAgainText}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={dir}>
      <p className="text-sm text-muted-foreground">
        {locale === "he" ? `נמצאו ${results.length} מלונות` : `Found ${results.length} hotels`}
      </p>

      {results.map((hotel) => {
        const lowestPrice = getLowestPrice(hotel.rooms || [])

        return (
          <Card
            key={hotel.hotelId}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Gallery */}
              <div className="relative w-full md:w-80 h-56 md:h-auto flex-shrink-0 bg-muted">
                <ImageGallery images={hotel.images} hotelName={hotel.hotelName} />
                {/* Free cancellation badge */}
                <Badge className="absolute bottom-3 left-3 bg-green-600 text-white border-0 z-10">
                  {freeCancellationText}
                </Badge>
              </div>

              <CardContent className="flex-1 p-5">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Hotel name and stars */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{hotel.hotelName}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                              <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                            ))}
                          </div>
                          {hotel.stars > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {hotel.stars} {locale === "he" ? "כוכבים" : "stars"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {hotel.city}
                        {hotel.address && ` • ${hotel.address}`}
                      </span>
                    </div>

                    {/* Description */}
                    {hotel.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{hotel.description}</p>
                    )}

                    {/* Facilities */}
                    <FacilitiesBar facilities={hotel.facilities} />
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {hotel.rooms?.length || 0} {roomsText}
                      </Badge>
                    </div>

                    <div className={cn("flex flex-col gap-2", dir === "rtl" ? "items-start" : "items-end")}>
                      {lowestPrice > 0 && (
                        <div className={dir === "rtl" ? "text-left" : "text-right"}>
                          <span className="text-sm text-muted-foreground">{fromText}</span>
                          <div className="text-2xl font-bold text-primary">{formatPrice(lowestPrice)}</div>
                          <span className="text-xs text-muted-foreground">{perNightText}</span>
                        </div>
                      )}
                      <Button
                        variant={expandedHotel === hotel.hotelId ? "outline" : "default"}
                        onClick={() => setExpandedHotel(expandedHotel === hotel.hotelId ? null : hotel.hotelId)}
                        className="min-w-[140px]"
                      >
                        {expandedHotel === hotel.hotelId ? (
                          <>
                            {hideRoomsText}
                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            {showRoomsText}
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Expanded rooms list */}
            {expandedHotel === hotel.hotelId && hotel.rooms && (
              <div className="border-t border-border bg-muted/30">
                <div className="divide-y divide-border">
                  {hotel.rooms.map((room, idx) => {
                    const roomKey = `${hotel.hotelId}-${room.roomId}-${room.boardId}`
                    const isSelecting = selectingRoom === roomKey

                    return (
                      <div key={`${room.roomId}-${idx}`} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">
                              {room.roomName || getCategoryName(room.categoryId)}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-sm">
                              <Badge variant="outline">{getCategoryName(room.categoryId)}</Badge>
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              >
                                {getBoardName(room.boardId)}
                              </Badge>
                              {room.maxOccupancy && (
                                <Badge variant="outline">
                                  👥{" "}
                                  {locale === "he"
                                    ? `עד ${room.maxOccupancy} אורחים`
                                    : `Up to ${room.maxOccupancy} guests`}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                              <CheckIcon className="h-4 w-4" />
                              <span>{freeCancellationText}</span>
                            </div>
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-4",
                              dir === "rtl" ? "flex-row-reverse md:flex-row" : "",
                            )}
                          >
                            <div className={dir === "rtl" ? "text-left" : "text-right"}>
                              <div className="text-2xl font-bold text-foreground">
                                {formatPrice(room.buyPrice, room.currency)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {nights > 1
                                  ? locale === "he"
                                    ? `ל-${nights} לילות`
                                    : `for ${nights} nights`
                                  : perNightText}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleSelectRoom(hotel, room)}
                              disabled={isSelecting || isPreBooking}
                              className="min-w-[130px]"
                              size="lg"
                            >
                              {isSelecting ? (
                                <>
                                  <LoaderIcon className="h-4 w-4 mr-2" />
                                  {selectingText}
                                </>
                              ) : (
                                selectText
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
