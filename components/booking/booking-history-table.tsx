"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface Booking {
  id: string
  mediciBookingId: string
  supplierReference?: string
  hotelName: string
  roomName: string
  dateFrom: string
  dateTo: string
  nights: number
  adults: number
  childrenAges: number[]
  totalPrice: number
  currency: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "EXPIRED"
  apiSource: string
  createdAt: string
  cancelledAt?: string
}

interface BookingHistoryTableProps {
  email: string
}

export function BookingHistoryTable({ email }: BookingHistoryTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [email])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/my-bookings?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err: any) {
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      CONFIRMED: "default",
      PENDING: "secondary",
      CANCELLED: "destructive",
      FAILED: "destructive",
      EXPIRED: "outline",
    }

    return (
      <Badge variant={variants[status] || "outline"}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading your bookings...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-destructive">{error}</p>
          <div className="flex justify-center mt-4">
            <Button onClick={fetchBookings} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No bookings found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{booking.hotelName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{booking.roomName}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Booking ID</p>
                <p className="text-sm font-mono">{booking.mediciBookingId}</p>
              </div>

              {booking.supplierReference && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmation Number</p>
                  <p className="text-sm font-mono">{booking.supplierReference}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Check-in</p>
                <p className="text-sm">{formatDate(new Date(booking.dateFrom))}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Check-out</p>
                <p className="text-sm">{formatDate(new Date(booking.dateTo))}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-sm">{booking.nights} night{booking.nights > 1 ? "s" : ""}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Guests</p>
                <p className="text-sm">
                  {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                  {booking.childrenAges.length > 0 && `, ${booking.childrenAges.length} child${booking.childrenAges.length > 1 ? "ren" : ""}`}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                <p className="text-sm font-semibold">
                  {booking.currency} {Number(booking.totalPrice).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Booked On</p>
                <p className="text-sm">{formatDate(new Date(booking.createdAt))}</p>
              </div>

              {booking.cancelledAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cancelled On</p>
                  <p className="text-sm">{formatDate(new Date(booking.cancelledAt))}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
