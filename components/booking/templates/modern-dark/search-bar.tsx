"use client"

import { useState } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface ModernDarkSearchBarProps {
  onSearch?: (data: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
    rooms: number
  }) => void
}

export function ModernDarkSearchBar({ onSearch }: ModernDarkSearchBarProps) {
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(new Date(Date.now() + 86400000))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check In */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-right transition-colors"
        >
          <span className="text-zinc-400 text-sm block mb-1">תאריך הגעה</span>
          <span className="text-white text-lg font-medium">{format(checkIn, "d בMMMM", { locale: he })}</span>
        </button>

        {/* Check Out */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-right transition-colors"
        >
          <span className="text-zinc-400 text-sm block mb-1">תאריך עזיבה</span>
          <span className="text-white text-lg font-medium">{format(checkOut, "d בMMMM", { locale: he })}</span>
        </button>

        {/* Guests */}
        <button
          onClick={() => setShowGuestPicker(!showGuestPicker)}
          className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-right transition-colors"
        >
          <span className="text-zinc-400 text-sm block mb-1">אורחים</span>
          <span className="text-white text-lg font-medium">
            {adults} מבוגרים, {children} ילדים
          </span>
        </button>

        {/* Search Button */}
        <button
          onClick={() => onSearch?.({ checkIn, checkOut, adults, children, rooms })}
          className="bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl p-4 font-bold text-lg transition-colors"
        >
          חפש חדרים
        </button>
      </div>

      {/* Guest Picker Dropdown */}
      {showGuestPicker && (
        <div className="mt-4 bg-zinc-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">מבוגרים</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">ילדים</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{children}</span>
                <button
                  onClick={() => setChildren(children + 1)}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">חדרים</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{rooms}</span>
                <button
                  onClick={() => setRooms(rooms + 1)}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowGuestPicker(false)}
            className="mt-4 w-full bg-white text-zinc-900 rounded-lg py-2 font-medium"
          >
            אישור
          </button>
        </div>
      )}
    </div>
  )
}
