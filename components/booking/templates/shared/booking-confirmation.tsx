"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Users, MapPin, Download, Mail, Phone } from "lucide-react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import type { HotelResult, RoomResult, SearchParams } from "@/hooks/use-booking-engine"
import Link from "next/link"

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
  onNewBooking: () => void
  variant?: "default" | "dark" | "luxury" | "family"
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
  variant = "default",
}: BookingConfirmationProps) {
  const nights = Math.ceil((searchParams.checkOut.getTime() - searchParams.checkIn.getTime()) / (1000 * 60 * 60 * 24))

  const containerClass =
    variant === "dark"
      ? "bg-zinc-900 text-white"
      : variant === "luxury"
        ? "bg-stone-50"
        : variant === "family"
          ? "bg-gradient-to-br from-purple-50 to-pink-50"
          : "bg-background"

  const cardClass =
    variant === "dark"
      ? "bg-zinc-800 border-zinc-700"
      : variant === "luxury"
        ? "bg-white border-stone-200"
        : variant === "family"
          ? "bg-white border-purple-200 rounded-2xl"
          : "bg-card border"

  const successColor =
    variant === "dark"
      ? "text-cyan-400"
      : variant === "luxury"
        ? "text-amber-600"
        : variant === "family"
          ? "text-green-500"
          : "text-green-600"

  const buttonClass =
    variant === "dark"
      ? "bg-cyan-500 hover:bg-cyan-600 text-black"
      : variant === "luxury"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : variant === "family"
          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl"
          : ""

  return (
    <div className={`p-6 rounded-lg ${containerClass}`} dir="rtl">
      {/* Demo Mode Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h4 className="font-medium text-green-900">הזמנת בדיקה הושלמה בהצלחה</h4>
        </div>
        <p className="text-sm text-green-700 mt-1">
          ✅ זוהי הזמנת דמו לבדיקות - לא בוצע חיוב אמיתי
          <br />
          📧 מייל אישור נשלח לכתובת {guestEmail}
        </p>
      </div>

      <div className="text-center mb-8">
        <CheckCircle className={`w-20 h-20 mx-auto mb-4 ${successColor}`} />
        <h1 className="text-3xl font-bold mb-2">ההזמנה אושרה!</h1>
        <p className="text-muted-foreground">אישור נשלח לכתובת הדוא״ל שלך</p>
      </div>

      <div className={`p-6 rounded-lg border mb-6 ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">מספר הזמנה</div>
            <div className="text-xl font-bold">{bookingId}</div>
          </div>
          {supplierReference && (
            <div className="text-left">
              <div className="text-sm text-muted-foreground">מספר אסמכתא</div>
              <div className="text-lg font-medium">{supplierReference}</div>
            </div>
          )}
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-semibold">{hotel.hotelName}</div>
              <div className="text-sm text-muted-foreground">{hotel.address || hotel.city}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-semibold">
                {format(searchParams.checkIn, "EEEE, d בMMMM yyyy", { locale: he })}
                {" - "}
                {format(searchParams.checkOut, "EEEE, d בMMMM yyyy", { locale: he })}
              </div>
              <div className="text-sm text-muted-foreground">
                {nights} {nights === 1 ? "לילה" : "לילות"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-semibold">{room.roomName}</div>
              <div className="text-sm text-muted-foreground">
                {searchParams.adults} מבוגרים
                {searchParams.children.length > 0 && `, ${searchParams.children.length} ילדים`}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex items-center justify-between">
          <div className="text-lg">סה״כ שולם</div>
          <div className="text-2xl font-bold">
            {currency === "ILS" ? "₪" : "$"}
            {totalPrice.toLocaleString()}
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border mb-6 ${cardClass}`}>
        <h3 className="font-semibold mb-2">פרטי האורח</h3>
        <div className="text-sm space-y-1">
          <div>{guestName}</div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            {guestEmail}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/my-account" className="flex-1">
          <Button variant="default" className={`w-full gap-2 ${buttonClass}`}>
            <Users className="w-4 h-4" />
            צפה בהזמנה שלי
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={onNewBooking}>
          <Download className="w-4 h-4" />
          הזמנה חדשה
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <div className="font-semibold mb-1">צריכים עזרה?</div>
        <div className="flex items-center gap-4">
          <a href="tel:*6070" className="flex items-center gap-1 text-blue-600">
            <Phone className="w-4 h-4" />
            *6070
          </a>
          <a href="mailto:support@hotel.co.il" className="flex items-center gap-1 text-blue-600">
            <Mail className="w-4 h-4" />
            support@hotel.co.il
          </a>
        </div>
      </div>
    </div>
  )
}
