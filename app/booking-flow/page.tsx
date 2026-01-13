"use client"

import { useState } from "react"
import { EnhancedSearchForm, SearchParams } from "@/components/booking/enhanced-search-form"
import { SimpleRoomCard } from "@/components/booking/simple-room-card"
import { BookingSummary } from "@/components/booking/booking-summary-sidebar"
import { GuestDetailsForm, GuestDetails } from "@/components/booking/guest-details-form"
import { SaveDetailsDialog } from "@/components/booking/save-details-dialog"
import { differenceInDays } from "date-fns"

type BookingStep = "search" | "rooms" | "details" | "payment"

export default function BookingFlowPage() {
  const [step, setStep] = useState<BookingStep>("search")
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Mock rooms data
  const mockRooms = [
    {
      id: "standard",
      name: "חדר סטנדרט",
      images: ["/room1.jpg", "/room2.jpg", "/room3.jpg"],
      price: 943,
      originalPrice: 1110,
      discount: 15,
      size: 25,
      maxOccupancy: 3,
      bedType: "מיטה זוגית",
      boardType: "לינה בלבד",
      amenities: ["WiFi", "מיזוג", "טלוויזיה", "ארוחת בוקר"],
      description: "חדר סטנדרט שלנו הוא בגודל ונוחות ומציע 25 מ'ר של פינוק. בחדר יכולים להתארח שני אורחים."
    },
    {
      id: "parlor",
      name: "חדר פרלור",
      images: ["/room4.jpg", "/room5.jpg"],
      price: 943,
      originalPrice: 1110,
      discount: 15,
      size: 26,
      maxOccupancy: 4,
      bedType: "מיטה זוגית + 2 אורחים",
      boardType: "לינה בלבד",
      amenities: ["WiFi", "מיזוג", "טלוויזיה", "מטבח קטן"],
      description: "חדר פרלור שלנו הוא גדול ונוחות ומציע 26 מ'ר של פינוק. בחדר יכולים להתארח 2 אורחים בנוחות."
    }
  ]

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
    setStep("rooms")
  }

  const handleBookRoom = (roomId: string) => {
    const room = mockRooms.find(r => r.id === roomId)
    setSelectedRoom(room)
    setStep("details")
  }

  const handleViewDetails = (roomId: string) => {
    // TODO: Show room details modal
    console.log("View details for", roomId)
  }

  const handleGuestDetailsSubmit = (details: GuestDetails) => {
    if (details.saveDetails) {
      setShowSaveDialog(true)
    } else {
      proceedToPayment(details)
    }
  }

  const handleSaveDetails = (rememberChoice: boolean) => {
    // TODO: Save to local storage or backend
    setShowSaveDialog(false)
    // Proceed to payment
  }

  const proceedToPayment = (details: GuestDetails) => {
    setStep("payment")
    // TODO: Integrate with payment gateway
  }

  const calculatePricing = () => {
    if (!searchParams || !selectedRoom) return null

    const nights = differenceInDays(searchParams.dates.to!, searchParams.dates.from)
    const subtotal = selectedRoom.price * nights
    const taxes = Math.round(subtotal * 0.17)
    const total = subtotal + taxes

    return {
      roomPrice: selectedRoom.price,
      nights,
      subtotal,
      taxes,
      total
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">מנוע הזמנות Brown Hotels</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Step */}
        {step === "search" && (
          <div className="max-w-4xl mx-auto">
            <EnhancedSearchForm onSearch={handleSearch} />
          </div>
        )}

        {/* Rooms Step */}
        {step === "rooms" && (
          <div className="grid lg:grid-cols-[1fr_350px] gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">חדרים זמינים</h2>
                <button
                  onClick={() => setStep("search")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  שנה חיפוש
                </button>
              </div>

              {mockRooms.map((room) => (
                <SimpleRoomCard
                  key={room.id}
                  room={room}
                  onBook={handleBookRoom}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            <div className="lg:sticky lg:top-6 h-fit">
              <BookingSummary
                dates={searchParams!.dates as any}
                guests={searchParams!.guests}
              />
            </div>
          </div>
        )}

        {/* Details Step */}
        {step === "details" && selectedRoom && (
          <div className="grid lg:grid-cols-[1fr_350px] gap-6">
            <div>
              <GuestDetailsForm
                onSubmit={handleGuestDetailsSubmit}
              />
            </div>

            <div className="lg:sticky lg:top-6 h-fit">
              <BookingSummary
                room={{
                  name: selectedRoom.name,
                  image: selectedRoom.images[0],
                  boardType: selectedRoom.boardType
                }}
                dates={searchParams!.dates as any}
                guests={searchParams!.guests}
                pricing={calculatePricing()!}
              />
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">תשלום מאובטח</h2>
              <p className="text-muted-foreground">
                כאן יהיה אינטגרציה עם שער תשלום...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Save Details Dialog */}
      {selectedRoom && searchParams && (
        <SaveDetailsDialog
          isOpen={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          guestDetails={{
            firstName: "",
            lastName: "",
            email: ""
          }}
          onSave={handleSaveDetails}
          onSkip={() => {
            setShowSaveDialog(false)
            proceedToPayment({} as GuestDetails)
          }}
        />
      )}
    </div>
  )
}
