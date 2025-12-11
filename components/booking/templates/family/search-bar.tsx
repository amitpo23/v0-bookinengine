"use client"

import { useState } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface FamilySearchBarProps {
  onSearch?: (data: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
  }) => void
}

export function FamilySearchBar({ onSearch }: FamilySearchBarProps) {
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(new Date(Date.now() + 86400000))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(2)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  return (
    <div className="bg-gradient-to-r from-sky-400 to-cyan-400 rounded-3xl p-6 shadow-xl" dir="rtl">
      <div className="bg-white rounded-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🌴 מצאו את החופשה המושלמת! 🌴</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Check In */}
          <div className="bg-sky-50 rounded-xl p-4 border-2 border-sky-200">
            <label className="text-sky-600 text-sm font-bold flex items-center gap-2">
              <span>📅</span> תאריך הגעה
            </label>
            <input
              type="text"
              readOnly
              value={format(checkIn, "d בMMMM yyyy", { locale: he })}
              className="w-full bg-transparent text-gray-800 font-medium mt-1 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Check Out */}
          <div className="bg-cyan-50 rounded-xl p-4 border-2 border-cyan-200">
            <label className="text-cyan-600 text-sm font-bold flex items-center gap-2">
              <span>📅</span> תאריך עזיבה
            </label>
            <input
              type="text"
              readOnly
              value={format(checkOut, "d בMMMM yyyy", { locale: he })}
              className="w-full bg-transparent text-gray-800 font-medium mt-1 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Guests */}
          <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 relative">
            <label className="text-amber-600 text-sm font-bold flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span> מי מגיע?
            </label>
            <button
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="w-full text-right bg-transparent text-gray-800 font-medium mt-1 focus:outline-none"
            >
              {adults} מבוגרים, {children} ילדים
            </button>

            {showGuestPicker && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border-2 border-amber-200 rounded-xl p-4 z-10 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                      <span>👨</span> מבוגרים
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 font-bold hover:bg-sky-200 text-xl"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xl font-bold">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 font-bold hover:bg-sky-200 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                      <span>👧</span> ילדים
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 font-bold hover:bg-pink-200 text-xl"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xl font-bold">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 font-bold hover:bg-pink-200 text-xl"
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
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl font-bold text-lg py-4 shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            🔍 חפש עכשיו!
          </button>
        </div>
      </div>
    </div>
  )
}
