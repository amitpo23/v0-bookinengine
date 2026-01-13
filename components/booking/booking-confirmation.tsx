"use client"

import React from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import {
  CheckCircle2,
  Download,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Printer,
  Share2,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import type { HotelResult, RoomResult, SearchParams } from "@/hooks/use-unified-booking-engine"

interface BookingConfirmationProps {
  bookingId: string
  supplierReference?: string
  hotel: HotelResult
  room: RoomResult
  searchParams: SearchParams
  totalPrice: number
  currency: string
  guestName: string
  guestEmail: string
  onNewBooking?: () => void
  onPrint?: () => void
}

export function BookingConfirmation({
  bookingId,
  supplierReference,
  hotel,
  room,
  searchParams,
  totalPrice,
  currency,
  guestName,
  guestEmail,
  onNewBooking,
  onPrint,
}: BookingConfirmationProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return format(date, "EEEE, d MMMM yyyy", { locale: he })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `הזמנה ב-${hotel.hotelName}`,
      text: `הזמנתי חדר ב-${hotel.hotelName}. מספר הזמנה: ${bookingId}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Share cancelled or failed")
      }
    }
  }

  const nights = searchParams.checkIn && searchParams.checkOut
    ? Math.ceil((searchParams.checkOut.getTime() - searchParams.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 1

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      {/* Success Header */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            ההזמנה אושרה בהצלחה!
          </h2>
          <p className="text-green-700 dark:text-green-300">
            אישור ההזמנה נשלח אל {guestEmail}
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>פרטי ההזמנה</CardTitle>
              <CardDescription>מספר הזמנה: {bookingId}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1">
              {bookingId}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Info */}
          <div className="flex gap-4">
            {hotel.images?.[0] && (
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img
                  src={hotel.images[0]}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {hotel.city}
              </p>
              <p className="text-sm mt-2">{room.roomName}</p>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                צ'ק-אין
              </p>
              <p className="font-medium">{formatDate(searchParams.checkIn)}</p>
              <p className="text-sm text-muted-foreground">משעה 15:00</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                צ'ק-אאוט
              </p>
              <p className="font-medium">{formatDate(searchParams.checkOut)}</p>
              <p className="text-sm text-muted-foreground">עד 11:00</p>
            </div>
          </div>

          <Separator />

          {/* Guest Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              פרטי האורח
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">שם מלא</p>
                <p className="font-medium">{guestName}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  אימייל
                </p>
                <p className="font-medium">{guestEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              סיכום תשלום
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{nights} לילות × חדר {room.roomName}</span>
                <span>{formatPrice(room.buyPrice * nights)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>סה״כ שולם</span>
                <span className="text-green-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          {supplierReference && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>מספר אסמכתא ספק: {supplierReference}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-2" />
            הדפסה
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 ml-2" />
            שיתוף
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/bookings/${bookingId}/confirmation.pdf`} download>
              <Download className="h-4 w-4 ml-2" />
              הורדת PDF
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onNewBooking && (
          <Button onClick={onNewBooking} variant="default" className="flex-1">
            <Home className="h-4 w-4 ml-2" />
            הזמנה חדשה
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
          <a href="/my-account/bookings">
            צפייה בהזמנות שלי
          </a>
        </Button>
      </div>
    </div>
  )
}
