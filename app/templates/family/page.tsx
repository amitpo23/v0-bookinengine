"use client"

import { PromotionBanner } from "@/components/promotions/promotion-banner"
import { FamilySearchBar } from "@/components/booking/templates/family"
import { EnhancedSearchResults } from "@/components/booking/enhanced-search-results"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { Loader2, AlertCircle, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  EnhancedLoadingOverlay,
  AnimatedBookingSteps,
  AnimatedSearchResults,
  AnimatedCard,
  EmptyState,
  ErrorState,
  showToast,
} from "@/components/templates/enhanced-ui"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"

const STEPS = [
  { id: "search", label: "חיפוש" },
  { id: "results", label: "בחירת חדר" },
  { id: "details", label: "פרטים" },
  { id: "payment", label: "תשלום" },
  { id: "confirmation", label: "סיום" },
]

function FamilyTemplateContent() {
  const booking = useBookingEngine()
  const today = new Date()

  const handleSearch = async (data: any) => {
    try {
      await booking.searchHotels({
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.childrenAges || [],
        hotelName: "Dizengoff Inn",
      })
      if (booking.searchResults.length > 0) {
        showToast.success('נמצאו חדרים!', `${booking.searchResults.length} אפשרויות זמינות`)
      }
    } catch (error) {
      showToast.error('שגיאה בחיפוש', 'נסה שוב מאוחר יותר')
    }
  }

  // Transform API results to template format
  const transformedRooms = booking.searchResults.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      name: room.roomName,
      images: room.images.length > 0 ? room.images : ["/family-friendly-hotel-room-kids.jpg"],
      size: room.size || 45,
      maxGuests: room.maxOccupancy,
      guestDescription: `עד ${room.maxOccupancy} אורחים`,
      amenities: (room.amenities.length > 0 ? room.amenities.slice(0, 6) : ["WiFi חינם", "מטבחון", "ערוצי ילדים", "מיזוג", "משחקים", "מקרר"]).map(a => ({ icon: "family", label: a })),
      offers: [{
        id: room.roomId,
        code: room.code,
        title: room.roomName,
        description: "חדר מרווח ומשפחתי עם כל מה שצריך! 🎉",
        price: room.buyPrice,
        originalPrice: room.originalPrice || room.buyPrice * 1.25,
        board: room.boardType === "BB" ? "🍳 ארוחת בוקר" : room.boardType === "HB" ? "🍽️ חצי פנסיון" : "🛏️ לינה בלבד",
        cancellationDate: "ביטול חינם עד 3 ימים לפני",
        refundable: true,
        badge: room.buyPrice < (room.originalPrice || room.buyPrice * 1.25) ? "מבצע משפחתי" : undefined,
        roomData: room,
        hotelData: hotel,
      }],
      remainingRooms: room.available,
    })),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-50" dir="rtl">
      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/templates"
            className="text-sky-600 hover:text-sky-800 transition-colors font-bold flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לטמפלטים
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏖️</span>
            <div>
              <h1 className="font-bold text-2xl text-gray-800">SunKids Resort</h1>
              <p className="text-sky-600 text-sm">חופשה משפחתית מושלמת!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/my-account" className="flex items-center gap-2 text-sky-700 hover:text-orange-500 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-bold">האזור האישי שלי</span>
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Booking Steps */}
      <div className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-6">
          <BookingSteps steps={STEPS} currentStep={booking.step} variant="family" />
        </div>
      </div>

      {/* Error Alert */}
      {booking.error && (
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">{booking.error}</AlertDescription>
            <Button variant="ghost" size="sm" onClick={booking.clearError}>
              סגור
            </Button>
          </Alert>
        </div>
      )}

      {/* Loading */}
      {booking.isLoading && (
        <div className="fixed inset-0 bg-purple-900/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-gray-800 text-lg font-bold">טוען... 🎉</p>
          </div>
        </div>
      )}

      {/* STEP: Search */}
      {booking.step === "search" && (
        <>
          <div className="relative py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">🌈 ברוכים הבאים ל-SunKids! 🌈</h1>
              <p className="text-xl text-gray-600 mb-8">המקום המושלם לחופשה משפחתית בלתי נשכחת!</p>
              <div className="flex justify-center gap-4 text-4xl">
                <span>🏊</span>
                <span>🎢</span>
                <span>🍦</span>
                <span>🎮</span>
                <span>🌴</span>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 mb-16">
            <FamilySearchBar onSearch={handleSearch} />
          </div>
        </>
      )}

      {/* STEP: Results */}
      {booking.step === "results" && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-8">
            <FamilySearchBar
              onSearch={handleSearch}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">🛏️ החדרים שלנו 🛏️</h2>
            <EnhancedSearchResults
              rooms={transformedRooms}
              nights={booking.nights}
              onSelectOffer={(room, offer) =>
                booking.selectRoom(offer.hotelData, offer.roomData)
              }
              currency="₪"
              hotelName="SunKids Resort"
              hotelRating={4}
            />
          </div>
        </>
      )}

      {/* STEP: Details */}
      {booking.step === "details" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👨‍👩‍👧‍👦 פרטי המשפחה</h2>
            <GuestDetailsForm onSubmit={booking.setGuestInfo} isLoading={booking.isLoading} variant="family" />
          </div>
        </div>
      )}

      {/* STEP: Payment */}
      {booking.step === "payment" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 תשלום</h2>
            <PaymentForm
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom?.currency || "ILS"}
              onSubmit={booking.completeBooking}
              isLoading={booking.isLoading}
              variant="family"
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
              variant="family"
            />
          </div>
        )}
    </div>
  )
}

export default function FamilyTemplatePage() {
  return (
    <ErrorBoundary>
      <FamilyTemplateContent />
    </ErrorBoundary>
  )
}
