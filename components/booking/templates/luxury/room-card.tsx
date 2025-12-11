"use client"

import { useState } from "react"
import Image from "next/image"

interface LuxuryRoomCardProps {
  room: {
    id: string
    name: string
    description: string
    size: number
    maxGuests: number
    price: number
    images: string[]
    amenities: string[]
    features: string[]
  }
  onSelect?: (roomId: string) => void
}

export function LuxuryRoomCard({ room, onSelect }: LuxuryRoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="bg-white border border-stone-200" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="relative h-80 lg:h-auto">
          <Image
            src={room.images[currentImage] || "/placeholder.svg?height=400&width=600&query=luxury suite elegant"}
            alt={room.name}
            fill
            className="object-cover"
          />

          {/* Image Navigation */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
              {room.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-12 h-1 transition-colors ${idx === currentImage ? "bg-amber-600" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12 flex flex-col">
          <div className="mb-6">
            <h3 className="font-serif text-3xl text-stone-800 mb-2">{room.name}</h3>
            <div className="flex items-center gap-6 text-stone-500 text-sm uppercase tracking-wider">
              <span>{room.size} מ״ר</span>
              <span className="w-1 h-1 bg-stone-400 rounded-full" />
              <span>עד {room.maxGuests} אורחים</span>
            </div>
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">{room.description}</p>

          {/* Features */}
          <div className="border-t border-b border-stone-200 py-6 mb-6">
            <h4 className="text-xs uppercase tracking-widest text-stone-500 mb-4">שירותים</h4>
            <div className="grid grid-cols-2 gap-3">
              {room.features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-stone-700">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="text-stone-500 text-sm block mb-1">החל מ-</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl text-stone-800">₪{room.price}</span>
                <span className="text-stone-500">/לילה</span>
              </div>
            </div>
            <button
              onClick={() => onSelect?.(room.id)}
              className="bg-stone-800 hover:bg-stone-900 text-white uppercase tracking-widest text-sm px-8 py-4 transition-colors"
            >
              הזמן עכשיו
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
