"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Users, Maximize2, Coffee, Tv, Bath, Snowflake, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RoomAmenity {
  icon: string
  label: string
}

interface RoomOffer {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  board: string
  cancellationPolicy?: string
  cancellationDate?: string
  badge?: string
}

interface RoomCardProps {
  name: string
  images: string[]
  size?: number
  maxGuests?: number
  guestDescription?: string
  amenities?: RoomAmenity[]
  offers: RoomOffer[]
  remainingRooms?: number
  onSelectOffer?: (offer: RoomOffer) => void
  currency?: string
}

const amenityIcons: Record<string, any> = {
  ac: Snowflake,
  coffee: Coffee,
  tv: Tv,
  bath: Bath,
  fridge: Snowflake,
  microwave: Tv,
}

export function NaraRoomCard({
  name,
  images,
  size,
  maxGuests,
  guestDescription,
  amenities = [],
  offers,
  remainingRooms,
  onSelectOffer,
  currency = "₪",
}: RoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showPrices, setShowPrices] = useState(false)

  const lowestPrice = Math.min(...offers.map((o) => o.price))

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
      <div className="flex">
        {/* Room Info Section */}
        <div className="flex-1 p-6">
          {/* Room Name */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">{name}</h3>

          {/* Size and Guests */}
          <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
            {size && (
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span>{size} מ"ר</span>
              </div>
            )}
            {(maxGuests || guestDescription) && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{guestDescription || `עד ${maxGuests} אורחים`}</span>
              </div>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity.icon] || Coffee
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <IconComponent className="w-4 h-4 text-gray-400" />
                  <span>{amenity.label}</span>
                </div>
              )
            })}
          </div>

          {/* More Info Link */}
          <button className="text-teal-600 text-sm hover:underline">מידע מפורט</button>
        </div>

        {/* Image Gallery */}
        <div className="relative w-72 h-48 flex-shrink-0">
          <img
            src={images[currentImage] || "/placeholder.svg?height=200&width=300&query=hotel room"}
            alt={name}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Search className="w-3 h-3" />
            <span>{images.length}</span>
          </div>
        </div>
      </div>

      {/* Price Section - Collapsed */}
      {!showPrices && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button onClick={() => setShowPrices(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
              הצג מחירים
            </Button>
            <div className="text-left">
              <Badge className="bg-teal-500 text-white mb-1">% מחיר מבצע</Badge>
              <div className="text-sm text-gray-500">החל מ</div>
              <div className="text-2xl font-bold text-teal-600">
                {lowestPrice} {currency}
              </div>
              <div className="text-xs text-gray-500">לחדר ללילה אחד כולל מע"מ</div>
            </div>
            {remainingRooms && remainingRooms <= 4 && (
              <div className="text-red-500 text-sm">נותרו {remainingRooms} חדרים</div>
            )}
          </div>
        </div>
      )}

      {/* Price Section - Expanded */}
      {showPrices && (
        <div className="border-t border-gray-100">
          {offers.map((offer, index) => (
            <div key={offer.id || index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Button onClick={() => onSelectOffer?.(offer)} className="bg-teal-600 hover:bg-teal-700 text-white">
                    הזמן עכשיו
                  </Button>
                  <div className="text-left">
                    {offer.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        {offer.originalPrice} {currency}
                      </div>
                    )}
                    <div className="text-xl font-bold text-teal-600">
                      {offer.price} {currency}
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-6">
                  {offer.badge && <Badge className="bg-teal-500 text-white mb-2">% מחיר מבצע</Badge>}
                  <h4 className="font-bold text-gray-800 mb-1">{offer.title}</h4>
                  {offer.cancellationDate && (
                    <div className="flex items-center gap-2 text-sm text-teal-600">
                      <span>✓</span>
                      <span>ביטול חינם עד {offer.cancellationDate}</span>
                      <button className="text-gray-500 hover:underline">מדיניות ביטולים</button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Coffee className="w-4 h-4" />
                  <span>{offer.board}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
