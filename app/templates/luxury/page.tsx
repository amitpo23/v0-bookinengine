"use client"

import { LuxurySearchBar, LuxuryRoomCard } from "@/components/booking/templates/luxury"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

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
      hotelName: "נארה",
    })
  }

  // Transform API results to template format
  const transformedRooms = booking.searchResults.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      id: room.roomId,
      name: room.roomName,
      description: `סוויטה מפוארת עם שירות יוקרתי`,
      size: room.size || 50,
      maxGuests: room.maxOccupancy,
      price: room.buyPrice,
      images: room.images.length > 0 ? room.images : ["/luxury-elegant-hotel-suite-gold.jpg"],
      amenities: room.amenities.length > 0 ? room.amenities.slice(0, 4) : ["נוף פנורמי", "ספא פרטי", "באטלר", "מיניבר"],
      features: room.amenities.length > 0 ? room.amenities : ["מיטת קינג", "אמבט שיש", "חלוקי רחצה", "שירות 24/7"],
      hotelData: hotel,
      roomData: room,
    })),
  )

  return (
    <div className="min-h-screen bg-stone-100" dir="rtl">
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
          <div />
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
          <div className="max-w-5xl mx-auto px-6 pb-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-stone-800 mb-4">הסוויטות שלנו</h2>
              <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
            </div>
            {transformedRooms.length > 0 ? (
              <div className="space-y-8">
                {transformedRooms.map((room) => (
                  <LuxuryRoomCard
                    key={room.id}
                    room={room}
                    onSelect={() => booking.selectRoom(room.hotelData, room.roomData)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-stone-500 font-serif">לא נמצאו סוויטות זמינות</p>
                <Button className="mt-4 bg-amber-600 hover:bg-amber-700" onClick={() => booking.goToStep("search")}>
                  חזרה לחיפוש
                </Button>
              </div>
            )}
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
