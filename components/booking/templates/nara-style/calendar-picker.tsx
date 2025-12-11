"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns"
import { he } from "date-fns/locale"

interface DayPrice {
  date: Date
  price?: number
  available: boolean
  isHoliday?: boolean
  isSpecialEvent?: boolean
}

interface CalendarPickerProps {
  prices: DayPrice[]
  selectedCheckIn?: Date
  selectedCheckOut?: Date
  onSelectDates?: (checkIn: Date, checkOut: Date) => void
  currency?: string
  minDate?: Date
}

export function NaraCalendarPicker({
  prices,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDates,
  currency = "₪",
  minDate = new Date(),
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkIn, setCheckIn] = useState<Date | undefined>(selectedCheckIn)
  const [checkOut, setCheckOut] = useState<Date | undefined>(selectedCheckOut)

  const nextMonth = addMonths(currentMonth, 1)

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDayClick = (day: Date, dayData: DayPrice) => {
    if (!dayData.available) return

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day)
      setCheckOut(undefined)
    } else {
      if (isBefore(day, checkIn)) {
        setCheckIn(day)
      } else {
        setCheckOut(day)
        onSelectDates?.(checkIn, day)
      }
    }
  }

  const getDayData = (date: Date): DayPrice => {
    return prices.find((p) => isSameDay(p.date, date)) || { date, available: true }
  }

  const renderMonth = (month: Date) => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const days = eachDayOfInterval({ start, end })

    // Hebrew day names (right to left)
    const dayNames = ["ש'", "ו'", "ה'", "ד'", "ג'", "ב'", "א'"]

    // Get the day of week for the first day (0 = Sunday)
    const firstDayOfWeek = start.getDay()
    const emptyDays = Array(firstDayOfWeek).fill(null)

    return (
      <div className="flex-1">
        {/* Month Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">{format(month, "MMMM yyyy", { locale: he })}</h3>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((name, i) => (
            <div key={i} className="text-center text-sm text-gray-500 py-2">
              {name}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for alignment */}
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="h-16" />
          ))}

          {/* Actual days */}
          {days.map((day) => {
            const dayData = getDayData(day)
            const isSelected = (checkIn && isSameDay(day, checkIn)) || (checkOut && isSameDay(day, checkOut))
            const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut)
            const isCheckInDay = checkIn && isSameDay(day, checkIn)
            const isCheckOutDay = checkOut && isSameDay(day, checkOut)
            const isPast = isBefore(day, minDate)

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day, dayData)}
                disabled={!dayData.available || isPast}
                className={`
                  h-16 flex flex-col items-center justify-center text-sm rounded transition-colors
                  ${isSelected ? "bg-teal-700 text-white" : ""}
                  ${isInRange ? "bg-teal-100" : ""}
                  ${!dayData.available || isPast ? "text-gray-300 cursor-not-allowed line-through" : "hover:bg-gray-100"}
                  ${dayData.isHoliday ? "text-red-500" : ""}
                  ${dayData.isSpecialEvent ? "font-bold" : ""}
                `}
              >
                <span className="text-base">{format(day, "d")}</span>
                {dayData.price && dayData.available && !isPast && (
                  <span className={`text-xs ${isSelected ? "text-white" : "text-gray-500"}`}>
                    {currency}
                    {dayData.price}
                  </span>
                )}
                {dayData.isSpecialEvent && <span className="text-yellow-500">★</span>}
                {dayData.isHoliday && <span className="text-red-400">●</span>}
                {isCheckInDay && <span className="text-xs">הגעה</span>}
                {isCheckOutDay && <span className="text-xs">עזיבה</span>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Two Month View */}
      <div className="flex gap-8">
        {renderMonth(nextMonth)}
        {renderMonth(currentMonth)}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Info className="w-4 h-4" />
            <span>המחירים המוצגים הם לזוג ללילה</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>אירועים מיוחדים</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">●</span>
            <span>חגים</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-300">—</span>
            <span>לא זמין</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            טווח מחירים
          </Button>
          <Button variant="outline" size="sm">
            מחירים
          </Button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-4">
        <Button variant="outline">איפוס</Button>
        <Button className="bg-teal-700 hover:bg-teal-800 text-white">אישור</Button>
      </div>
    </div>
  )
}
