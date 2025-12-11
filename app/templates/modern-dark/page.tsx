"use client"

import { ModernDarkSearchBar, ModernDarkRoomCard } from "@/components/booking/templates/modern-dark"
import Link from "next/link"

const mockRooms = [
  {
    id: "1",
    name: "סוויטה פרימיום",
    description: "סוויטה מעוצבת עם נוף פנורמי לים, אמבטיה עם ג׳קוזי ומרפסת פרטית",
    size: 55,
    maxGuests: 3,
    price: 850,
    originalPrice: 1100,
    images: ["/premium-suite-dark-modern.jpg"],
    amenities: ["נוף לים", "ג׳קוזי", "מרפסת", "מיניבר", "WiFi"],
    available: 2,
  },
  {
    id: "2",
    name: "חדר דלוקס",
    description: "חדר מרווח עם עיצוב מודרני, מיטה זוגית ואזור ישיבה נפרד",
    size: 35,
    maxGuests: 2,
    price: 550,
    images: ["/deluxe-room-modern-dark.jpg"],
    amenities: ["מיטה זוגית", "אזור ישיבה", "מקלחון", "WiFi"],
    available: 5,
  },
]

export default function ModernDarkTemplatePage() {
  return (
    <div className="min-h-screen bg-zinc-950" dir="rtl">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-zinc-400 hover:text-white transition-colors">
            ← חזרה לטמפלטים
          </Link>
          <h1 className="text-white font-bold text-xl">Modern Dark Template</h1>
          <div />
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-[50vh] bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">THE NOIR HOTEL</h1>
          <p className="text-zinc-400 text-xl">חוויה מודרנית ויוקרתית</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <ModernDarkSearchBar onSearch={(data) => console.log(data)} />
      </div>

      {/* Rooms */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">החדרים שלנו</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockRooms.map((room) => (
            <ModernDarkRoomCard key={room.id} room={room} onSelect={(id) => console.log("Selected:", id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
