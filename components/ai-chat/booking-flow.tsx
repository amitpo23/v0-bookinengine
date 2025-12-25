"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Types
interface BookingRoom {
  code: string
  name: string
  hotelName: string
  hotelId: number
  roomType: string
  price: number
  currency: string
  board: string
  cancellation: string
  dateFrom: string
  dateTo: string
  adults: number
  children: number[]
  image?: string
}

interface GuestDetails {
  title: "MR" | "MRS" | "MS"
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  zip: string
}

interface BookingFlowProps {
  room: BookingRoom
  isRtl: boolean
  onComplete: (result: { success: boolean; confirmationNumber?: string; error?: string }) => void
  onCancel: () => void
}

// Icons
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

type BookingStep = "confirm_price" | "guest_details" | "payment" | "complete"

export function BookingFlow({ room, isRtl, onComplete, onCancel }: BookingFlowProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState<BookingStep>("confirm_price")
  const [isLoading, setIsLoading] = useState(false)
  const [prebookToken, setPrebookToken] = useState<string>("")
  const [prebookId, setPrebookId] = useState<number>(0)
  const [confirmedPrice, setConfirmedPrice] = useState<number>(room.price)
  const [error, setError] = useState<string>("")

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    title: "MR",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "IL",
    city: "",
    address: "",
    zip: "",
  })

  // Auto-fill form from Google session
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(" ") || []
      setGuestDetails((prev) => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(" ") || prev.lastName,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  // Step 1: PreBook - Confirm Price
  const handlePreBook = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Starting PreBook with room:", room)

      const response = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: room.code,
          dateFrom: room.dateFrom,
          dateTo: room.dateTo,
          hotelId: room.hotelId,
          adults: room.adults,
          children: room.children || [],
        }),
      })

      const data = await response.json()
      console.log("[v0] PreBook response:", data)

      if (data.success || data.token || data.preBookId) {
        setPrebookToken(data.token || "")
        setPrebookId(data.preBookId || 0)
        setConfirmedPrice(data.priceConfirmed || room.price)
        setStep("guest_details")
      } else {
        setError(
          data.error || (isRtl ? "לא ניתן לאשר את המחיר כרגע. נסה שוב." : "Unable to confirm price. Please try again."),
        )
      }
    } catch (err: any) {
      console.error("[v0] PreBook error:", err)
      setError(isRtl ? "שגיאה בתקשורת. נסה שוב." : "Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Validate Guest Details
  const validateGuestDetails = (): boolean => {
    if (!guestDetails.firstName || !guestDetails.lastName) {
      setError(isRtl ? "נא למלא שם מלא" : "Please enter full name")
      return false
    }
    if (!guestDetails.email || !guestDetails.email.includes("@")) {
      setError(isRtl ? "נא למלא אימייל תקין" : "Please enter valid email")
      return false
    }
    if (!guestDetails.phone) {
      setError(isRtl ? "נא למלא מספר טלפון" : "Please enter phone number")
      return false
    }
    return true
  }

  const handleGuestDetailsSubmit = () => {
    if (validateGuestDetails()) {
      setError("")
      setStep("payment")
    }
  }

  // Step 3: Complete Booking
  const handleCompleteBooking = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Starting Book with:", { room, prebookToken, prebookId, guestDetails })

      const response = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: room.code,
          token: prebookToken,
          preBookId: prebookId,
          dateFrom: room.dateFrom,
          dateTo: room.dateTo,
          hotelId: room.hotelId,
          adults: room.adults,
          children: room.children || [],
          customer: guestDetails,
        }),
      })

      const data = await response.json()
      console.log("[v0] Book response:", data)

      if (data.success) {
        setStep("complete")
        onComplete({
          success: true,
          confirmationNumber: data.bookingId || data.supplierReference,
        })
      } else {
        setError(data.error || (isRtl ? "ההזמנה נכשלה. נסה שוב." : "Booking failed. Please try again."))
      }
    } catch (err: any) {
      console.error("[v0] Book error:", err)
      setError(isRtl ? "שגיאה בתקשורת. נסה שוב." : "Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate nights
  const nights = Math.ceil(
    (new Date(room.dateTo).getTime() - new Date(room.dateFrom).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card className="overflow-hidden bg-slate-800/90 backdrop-blur-sm border-white/10">
      {/* Progress Steps */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50">
        {["confirm_price", "guest_details", "payment", "complete"].map((s, idx) => {
          const stepLabels = isRtl
            ? ["אישור מחיר", "פרטי אורח", "תשלום", "אישור"]
            : ["Price", "Guest Info", "Payment", "Done"]
          const isActive = step === s
          const isPast = ["confirm_price", "guest_details", "payment", "complete"].indexOf(step) > idx

          return (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                  isActive && "bg-emerald-500 text-white",
                  isPast && "bg-emerald-500/20 text-emerald-400",
                  !isActive && !isPast && "bg-slate-700 text-slate-400",
                )}
              >
                {isPast ? <CheckIcon /> : idx + 1}
              </div>
              <span
                className={cn(
                  "mx-2 text-xs hidden sm:block",
                  isActive && "text-emerald-400 font-medium",
                  !isActive && "text-slate-500",
                )}
              >
                {stepLabels[idx]}
              </span>
              {idx < 3 && <div className={cn("w-8 h-0.5 mx-1", isPast ? "bg-emerald-500/50" : "bg-slate-700")} />}
            </div>
          )
        })}
      </div>

      {/* Room Summary - Always visible */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="flex gap-4">
          {room.image && (
            <img
              src={room.image || "/placeholder.svg"}
              alt={room.hotelName}
              className="w-20 h-20 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{room.hotelName}</h4>
            <p className="text-sm text-slate-400">{room.roomType}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {room.dateFrom} - {room.dateTo}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon />
                {room.adults} {isRtl ? "מבוגרים" : "adults"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">${confirmedPrice.toFixed(0)}</p>
            <p className="text-xs text-slate-500">
              {nights} {isRtl ? "לילות" : "nights"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="p-4">
        {/* Step 1: Confirm Price */}
        {step === "confirm_price" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <LockIcon />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isRtl ? "אישור מחיר והזמינות" : "Confirm Price & Availability"}
              </h3>
              <p className="text-sm text-slate-400">
                {isRtl
                  ? "לחץ להמשך כדי לנעול את המחיר ולאשר זמינות"
                  : "Click continue to lock in price and confirm availability"}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={onCancel}
              >
                {isRtl ? "חזור" : "Back"}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
                onClick={handlePreBook}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : isRtl ? "המשך" : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {step === "guest_details" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">{isRtl ? "פרטי האורח" : "Guest Details"}</h3>

            {/* Google Sign In Button */}
            {!session?.user && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => signIn("google")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isRtl ? "התחבר עם Google למילוי מהיר" : "Sign in with Google for quick fill"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-slate-800 text-slate-400">{isRtl ? "או מלא ידנית" : "Or fill manually"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Show user info if logged in */}
            {session?.user && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
                {session.user.image && (
                  <img src={session.user.image} alt={session.user.name || ""} className="h-10 w-10 rounded-full" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-400">{isRtl ? "מחובר כ-" : "Signed in as "}{session.user.name}</p>
                  <p className="text-xs text-emerald-300/70">{session.user.email}</p>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="flex gap-2">
              {(["MR", "MRS", "MS"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1",
                    guestDetails.title === t
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "border-slate-600 text-slate-400",
                  )}
                  onClick={() => setGuestDetails({ ...guestDetails, title: t })}
                >
                  {t}
                </Button>
              ))}
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">{isRtl ? "שם פרטי" : "First Name"}</Label>
                <Input
                  value={guestDetails.firstName}
                  onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder={isRtl ? "ישראל" : "John"}
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">{isRtl ? "שם משפחה" : "Last Name"}</Label>
                <Input
                  value={guestDetails.lastName}
                  onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder={isRtl ? "ישראלי" : "Doe"}
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <Label className="text-slate-400 text-xs">{isRtl ? "אימייל" : "Email"}</Label>
              <Input
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-white"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label className="text-slate-400 text-xs">{isRtl ? "טלפון" : "Phone"}</Label>
              <Input
                type="tel"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-white"
                placeholder="+972-50-1234567"
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">{isRtl ? "עיר" : "City"}</Label>
                <Input
                  value={guestDetails.city}
                  onChange={(e) => setGuestDetails({ ...guestDetails, city: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder={isRtl ? "תל אביב" : "Tel Aviv"}
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">{isRtl ? "מיקוד" : "Zip"}</Label>
                <Input
                  value={guestDetails.zip}
                  onChange={(e) => setGuestDetails({ ...guestDetails, zip: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white"
                  placeholder="12345"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-400 text-xs">{isRtl ? "כתובת" : "Address"}</Label>
              <Input
                value={guestDetails.address}
                onChange={(e) => setGuestDetails({ ...guestDetails, address: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-white"
                placeholder={isRtl ? "רחוב הרצל 1" : "123 Main St"}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setStep("confirm_price")}
              >
                {isRtl ? "חזור" : "Back"}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
                onClick={handleGuestDetailsSubmit}
              >
                {isRtl ? "המשך לתשלום" : "Continue to Payment"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">{isRtl ? "אישור ותשלום" : "Confirm & Pay"}</h3>

            {/* Summary */}
            <div className="p-4 bg-slate-900/50 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{isRtl ? "מחיר ללילה" : "Price per night"}</span>
                <span className="text-white">${(confirmedPrice / nights).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{isRtl ? "מספר לילות" : "Nights"}</span>
                <span className="text-white">{nights}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-700 pt-3">
                <span className="text-white font-medium">{isRtl ? "סה״כ" : "Total"}</span>
                <span className="text-emerald-400 font-bold text-lg">${confirmedPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Guest Info Summary */}
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">{isRtl ? "פרטי האורח" : "Guest Info"}</p>
              <p className="text-white">
                {guestDetails.title} {guestDetails.firstName} {guestDetails.lastName}
              </p>
              <p className="text-sm text-slate-500">{guestDetails.email}</p>
              <p className="text-sm text-slate-500">{guestDetails.phone}</p>
            </div>

            {/* Payment Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400">
                {isRtl
                  ? "התשלום יתבצע ישירות במלון בעת ההגעה"
                  : "Payment will be made directly at the hotel upon arrival"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setStep("guest_details")}
              >
                {isRtl ? "חזור" : "Back"}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
                onClick={handleCompleteBooking}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : isRtl ? "אשר הזמנה" : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{isRtl ? "ההזמנה אושרה!" : "Booking Confirmed!"}</h3>
            <p className="text-slate-400 mb-6">
              {isRtl ? "אישור נשלח לאימייל שלך" : "Confirmation sent to your email"}
            </p>
            <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600" onClick={onCancel}>
              {isRtl ? "סגור" : "Close"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
