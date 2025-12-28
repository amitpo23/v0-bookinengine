"use client"

import { PromotionBanner } from "@/components/promotions/promotion-banner"
import { LuxurySearchBar } from "@/components/booking/templates/luxury"
import { EnhancedSearchResults } from "@/components/booking/enhanced-search-results"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { Loader2, AlertCircle, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"

const STEPS = [
  { id: "search", label: "חיפוש" },
  { id: "results", label: "בחירת סוויטה" },
  { id: "details", label: "פרטי אורח" },
  { id: "payment", label: "תשלום" },
  { id: "confirmation", label: "אישור" },
]

export default function LuxuryTemplatePage() {
  const booking = useBookingEngine()
  const today = new Date()

  const handleSearch = async (data: any) => {
    await booking.searchHotels({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.guests,
      children: [],
      hotelName: "Dizengoff Inn",
    })
  }

  // Transform API results to template format
  const transformedRooms = booking.searchResults.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      name: room.roomName,
      images: room.images.length > 0 ? room.images : ["/luxury-elegant-hotel-suite-gold.jpg"],
      size: room.size || 50,
      maxGuests: room.maxOccupancy,
      guestDescription: `עד ${room.maxOccupancy} אורחים`,
      amenities: (room.amenities.length > 0 ? room.amenities.slice(0, 6) : ["נוף פנורמי", "ספא פרטי", "באטלר", "מיניבר", "WiFi", "מיזוג"]).map(a => ({ icon: "luxury", label: a })),
      offers: [{
        id: room.roomId,
        code: room.code,
        title: room.roomName,
        description: "סוויטה מפוארת עם שירות יוקרתי",
        price: room.buyPrice,
        originalPrice: room.originalPrice || room.buyPrice * 1.3,
        board: room.boardType === "BB" ? "לינה וארוחת בוקר" : room.boardType === "HB" ? "חצי פנסיון" : "לינה בלבד",
        cancellationDate: "ביטול חינם עד 7 ימים לפני",
        refundable: true,
        badge: room.buyPrice < (room.originalPrice || room.buyPrice * 1.3) ? "מחיר יוקרתי" : undefined,
        roomData: room,
        hotelData: hotel,
      }],
      remainingRooms: room.available,
    })),
  )

  return (
    <div className="min-h-screen bg-stone-100" dir="rtl">
      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/templates"
            className="text-stone-500 hover:text-stone-800 transition-colors font-serif flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לטמפלטים
          </Link>
          <div className="text-center">
            <h1 className="font-serif text-3xl text-stone-800 tracking-widest">CHÂTEAU</h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest">LUXURY RESORT</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/my-account" className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">האזור האישי שלי</span>
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Booking Steps */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <BookingSteps steps={STEPS} currentStep={booking.step} variant="luxury" />
        </div>
      </div>

      {/* Error Alert */}
      {booking.error && (
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{booking.error}</AlertDescription>
            <Button variant="ghost" size="sm" onClick={booking.clearError}>
              סגור
            </Button>
          </Alert>
        </div>
      )}

      {/* Loading */}
      {booking.isLoading && (
        <div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <p className="text-stone-800 text-lg font-serif">טוען...</p>
          </div>
        </div>
      )}

      {/* STEP: Search */}
      {booking.step === "search" && (
        <>
          <div className="relative h-[60vh] bg-[url('/luxury-hotel-lobby-elegant-marble.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="font-serif text-6xl tracking-widest mb-4">CHÂTEAU</h1>
                <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-4" />
                <p className="text-xl tracking-wider">חוויית אירוח יוקרתית</p>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
            <LuxurySearchBar onSearch={handleSearch} />
          </div>
        </>
      )}

      {/* STEP: Results */}
      {booking.step === "results" && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-8">
            <LuxurySearchBar
              onSearch={handleSearch}
              initialData={{
                checkIn: booking.searchParams?.checkIn,
                checkOut: booking.searchParams?.checkOut,
                guests: booking.searchParams?.adults,
              }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 pb-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-stone-800 mb-4">הסוויטות שלנו</h2>
              <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
            </div>
            <EnhancedSearchResults
              rooms={transformedRooms}
              nights={booking.nights}
              onSelectOffer={(room, offer) =>
                booking.selectRoom(offer.hotelData, offer.roomData)
              }
              currency="₪"
              hotelName="CHÂTEAU Luxury Resort"
              hotelRating={5}
            />
          </div>
        </>
      )}

      {/* STEP: Details */}
      {booking.step === "details" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-serif text-stone-800 mb-6">פרטי האורח</h2>
            <GuestDetailsForm onSubmit={booking.setGuestInfo} isLoading={booking.isLoading} variant="luxury" />
          </div>
        </div>
      )}

      {/* STEP: Payment */}
      {booking.step === "payment" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-serif text-stone-800 mb-6">תשלום</h2>
            <PaymentForm
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom?.currency || "ILS"}
              onSubmit={booking.completeBooking}
              isLoading={booking.isLoading}
              variant="luxury"
            />
          </div>
        </div>
      )}

      {/* STEP: Confirmation */}
      {booking.step === "confirmation" &&
        booking.bookingConfirmation &&
        booking.selectedHotel &&
        booking.selectedRoom &&
        booking.searchParams &&
        booking.guestInfo && (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <BookingConfirmation
              bookingId={booking.bookingConfirmation.bookingId}
              supplierReference={booking.bookingConfirmation.supplierReference}
              hotel={booking.selectedHotel}
              room={booking.selectedRoom}
              searchParams={booking.searchParams}
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom.currency}
              guestName={`${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`}
              guestEmail={booking.guestInfo.email}
              onNewBooking={booking.reset}
              variant="luxury"
            />
          </div>
        )}
    </div>
  )
}
