"use client"

import { useState, useMemo } from "react"
import { EnhancedRoomCard } from "./enhanced-room-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Search,
  X,
  CheckCircle2,
  Wifi,
  Coffee,
  Utensils,
  Star,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface SearchResultsContainerProps {
  rooms: any[]
  nights: number
  onSelectOffer: (room: any, offer: any) => void
  isLoading?: boolean
  currency?: string
  hotelName?: string
  hotelRating?: number
}

export function EnhancedSearchResults({
  rooms,
  nights,
  onSelectOffer,
  isLoading,
  currency = "₪",
  hotelName,
  hotelRating,
}: SearchResultsContainerProps) {
  const [sortBy, setSortBy] = useState<string>("price-low")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    board: string[]
    amenities: string[]
    maxPrice: number | null
    refundable: boolean | null
  }>({
    board: [],
    amenities: [],
    maxPrice: null,
    refundable: null,
  })

  // Available filters from data
  const availableFilters = useMemo(() => {
    const boardTypes = new Set<string>()
    const amenitiesSet = new Set<string>()

    rooms.forEach((room) => {
      room.offers?.forEach((offer: any) => {
        boardTypes.add(offer.board)
      })
      room.amenities?.forEach((amenity: any) => {
        amenitiesSet.add(amenity.label)
      })
    })

    return {
      board: Array.from(boardTypes),
      amenities: Array.from(amenitiesSet),
    }
  }, [rooms])

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Filter by board type
      if (selectedFilters.board.length > 0) {
        const hasMatchingBoard = room.offers?.some((offer: any) =>
          selectedFilters.board.includes(offer.board)
        )
        if (!hasMatchingBoard) return false
      }

      // Filter by amenities
      if (selectedFilters.amenities.length > 0) {
        const hasAllAmenities = selectedFilters.amenities.every((amenity) =>
          room.amenities?.some((a: any) => a.label === amenity)
        )
        if (!hasAllAmenities) return false
      }

      // Filter by max price
      if (selectedFilters.maxPrice) {
        const minPrice = Math.min(...(room.offers?.map((o: any) => o.price) || [Infinity]))
        if (minPrice > selectedFilters.maxPrice) return false
      }

      // Filter by refundable
      if (selectedFilters.refundable !== null) {
        const hasRefundable = room.offers?.some((offer: any) => offer.refundable)
        if (selectedFilters.refundable && !hasRefundable) return false
      }

      return true
    })
  }, [rooms, selectedFilters])

  // Sort rooms
  const sortedRooms = useMemo(() => {
    const sorted = [...filteredRooms]

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => {
          const minPriceA = Math.min(...(a.offers?.map((o: any) => o.price) || [Infinity]))
          const minPriceB = Math.min(...(b.offers?.map((o: any) => o.price) || [Infinity]))
          return minPriceA - minPriceB
        })
      case "price-high":
        return sorted.sort((a, b) => {
          const minPriceA = Math.min(...(a.offers?.map((o: any) => o.price) || [Infinity]))
          const minPriceB = Math.min(...(b.offers?.map((o: any) => o.price) || [Infinity]))
          return minPriceB - minPriceA
        })
      case "size":
        return sorted.sort((a, b) => (b.size || 0) - (a.size || 0))
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name, "he"))
      default:
        return sorted
    }
  }, [filteredRooms, sortBy])

  const toggleFilter = (filterType: "board" | "amenities", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      board: [],
      amenities: [],
      maxPrice: null,
      refundable: null,
    })
  }

  const activeFiltersCount =
    selectedFilters.board.length +
    selectedFilters.amenities.length +
    (selectedFilters.maxPrice ? 1 : 0) +
    (selectedFilters.refundable !== null ? 1 : 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">מחפש חדרים זמינים...</p>
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">לא נמצאו חדרים זמינים</h3>
          <p className="text-gray-600">נסה לשנות את תאריכי החיפוש או מספר האורחים</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header with Results Count and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              נמצאו {filteredRooms.length} חדרים זמינים
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {nights} לילות • {hotelName || "תוצאות החיפוש"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="w-4 h-4 ml-2" />
                <SelectValue placeholder="מיין לפי" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>מחיר: נמוך לגבוה</span>
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>מחיר: גבוה לנמוך</span>
                  </div>
                </SelectItem>
                <SelectItem value="size">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>גודל חדר</span>
                  </div>
                </SelectItem>
                <SelectItem value="name">
                  <div className="flex items-center gap-2">
                    <span>שם</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle Button */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2",
                showFilters && "bg-teal-600 hover:bg-teal-700"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>סינון</span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-white text-teal-700 border-0 mr-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel - Expandable */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Board Type Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-teal-600" />
                  בסיס אירוח
                </h4>
                <div className="space-y-2">
                  {availableFilters.board.map((board) => (
                    <label
                      key={board}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.board.includes(board)}
                        onChange={() => toggleFilter("board", board)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{board}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-teal-600" />
                  שירותים
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableFilters.amenities.slice(0, 5).map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.amenities.includes(amenity)}
                        onChange={() => toggleFilter("amenities", amenity)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-600" />
                  אפשרויות נוספות
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedFilters.refundable === true}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          refundable: e.target.checked ? true : null,
                        }))
                      }
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">ביטול חינם</span>
                  </label>

                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      מחיר מקסימלי ללילה
                    </label>
                    <input
                      type="number"
                      placeholder="ללא הגבלה"
                      value={selectedFilters.maxPrice || ""}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  נקה את כל הסינונים ({activeFiltersCount})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && !showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedFilters.board.map((board) => (
              <Badge
                key={board}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-gray-300"
                onClick={() => toggleFilter("board", board)}
              >
                {board}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedFilters.amenities.map((amenity) => (
              <Badge
                key={amenity}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-gray-300"
                onClick={() => toggleFilter("amenities", amenity)}
              >
                {amenity}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedFilters.refundable && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-gray-300"
                onClick={() =>
                  setSelectedFilters((prev) => ({ ...prev, refundable: null }))
                }
              >
                ביטול חינם
                <X className="w-3 h-3" />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Room Cards List */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            לא נמצאו חדרים המתאימים לסינון
          </h3>
          <p className="text-gray-600 mb-4">נסה להקל על הסינון או לנקות אותו לחלוטין</p>
          <Button onClick={clearAllFilters} variant="outline">
            נקה סינון
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedRooms.map((room, index) => (
            <EnhancedRoomCard
              key={room.id || index}
              name={room.name}
              images={room.images}
              size={room.size}
              maxGuests={room.maxGuests}
              guestDescription={room.guestDescription}
              amenities={room.amenities}
              offers={room.offers}
              remainingRooms={room.remainingRooms}
              onSelectOffer={(offer) => onSelectOffer(room, offer)}
              currency={currency}
              nights={nights}
              hotelRating={hotelRating}
              hotelName={hotelName}
            />
          ))}
        </div>
      )}
    </div>
  )
}
