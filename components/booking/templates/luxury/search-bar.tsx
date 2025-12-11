"use client"

import { useState } from "react"
import { format } from "date-fns"

interface LuxurySearchBarProps {
  onSearch?: (data: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
  }) => void
}

export function LuxurySearchBar({ onSearch }: LuxurySearchBarProps) {
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(new Date(Date.now() + 86400000))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  return (
    <div className="bg-stone-50 border-2 border-stone-200 rounded-none p-8" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-stone-800 tracking-wide">הזמינו את השהייה שלכם</h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Check In */}
        <div className="border-b-2 border-stone-300 pb-2">
          <label className="text-stone-500 text-xs uppercase tracking-widest font-medium">תאריך הגעה</label>
          <input
            type="text"
            readOnly
            value={format(checkIn, "dd/MM/yyyy")}
            className="w-full bg-transparent text-stone-800 text-lg font-serif mt-1 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Check Out */}
        <div className="border-b-2 border-stone-300 pb-2">
          <label className="text-stone-500 text-xs uppercase tracking-widest font-medium">תאריך עזיבה</label>
          <input
            type="text"
            readOnly
            value={format(checkOut, "dd/MM/yyyy")}
            className="w-full bg-transparent text-stone-800 text-lg font-serif mt-1 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Guests */}
        <div className="border-b-2 border-stone-300 pb-2 relative">
          <label className="text-stone-500 text-xs uppercase tracking-widest font-medium">אורחים</label>
          <button
            onClick={() => setShowGuestPicker(!showGuestPicker)}
            className="w-full text-right bg-transparent text-stone-800 text-lg font-serif mt-1 focus:outline-none"
          >
            {adults} מבוגרים{children > 0 ? `, ${children} ילדים` : ""}
          </button>

          {showGuestPicker && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white border-2 border-stone-200 p-4 z-10 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-stone-700">מבוגרים</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 border border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-serif">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 border border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-stone-700">ילדים</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 border border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-serif">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 border border-stone-300 text-stone-600 hover:border-amber-600 hover:text-amber-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => onSearch?.({ checkIn, checkOut, adults, children })}
          className="bg-amber-700 hover:bg-amber-800 text-white uppercase tracking-widest text-sm font-medium py-4 transition-colors"
        >
          בדוק זמינות
        </button>
      </div>
    </div>
  )
}
