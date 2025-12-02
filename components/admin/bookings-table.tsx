"use client"

import { useState } from "react"
import { formatDate, formatDateShort } from "@/lib/date-utils"
import type { Booking } from "@/types/booking"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const SearchIcon = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

const UsersIcon = ({ className }: { className?: string }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
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
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
)

interface BookingsTableProps {
  bookings: Booking[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">מאושר</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">ממתין</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">בוטל</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">הושלם</Badge>
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.confirmationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestDetails.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestDetails.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestDetails.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי מספר אישור, שם או אימייל..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="confirmed">מאושר</SelectItem>
              <SelectItem value="pending">ממתין</SelectItem>
              <SelectItem value="cancelled">בוטל</SelectItem>
              <SelectItem value="completed">הושלם</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">מספר אישור</TableHead>
                <TableHead className="text-right">אורח</TableHead>
                <TableHead className="text-right">תאריכים</TableHead>
                <TableHead className="text-right">חדרים</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">סכום</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    לא נמצאו הזמנות
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono font-medium">{booking.confirmationNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.guestDetails.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDateShort(booking.checkIn, "he")}</p>
                        <p className="text-muted-foreground">
                          {booking.nights} {booking.nights === 1 ? "לילה" : "לילות"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.rooms.length} {booking.rooms.length === 1 ? "חדר" : "חדרים"}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(booking.pricing.total, booking.pricing.currency)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          מציג {filteredBookings.length} מתוך {bookings.length} הזמנות
        </p>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>הזמנה {selectedBooking.confirmationNumber}</span>
                  {getStatusBadge(selectedBooking.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Guest Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    פרטי אורח
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">שם מלא</p>
                      <p className="font-medium">
                        {selectedBooking.guestDetails.firstName} {selectedBooking.guestDetails.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MailIcon className="h-3 w-3" />
                        אימייל
                      </p>
                      <p className="font-medium">{selectedBooking.guestDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3" />
                        טלפון
                      </p>
                      <p className="font-medium">{selectedBooking.guestDetails.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">מדינה</p>
                      <p className="font-medium">{selectedBooking.guestDetails.country}</p>
                    </div>
                  </div>
                  {selectedBooking.guestDetails.specialRequests && (
                    <div className="mt-3">
                      <p className="text-muted-foreground text-sm">בקשות מיוחדות</p>
                      <p className="text-sm bg-background p-2 rounded mt-1">
                        {selectedBooking.guestDetails.specialRequests}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stay Details */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    פרטי שהייה
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">צ'ק-אין</p>
                      <p className="font-medium">{formatDate(selectedBooking.checkIn, "he")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">צ'ק-אאוט</p>
                      <p className="font-medium">{formatDate(selectedBooking.checkOut, "he")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">לילות</p>
                      <p className="font-medium">{selectedBooking.nights}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-muted-foreground">מבוגרים</p>
                      <p className="font-medium">{selectedBooking.guests.adults}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ילדים</p>
                      <p className="font-medium">{selectedBooking.guests.children}</p>
                    </div>
                  </div>
                </div>

                {/* Rooms */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">חדרים</h3>
                  <div className="space-y-2">
                    {selectedBooking.rooms.map((room, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-background p-3 rounded">
                        <div>
                          <p className="font-medium">
                            {room.quantity}x {room.room.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{room.ratePlan.name}</p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(
                            room.ratePlan.price * room.quantity * selectedBooking.nights,
                            selectedBooking.pricing.currency,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" />
                    פירוט תשלום
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>סכום ביניים</span>
                      <span>{formatPrice(selectedBooking.pricing.subtotal, selectedBooking.pricing.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>מע״מ</span>
                      <span>{formatPrice(selectedBooking.pricing.taxes, selectedBooking.pricing.currency)}</span>
                    </div>
                    {selectedBooking.pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>הנחה</span>
                        <span>-{formatPrice(selectedBooking.pricing.discount, selectedBooking.pricing.currency)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-base">
                      <span>סה״כ</span>
                      <span className="text-primary">
                        {formatPrice(selectedBooking.pricing.total, selectedBooking.pricing.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    שלח אישור מחדש
                  </Button>
                  {selectedBooking.status === "confirmed" && (
                    <Button variant="outline" className="flex-1 text-destructive hover:text-destructive bg-transparent">
                      בטל הזמנה
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
