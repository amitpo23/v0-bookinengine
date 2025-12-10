"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Users, Maximize2, Eye, Wifi, Coffee, Tv, Wind, X } from "lucide-react"

interface RoomImage {
  url: string
  alt: string
}

interface Amenity {
  icon: React.ReactNode
  label: string
}

interface RateOption {
  id: string
  name: string
  nameHe: string
  price: number
  originalPrice?: number
  features: string[]
  featuresHe: string[]
  refundable: boolean
}

interface Room {
  id: string
  name: string
  nameHe: string
  description: string
  descriptionHe: string
  images: RoomImage[]
  size: number
  maxOccupancy: number
  amenities: string[]
  rateOptions: RateOption[]
  rating?: number
  reviewCount?: number
}

interface RoomCardProps {
  room: Room
  nights: number
  onBook: (roomId: string, rateId: string) => void
  language?: "en" | "he"
}

const RoomCard: React.FC<RoomCardProps> = ({ room, nights, onBook, language = "he" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRate, setSelectedRate] = useState<string>(room.rateOptions[0]?.id)

  const isHebrew = language === "he"

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    ac: <Wind className="w-5 h-5" />,
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)
  }

  const calculateSavings = (original?: number, current?: number) => {
    if (!original || !current) return 0
    return original - current
  }

  const selectedRateOption = room.rateOptions.find((r) => r.id === selectedRate) || room.rateOptions[0]
  const totalPrice = selectedRateOption.price * nights
  const originalTotalPrice = selectedRateOption.originalPrice ? selectedRateOption.originalPrice * nights : null
  const savings = originalTotalPrice ? calculateSavings(originalTotalPrice, totalPrice) : 0

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden mb-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Image Gallery Section */}
          <div className="lg:col-span-1 relative group">
            <div className="relative h-80 lg:h-full overflow-hidden">
              <img
                src={room.images[currentImageIndex].url}
                alt={room.images[currentImageIndex].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Image Navigation */}
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white w-6" : "bg-white/60"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {/* View Gallery Button */}
              <button
                onClick={() => setShowGallery(true)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                {isHebrew ? `כל התמונות (${room.images.length})` : `All Photos (${room.images.length})`}
              </button>

              {/* Special Offer Badge */}
              {savings > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold">
                  {isHebrew ? `חסכו ₪${savings}` : `Save ₪${savings}`}
                </div>
              )}
            </div>
          </div>

          {/* Room Details Section */}
          <div className="lg:col-span-2 p-6 lg:p-8">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {isHebrew ? room.nameHe : room.name}
                  </h3>
                  {room.rating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(room.rating!) ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span>
                        ({room.reviewCount} {isHebrew ? "ביקורות" : "reviews"})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Icons */}
              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <Maximize2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">
                    {room.size} {isHebrew ? "מ״ר" : "m²"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">
                    {isHebrew ? `עד ${room.maxOccupancy} אורחים` : `Up to ${room.maxOccupancy} guests`}
                  </span>
                </div>
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">
                      {amenityIcons[amenity.toLowerCase()] || <Coffee className="w-5 h-5" />}
                    </span>
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{isHebrew ? room.descriptionHe : room.description}</p>

              {/* Rate Options */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-900">
                  {isHebrew ? "בחרו תעריף:" : "Select Rate:"}
                </h4>
                <div className="space-y-3">
                  {room.rateOptions.map((rate) => {
                    const rateTotal = rate.price * nights
                    const rateOriginal = rate.originalPrice ? rate.originalPrice * nights : null
                    const rateSavings = rateOriginal ? rateOriginal - rateTotal : 0

                    return (
                      <div
                        key={rate.id}
                        onClick={() => setSelectedRate(rate.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRate === rate.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-bold text-gray-900">{isHebrew ? rate.nameHe : rate.name}</h5>
                              {rate.refundable && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  {isHebrew ? "ניתן לביטול" : "Refundable"}
                                </span>
                              )}
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {(isHebrew ? rate.featuresHe : rate.features).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="text-green-500">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right">
                            {rateOriginal && (
                              <div className="text-sm text-gray-400 line-through mb-1">
                                ₪{rateOriginal.toLocaleString()}
                              </div>
                            )}
                            <div className="text-2xl font-bold text-blue-600">₪{rateTotal.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              ₪{rate.price.toLocaleString()} / {isHebrew ? "לילה" : "night"}
                            </div>
                            {rateSavings > 0 && (
                              <div className="text-sm font-bold text-orange-600 mt-1">
                                {isHebrew ? "חיסכון" : "Save"} ₪{rateSavings.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300"
                >
                  {isHebrew ? "פרטים נוספים" : "More Details"}
                </button>
                <button
                  onClick={() => onBook(room.id, selectedRate)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isHebrew ? "הזמינו עכשיו - תשלום במלון" : "Book Now - Pay at Hotel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={room.images[currentImageIndex].url}
              alt={room.images[currentImageIndex].alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 ${idx === currentImageIndex ? "ring-4 ring-blue-500" : ""}`}
                >
                  <img src={img.url} alt={img.alt} className="w-20 h-20 object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold">{isHebrew ? room.nameHe : room.name}</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-3">{isHebrew ? "תיאור" : "Description"}</h4>
                <p className="text-gray-600 leading-relaxed">{isHebrew ? room.descriptionHe : room.description}</p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3">{isHebrew ? "מתקנים ושירותים" : "Amenities & Services"}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-blue-600">
                        {amenityIcons[amenity.toLowerCase()] || <Coffee className="w-5 h-5" />}
                      </span>
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3">{isHebrew ? "מידע נוסף" : "Additional Information"}</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• {isHebrew ? `גודל החדר: ${room.size} מ״ר` : `Room size: ${room.size} m²`}</li>
                  <li>
                    •{" "}
                    {isHebrew
                      ? `תפוסה מקסימלית: ${room.maxOccupancy} אורחים`
                      : `Maximum occupancy: ${room.maxOccupancy} guests`}
                  </li>
                  <li>• {isHebrew ? "צ׳ק-אין: 15:00" : "Check-in: 3:00 PM"}</li>
                  <li>• {isHebrew ? "צ׳ק-אאוט: 11:00" : "Check-out: 11:00 AM"}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDetails(false)
                onBook(room.id, selectedRate)
              }}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              {isHebrew ? "המשך להזמנה" : "Continue to Booking"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default RoomCard
