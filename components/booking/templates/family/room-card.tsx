"use client"

import { useState } from "react"
import Image from "next/image"

interface FamilyRoomCardProps {
  room: {
    id: string
    name: string
    description: string
    size: number
    maxGuests: number
    price: number
    originalPrice?: number
    images: string[]
    kidsFriendly: boolean
    amenities: string[]
  }
  onSelect?: (roomId: string) => void
}

export function FamilyRoomCard({ room, onSelect }: FamilyRoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const discount = room.originalPrice ? Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100) : 0

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-sky-100 hover:border-sky-300 transition-all hover:shadow-2xl"
      dir="rtl"
    >
      {/* Image */}
      <div className="relative h-56">
        <Image
          src={room.images[currentImage] || "/placeholder.svg?height=224&width=400&query=family resort pool kids"}
          alt={room.name}
          fill
          className="object-cover"
        />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              🔥 {discount}% הנחה!
            </div>
          )}
          {room.kidsFriendly && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              👶 מתאים לילדים
            </div>
          )}
        </div>

        {/* Image Navigation */}
        {room.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {room.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentImage ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>

        <div className="flex items-center gap-4 text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <span>📐</span> {room.size} מ״ר
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span> עד {room.maxGuests} אורחים
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between bg-gradient-to-r from-amber-50 to-orange-50 -mx-6 -mb-6 p-6 mt-4">
          <div>
            {room.originalPrice && <span className="text-gray-400 line-through text-lg">₪{room.originalPrice}</span>}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-orange-600">₪{room.price}</span>
              <span className="text-gray-500">/לילה</span>
            </div>
          </div>
          <button
            onClick={() => onSelect?.(room.id)}
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            🎉 הזמן עכשיו!
          </button>
        </div>
      </div>
    </div>
  )
}
