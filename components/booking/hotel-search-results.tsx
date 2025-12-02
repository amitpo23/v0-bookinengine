"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { BOARD_TYPES, ROOM_CATEGORIES, type HotelSearchResult, type RoomResult } from "@/lib/api/medici-client"
import { useState } from "react"

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
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
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
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
    <path d="m18 15-6-6-6 6" />
  </svg>
)

interface HotelSearchResultsProps {
  results: HotelSearchResult[]
}

export function HotelSearchResults({ results }: HotelSearchResultsProps) {
  const { locale, dir } = useI18n()
  const { addRoom, nights } = useBooking()
  const [expandedHotel, setExpandedHotel] = useState<number | null>(null)

  const noResultsText = locale === "he" ? "לא נמצאו תוצאות" : "No results found"
  const tryAgainText = locale === "he" ? "נסה לשנות את פרטי החיפוש" : "Try changing your search criteria"
  const roomsText = locale === "he" ? "חדרים זמינים" : "Available Rooms"
  const fromText = locale === "he" ? "החל מ-" : "From "
  const perNightText = locale === "he" ? "/ לילה" : "/ night"
  const selectText = locale === "he" ? "בחר" : "Select"
  const showRoomsText = locale === "he" ? "הצג חדרים" : "Show Rooms"
  const hideRoomsText = locale === "he" ? "הסתר חדרים" : "Hide Rooms"

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
    return Math.min(...rooms.map((r) => r.buyPrice))
  }

  const handleSelectRoom = (hotel: HotelSearchResult, room: RoomResult) => {
    const internalRoom = {
      id: room.roomId,
      hotelId: String(hotel.hotelId),
      name: room.roomName || getCategoryName(room.categoryId),
      description: `${getCategoryName(room.categoryId)} - ${getBoardName(room.boardId)}`,
      images: [hotel.imageUrl || "/comfortable-hotel-room.png"],
      maxGuests: room.maxOccupancy,
      maxAdults: room.maxOccupancy,
      maxChildren: 0,
      bedType: getCategoryName(room.categoryId),
      size: 30,
      amenities: [],
      basePrice: room.buyPrice,
      available: 5,
    }

    const ratePlan = {
      id: `${room.roomId}-${room.boardId}`,
      roomId: room.roomId,
      name: getBoardName(room.boardId),
      description: room.roomCategory || "",
      price: room.buyPrice,
      includes: [getBoardName(room.boardId)],
      cancellationPolicy: "free" as const,
      prepayment: "none" as const,
      mealPlan: getMealPlanFromBoardId(room.boardId),
    }

    addRoom({ room: internalRoom, ratePlan, quantity: 1 })
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
    <div className="space-y-4" dir={dir}>
      <p className="text-sm text-muted-foreground">
        {locale === "he" ? `נמצאו ${results.length} מלונות` : `Found ${results.length} hotels`}
      </p>

      {results.map((hotel) => (
        <Card key={hotel.hotelId} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
              <Image
                src={hotel.imageUrl || "/placeholder.svg?height=300&width=400&query=luxury hotel"}
                alt={hotel.hotelName}
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="flex-1 p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">{hotel.hotelName}</h3>
                    <div className="flex items-center">
                      {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{hotel.city}</span>
                    {hotel.address && <span className="mx-1">•</span>}
                    {hotel.address && <span>{hotel.address}</span>}
                  </div>

                  <Badge variant="secondary" className="mb-3">
                    {hotel.rooms?.length || 0} {roomsText}
                  </Badge>
                </div>

                <div className={cn("flex flex-col gap-2", dir === "rtl" ? "md:items-start" : "md:items-end")}>
                  <div className={dir === "rtl" ? "text-left" : "text-right"}>
                    <span className="text-sm text-muted-foreground">{fromText}</span>
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(getLowestPrice(hotel.rooms || []))}
                    </div>
                    <span className="text-xs text-muted-foreground">{perNightText}</span>
                  </div>
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
            </CardContent>
          </div>

          {expandedHotel === hotel.hotelId && hotel.rooms && (
            <div className="border-t border-border">
              <div className="divide-y divide-border">
                {hotel.rooms.map((room, idx) => (
                  <div key={`${room.roomId}-${idx}`} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {room.roomName || getCategoryName(room.categoryId)}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{getCategoryName(room.categoryId)}</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {getBoardName(room.boardId)}
                          </Badge>
                          {room.maxOccupancy && (
                            <span>
                              👥{" "}
                              {locale === "he" ? `עד ${room.maxOccupancy} אורחים` : `Up to ${room.maxOccupancy} guests`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={cn("flex items-center gap-4", dir === "rtl" ? "flex-row-reverse md:flex-row" : "")}
                      >
                        <div className={dir === "rtl" ? "text-left" : "text-right"}>
                          <div className="text-xl font-bold text-foreground">
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
                        <Button onClick={() => handleSelectRoom(hotel, room)}>{selectText}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
