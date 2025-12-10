"use client"

import type React from "react"
import { Calendar, Users, Moon, MapPin, Edit2 } from "lucide-react"

interface BookingSummaryProps {
  hotelName: string
  hotelNameHe: string
  checkIn: Date
  checkOut: Date
  guests: {
    adults: number
    children: number
  }
  nights: number
  totalPrice?: number
  onEdit?: () => void
  language?: "en" | "he"
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  hotelName,
  hotelNameHe,
  checkIn,
  checkOut,
  guests,
  nights,
  totalPrice,
  onEdit,
  language = "he",
}) => {
  const isHebrew = language === "he"

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isHebrew ? "he-IL" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Hotel Name */}
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{isHebrew ? hotelNameHe : hotelName}</h2>
              <p className="text-blue-100 text-sm">{isHebrew ? "פרטי ההזמנה שלכם" : "Your Booking Details"}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Check-in / Check-out */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-200" />
              <div className="text-sm">
                <div className="font-semibold">{formatDate(checkIn)}</div>
                <div className="text-blue-200">{isHebrew ? "כניסה" : "Check-in"}</div>
              </div>
              <div className="mx-2 text-blue-200">→</div>
              <div className="text-sm">
                <div className="font-semibold">{formatDate(checkOut)}</div>
                <div className="text-blue-200">{isHebrew ? "יציאה" : "Check-out"}</div>
              </div>
            </div>

            {/* Nights */}
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Moon className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-bold">{nights}</div>
                <div className="text-blue-200 text-xs">{isHebrew ? "לילות" : "nights"}</div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-bold">{totalGuests}</div>
                <div className="text-blue-200 text-xs">
                  {isHebrew
                    ? `${guests.adults} מבוגרים${guests.children > 0 ? `, ${guests.children} ילדים` : ""}`
                    : `${guests.adults} adult${guests.adults > 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} child${guests.children > 1 ? "ren" : ""}` : ""}`}
                </div>
              </div>
            </div>

            {/* Total Price */}
            {totalPrice && (
              <div className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold shadow-lg">
                <div className="text-2xl">₪{totalPrice.toLocaleString()}</div>
                <div className="text-xs opacity-75">{isHebrew ? "סה״כ" : "Total"}</div>
              </div>
            )}

            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="font-medium">{isHebrew ? "ערוך" : "Edit"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator Bar */}
      <div className="h-1 bg-blue-800">
        <div className="h-full bg-yellow-400 w-1/3 transition-all duration-500" />
      </div>
    </div>
  )
}

export default BookingSummary
