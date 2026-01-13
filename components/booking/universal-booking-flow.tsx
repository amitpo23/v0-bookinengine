"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { 
  Calendar, 
  Users, 
  Search, 
  Loader2, 
  AlertCircle, 
  Clock, 
  Tag, 
  Star,
  CheckCircle2,
  CreditCard,
  Gift,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Wifi,
  Coffee,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Booking Components
import { useBookingFlow, PrebookWarning, BookingError } from "./booking-flow-provider"
import { GuestDetailsForm } from "./guest-details-form"
import { PaymentForm } from "./payment-form"
import { StripePaymentForm } from "./stripe-payment-form"
import { BookingConfirmation } from "./booking-confirmation"
import { PreBookTimer } from "./prebook-timer"
import { PromoCodeInput } from "./PromoCodeInput"
import { LoyaltyBadge } from "./LoyaltyBadge"

// Types
import type { HotelResult, RoomResult, BookingStep } from "@/hooks/use-unified-booking-engine"

// ============================================================================
// PROPS
// ============================================================================

export interface UniversalBookingFlowProps {
  // Appearance
  variant?: "default" | "compact" | "embedded"
  theme?: "light" | "dark" | "auto"
  accentColor?: string
  
  // Default values
  defaultCity?: string
  defaultHotelName?: string
  
  // Feature toggles
  showPromoCode?: boolean
  showLoyalty?: boolean
  showTimer?: boolean
  showSteps?: boolean
  useStripePayment?: boolean
  
  // Customization
  className?: string
  stepLabels?: {
    search?: string
    results?: string
    details?: string
    payment?: string
    confirmation?: string
  }
  
  // Callbacks
  onSearchComplete?: (results: HotelResult[]) => void
  onRoomSelected?: (hotel: HotelResult, room: RoomResult) => void
  onBookingComplete?: (bookingId: string) => void
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

function BookingStepIndicator({ 
  currentStep,
  labels,
}: { 
  currentStep: BookingStep
  labels: UniversalBookingFlowProps["stepLabels"]
}) {
  const steps: { key: BookingStep; label: string; icon: React.ReactNode }[] = [
    { key: "search", label: labels?.search || "חיפוש", icon: <Search className="h-4 w-4" /> },
    { key: "results", label: labels?.results || "תוצאות", icon: <Star className="h-4 w-4" /> },
    { key: "details", label: labels?.details || "פרטים", icon: <Users className="h-4 w-4" /> },
    { key: "payment", label: labels?.payment || "תשלום", icon: <CreditCard className="h-4 w-4" /> },
    { key: "confirmation", label: labels?.confirmation || "אישור", icon: <CheckCircle2 className="h-4 w-4" /> },
  ]

  const currentIndex = steps.findIndex(s => s.key === currentStep)
  const progress = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="w-full mb-8">
      <Progress value={progress} className="h-2 mb-4" />
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep
          const isCompleted = index < currentIndex
          const isPending = index > currentIndex

          return (
            <div
              key={step.key}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive && "text-primary scale-110",
                isCompleted && "text-green-600",
                isPending && "text-muted-foreground opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-green-100 text-green-600",
                  isPending && "bg-muted"
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
              </div>
              <span className="text-xs font-medium hidden md:block">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// SEARCH FORM
// ============================================================================

function SearchForm({
  defaultCity,
  defaultHotelName,
}: {
  defaultCity?: string
  defaultHotelName?: string
}) {
  const booking = useBookingFlow()
  
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"))
  const [checkOut, setCheckOut] = useState(
    format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  )
  const [adults, setAdults] = useState(2)
  const [city, setCity] = useState(defaultCity || "")
  const [hotelName, setHotelName] = useState(defaultHotelName || "")

  const handleSearch = async () => {
    await booking.searchHotels({
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children: [],
      city: city || undefined,
      hotelName: hotelName || undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          חיפוש מלון
        </CardTitle>
        <CardDescription>מצאו את המלון המושלם לחופשה שלכם</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              עיר
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="תל אביב, ירושלים..."
            />
          </div>

          {/* Hotel Name (optional) */}
          <div className="space-y-2">
            <Label htmlFor="hotelName">שם מלון (אופציונלי)</Label>
            <Input
              id="hotelName"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              placeholder="חיפוש לפי שם..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Check In */}
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              צ'ק-אין
            </Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          {/* Check Out */}
          <div className="space-y-2">
            <Label htmlFor="checkOut" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              צ'ק-אאוט
            </Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="adults" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              אורחים
            </Label>
            <Input
              id="adults"
              type="number"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              min={1}
              max={10}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSearch} 
          disabled={booking.state.isLoading}
          className="w-full"
          size="lg"
        >
          {booking.state.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              מחפש...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 ml-2" />
              חפש מלונות
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ============================================================================
// RESULTS VIEW
// ============================================================================

function ResultsView({
  onRoomSelected,
}: {
  onRoomSelected?: (hotel: HotelResult, room: RoomResult) => void
}) {
  const booking = useBookingFlow()

  const handleSelectRoom = async (hotel: HotelResult, room: RoomResult) => {
    const success = await booking.selectRoom(hotel, room)
    if (success && onRoomSelected) {
      onRoomSelected(hotel, room)
    }
  }

  if (booking.state.searchResults.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">לא נמצאו תוצאות</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => booking.goToStep("search")}
          >
            חזור לחיפוש
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          נמצאו {booking.state.searchResults.length} מלונות
        </h2>
        <Button variant="outline" onClick={() => booking.goToStep("search")}>
          <ChevronRight className="h-4 w-4 ml-1" />
          חיפוש חדש
        </Button>
      </div>

      {booking.state.searchResults.map((hotel) => (
        <Card key={hotel.hotelId} className="overflow-hidden">
          <div className="md:flex">
            {/* Hotel Image */}
            <div className="md:w-1/3 h-48 md:h-auto">
              <img
                src={hotel.imageUrl || hotel.images?.[0] || "/placeholder-hotel.jpg"}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hotel Info */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {hotel.city}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.stars || 4 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.facilities?.slice(0, 5).map((facility, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>

              {/* Rooms */}
              <div className="space-y-3">
                <h4 className="font-semibold">חדרים זמינים:</h4>
                {hotel.rooms?.slice(0, 3).map((room) => (
                  <div 
                    key={room.code} 
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{room.roomName || room.roomCategory}</p>
                      <p className="text-sm text-muted-foreground">{room.boardType}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">
                        {room.currency} {room.buyPrice?.toLocaleString()}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleSelectRoom(hotel, room)}
                        disabled={booking.state.isLoading}
                      >
                        {booking.state.isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "הזמן עכשיו"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// DETAILS STEP
// ============================================================================

function DetailsStep({
  showPromoCode,
  showLoyalty,
  showTimer,
}: {
  showPromoCode?: boolean
  showLoyalty?: boolean
  showTimer?: boolean
}) {
  const booking = useBookingFlow()
  const [promoCode, setPromoCode] = useState("")

  const handleApplyPromo = async () => {
    if (promoCode) {
      await booking.applyPromoCode(promoCode)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="md:col-span-2 space-y-6">
        {/* PreBook Timer */}
        {showTimer && booking.prebookTimeRemaining && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>שמרו את ההזמנה</AlertTitle>
            <AlertDescription>
              <PreBookTimer
                expiresAt={booking.state.prebookData?.expiresAt || new Date()}
                onExpired={() => booking.goToStep("results")}
                warningMinutes={5}
              />
            </AlertDescription>
          </Alert>
        )}

        {/* Guest Form */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי האורח</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestDetailsForm
              onSubmit={(details) => booking.setGuestInfo(details)}
            />
          </CardContent>
        </Card>

        {/* Promo Code */}
        {showPromoCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                קוד קופון
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="הזינו קוד קופון"
                />
                <Button 
                  onClick={handleApplyPromo}
                  disabled={!promoCode || booking.state.isLoading}
                >
                  החל
                </Button>
              </div>
              {booking.state.appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-between">
                  <span>
                    <CheckCircle2 className="h-4 w-4 inline ml-1" />
                    {booking.state.appliedPromo.message}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => booking.removePromoCode()}
                  >
                    הסר
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loyalty */}
        {showLoyalty && booking.state.loyaltyInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                מועדון לקוחות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoyaltyBadge
                tier={booking.state.loyaltyInfo.tier}
                discount={booking.loyaltyDiscount}
                points={booking.state.loyaltyInfo.points}
              />
              {booking.state.loyaltyInfo.points > 0 && (
                <div className="mt-4">
                  <Label>נקודות לשימוש (עד {booking.state.loyaltyInfo.points})</Label>
                  <Input
                    type="number"
                    max={booking.state.loyaltyInfo.points}
                    value={booking.state.loyaltyInfo.pointsToUse}
                    onChange={(e) => 
                      booking.setLoyaltyPointsToUse(Number(e.target.value))
                    }
                    className="mt-2"
                  />
                  {booking.loyaltyDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      הנחה: ${booking.loyaltyDiscount.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Booking Summary */}
      <div className="md:col-span-1">
        <BookingSummary />
      </div>
    </div>
  )
}

// ============================================================================
// PAYMENT STEP
// ============================================================================

function PaymentStep({ useStripe = false }: { useStripe?: boolean }) {
  const booking = useBookingFlow()
  const [paymentMethod, setPaymentMethod] = useState<"manual" | "stripe">(
    useStripe ? "stripe" : "manual"
  )

  const handleStripeSuccess = async (paymentIntentId: string) => {
    // Update payment info with Stripe data and complete booking
    booking.setPaymentInfo({
      method: "stripe",
      stripePaymentIntentId: paymentIntentId,
    })
    await booking.processPayment()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {/* Payment Method Toggle */}
        {useStripe && (
          <Card>
            <CardContent className="pt-6">
              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "manual" | "stripe")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stripe" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Stripe
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    הזנה ידנית
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              תשלום
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethod === "stripe" && useStripe ? (
              <StripePaymentForm onSuccess={handleStripeSuccess} />
            ) : (
              <PaymentForm
                onSubmit={() => booking.completeBooking()}
                isProcessing={booking.state.isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <BookingSummary />
      </div>
    </div>
  )
}

// ============================================================================
// CONFIRMATION STEP
// ============================================================================

function ConfirmationStep({
  onComplete,
}: {
  onComplete?: (bookingId: string) => void
}) {
  const booking = useBookingFlow()

  useEffect(() => {
    if (booking.state.bookingConfirmation?.bookingId && onComplete) {
      onComplete(booking.state.bookingConfirmation.bookingId)
    }
  }, [booking.state.bookingConfirmation?.bookingId, onComplete])

  if (!booking.state.bookingConfirmation || !booking.state.selectedHotel || 
      !booking.state.selectedRoom || !booking.state.searchParams || 
      !booking.state.guestInfo) {
    return null
  }

  return (
    <BookingConfirmation
      bookingId={booking.state.bookingConfirmation.bookingId}
      supplierReference={booking.state.bookingConfirmation.supplierReference}
      hotel={booking.state.selectedHotel}
      room={booking.state.selectedRoom}
      searchParams={booking.state.searchParams}
      totalPrice={booking.totalPrice}
      currency={booking.state.bookingConfirmation.currency}
      guestName={`${booking.state.guestInfo.firstName} ${booking.state.guestInfo.lastName}`}
      guestEmail={booking.state.guestInfo.email}
      onNewBooking={() => booking.reset()}
    />
  )
}

// ============================================================================
// BOOKING SUMMARY
// ============================================================================

function BookingSummary() {
  const booking = useBookingFlow()

  if (!booking.state.selectedHotel || !booking.state.selectedRoom) {
    return null
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>סיכום הזמנה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hotel */}
        <div>
          <h4 className="font-semibold">{booking.state.selectedHotel.hotelName}</h4>
          <p className="text-sm text-muted-foreground">
            {booking.state.selectedRoom.roomName}
          </p>
        </div>

        <Separator />

        {/* Dates */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>צ'ק-אין:</span>
            <span>
              {booking.state.searchParams?.checkIn 
                ? format(booking.state.searchParams.checkIn, "dd/MM/yyyy", { locale: he })
                : "-"
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>צ'ק-אאוט:</span>
            <span>
              {booking.state.searchParams?.checkOut 
                ? format(booking.state.searchParams.checkOut, "dd/MM/yyyy", { locale: he })
                : "-"
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>לילות:</span>
            <span>{booking.nights}</span>
          </div>
          <div className="flex justify-between">
            <span>אורחים:</span>
            <span>{booking.state.searchParams?.adults || 2}</span>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>מחיר בסיס:</span>
            <span>
              {booking.state.prebookData?.currency || "USD"} {booking.subtotal.toLocaleString()}
            </span>
          </div>

          {booking.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>הנחת קופון:</span>
              <span>-{booking.state.prebookData?.currency || "USD"} {booking.discount.toLocaleString()}</span>
            </div>
          )}

          {booking.loyaltyDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>הנחת נקודות:</span>
              <span>-{booking.state.prebookData?.currency || "USD"} {booking.loyaltyDiscount.toLocaleString()}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>סה"כ לתשלום:</span>
            <span>
              {booking.state.prebookData?.currency || "USD"} {booking.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UniversalBookingFlow({
  variant = "default",
  theme = "auto",
  accentColor,
  defaultCity,
  defaultHotelName,
  showPromoCode = true,
  showLoyalty = true,
  showTimer = true,
  showSteps = true,
  useStripePayment = false,
  className,
  stepLabels,
  onSearchComplete,
  onRoomSelected,
  onBookingComplete,
}: UniversalBookingFlowProps) {
  const booking = useBookingFlow()

  return (
    <div 
      className={cn(
        "w-full max-w-6xl mx-auto p-4",
        variant === "compact" && "max-w-2xl",
        variant === "embedded" && "p-0",
        className
      )}
      dir="rtl"
    >
      {/* Step Indicator */}
      {showSteps && (
        <BookingStepIndicator 
          currentStep={booking.state.step} 
          labels={stepLabels}
        />
      )}

      {/* Error Display */}
      <BookingError>
        {(error, clearError) => (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={clearError}>
                סגור
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </BookingError>

      {/* PreBook Expiry Warning */}
      <PrebookWarning warningThreshold={300}>
        {(seconds, refresh) => (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">ההזמנה עומדת לפוג!</AlertTitle>
            <AlertDescription className="flex items-center justify-between text-yellow-600">
              <span>נותרו {Math.floor(seconds / 60)} דקות ו-{seconds % 60} שניות</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refresh}
                className="border-yellow-500 text-yellow-700"
              >
                <RefreshCw className="h-4 w-4 ml-1" />
                הארך זמן
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </PrebookWarning>

      {/* Step Content */}
      {booking.state.step === "search" && (
        <SearchForm 
          defaultCity={defaultCity} 
          defaultHotelName={defaultHotelName} 
        />
      )}

      {booking.state.step === "results" && (
        <ResultsView onRoomSelected={onRoomSelected} />
      )}

      {booking.state.step === "details" && (
        <DetailsStep 
          showPromoCode={showPromoCode}
          showLoyalty={showLoyalty}
          showTimer={showTimer}
        />
      )}

      {booking.state.step === "payment" && <PaymentStep useStripe={useStripePayment} />}

      {booking.state.step === "processing" && (
        <Card className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">מעבד את ההזמנה...</p>
          <p className="text-muted-foreground">אנא המתינו</p>
        </Card>
      )}

      {booking.state.step === "confirmation" && (
        <ConfirmationStep onComplete={onBookingComplete} />
      )}

      {/* Navigation */}
      {booking.state.step !== "search" && booking.state.step !== "confirmation" && (
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => booking.goBack()}>
            <ChevronRight className="h-4 w-4 ml-1" />
            חזור
          </Button>
        </div>
      )}
    </div>
  )
}

export default UniversalBookingFlow
