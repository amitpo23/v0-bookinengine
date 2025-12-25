"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Maximize2, 
  Coffee, 
  Wifi,
  Tv, 
  Wind,
  CheckCircle2,
  Star,
  Heart,
  Share2,
  Info,
  Sparkles,
  MapPin,
  Calendar,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RoomAmenity {
  icon: string
  label: string
}

interface RoomOffer {
  id: string
  code: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  board: string
  cancellationDate?: string
  features?: string[]
  refundable?: boolean
  badge?: string
}

interface EnhancedRoomCardProps {
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
  nights?: number
  hotelRating?: number
  hotelName?: string
}

const amenityIcons: Record<string, any> = {
  ac: Wind,
  coffee: Coffee,
  wifi: Wifi,
  tv: Tv,
  bath: Coffee,
  fridge: Coffee,
}

export function EnhancedRoomCard({
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
  nights = 1,
  hotelRating,
  hotelName,
}: EnhancedRoomCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showAllOffers, setShowAllOffers] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const lowestOffer = offers.reduce((min, offer) => 
    offer.price < min.price ? offer : min, offers[0]
  )

  const savings = lowestOffer.originalPrice 
    ? Math.round(((lowestOffer.originalPrice - lowestOffer.price) / lowestOffer.originalPrice) * 100)
    : 0

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const totalPrice = lowestOffer.price * nights
  const originalTotalPrice = lowestOffer.originalPrice ? lowestOffer.originalPrice * nights : null

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 bg-white" dir="rtl">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery Section - Now with Modern Design */}
        <div className="relative lg:w-96 h-72 lg:h-auto flex-shrink-0 group">
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Image Navigation with Modern Style */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="תמונה קודמת"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="תמונה הבאה"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-full">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    idx === currentImage 
                      ? "w-6 h-2 bg-white" 
                      : "w-2 h-2 bg-white/60 hover:bg-white/80"
                  )}
                  aria-label={`עבור לתמונה ${idx + 1}`}
                />
              ))}
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {savings > 0 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 shadow-lg font-bold border-0">
                  <Sparkles className="w-3 h-3 ml-1 inline" />
                  חסכו {savings}%
                </Badge>
              )}
              {remainingRooms && remainingRooms <= 3 && (
                <Badge className="bg-red-600 text-white px-3 py-1.5 shadow-lg animate-pulse border-0">
                  נותרו רק {remainingRooms}!
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-lg hover:scale-110",
                  isLiked ? "bg-red-500 text-white" : "bg-white/95 text-gray-700"
                )}
                aria-label="הוסף למועדפים"
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </button>
              <button
                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110"
                aria-label="שתף"
              >
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Room Details Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {name}
                </h3>
                {hotelName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{hotelName}</span>
                    {hotelRating && (
                      <div className="flex items-center gap-1 mr-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{hotelRating}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2">
              {size && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Maximize2 className="w-4 h-4" />
                  <span>{size} מ״ר</span>
                </div>
              )}
              {(maxGuests || guestDescription) && (
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Users className="w-4 h-4" />
                  <span>{guestDescription || `עד ${maxGuests} אורחים`}</span>
                </div>
              )}
              {nights > 1 && (
                <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Moon className="w-4 h-4" />
                  <span>{nights} לילות</span>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            {amenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {amenities.slice(0, 6).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity.icon] || Coffee
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="font-medium">{amenity.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Offers Section */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-white">
            {/* Best Offer - Always Visible */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-teal-500 text-white border-0">
                      {lowestOffer.board}
                    </Badge>
                    {lowestOffer.refundable && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">ביטול חינם</span>
                      </div>
                    )}
                  </div>
                  
                  {lowestOffer.cancellationDate && (
                    <p className="text-sm text-gray-600 mb-3">
                      ביטול חינם עד {lowestOffer.cancellationDate}
                    </p>
                  )}

                  {/* Features List */}
                  {lowestOffer.features && lowestOffer.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {lowestOffer.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-teal-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="text-left mr-6">
                  {originalTotalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400 line-through">
                        {originalTotalPrice} {currency}
                      </span>
                      <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                        חסכו {originalTotalPrice - totalPrice} {currency}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-teal-600">
                      {totalPrice}
                    </span>
                    <span className="text-xl text-gray-600">{currency}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {nights > 1 ? `סה״כ ל-${nights} לילות` : "ללילה אחד"} • כולל מע״מ
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ({lowestOffer.price} {currency} ללילה)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => onSelectOffer?.(lowestOffer)}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-semibold"
                >
                  הזמן עכשיו
                </Button>
                {offers.length > 1 && (
                  <Button
                    onClick={() => setShowAllOffers(!showAllOffers)}
                    variant="outline"
                    size="lg"
                    className="h-12 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold"
                  >
                    {showAllOffers ? "הסתר" : `עוד ${offers.length - 1} אפשרויות`}
                  </Button>
                )}
              </div>
            </div>

            {/* Additional Offers - Expandable */}
            {showAllOffers && offers.length > 1 && (
              <div className="border-t border-gray-200">
                {offers.slice(1).map((offer, index) => {
                  const offerTotal = offer.price * nights
                  const offerOriginalTotal = offer.originalPrice ? offer.originalPrice * nights : null

                  return (
                    <div 
                      key={offer.id || index} 
                      className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-teal-300 text-teal-700">
                              {offer.board}
                            </Badge>
                            {offer.badge && (
                              <Badge className="bg-blue-500 text-white border-0">
                                {offer.badge}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{offer.title}</h4>
                          {offer.cancellationDate && (
                            <p className="text-sm text-gray-600">
                              ביטול חינם עד {offer.cancellationDate}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mr-6">
                          <div className="text-left">
                            {offerOriginalTotal && (
                              <div className="text-sm text-gray-400 line-through">
                                {offerOriginalTotal} {currency}
                              </div>
                            )}
                            <div className="text-2xl font-bold text-gray-900">
                              {offerTotal} {currency}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({offer.price} {currency} ללילה)
                            </div>
                          </div>

                          <Button
                            onClick={() => onSelectOffer?.(offer)}
                            variant="outline"
                            className="border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold"
                          >
                            בחר
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
