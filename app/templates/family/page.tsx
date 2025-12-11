"use client"

import { FamilySearchBar, FamilyRoomCard } from "@/components/booking/templates/family"
import Link from "next/link"

const mockRooms = [
  {
    id: "1",
    name: "סוויטה משפחתית גדולה",
    description: "סוויטה מרווחת עם 2 חדרי שינה, מטבחון, וגישה ישירה לבריכה - מושלם למשפחות!",
    size: 65,
    maxGuests: 6,
    price: 750,
    originalPrice: 950,
    images: ["/family-suite-pool-kids-friendly.jpg"],
    kidsFriendly: true,
    amenities: ["2 חדרי שינה", "מטבחון", "גישה לבריכה", "ערוצי ילדים"],
  },
  {
    id: "2",
    name: "חדר קונקט למשפחות",
    description: "2 חדרים מחוברים עם דלת פנימית, מושלם למשפחות עם ילדים גדולים יותר",
    size: 50,
    maxGuests: 4,
    price: 580,
    images: ["/connecting-rooms-family-hotel.jpg"],
    kidsFriendly: true,
    amenities: ["2 חדרים מחוברים", "2 חדרי רחצה", "מיניבר", "WiFi"],
  },
]

export default function FamilyTemplatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-sky-600 hover:text-sky-800 transition-colors font-bold">
            ← חזרה לטמפלטים
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏖️</span>
            <div>
              <h1 className="font-bold text-2xl text-gray-800">SunKids Resort</h1>
              <p className="text-sky-600 text-sm">חופשה משפחתית מושלמת!</p>
            </div>
          </div>
          <div />
        </div>
      </header>

      {/* Hero */}
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

      {/* Search */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <FamilySearchBar onSearch={(data) => console.log(data)} />
      </div>

      {/* Rooms */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">🛏️ החדרים שלנו 🛏️</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockRooms.map((room) => (
            <FamilyRoomCard key={room.id} room={room} onSelect={(id) => console.log("Selected:", id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
