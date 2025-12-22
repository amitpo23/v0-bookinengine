"use client"

import { useState } from "react"
import { PromotionBanner } from "@/components/promotions/promotion-banner"
import {
  NaraSearchBar,
  PriceComparison,
  NaraRoomCard,
  NaraCalendarPicker,
  AddonsCarousel,
  BookingSidebar,
} from "@/components/booking/templates/nara-style"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { addDays } from "date-fns"
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

// Sample addons data
const addons = [
  {
    id: "1",
    name: "ערכת מדורה",
    description: "ערכת המדורה כוללת כל המספיק לבערך 3 חבילות מרשמלו",
    price: 220,
    image: "/campfire-kit-with-marshmallows.jpg",
  },
  {
    id: "2",
    name: "ערכת מנגל",
    description: "ערכה הכוללת מנגל + רשת + חבילת פחמים + מדlicer פחמים",
    price: 120,
    image: "/bbq-grill-kit.jpg",
  },
  {
    id: "3",
    name: "ארוחת ערב חג",
    description: "חגיגה קולינרית על שפת הכנרת!",
    price: 600,
    image: "/holiday-dinner-honey-pomegranate.jpg",
  },
]

export default function NaraTemplatePage() {
  const booking = useBookingEngine()
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const today = new Date()

  // Generate calendar prices
  const calendarPrices = Array.from({ length: 60 }, (_, i) => {
    const date = addDays(today, i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
    return {
      date,
      price: isWeekend ? 921 : [555, 570, 650, 690, 698][Math.floor(Math.random() * 5)],
      available: Math.random() > 0.1,
      isHoliday: Math.random() > 0.9,
      isSpecialEvent: Math.random() > 0.95,
    }
  })

  // Handle search
  const handleSearch = async (data: any) => {
    await booking.searchHotels({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.guests,
      children: [],
      hotelName: "Dizengoff Inn", // שם מלון אמיתי במערכת Medici
    })
  }

  // Handle room selection
  const handleSelectRoom = async (hotel: any, room: any) => {
    const hotelResult = {
      hotelId: hotel.hotelId || 67919,
      hotelName: hotel.hotelName || hotel.name || "NARA Hotels",
      city: hotel.city || "טבריה",
      stars: hotel.stars || 4,
      address: hotel.address || "",
      imageUrl: hotel.imageUrl || "",
      images: hotel.images || [],
      description: hotel.description || "",
      facilities: hotel.facilities || [],
      rooms: [],
    }

    const roomResult = {
      code: room.code || room.id || `${hotelResult.hotelId}:${room.categoryId || 1}:double:BB:${Date.now()}`,
      roomId: room.roomId || room.id || "1",
      roomName: room.name || room.roomName || room.title || "יחידות סופيريור",
      roomCategory: room.roomCategory || "superior",
      categoryId: room.categoryId || 2,
      boardId: room.boardId || 2,
      boardType: room.boardType || "BB",
      buyPrice: room.price || room.buyPrice || 570,
      originalPrice: room.originalPrice || 900,
      currency: room.currency || "ILS",
      maxOccupancy: room.maxGuests || 4,
      size: room.size || 41,
      view: room.view || "",
      bedding: room.bedding || "",
      amenities: room.amenities?.map((a: any) => a.label || a) || [],
      images: room.images || [],
      cancellationPolicy: room.cancellationPolicy || "free",
      available: room.available || 5,
    }

    await booking.selectRoom(hotelResult, roomResult)
  }

  // Transform API results to template format
  const transformedRooms = booking.searchResults.flatMap((hotel) =>
    hotel.rooms.map((room) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      name: room.roomName,
      images: room.images.length > 0 ? room.images : ["/luxury-hotel-room.png"],
      size: room.size || 41,
      maxGuests: room.maxOccupancy,
      guestDescription: `עד ${room.maxOccupancy} אורחים`,
      amenities: [
        { icon: "ac", label: "מיזוג אוויר" },
        { icon: "coffee", label: "ערכת קפה ותה" },
        { icon: "bath", label: "חדר אמבטיה" },
        { icon: "fridge", label: "מקרר" },
      ],
      offers: [
        {
          id: room.roomId,
          code: room.code,
          title: room.roomName,
          description: "",
          price: room.buyPrice,
          originalPrice: room.originalPrice || room.buyPrice * 1.3,
          board: room.boardType === "BB" ? "לינה וארוחת בוקר" : room.boardType === "HB" ? "חצי פנסיון" : "לינה בלבד",
          cancellationDate: "ביטול חינם עד 3 ימים לפני",
          badge: room.buyPrice < (room.originalPrice || room.buyPrice * 1.3) ? "מחיר מבצע" : undefined,
          roomData: room,
          hotelData: hotel,
        },
      ],
    })),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            חזרה לטמפלטים
          </Link>
          <h1 className="text-2xl font-bold text-[#0a3d62]">NARA HOTELS</h1>
          <div />
        </div>
      </header>

      {/* Booking Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <BookingSteps steps={STEPS} currentStep={booking.step} />
        </div>
      </div>

      {/* Error Alert */}
      {booking.error && (
        <div className="container mx-auto px-6 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{booking.error}</AlertDescription>
            <Button variant="ghost" size="sm" onClick={booking.clearError}>
              סגור
            </Button>
          </Alert>
        </div>
      )}

      {/* Loading Overlay */}
      {booking.isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0a3d62]" />
            <p className="text-lg">טוען...</p>
          </div>
        </div>
      )}

      {/* STEP: Search */}
      {booking.step === "search" && (
        <>
          <NaraSearchBar
            hotelName="NARA"
            initialData={{
              location: "כפר הנופש דריה",
              checkIn: addDays(today, 5),
              checkOut: addDays(today, 6),
              guests: 2,
              rooms: 1,
            }}
            onSearch={handleSearch}
          />
          <div className="container mx-auto px-6 py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ברוכים הבאים ל-NARA Hotels</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">בחרו תאריכים ומספר אורחים כדי למצוא את החדר המושלם עבורכם</p>
          </div>
        </>
      )}

      {/* STEP: Results */}
      {booking.step === "results" && (
        <>
          <NaraSearchBar
            hotelName="NARA"
            initialData={{
              location: booking.searchParams?.hotelName || "כפר הנופש דריה",
              checkIn: booking.searchParams?.checkIn || addDays(today, 5),
              checkOut: booking.searchParams?.checkOut || addDays(today, 6),
              guests: booking.searchParams?.adults || 2,
              rooms: 1,
            }}
            onSearch={handleSearch}
          />

          <PriceComparison sitePrice={transformedRooms[0]?.offers[0]?.price || 570} />

          <div className="container mx-auto px-6 pb-12">
            <div className="flex gap-6" dir="rtl">
              <BookingSidebar
                checkIn={booking.searchParams?.checkIn || addDays(today, 5)}
                checkOut={booking.searchParams?.checkOut || addDays(today, 6)}
                nights={booking.nights}
                rooms={1}
                guests={booking.searchParams?.adults || 2}
                selectedRoom={
                  booking.selectedRoom
                    ? { name: booking.selectedRoom.roomName, price: booking.selectedRoom.buyPrice }
                    : null
                }
                totalPrice={booking.totalPrice}
                onBook={() => {}}
              />

              <div className="flex-1 space-y-6">
                {transformedRooms.length > 0 ? (
                  transformedRooms.map((room, index) => (
                    <NaraRoomCard
                      key={index}
                      {...room}
                      onSelectOffer={(offer) =>
                        handleSelectRoom(
                          { hotelId: room.hotelId, hotelName: room.hotelName },
                          { ...offer.roomData, ...offer },
                        )
                      }
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500">לא נמצאו חדרים זמינים לתאריכים שנבחרו</p>
                    <Button className="mt-4" onClick={() => booking.goToStep("search")}>
                      חזרה לחיפוש
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white py-12 border-t">
            <div className="container mx-auto px-6">
              <AddonsCarousel
                addons={addons}
                onAddAddon={(addon) => setSelectedAddons([...selectedAddons, addon.id])}
              />
            </div>
          </div>
        </>
      )}

      {/* STEP: Guest Details */}
      {booking.step === "details" && (
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-6" dir="rtl">
            <BookingSidebar
              checkIn={booking.searchParams?.checkIn || today}
              checkOut={booking.searchParams?.checkOut || addDays(today, 1)}
              nights={booking.nights}
              rooms={1}
              guests={booking.searchParams?.adults || 2}
              selectedRoom={
                booking.selectedRoom
                  ? { name: booking.selectedRoom.roomName, price: booking.selectedRoom.buyPrice }
                  : null
              }
              totalPrice={booking.totalPrice}
              onBook={() => {}}
            />

            <div className="flex-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">פרטי האורח</h2>
                <GuestDetailsForm onSubmit={booking.setGuestInfo} isLoading={booking.isLoading} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP: Payment */}
      {booking.step === "payment" && (
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-6" dir="rtl">
            <BookingSidebar
              checkIn={booking.searchParams?.checkIn || today}
              checkOut={booking.searchParams?.checkOut || addDays(today, 1)}
              nights={booking.nights}
              rooms={1}
              guests={booking.searchParams?.adults || 2}
              selectedRoom={
                booking.selectedRoom
                  ? { name: booking.selectedRoom.roomName, price: booking.selectedRoom.buyPrice }
                  : null
              }
              totalPrice={booking.totalPrice}
              onBook={() => {}}
            />

            <div className="flex-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">תשלום</h2>
                <PaymentForm
                  totalPrice={booking.totalPrice}
                  currency={booking.selectedRoom?.currency || "ILS"}
                  onSubmit={booking.completeBooking}
                  isLoading={booking.isLoading}
                />
              </div>
            </div>
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
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-2xl mx-auto">
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
              />
            </div>
          </div>
        )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4">
            <NaraCalendarPicker
              prices={calendarPrices}
              onSelectDates={(checkIn, checkOut) => {
                setShowCalendar(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
