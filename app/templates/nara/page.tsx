"use client"

import { useState } from "react"
import {
  NaraSearchBar,
  PriceComparison,
  NaraRoomCard,
  NaraCalendarPicker,
  AddonsCarousel,
  BookingSidebar,
} from "@/components/booking/templates/nara-style"
import { addDays } from "date-fns"

export default function NaraTemplatePage() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)

  const today = new Date()

  // Sample data
  const rooms = [
    {
      name: "יחידות סופיריור",
      images: ["/luxury-hotel-sea-view.png", "/modern-hotel-bathroom.jpg"],
      size: 41,
      maxGuests: 4,
      guestDescription: "למשפחות או קבוצות עד 4 אורחים",
      amenities: [
        { icon: "ac", label: "מיזוג אוויר" },
        { icon: "coffee", label: "ערכת קפה ותה" },
        { icon: "bath", label: "חדר אמבטיה" },
        { icon: "fridge", label: "מקרר" },
      ],
      offers: [
        {
          id: "1",
          title: "הנחה מיוחדת לאזרחים ותיקים וכרטיסים לחמי טבריה!",
          description: "",
          price: 570,
          originalPrice: 900,
          board: "לינה וארוחת בוקר",
          cancellationDate: "12 בדצמבר 2025, ב 23:59",
          badge: "מחיר מבצע",
        },
        {
          id: "2",
          title: "חופשה זוגית מושלמת באמצע השבוע!",
          description: "",
          price: 600,
          originalPrice: 900,
          board: "לינה וארוחת בוקר",
          cancellationDate: "12 בדצמבר 2025, ב 23:59",
          badge: "מחיר מבצע",
        },
      ],
    },
    {
      name: "יחידות סטודיו",
      images: ["/studio-hotel-room-sea-view.jpg"],
      size: 18,
      maxGuests: 2,
      guestDescription: "לזוג או לזוג + ילד",
      amenities: [
        { icon: "ac", label: "מיזוג אוויר" },
        { icon: "coffee", label: "ערכת קפה ותה" },
        { icon: "microwave", label: "מיקרוגל" },
        { icon: "tv", label: "נוף לים" },
      ],
      remainingRooms: 4,
      offers: [
        {
          id: "3",
          title: "מבצע לזוגות!",
          price: 570,
          board: "לינה וארוחת בוקר",
          badge: "מחיר מבצע",
        },
      ],
    },
  ]

  const addons = [
    {
      id: "1",
      name: "ערכת מדורה",
      description: "ערכת המדורה כוללת כל המספיק לבערך 3 חבילות מרשמלו, 6",
      price: 220,
      image: "/campfire-kit-marshmallows.jpg",
    },
    {
      id: "2",
      name: "ערכת מנגל",
      description: "ערכה הכוללת מנגל + רשת + חבילת פחמים + מדליק פחמים",
      price: 120,
      image: "/bbq-grill-kit.jpg",
    },
    {
      id: "3",
      name: "ארוחת ערב חג",
      description: "חגיגה קולינרית על שפת הכנרת! צוות השפים המיומן שלנו הכין עבורכם חוויה קול...",
      price: 600,
      image: "/holiday-dinner-honey-pomegranate.jpg",
    },
    {
      id: "4",
      name: "ארוחת ערב שישי",
      description: "ארוחת ערב שבת בזה יה, מוגשת בחדר האוכל כשברקע נוף מדהים לכנרת. הארוחה מוגשת ב...",
      price: 360,
      image: "/shabbat-dinner-candles.jpg",
    },
  ]

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <NaraSearchBar
        hotelName="NARA"
        initialData={{
          location: "כפר הנופש דריה",
          checkIn: addDays(today, 5),
          checkOut: addDays(today, 6),
          guests: 2,
          rooms: 1,
        }}
        onSearch={(data) => console.log("Search:", data)}
      />

      {/* Price Comparison */}
      <PriceComparison sitePrice={570} />

      {/* Filter */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-gray-600 hover:bg-gray-50">
            <span>סינון לפי:</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="flex gap-6" dir="rtl">
          {/* Sidebar */}
          <BookingSidebar
            checkIn={addDays(today, 5)}
            checkOut={addDays(today, 6)}
            nights={1}
            rooms={1}
            guests={2}
            selectedRoom={selectedRoom}
            totalPrice={selectedRoom?.price || 570}
            onBook={() => console.log("Book")}
          />

          {/* Room List */}
          <div className="flex-1 space-y-6">
            {rooms.map((room, index) => (
              <NaraRoomCard key={index} {...room} onSelectOffer={(offer) => setSelectedRoom({ ...room, ...offer })} />
            ))}
          </div>
        </div>
      </div>

      {/* Addons Section */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-6">
          <AddonsCarousel addons={addons} onAddAddon={(addon) => console.log("Add addon:", addon)} />
        </div>
      </div>

      {/* Calendar Modal (for demo) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4">
            <NaraCalendarPicker
              prices={calendarPrices}
              onSelectDates={(checkIn, checkOut) => {
                console.log("Selected dates:", checkIn, checkOut)
                setShowCalendar(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
