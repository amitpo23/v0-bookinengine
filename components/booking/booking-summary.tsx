"use client"

import { useState } from "react"
import { formatDate } from "@/lib/date-utils"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface BookingSummaryProps {
  showContinue?: boolean
  onContinue?: () => void
  className?: string
}

export function BookingSummary({ showContinue = true, onContinue, className }: BookingSummaryProps) {
  const { hotel, search, selectedRooms, removeRoom, updateRoomQuantity, nights, totalPrice, setCurrentStep } =
    useBooking()
  const { t, locale, dir } = useI18n()
  const [showClubOffer, setShowClubOffer] = useState(true)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const taxes = totalPrice * 0.17
  const grandTotal = totalPrice + taxes
  const clubDiscount = Math.round(totalPrice * 0.05) // 5% club discount
  const clubPrice = totalPrice - clubDiscount
  const nightsText = nights === 1 ? (locale === "he" ? "לילה" : "night") : locale === "he" ? "לילות" : "nights"

    const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!hotel || !search || selectedRooms.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      // Get the first room's rate plan code
      const roomCode = selectedRooms[0].ratePlan.id || selectedRooms[0].ratePlan.code
      
      const response = await fetch('/api/booking/prebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: roomCode,
          dateFrom: search.checkIn,
          dateTo: search.checkOut,
          hotelId: hotel.id,
          adults: search.adults,
          children: search.children || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate booking')
      }

      // If successful, proceed to next step
      setCurrentStep(3)
      onContinue?.()
    } catch (err) {
      console.error('Prebook error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }}

  const hotelImage = selectedRooms[0]?.room?.images?.[0] || "/luxury-hotel-pool.png"

  if (selectedRooms.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)} dir={dir}>
        <h3 className="font-semibold text-lg mb-4 text-gray-900">
          {locale === "he" ? "סיכום הזמנה" : "Booking Summary"}
        </h3>
        <p className="text-gray-500 text-sm text-center py-8">
          {locale === "he" ? "טרם נבחרו חדרים" : "No rooms selected"}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", className)} dir={dir}>
      <div className="relative h-48 w-full">
        <Image src={hotelImage || "/placeholder.svg"} alt={hotel?.name || "Hotel"} fill className="object-cover" />
      </div>

      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{locale === "he" ? "סיכום הזמנה" : "Booking Summary"}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">{hotel?.name || "המלון"}</span>
          <span>
            {formatDate(search.checkIn, locale)} - {formatDate(search.checkOut, locale)}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {locale === "he" ? `${nights} ${nightsText}` : `${nights} ${nightsText}`}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {selectedRooms.map((sr, index) => (
          <div key={`${sr.room.id}-${sr.ratePlan.id}`} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {locale === "he" ? `חדר ${index + 1}` : `Room ${index + 1}`}
                </span>
                <span className="text-xs text-amber-600 font-medium">
                  {locale === "he" ? "הנחה למזמינים באתר" : "Website discount"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-red-500"
                onClick={() => removeRoom(sr.room.id, sr.ratePlan.id)}
              >
                <Icons.x className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              {sr.room.name}, {sr.ratePlan.name}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {locale === "he" ? "מחיר:" : "Price:"} {formatPrice(sr.ratePlan.price * sr.quantity * nights)}
            </p>
          </div>
        ))}
      </div>

      {showClubOffer && (
        <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">
                {locale === "he"
                  ? `הצטרפות לחוג השמש תחסוך לך ${formatPrice(clubDiscount)}`
                  : `Join the club to save ${formatPrice(clubDiscount)}`}
              </p>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-4">
              {locale === "he" ? "חוג השמש" : "Sun Club"}
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{locale === "he" ? "מחיר באתר" : "Website price"}</span>
          <span className="text-gray-900 font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{locale === "he" ? "מחיר מועדון" : "Club price"}</span>
          <span className="text-blue-600 font-bold">{formatPrice(clubPrice)}</span>
        </div>
      </div>

            {showContinue && (
        <div className="p-4 pt-0">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            size="lg" 
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {locale === "he" ? "בודק זמינות..." : "Checking availability..."}
              </>
            ) : (
              locale === "he" ? "המשך להזמנה" : "Continue to booking"
            )}
          </Button>
        </div>
      )}  </div>
      )}
    </div>
  )
}
