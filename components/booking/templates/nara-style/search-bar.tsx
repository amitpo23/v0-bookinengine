"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface SearchBarProps {
  hotelName?: string
  hotelLogo?: string
  initialData?: {
    location?: string
    checkIn?: Date
    checkOut?: Date
    nights?: number
    guests?: number
    rooms?: number
  }
  onSearch?: (data: any) => void
}

export function NaraSearchBar({ hotelName = "NARA", hotelLogo, initialData, onSearch }: SearchBarProps) {
  const [location, setLocation] = useState(initialData?.location || "")
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialData?.checkIn)
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialData?.checkOut)
  const [guests, setGuests] = useState(initialData?.guests || 2)
  const [rooms, setRooms] = useState(initialData?.rooms || 1)

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 1

  return (
    <div className="w-full bg-white border-b shadow-sm">
      {/* Hotel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          {hotelLogo ? (
            <img src={hotelLogo || "/placeholder.svg"} alt={hotelName} className="h-12" />
          ) : (
            <h1 className="text-3xl font-serif tracking-wider text-gray-800">{hotelName}</h1>
          )}
          <span className="text-xs text-gray-500 tracking-widest">HOTELS</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-0 px-6 py-3" dir="rtl">
        {/* Update Search Button */}
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-sm"
          onClick={() => onSearch?.({ location, checkIn, checkOut, guests, rooms })}
        >
          עדכן חיפוש
        </Button>

        {/* Guests */}
        <div className="flex flex-col items-center px-6 py-2 border-r border-gray-200">
          <span className="text-sm text-gray-500">מי מגיע?</span>
          <span className="font-medium">
            {guests} אורחים, חדר {rooms}
          </span>
        </div>

        {/* Nights */}
        <div className="flex flex-col items-center px-6 py-2 border-r border-gray-200">
          <span className="text-sm text-gray-500">לילה</span>
          <span className="font-medium text-xl">{nights}</span>
        </div>

        {/* Check-out */}
        <div className="flex flex-col items-center px-6 py-2 border-r border-gray-200">
          <span className="text-sm text-gray-500">תאריך עזיבה</span>
          <span className="font-medium">
            {checkOut ? format(checkOut, "EEEE, d בMMMM", { locale: he }) : "בחר תאריך"}
          </span>
        </div>

        {/* Check-in */}
        <div className="flex flex-col items-center px-6 py-2 border-r border-gray-200">
          <span className="text-sm text-gray-500">תאריך הגעה</span>
          <span className="font-medium">
            {checkIn ? format(checkIn, "EEEE, d בMMMM", { locale: he }) : "בחר תאריך"}
          </span>
        </div>

        {/* Location */}
        <div className="flex flex-col items-center px-6 py-2 bg-gray-100 rounded">
          <span className="text-sm text-gray-500">איפה?</span>
          <span className="font-medium">{location || "בחר יעד"}</span>
        </div>
      </div>
    </div>
  )
}
