"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Room } from "@/types/booking"

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

interface PricingCalendarProps {
  rooms: Room[]
}

interface PriceOverride {
  date: string
  roomId: string
  price: number
  reason?: string
}

export function PricingCalendar({ rooms }: PricingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id || "")
  const [priceOverrides, setPriceOverrides] = useState<PriceOverride[]>([])
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [editReason, setEditReason] = useState<string>("")

  const selectedRoomData = rooms.find((r) => r.id === selectedRoom)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { days, firstDay }
  }

  const { days, firstDay } = getDaysInMonth(currentMonth)

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("he-IL", { month: "long", year: "numeric" })
  }

  const getDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toISOString().split("T")[0]
  }

  const getPriceForDate = (day: number) => {
    const dateStr = getDateString(day)
    const override = priceOverrides.find((p) => p.date === dateStr && p.roomId === selectedRoom)
    return override?.price || selectedRoomData?.basePrice || 0
  }

  const hasOverride = (day: number) => {
    const dateStr = getDateString(day)
    return priceOverrides.some((p) => p.date === dateStr && p.roomId === selectedRoom)
  }

  const handleDayClick = (day: number) => {
    const dateStr = getDateString(day)
    const existing = priceOverrides.find((p) => p.date === dateStr && p.roomId === selectedRoom)
    setEditingDate(dateStr)
    setEditPrice(existing?.price || selectedRoomData?.basePrice || 0)
    setEditReason(existing?.reason || "")
  }

  const savePrice = () => {
    if (!editingDate) return

    setPriceOverrides((prev) => {
      const filtered = prev.filter((p) => !(p.date === editingDate && p.roomId === selectedRoom))
      if (editPrice !== selectedRoomData?.basePrice) {
        return [...filtered, { date: editingDate, roomId: selectedRoom, price: editPrice, reason: editReason }]
      }
      return filtered
    })
    setEditingDate(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const dayNames = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              לוח מחירים
            </CardTitle>
            <CardDescription>הגדר מחירים שונים לתאריכים ספציפיים</CardDescription>
          </div>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="בחר חדר" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-semibold">{formatMonth(currentMonth)}</h3>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before first of month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1
            const price = getPriceForDate(day)
            const isOverride = hasOverride(day)
            const isWeekend = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 6

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square p-1 rounded-lg border transition-colors text-right flex flex-col
                  ${isOverride ? "bg-primary/10 border-primary" : "hover:bg-muted"}
                  ${isWeekend ? "bg-amber-50 dark:bg-amber-900/10" : ""}
                `}
              >
                <span className="text-xs font-medium">{day}</span>
                <span
                  className={`text-xs mt-auto ${isOverride ? "text-primary font-semibold" : "text-muted-foreground"}`}
                >
                  {formatPrice(price)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/10 border border-primary" />
            <span>מחיר מותאם</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-50 dark:bg-amber-900/10 border" />
            <span>שבת</span>
          </div>
        </div>

        {/* Edit Price Dialog */}
        <Dialog open={!!editingDate} onOpenChange={() => setEditingDate(null)}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>עדכון מחיר</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>תאריך</Label>
                <Input value={editingDate || ""} disabled dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>מחיר ללילה (₪)</Label>
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>סיבה (אופציונלי)</Label>
                <Input
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="חג, אירוע מיוחד..."
                />
              </div>
              <p className="text-sm text-muted-foreground">
                מחיר בסיס: {formatPrice(selectedRoomData?.basePrice || 0)}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingDate(null)}>
                ביטול
              </Button>
              <Button onClick={savePrice}>שמור</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
