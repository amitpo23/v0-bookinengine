"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Booking } from "@/types/booking"
import { formatDate } from "@/lib/date-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const MoreHorizontalIcon = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

const ArrowUpLeftIcon = ({ className }: { className?: string }) => (
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
    <path d="M7 17V7h10" />
    <path d="M17 17 7 7" />
  </svg>
)

interface RecentBookingsProps {
  bookings: Booking[]
}

const statusConfig = {
  confirmed: { label: "מאושר", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  pending: { label: "ממתין", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  cancelled: { label: "מבוטל", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  completed: { label: "הושלם", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">הזמנות אחרונות</CardTitle>
          <p className="text-sm text-muted-foreground">5 ההזמנות האחרונות שהתקבלו</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          צפה בהכל
          <ArrowUpLeftIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {bookings.slice(0, 5).map((booking) => {
            const status = statusConfig[booking.status as keyof typeof statusConfig]
            const initials = `${booking.guestDetails.firstName.charAt(0)}${booking.guestDetails.lastName.charAt(0)}`

            return (
              <div
                key={booking.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">#{booking.confirmationNumber}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.rooms[0]?.room.name} • {booking.nights} לילות
                  </div>
                </div>

                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium">
                    {formatDate(booking.checkIn, "he")} - {formatDate(booking.checkOut, "he")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.guests.adults} מבוגרים
                    {booking.guests.children > 0 && `, ${booking.guests.children} ילדים`}
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-semibold">₪{booking.pricing.total.toLocaleString()}</div>
                  <Badge variant="outline" className={status?.className}>
                    {status?.label}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" dir="rtl">
                    <DropdownMenuItem>צפה בפרטים</DropdownMenuItem>
                    <DropdownMenuItem>שלח אישור</DropdownMenuItem>
                    <DropdownMenuItem>ערוך הזמנה</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">בטל הזמנה</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
