"use client"

import { useState } from "react"
import Image from "next/image"

interface ModernDarkRoomCardProps {
  room: {
    id: string
    name: string
    description: string
    size: number
    maxGuests: number
    price: number
    originalPrice?: number
    images: string[]
    amenities: string[]
    available: number
  }
  onSelect?: (roomId: string) => void
}

export function ModernDarkRoomCard({ room, onSelect }: ModernDarkRoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const discount = room.originalPrice ? Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100) : 0

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={room.images[currentImage] || "/placeholder.svg?height=256&width=400&query=luxury hotel room dark"}
          alt={room.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% הנחה
          </div>
        )}

        {/* Availability Badge */}
        {room.available <= 3 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
            נותרו {room.available} חדרים
          </div>
        )}

        {/* Image Navigation */}
        {room.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {room.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{room.name}</h3>
            <div className="flex items-center gap-4 text-zinc-400 text-sm">
              <span>{room.size} מ״ר</span>
              <span>עד {room.maxGuests} אורחים</span>
            </div>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{room.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 4).map((amenity, idx) => (
            <span key={idx} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs">
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs">
              +{room.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">₪{room.price}</span>
              {room.originalPrice && <span className="text-zinc-500 line-through">₪{room.originalPrice}</span>}
            </div>
            <span className="text-zinc-400 text-sm">ללילה</span>
          </div>
          <button
            onClick={() => onSelect?.(room.id)}
            className="bg-white hover:bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            בחר חדר
          </button>
        </div>
      </div>
    </div>
  )
}
