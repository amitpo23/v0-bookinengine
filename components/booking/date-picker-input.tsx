"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Inline SVG icons
const CalendarIcon = () => (
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
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const ChevronLeftIcon = () => (
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
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = () => (
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
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

interface DatePickerInputProps {
  value: Date | undefined
  onChange: (date: Date) => void
  minDate?: Date
  label: string
  placeholder: string
  dir?: "ltr" | "rtl"
}

const DAYS_HE = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"]
const DAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS_HE = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
]
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function DatePickerInput({ value, onChange, minDate, label, placeholder, dir = "ltr" }: DatePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => value || new Date())

  const isHebrew = dir === "rtl"
  const days = isHebrew ? DAYS_HE : DAYS_EN
  const months = isHebrew ? MONTHS_HE : MONTHS_EN

  useEffect(() => {
    if (value) {
      setCurrentMonth(value)
    }
  }, [value])

  const formatDisplayDate = (date: Date) => {
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return isHebrew ? `${day} ${month}, ${year}` : `${month} ${day}, ${year}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    const compareMin = new Date(minDate)
    compareMin.setHours(0, 0, 0, 0)
    return compareDate < compareMin
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!value) return false
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!isDateDisabled(selected)) {
      onChange(selected)
      setOpen(false)
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days_arr = []

    for (let i = 0; i < firstDay; i++) {
      days_arr.push(<div key={`empty-${i}`} className="h-9 w-9" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const disabled = isDateDisabled(date)
      const selected = isSelected(date)
      const today = isToday(date)

      days_arr.push(
        <button
          key={day}
          type="button"
          onClick={() => handleSelectDate(day)}
          disabled={disabled}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-normal transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent",
            selected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            today && !selected && "bg-accent text-accent-foreground",
          )}
        >
          {day}
        </button>,
      )
    }

    return days_arr
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-14 px-4",
            dir === "rtl" ? "text-right" : "text-left",
            !value && "text-muted-foreground",
          )}
        >
          <div className={cn("flex flex-col gap-0.5 flex-1", "items-start")}>
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium">{value ? formatDisplayDate(value) : placeholder}</span>
          </div>
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3" dir="ltr">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </Button>
            <span className="text-sm font-medium">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" onClick={handleNextMonth}>
              <ChevronRightIcon />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="h-9 w-9 flex items-center justify-center text-xs text-muted-foreground font-normal"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
