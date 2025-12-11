"use client"

import { LuxurySearchBar, LuxuryRoomCard } from "@/components/booking/templates/luxury"
import Link from "next/link"

const mockRooms = [
  {
    id: "1",
    name: "Royal Suite",
    description: "סוויטה מלכותית עם נוף מדהים, חדר שינה נפרד, סלון מרווח וגישה בלעדית לטרקלין VIP של המלון",
    size: 85,
    maxGuests: 4,
    price: 2200,
    images: ["/royal-luxury-suite-elegant-gold.jpg"],
    amenities: ["נוף פנורמי", "טרקלין VIP", "באטלר אישי", "ספא פרטי"],
    features: ["חדר שינה נפרד", "סלון מרווח", "חדר רחצה שיש", "מרפסת פרטית", "שירות חדרים 24/7", "מיניבר פרימיום"],
  },
  {
    id: "2",
    name: "Grand Deluxe",
    description: "חדר דלוקס מפנק עם ריהוט יוקרתי, מיטת קינג סייז ונוף עוצר נשימה",
    size: 50,
    maxGuests: 2,
    price: 1400,
    images: ["/grand-deluxe-luxury-hotel-room.jpg"],
    amenities: ["מיטת קינג", "נוף לים", "אמבט פרטי", "WiFi מהיר"],
    features: ["מיטת קינג סייז", "אמבט שיש", "מקלחון גשם", "מוצרי טיפוח יוקרתיים", "חלוקי רחצה", "נעלי בית"],
  },
]

export default function LuxuryTemplatePage() {
  return (
    <div className="min-h-screen bg-stone-100" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/templates" className="text-stone-500 hover:text-stone-800 transition-colors font-serif">
            ← חזרה לטמפלטים
          </Link>
          <div className="text-center">
            <h1 className="font-serif text-3xl text-stone-800 tracking-widest">CHÂTEAU</h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest">LUXURY RESORT</p>
          </div>
          <div />
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-[60vh] bg-[url('/luxury-hotel-lobby-elegant.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-serif text-6xl tracking-widest mb-4">CHÂTEAU</h1>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-4" />
            <p className="text-xl tracking-wider">חוויית אירוח יוקרתית</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <LuxurySearchBar onSearch={(data) => console.log(data)} />
      </div>

      {/* Rooms */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-stone-800 mb-4">הסוויטות שלנו</h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
        </div>
        <div className="space-y-8">
          {mockRooms.map((room) => (
            <LuxuryRoomCard key={room.id} room={room} onSelect={(id) => console.log("Selected:", id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
