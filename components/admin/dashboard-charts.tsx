"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JSX } from "react"

const revenueData = [
  { name: "ינו", revenue: 45000, bookings: 32 },
  { name: "פבר", revenue: 52000, bookings: 38 },
  { name: "מרץ", revenue: 48000, bookings: 35 },
  { name: "אפר", revenue: 61000, bookings: 45 },
  { name: "מאי", revenue: 75000, bookings: 52 },
  { name: "יונ", revenue: 82000, bookings: 58 },
  { name: "יול", revenue: 98000, bookings: 72 },
  { name: "אוג", revenue: 112000, bookings: 85 },
  { name: "ספט", revenue: 89000, bookings: 65 },
  { name: "אוק", revenue: 76000, bookings: 54 },
  { name: "נוב", revenue: 65000, bookings: 48 },
  { name: "דצמ", revenue: 71000, bookings: 51 },
]

const occupancyData = [
  { day: "א", rate: 85 },
  { day: "ב", rate: 72 },
  { day: "ג", rate: 78 },
  { day: "ד", rate: 82 },
  { day: "ה", rate: 91 },
  { day: "ו", rate: 98 },
  { day: "ש", rate: 95 },
]

const roomTypeData = [
  { name: "סטנדרט", value: 35, color: "#3b82f6" },
  { name: "דלקס", value: 28, color: "#10b981" },
  { name: "סוויטה", value: 22, color: "#f59e0b" },
  { name: "סוויטה נשיאותית", value: 15, color: "#ef4444" },
]

const bookingSourceData = [
  { name: "ישיר", value: 45 },
  { name: "Booking.com", value: 25 },
  { name: "Expedia", value: 15 },
  { name: "אחר", value: 15 },
]

export function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue))

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">הכנסות והזמנות</CardTitle>
          <p className="text-sm text-muted-foreground">סקירה שנתית</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">הכנסות</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] flex items-end gap-2">
          {revenueData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md transition-all hover:from-primary hover:to-primary/90"
                style={{ height: `${(item.revenue / maxRevenue) * 250}px` }}
                title={`₪${item.revenue.toLocaleString()}`}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <span>סה״כ: ₪{revenueData.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</span>
          <span>ממוצע: ₪{Math.round(revenueData.reduce((a, b) => a + b.revenue, 0) / 12).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function OccupancyChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">תפוסה שבועית</CardTitle>
        <p className="text-sm text-muted-foreground">אחוז התפוסה לפי יום</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[200px] flex items-end gap-3">
          {occupancyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium">{item.rate}%</span>
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all hover:from-blue-500 hover:to-blue-300"
                style={{ height: `${item.rate * 1.5}px` }}
              />
              <span className="text-xs text-muted-foreground">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RoomTypeChart() {
  const total = roomTypeData.reduce((a, b) => a + b.value, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">התפלגות סוגי חדרים</CardTitle>
        <p className="text-sm text-muted-foreground">הזמנות לפי סוג חדר</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {
                roomTypeData.reduce(
                  (acc, item, index) => {
                    const prevOffset = acc.offset
                    const percentage = (item.value / total) * 100
                    const dashArray = `${percentage} ${100 - percentage}`
                    acc.elements.push(
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-prevOffset}
                        className="transition-all"
                      />,
                    )
                    acc.offset = prevOffset + percentage
                    return acc
                  },
                  { elements: [] as JSX.Element[], offset: 0 },
                ).elements
              }
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{total}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {roomTypeData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-medium mr-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function QuickStats() {
  const stats = [
    { label: "ממוצע לילה", value: "₪892", change: "+12%", positive: true },
    { label: "אורך שהייה ממוצע", value: "2.8 לילות", change: "+5%", positive: true },
    { label: "שיעור ביטולים", value: "4.2%", change: "-2%", positive: true },
    { label: "זמן תגובה", value: "1.2 שעות", change: "-15%", positive: true },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">מדדי ביצועים</CardTitle>
        <p className="text-sm text-muted-foreground">נתונים מרכזיים</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stat.value}</span>
                <Badge
                  variant="secondary"
                  className={
                    stat.positive
                      ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                  }
                >
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
