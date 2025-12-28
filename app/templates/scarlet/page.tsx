"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { Calendar, Users, Heart, Sparkles, Bath, Home, Crown, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { scarletRoomTypes, scarletHotelConfig } from "@/lib/hotels/scarlet-config"
import { PromoCodeInput } from "@/components/promotions/promo-code-input"
import { LoyaltySignup } from "@/components/promotions/loyalty-signup"
import { LoyaltyBadge } from "@/components/promotions/loyalty-badge"
import { AffiliateTracker } from "@/components/analytics/affiliate-tracker"
import { trackEvent, trackPageView, trackSelectItem, trackSearch } from "@/lib/analytics/ga4"
import { LoginButton } from "@/components/auth/login-button"
import Link from "next/link"

export default function ScarletTemplate() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<string, number>>({})
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0)

  // Track page view on mount
  useEffect(() => {
    console.log('Scarlet Hotel Config Images:', {
      total: scarletHotelConfig.images.length,
      images: scarletHotelConfig.images
    })
    trackPageView(window.location.href, 'Scarlet Hotel Tel Aviv')
    trackEvent({
      event: 'page_view',
      page_title: 'Scarlet Hotel Tel Aviv',
      hotel_id: scarletHotelConfig.hotelId,
      template_name: 'scarlet'
    })
  }, [])

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    console.log('Setting up background image rotation for', scarletHotelConfig.images.length, 'images')
    const interval = setInterval(() => {
      setBackgroundImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % scarletHotelConfig.images.length
        console.log('Background image rotating from', prevIndex, 'to', nextIndex)
        return nextIndex
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    trackSearch(`${checkIn} to ${checkOut}, ${guests} guests`, {
      check_in: checkIn,
      check_out: checkOut,
      guests,
      hotel_id: scarletHotelConfig.hotelId
    })
    console.log("Searching:", { checkIn, checkOut, guests })
  }

  const handleBookRoom = (roomId: string) => {
    const room = scarletRoomTypes.find(r => r.id === roomId)
    setSelectedRoom(roomId)
    
    if (room) {
      trackSelectItem({
        item_id: roomId,
        item_name: room.name,
        price: room.basePrice,
        quantity: 1
      })
      
      trackEvent({
        event: 'select_room',
        room_id: roomId,
        room_name: room.name,
        room_price: room.basePrice,
        hotel_id: scarletHotelConfig.hotelId
      })
    }
    
    console.log("Booking room:", roomId)
  }

  const handlePromoApplied = (code: string, discountAmount: number) => {
    setPromoCode(code)
    setDiscount(discountAmount)
    
    trackEvent({
      event: 'apply_promotion',
      promotion_name: code,
      discount_amount: discountAmount,
      hotel_id: scarletHotelConfig.hotelId
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
            <span className="text-sm">חזרה לטמפלטים</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/my-account" className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">האזור האישי שלי</span>
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Gallery with Auto-Rotation */}
        <div className="absolute inset-0">
          {scarletHotelConfig.images && scarletHotelConfig.images.length > 0 ? (
            scarletHotelConfig.images.map((image, index) => (
              <div
                key={`bg-${index}`}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{
                  backgroundImage: `url('${image}')`,
                  opacity: backgroundImageIndex === index ? 1 : 0,
                  zIndex: backgroundImageIndex === index ? 2 : 1,
                }}
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Loading images...
              </div>
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="mb-6 inline-block">
            <Heart className="h-16 w-16 text-red-500 animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent">
            Scarlet
          </h1>
          
          <p className="text-3xl md:text-4xl font-light mb-2 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
            {scarletHotelConfig.hebrewName}
          </p>
          
          <p className="text-xl md:text-2xl text-white mb-12" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
            {scarletHotelConfig.hebrewTagline}
          </p>

          {/* Search Box */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 rounded-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-400" />
                  תאריך הגעה
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-400" />
                  תאריך עזיבה
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-400" />
                  מספר אורחים
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="bg-gray-800">
                      {num} {num === 1 ? "אורח" : "אורחים"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-[52px] bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/50"
                >
                  חפש חדרים
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            החדרים שלנו
          </h2>
          <p className="text-xl text-gray-300">
            גלו את החדר המושלם עבורכם
          </p>
        </div>

        <div className="space-y-16">
          {scarletRoomTypes.map((room, index) => (
            <Card
              key={room.id}
              className={`bg-gradient-to-br ${
                room.isPremium
                  ? "from-yellow-900/20 via-gray-900/20 to-gray-900/20 border-yellow-500/30"
                  : room.wowFactor
                  ? "from-pink-900/20 via-gray-900/20 to-gray-900/20 border-pink-500/30"
                  : "from-gray-900/50 via-gray-800/50 to-gray-900/50 border-white/10"
              } backdrop-blur-sm overflow-hidden group hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                {/* Image Gallery */}
                <div className={`relative h-80 lg:h-auto overflow-hidden group/gallery ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <img
                    src={room.images[roomImageIndexes[room.id] || 0]}
                    alt={room.hebrewName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Room Emoji Badge */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border-2 border-white/30">
                    {room.emoji}
                  </div>

                  {/* Special Badges */}
                  {room.isPremium && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500/90 text-black font-bold border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      PREMIUM
                    </Badge>
                  )}
                  {room.wowFactor && (
                    <Badge className="absolute top-4 left-4 bg-pink-500/90 text-white font-bold border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      WOW
                    </Badge>
                  )}

                  {/* Image Counter - only show if multiple images */}
                  {room.images.length > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {(roomImageIndexes[room.id] || 0) + 1}/{room.images.length}
                    </div>
                  )}

                  {/* Previous Button - only show if multiple images */}
                  {room.images.length > 1 && (
                    <button
                      onClick={() => {
                        const currentIndex = roomImageIndexes[room.id] || 0
                        const newIndex = currentIndex === 0 ? room.images.length - 1 : currentIndex - 1
                        setRoomImageIndexes(prev => ({ ...prev, [room.id]: newIndex }))
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-3 rounded-full transition-all opacity-0 group-hover/gallery:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}

                  {/* Next Button - only show if multiple images */}
                  {room.images.length > 1 && (
                    <button
                      onClick={() => {
                        const currentIndex = roomImageIndexes[room.id] || 0
                        const newIndex = currentIndex === room.images.length - 1 ? 0 : currentIndex + 1
                        setRoomImageIndexes(prev => ({ ...prev, [room.id]: newIndex }))
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-3 rounded-full transition-all opacity-0 group-hover/gallery:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}

                  {/* Dots Navigation - only show if multiple images */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                      {room.images.map((_, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => setRoomImageIndexes(prev => ({ ...prev, [room.id]: imgIndex }))}
                          className={`w-2 h-2 rounded-full transition-all ${
                            (roomImageIndexes[room.id] || 0) === imgIndex
                              ? "bg-white w-8"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${imgIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4 bg-red-600/90 backdrop-blur-md px-6 py-3 rounded-full">
                    <div className="text-2xl font-bold">₪{room.basePrice}</div>
                    <div className="text-xs text-gray-200">ללילה</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold mb-2 text-white">
                      {room.hebrewName}
                    </h3>
                    <p className="text-sm text-gray-400 mb-1">{room.name}</p>
                    <p className="text-lg text-red-400 italic">
                      {room.tagline}
                    </p>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 text-right">
                    {room.description}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                    <div className="text-center">
                      <Home className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-sm text-gray-400">גודל</div>
                      <div className="font-bold">{room.size} מ"ר</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-sm text-gray-400">אורחים</div>
                      <div className="font-bold">עד {room.maxGuests}</div>
                    </div>
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-sm text-gray-400">מקלחת</div>
                      <div className="font-bold">מלאה</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-red-400">מה כלול:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {room.special && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 text-red-400 mb-1">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-semibold">מיוחד במינו:</span>
                      </div>
                      <p className="text-sm text-gray-300">{room.special}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleBookRoom(room.id)}
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
                  >
                    הזמן עכשיו
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              השירותים שלנו
            </h2>
            <p className="text-gray-400">כל מה שצריך לחופשה מושלמת</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scarletHotelConfig.amenities.map((amenity, idx) => (
              <Card key={idx} className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
                <div className="text-red-400 mb-2">
                  <Sparkles className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-300">{amenity}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Code & Loyalty Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              הטבות והנחות
            </h2>
            <p className="text-gray-400">חסכו יותר בהזמנה הבאה</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Promo Code */}
            <Card className="bg-gradient-to-br from-red-900/20 via-gray-900/50 to-gray-900/50 backdrop-blur-sm border-red-500/30 p-6">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-400" />
                קוד הנחה
              </h3>
              <PromoCodeInput
                onPromoApplied={handlePromoApplied}
                hotelId={scarletHotelConfig.hotelId}
                variant="dark"
              />
              {discount > 0 && (
                <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                  <p className="text-green-400 text-sm font-semibold">
                    🎉 הנחה של {discount}% הופעלה!
                  </p>
                </div>
              )}
            </Card>

            {/* Loyalty Club */}
            <Card className="bg-gradient-to-br from-pink-900/20 via-gray-900/50 to-gray-900/50 backdrop-blur-sm border-pink-500/30 p-6">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-pink-400" />
                מועדון לקוחות
              </h3>
              <LoyaltyBadge hotelId={scarletHotelConfig.hotelId} variant="dark" />
              <div className="mt-4">
                <LoyaltySignup hotelId={scarletHotelConfig.hotelId} variant="dark" />
              </div>
            </Card>
          </div>

          {/* Benefits */}
          <Card className="bg-gradient-to-br from-yellow-900/20 via-gray-900/50 to-purple-900/20 backdrop-blur-sm border-yellow-500/30 p-8">
            <div className="text-center mb-6">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">
                מה מקבלים חברי VIP?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">10% הנחה</h4>
                <p className="text-sm text-gray-400">על כל ההזמנות</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">שדרוג חינם</h4>
                <p className="text-sm text-gray-400">כפוף לזמינות</p>
              </div>
              <div className="text-center">
                <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">צ'ק-אין מהיר</h4>
                <p className="text-sm text-gray-400">ללא המתנה</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Affiliate Tracker */}
      <AffiliateTracker hotelId={scarletHotelConfig.hotelId} />

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{scarletHotelConfig.hebrewName}</h3>
            <p className="text-gray-400">{scarletHotelConfig.tagline}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 mb-6 text-sm text-gray-400">
            <div>
              <span className="font-semibold text-white">טלפון:</span>{" "}
              {scarletHotelConfig.contact.phone}
            </div>
            <div>
              <span className="font-semibold text-white">אימייל:</span>{" "}
              {scarletHotelConfig.contact.email}
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 Scarlet Hotel Tel Aviv. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
