"use client"

import { ModernDarkSearchBar, ModernDarkRoomCard } from "@/components/booking/templates/modern-dark"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const STEPS = [
  { id: "search", label: "חיפוש" },
  { id: "results", label: "בחירת חדר" },
  { id: "details", label: "פרטי אורח" },
  { id: "payment", label: "תשלום" },
  { id: "confirmation", label: "אישור" },
]

export default function ModernDarkTemplatePage() {
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

  const handleSelectRoom = async (roomId: string) => {
    const hotel = booking.searchResults[0]
    const room = hotel?.rooms.find((r) => r.roomId === roomId) || hotel?.rooms[0]
    if (hotel && room) {
      await booking.selectRoom(hotel, room)
    }
  }

  // Transform API results to template format
  const transformedRooms = booking.searchResults.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      id: room.roomId,
      name: room.roomName,
      description: `חדר מרווח עם ${room.bedding || "מיטה זוגית"}`,
      size: room.size || 35,
      maxGuests: room.maxOccupancy,
      price: room.buyPrice,
      originalPrice: room.originalPrice || undefined,
      images: room.images.length > 0 ? room.images : ["/modern-dark-hotel-room.jpg"],
      amenities: room.amenities.length > 0 ? room.amenities : ["WiFi", "מיזוג", "מיניבר"],
      available: room.available,
      hotelData: hotel,
      roomData: room,
    })),
  )

  return (
    <div className="min-h-screen bg-zinc-950" dir="rtl">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            חזרה לטמפלטים
          </Link>
          <h1 className="text-white font-bold text-xl">THE NOIR HOTEL</h1>
          <div />
        </div>
      </header>

      {/* Booking Steps */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <BookingSteps steps={STEPS} currentStep={booking.step} variant="dark" />
        </div>
      </div>

      {/* Error Alert */}
      {booking.error && (
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Alert variant="destructive" className="bg-red-900/50 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">{booking.error}</AlertDescription>
            <Button variant="ghost" size="sm" onClick={booking.clearError} className="text-white">
              סגור
            </Button>
          </Alert>
        </div>
      )}

      {/* Loading */}
      {booking.isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="text-white text-lg">טוען...</p>
          </div>
        </div>
      )}

      {/* STEP: Search */}
      {booking.step === "search" && (
        <>
          <div className="relative h-[50vh] bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">THE NOIR HOTEL</h1>
              <p className="text-zinc-400 text-xl">חוויה מודרנית ויוקרתית</p>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
            <ModernDarkSearchBar onSearch={handleSearch} />
          </div>
        </>
      )}

      {/* STEP: Results */}
      {booking.step === "results" && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-8">
            <ModernDarkSearchBar
              onSearch={handleSearch}
              initialData={{
                checkIn: booking.searchParams?.checkIn,
                checkOut: booking.searchParams?.checkOut,
                guests: booking.searchParams?.adults,
              }}
            />
          </div>
          <div className="max-w-5xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-bold text-white mb-8">החדרים הזמינים</h2>
            {transformedRooms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {transformedRooms.map((room) => (
                  <ModernDarkRoomCard
                    key={room.id}
                    room={room}
                    onSelect={() => booking.selectRoom(room.hotelData, room.roomData)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-800 rounded-lg">
                <p className="text-zinc-400">לא נמצאו חדרים זמינים</p>
                <Button
                  className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black"
                  onClick={() => booking.goToStep("search")}
                >
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
          <div className="bg-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">פרטי האורח</h2>
            <GuestDetailsForm onSubmit={booking.setGuestInfo} isLoading={booking.isLoading} variant="dark" />
          </div>
        </div>
      )}

      {/* STEP: Payment */}
      {booking.step === "payment" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">תשלום</h2>
            <PaymentForm
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom?.currency || "ILS"}
              onSubmit={booking.completeBooking}
              isLoading={booking.isLoading}
              variant="dark"
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
              variant="dark"
            />
          </div>
        )}
    </div>
  )
}
