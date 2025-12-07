"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EnhancedHotelCardProps {
  hotel: {
    code?: string
    name: string
    hotelName?: string
    hotelId?: number
    location?: string
    city?: string
    price?: number
    pricePerNight?: number
    currency?: string
    rating?: number
    stars?: number
    roomType?: string
    room_type?: string
    board?: string
    meals?: string
    cancellation?: { type: string } | string
    image?: string
    images?: string[]
    facilities?: string[]
    amenities?: string[]
    description?: string
  }
  isRtl: boolean
  darkMode?: boolean
  onSelect: (room: any) => void
  searchContext?: {
    dateFrom: string
    dateTo: string
    adults: number
    children: number[]
  }
  showEnhancedInfo?: boolean
}

interface HotelInfo {
  description: string
  highlights: string[]
  amenities: string[]
  nearbyAttractions: string[]
  rating: number
  priceRange: string
  checkInTime: string
  checkOutTime: string
  imageQuery: string
}

// Icons
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={cn("w-4 h-4", filled ? "text-amber-400 fill-amber-400" : "text-slate-600")}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={cn("w-5 h-5", filled ? "text-rose-500 fill-rose-500" : "text-white")}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const WifiIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
  </svg>
)

const PoolIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12h20M2 18h20M12 2v20" />
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L13.4 8.6L19 10L13.4 11.4L12 17L10.6 11.4L5 10L10.6 8.6L12 3Z" />
    <path d="M5 3L5.5 5L7.5 5.5L5.5 6L5 8L4.5 6L2.5 5.5L4.5 5L5 3Z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const InfoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin text-emerald-400" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export function EnhancedHotelCard({
  hotel,
  isRtl,
  darkMode = true,
  onSelect,
  searchContext,
  showEnhancedInfo = true,
}: EnhancedHotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)

  const hotelName = hotel.hotelName || hotel.name
  const price = hotel.price || hotel.pricePerNight || 0
  const rating = hotel.rating || hotel.stars || 4
  const location = hotel.location || hotel.city || ""
  const roomType = hotel.roomType || hotel.room_type || (isRtl ? "חדר סטנדרטי" : "Standard Room")
  const board = hotel.board || hotel.meals || "RO"
  const cancellation = typeof hotel.cancellation === "object" ? hotel.cancellation.type : hotel.cancellation
  const facilities = hotel.facilities || hotel.amenities || []

  // Generate placeholder images based on hotel name
  const defaultImages = [
    `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotelName + " hotel room luxury")}`,
    `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotelName + " hotel lobby")}`,
    `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotelName + " hotel pool")}`,
  ]

  const images = hotel.images?.length ? hotel.images : hotel.image ? [hotel.image] : defaultImages

  // Fetch enhanced hotel info
  const fetchHotelInfo = async () => {
    if (hotelInfo || !showEnhancedInfo) return

    setIsLoadingInfo(true)
    try {
      const response = await fetch("/api/ai/hotel-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelName,
          city: location,
        }),
      })

      const data = await response.json()
      if (data.success && data.data) {
        setHotelInfo(data.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch hotel info:", error)
    } finally {
      setIsLoadingInfo(false)
    }
  }

  useEffect(() => {
    if (showDetails && !hotelInfo) {
      fetchHotelInfo()
    }
  }, [showDetails])

  const handleSelectRoom = () => {
    onSelect({
      code: hotel.code || "",
      name: hotelName,
      hotelName: hotelName,
      hotelId: hotel.hotelId || 0,
      roomType,
      price,
      currency: hotel.currency || "USD",
      board,
      cancellation: cancellation || "non-refundable",
      dateFrom: searchContext?.dateFrom || "",
      dateTo: searchContext?.dateTo || "",
      adults: searchContext?.adults || 2,
      children: searchContext?.children || [],
      image: images[0],
    })
  }

  const boardLabels: Record<string, { en: string; he: string }> = {
    RO: { en: "Room Only", he: "לינה בלבד" },
    BB: { en: "Breakfast", he: "כולל ארוחת בוקר" },
    HB: { en: "Half Board", he: "חצי פנסיון" },
    FB: { en: "Full Board", he: "פנסיון מלא" },
    AI: { en: "All Inclusive", he: "הכל כלול" },
  }

  const getBoardLabel = (b: string) => {
    const label = boardLabels[b.toUpperCase()]
    return label ? (isRtl ? label.he : label.en) : b
  }

  return (
    <Card
      className={cn(
        "overflow-hidden backdrop-blur-sm border transition-all duration-300 group",
        darkMode
          ? "bg-slate-800/90 border-white/10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10"
          : "bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20",
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={hotelName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotelName + " hotel")}`
          }}
        />

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
            darkMode ? "from-slate-900/95" : "from-black/70",
          )}
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-5" : "bg-white/50 hover:bg-white/75",
                )}
              />
            ))}
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all",
            liked ? "bg-rose-500 text-white" : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50",
          )}
        >
          <HeartIcon filled={liked} />
        </button>

        {/* Free Cancellation Badge */}
        {(cancellation === "free" || cancellation === "fully-refundable") && (
          <Badge className="absolute top-3 left-3 bg-emerald-500/90 text-white border-0 backdrop-blur-sm">
            {isRtl ? "ביטול חינם" : "Free Cancel"}
          </Badge>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-3xl font-bold text-white drop-shadow-lg">${price.toFixed(0)}</p>
          <p className="text-xs text-white/80">{isRtl ? "ללילה" : "/night"}</p>
        </div>

        {/* AI Enhanced Badge */}
        {showEnhancedInfo && (
          <Badge className="absolute top-3 left-3 bg-purple-500/90 text-white border-0 backdrop-blur-sm gap-1">
            <SparklesIcon />
            AI
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold text-base truncate", darkMode ? "text-white" : "text-slate-900")}>
              {hotelName}
            </h4>
            {location && (
              <p className={cn("flex items-center gap-1 text-sm mt-1", darkMode ? "text-slate-400" : "text-slate-500")}>
                <LocationIcon />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < rating} />
            ))}
          </div>
        </div>

        {/* Description from AI */}
        {hotelInfo?.description && (
          <p className={cn("text-sm line-clamp-2", darkMode ? "text-slate-400" : "text-slate-600")}>
            {hotelInfo.description}
          </p>
        )}

        {/* Facilities */}
        <div className="flex flex-wrap gap-2">
          {(hotelInfo?.amenities || facilities).slice(0, 4).map((facility, idx) => (
            <span
              key={idx}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs rounded-full",
                darkMode ? "text-slate-400 bg-slate-700/50" : "text-slate-600 bg-slate-100",
              )}
            >
              {facility.toLowerCase().includes("wifi") ? (
                <WifiIcon />
              ) : facility.toLowerCase().includes("pool") ? (
                <PoolIcon />
              ) : (
                <span className="w-3 h-3 rounded-full bg-emerald-500/30" />
              )}
              <span className="truncate max-w-[80px]">{facility}</span>
            </span>
          ))}
        </div>

        {/* Room Info */}
        <div
          className={cn(
            "flex items-center justify-between text-sm pt-2 border-t",
            darkMode ? "text-slate-400 border-white/5" : "text-slate-500 border-slate-200",
          )}
        >
          <span>{roomType}</span>
          <Badge variant="secondary" className={darkMode ? "bg-slate-700 text-slate-300" : ""}>
            {getBoardLabel(board)}
          </Badge>
        </div>

        {/* Enhanced Info Toggle */}
        {showEnhancedInfo && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg transition-colors",
              darkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
            )}
          >
            <InfoIcon />
            {showDetails ? (isRtl ? "הסתר פרטים" : "Hide Details") : isRtl ? "מידע נוסף" : "More Info"}
          </button>
        )}

        {/* Expanded Details */}
        {showDetails && (
          <div
            className={cn(
              "p-3 rounded-lg space-y-3 animate-in slide-in-from-top-2",
              darkMode ? "bg-slate-900/50" : "bg-slate-50",
            )}
          >
            {isLoadingInfo ? (
              <div className="flex items-center justify-center py-4 gap-2">
                <LoadingSpinner />
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
                  {isRtl ? "טוען מידע..." : "Loading info..."}
                </span>
              </div>
            ) : hotelInfo ? (
              <>
                {/* Highlights */}
                {hotelInfo.highlights?.length > 0 && (
                  <div>
                    <p className={cn("text-xs font-medium mb-1", darkMode ? "text-slate-400" : "text-slate-600")}>
                      {isRtl ? "דגשים" : "Highlights"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hotelInfo.highlights.map((h, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Check-in/out */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                      Check-in: {hotelInfo.checkInTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                      Check-out: {hotelInfo.checkOutTime}
                    </span>
                  </div>
                </div>

                {/* Nearby Attractions */}
                {hotelInfo.nearbyAttractions?.length > 0 && (
                  <div>
                    <p className={cn("text-xs font-medium mb-1", darkMode ? "text-slate-400" : "text-slate-600")}>
                      {isRtl ? "אטרקציות קרובות" : "Nearby"}
                    </p>
                    <p className={cn("text-sm", darkMode ? "text-slate-300" : "text-slate-700")}>
                      {hotelInfo.nearbyAttractions.join(" • ")}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className={cn("text-sm text-center py-2", darkMode ? "text-slate-500" : "text-slate-400")}>
                {isRtl ? "לא נמצא מידע נוסף" : "No additional info available"}
              </p>
            )}
          </div>
        )}

        {/* Select Button */}
        <Button
          className="w-full h-11 text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          onClick={handleSelectRoom}
        >
          {isRtl ? "בחר והמשך" : "Select & Continue"}
        </Button>
      </div>
    </Card>
  )
}
