"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { Calendar, Users, Heart, Sparkles, Bath, Home, Crown, User, ChevronLeft, ChevronRight, MessageCircle, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SocialShare } from "@/components/ui/social-share"
import { scarletRoomTypes, scarletHotelConfig } from "@/lib/hotels/scarlet-config"
import { LoyaltySignup } from "@/components/promotions/loyalty-signup"
import { LoyaltyBadge } from "@/components/promotions/loyalty-badge"
import { PromotionBanner } from "@/components/promotions/promotion-banner"
import { AffiliateTracker } from "@/components/analytics/affiliate-tracker"
import { trackEvent, trackPageView, trackSelectItem, trackSearch } from "@/lib/analytics/ga4"
import { LoginButton } from "@/components/auth/login-button"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/booking/language-switcher"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { BookingSteps, GuestDetailsForm, PaymentForm, BookingConfirmation } from "@/components/booking/templates/shared"
import { PreBookTimer } from "@/components/booking/prebook-timer"
import { addDays } from "date-fns"
import Link from "next/link"
import { ErrorBoundary } from "@/components/error-boundary"
import { AnimatedCard, showToast } from "@/components/templates/enhanced-ui"
import { motion, AnimatePresence } from "framer-motion"

// Helper function to normalize API rooms to display format
function normalizeApiRoom(apiRoom: any, index: number) {
  const emojis = ['💎', '❤️', '💼', '☀️', '🌙', '✨', '🎭', '🏆']
  const hebrewNames = ['הקלאסי הזוגי', 'הרומנטי הזוגי', 'האקונומי הזוגי', 'קלאסי עם מרפסת', 'סוויט מלוכה', 'חדר דלוקס', 'חדר פרימיום', 'סוויט ויו']
  
  return {
    id: apiRoom.roomId || apiRoom.code || `room-${index}`,
    name: apiRoom.roomName || `Room ${index + 1}`,
    hebrewName: hebrewNames[index % hebrewNames.length] || apiRoom.roomName || `חדר ${index + 1}`,
    emoji: emojis[index % emojis.length],
    tagline: apiRoom.view ? `עם נוף ${apiRoom.view}` : "חדר עם כל הנוחיות",
    description: `חדר בגודל ${apiRoom.size || 20} מ"ר עם קיבול של עד ${apiRoom.maxOccupancy || 2} אורחים. ` + 
                 (apiRoom.amenities?.length > 0 ? `כולל: ${apiRoom.amenities.slice(0, 3).join(', ')}.` : ""),
    size: apiRoom.size || 20,
    maxGuests: apiRoom.maxOccupancy || 2,
    basePrice: Math.round(apiRoom.buyPrice || 0),
    currency: apiRoom.currency || "ILS",
    features: apiRoom.amenities?.slice(0, 7) || [
      "מיטה נוחה",
      "טלוויזיה חכמה",
      "מיזוג אוויר",
      "מקלחת חמה",
      "מגבות רכות",
      "קפה/תה",
      "נוף"
    ],
    images: apiRoom.images?.length > 0 ? apiRoom.images : [
      "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-1.jpg"
    ],
    apiRoom: apiRoom // Keep original API data for reference
  }
}

function ScarletTemplateContent() {
  const { t, locale, dir } = useI18n()
  
  // Helper function to check if a hotel is The Scarlet Hotel (production ID: 12466)
  // ONLY Scarlet - no fallback hotels for this dedicated template
  const isScarletHotel = (hotel: any) => {
    if (!hotel) return false
    const hotelName = (hotel.hotelName || hotel.name || '').toLowerCase()
    const hotelId = String(hotel.hotelId || '')
    const seoName = (hotel.seoname || '').toLowerCase()

    return (
      hotelId === '12466' ||
      hotelName.includes('scarlet') ||
      seoName === 'scarlet-12466'
    )
  }
  
  // Get filtered Scarlet results
  const getScarletResults = () => {
    if (!booking.searchResults || booking.searchResults.length === 0) return null
    
    // Find Scarlet hotel in results
    const scarletHotel = booking.searchResults.find(isScarletHotel)
    return scarletHotel || null
  }
  
  // Set document metadata dynamically
  useEffect(() => {
    const title = locale === 'he' 
      ? `${scarletHotelConfig.hebrewName} - ${scarletHotelConfig.hebrewTagline}` 
      : `Scarlet Hotel Tel Aviv - A romantic experience in the heart of Tel Aviv`
    
    const description = scarletHotelConfig.description
    
    document.title = title
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }
    
    // Add/Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: scarletHotelConfig.images[0] },
      { property: 'og:site_name', content: 'Scarlet Hotel Tel Aviv' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: scarletHotelConfig.images[0] },
    ]
    
    ogTags.forEach(({ property, name, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      if (meta) {
        meta.setAttribute('content', content)
      } else {
        meta = document.createElement('meta')
        if (property) meta.setAttribute('property', property)
        if (name) meta.setAttribute('name', name)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    })
    
    // Add structured data for Hotel
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "Scarlet Hotel Tel Aviv",
      "image": scarletHotelConfig.images,
      "description": scarletHotelConfig.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Tel Aviv",
        "addressCountry": "IL"
      },
      "telephone": scarletHotelConfig.contact.phone,
      "email": scarletHotelConfig.contact.email,
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "priceRange": "₪₪₪",
      "amenityFeature": scarletHotelConfig.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }))
    }
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)
  }, [locale])

  // Booking Engine Hook - for real API integration
  const booking = useBookingEngine()

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [roomImageIndexes, setRoomImageIndexes] = useState<Record<string, number>>({})
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0)
  const [showAiChat, setShowAiChat] = useState(false)
  const [showApiResults, setShowApiResults] = useState(false)
  const [prebookExpiry, setPrebookExpiry] = useState<Date | null>(null)
  const [scarletSearchResults, setScarletSearchResults] = useState<any[]>([])
  const [hasAutoSearched, setHasAutoSearched] = useState(false)

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

  // Debug: Log API results
  useEffect(() => {
    console.log('=== SCARLET DEBUG ===')
    console.log('showApiResults:', showApiResults)
    console.log('scarletSearchResults:', scarletSearchResults)
    console.log('scarletSearchResults.length:', scarletSearchResults?.length || 0)
    if (scarletSearchResults.length > 0) {
      console.log('First hotel:', scarletSearchResults[0])
      console.log('Rooms in first hotel:', scarletSearchResults[0]?.rooms?.length || 0)
      console.log('First 3 rooms:', scarletSearchResults[0]?.rooms?.slice(0, 3))
    }
  }, [showApiResults, scarletSearchResults])

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

  // Prefill dates so search can run immediately
  useEffect(() => {
    if (!checkIn) {
      setCheckIn(format(addDays(new Date(), 1), "yyyy-MM-dd"))
    }
    if (!checkOut) {
      setCheckOut(format(addDays(new Date(), 3), "yyyy-MM-dd"))
    }
  }, [checkIn, checkOut])

  // Keep scarlet results in sync with booking search results (so UI always shows live API data)
  useEffect(() => {
    if (!booking.searchResults || booking.searchResults.length === 0) return
    const scarletHotels = booking.searchResults.filter(isScarletHotel)
    if (scarletHotels.length > 0) {
      setScarletSearchResults(scarletHotels)
      setShowApiResults(true)
    }
  }, [booking.searchResults])

  // Auto-run search once dates exist (so Scarlet page renders live data on load)
  useEffect(() => {
    if (!checkIn || !checkOut || hasAutoSearched) return
    setHasAutoSearched(true)
    handleSearch(true).catch((err) => console.error('Auto search failed', err))
  }, [checkIn, checkOut, hasAutoSearched])

  // Real API Search
  const handleSearch = async (silent?: boolean) => {
    console.log('handleSearch called! checkIn:', checkIn, 'checkOut:', checkOut)

    if (!checkIn || !checkOut) {
      showToast?.('אנא בחרו תאריכים', 'error')
      return
    }

    setShowApiResults(false)
    setScarletSearchResults([])

    trackSearch(`${checkIn} to ${checkOut}, ${guests} guests`, {
      check_in: checkIn,
      check_out: checkOut,
      guests,
      hotel_id: scarletHotelConfig.hotelId
    })

    try {
      // Search in Tel Aviv and filter for Scarlet Hotel only
      // Note: Direct hotel name search returns 404, so we search by city and filter
      const searchResult = await booking.searchHotels({
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults: guests,
        children: [],
        city: "Tel Aviv",
      })

      // Filter ONLY Scarlet Hotel (ID: 12466) - no fallback hotels
      const scarletHotels = searchResult?.filter((hotel: any) => {
        return isScarletHotel(hotel)
      }) || []

      setScarletSearchResults(scarletHotels)
      setShowApiResults(true)

      if (!silent) {
        if (scarletHotels.length > 0) {
          showToast?.('נמצאו תוצאות למלון סקרלט', 'success')
        } else {
          showToast?.('מלון סקרלט לא זמין בתאריכים אלה', 'error')
        }
      }
    } catch (err: any) {
      console.error('Search failed', err)
      showToast?.('החיפוש נכשל, נסו שוב', 'error')
    }
  }

  // Handle room selection with PreBook
  const handleSelectRoom = async (room: any) => {
    console.log('=== ROOM SELECTION STARTED ===')
    console.log('Room clicked:', room)
    console.log('checkIn:', checkIn, 'checkOut:', checkOut)
    console.log('scarletSearchResults:', scarletSearchResults)

    if (!checkIn || !checkOut) {
      // Use static room data if no dates selected
      window.location.href = `/templates/scarlet/booking?room=${room.id}&checkIn=${addDays(new Date(), 1).toISOString()}&checkOut=${addDays(new Date(), 3).toISOString()}&guests=${guests}`
      return
    }

    // If we have API results, do a real prebook
    if (scarletSearchResults.length > 0) {
      const hotel = scarletSearchResults[0]
      console.log('Hotel from API:', hotel)
      console.log('Hotel rooms:', hotel.rooms)
      
      // Get the API room - if room has apiRoom property, use it, otherwise find it or use first room
      const apiRoom = room.apiRoom || hotel.rooms.find((r: any) => 
        r.roomId === room.id || 
        r.roomName === room.name ||
        r.roomName.includes(room.name)
      ) || hotel.rooms[0]
      
      console.log('Selected room:', room)
      console.log('Found API room:', apiRoom)
      console.log('API room has code?', !!apiRoom?.code)
      console.log('API room has roomId?', !!apiRoom?.roomId)
      
      if (apiRoom) {
        const hotelResult = {
          hotelId: hotel.hotelId,
          hotelName: hotel.hotelName,
          city: hotel.city || "Tel Aviv",
          stars: hotel.stars || 4,
          address: hotel.address || "",
          imageUrl: hotel.hotelImage || room.images[0],
          images: hotel.images || room.images,
          description: hotel.description || room.description,
          facilities: hotel.facilities || [],
          rooms: [],
        }

        const roomResult = {
          code: apiRoom.code,
          roomId: apiRoom.roomId,
          roomName: apiRoom.roomName,
          roomCategory: apiRoom.roomCategory || room.id,
          categoryId: apiRoom.categoryId || 1,
          boardId: apiRoom.boardId || 2,
          boardType: apiRoom.boardType || "BB",
          buyPrice: apiRoom.buyPrice || room.basePrice,
          originalPrice: apiRoom.originalPrice || room.basePrice * 1.2,
          currency: apiRoom.currency || "ILS",
          maxOccupancy: room.maxGuests,
          size: room.size,
          view: "",
          bedding: "",
          amenities: room.features || [],
          images: room.images,
          cancellationPolicy: apiRoom.cancellationPolicy || "free",
          available: 5,
        }

        console.log('=== CALLING PREBOOK ===')
        console.log('hotelResult:', hotelResult)
        console.log('roomResult:', roomResult)

        const success = await booking.selectRoom(hotelResult, roomResult)
        
        console.log('=== PREBOOK RESULT ===')
        console.log('success:', success)
        console.log('booking.prebookData:', booking.prebookData)
        
        if (success) {
          // Set prebook expiry (30 minutes)
          setPrebookExpiry(new Date(Date.now() + 30 * 60 * 1000))
          trackEvent({
            event: 'room_selected',
            room_name: room.hebrewName,
            price: roomResult.buyPrice,
            hotel_id: scarletHotelConfig.hotelId
          })
        }
        return
      }
    }

    // Fallback to static booking page
    window.location.href = `/templates/scarlet/booking?room=${room.id}&checkIn=${checkIn || addDays(new Date(), 1).toISOString()}&checkOut=${checkOut || addDays(new Date(), 3).toISOString()}&guests=${guests}`
  }

  // Handle prebook expiry
  const handlePrebookExpired = () => {
    setPrebookExpiry(null)
    booking.reset()
    showToast?.("זמן ההזמנה פג. אנא חפש שוב.", "error")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white" dir={dir}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
            <span className="text-sm">{t('backToTemplates')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <SocialShare 
              variant="icon" 
              title={locale === 'he' ? `${scarletHotelConfig.hebrewName} - ${scarletHotelConfig.hebrewTagline}` : t('scarletHotelName')}
              description={scarletHotelConfig.description}
              hashtags={['ScarletHotel', 'TelAviv', 'BoutiqueHotel']}
              className="text-gray-300 hover:text-white"
            />
            <Link href="/my-account" className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{t('myAccount')}</span>
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
                role="img"
                aria-label={`${scarletHotelConfig.hebrewName} hotel image ${index + 1}`}
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
            {locale === 'he' ? scarletHotelConfig.hebrewName : t('scarletHotelName')}
          </p>
          
          <p className="text-xl md:text-2xl text-white mb-12" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
            {locale === 'he' ? scarletHotelConfig.hebrewTagline : t('scarletTagline')}
          </p>

          {/* Search Box */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 rounded-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-400" />
                  {t('checkIn')}
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
                  {t('checkOut')}
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
                  {t('guests')}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="bg-gray-800">
                      {num} {t('guests')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    console.log('Button clicked!')
                    handleSearch()
                  }}
                  disabled={booking.isLoading}
                  className="w-full h-[52px] bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/50 disabled:opacity-50"
                >
                  {booking.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      {t('searching') || 'מחפש...'}
                    </>
                  ) : (
                    t('searchRooms')
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {booking.error && (
              <Alert variant="destructive" className="mt-4 bg-red-900/50 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{booking.error}</AlertDescription>
              </Alert>
            )}

            {/* API Search Results Summary */}
            {showApiResults && booking.searchResults.length > 0 && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-center">
                  ✅ נמצאו {booking.searchResults[0]?.rooms?.length || 0} חדרים זמינים בתאריכים שבחרת!
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* PreBook Timer - shows when room is selected */}
      {booking.step === 'details' && prebookExpiry && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
          <Card className="bg-gray-900/95 border-red-500/50 p-4">
            <PreBookTimer 
              expiresAt={prebookExpiry}
              onExpired={handlePrebookExpired}
              warningMinutes={5}
            />
          </Card>
        </div>
      )}

      {/* Guest Details Step */}
      {booking.step === 'details' && (
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <Card className="bg-gray-900/80 border-red-500/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              פרטי האורח
            </h2>
            <GuestDetailsForm 
              onSubmit={(details) => {
                booking.setGuestInfo(details)
              }}
              isLoading={booking.isLoading}
            />
          </Card>
        </section>
      )}

      {/* Payment Step */}
      {booking.step === 'payment' && (
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <Card className="bg-gray-900/80 border-red-500/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              תשלום
            </h2>
            <PaymentForm
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom?.currency || "ILS"}
              onSubmit={booking.completeBooking}
              isLoading={booking.isLoading}
            />
          </Card>
        </section>
      )}

      {/* Confirmation Step */}
      {booking.step === 'confirmation' && booking.bookingConfirmation && booking.selectedHotel && booking.selectedRoom && booking.searchParams && booking.guestInfo && (
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <BookingConfirmation
            bookingId={booking.bookingConfirmation.bookingId}
            supplierReference={booking.bookingConfirmation.supplierReference}
            hotel={booking.selectedHotel}
            room={booking.selectedRoom}
            searchParams={booking.searchParams}
            totalPrice={booking.totalPrice}
            currency={booking.selectedRoom.currency}
            guestName={`${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`}
            guestEmail={booking.guestInfo.email}
            onNewBooking={() => {
              booking.reset()
              setPrebookExpiry(null)
              setShowApiResults(false)
            }}
          />
        </section>
      )}

      {/* Active Promotions Banner */}
      {scarletHotelConfig.activePromotions && scarletHotelConfig.activePromotions.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8 overflow-x-auto">
              <Sparkles className="h-8 w-8 text-white animate-spin-slow flex-shrink-0" />
              {scarletHotelConfig.activePromotions.map((promo, index) => (
                <div key={promo.id} className="flex items-center gap-4 text-white flex-shrink-0">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{promo.discount}%</div>
                    <div className="text-sm font-medium">{promo.title}</div>
                  </div>
                  {index < scarletHotelConfig.activePromotions.length - 1 && (
                    <div className="w-px h-12 bg-white/30" />
                  )}
                </div>
              ))}
              <Sparkles className="h-8 w-8 text-white animate-spin-slow flex-shrink-0" />
            </div>
          </div>
        </section>
      )}

      {/* Rooms Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            {t('ourRooms')}
          </h2>
          <p className="text-xl text-gray-300">
            {t('findPerfectRoom')}
          </p>
        </div>

        <div className="space-y-16">
          {(() => {
            const shouldShowApi = showApiResults && scarletSearchResults.length > 0
            const roomsToRender = shouldShowApi 
              ? (scarletSearchResults[0]?.rooms || []).map((apiRoom: any, idx: number) => normalizeApiRoom(apiRoom, idx))
              : scarletRoomTypes
            
            console.log('=== ROOM RENDER ===')
            console.log('showApiResults:', showApiResults)
            console.log('scarletSearchResults.length:', scarletSearchResults?.length || 0)
            console.log('shouldShowApi:', shouldShowApi)
            console.log('roomsToRender.length:', roomsToRender.length)
            console.log('First room:', roomsToRender[0])
            if (roomsToRender[0]) {
              console.log('First room price (basePrice):', roomsToRender[0].basePrice)
              console.log('First room currency:', roomsToRender[0].currency)
              console.log('First room apiRoom:', roomsToRender[0].apiRoom)
            }
            
            return roomsToRender
          })().map((room, index) => (
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
                    alt={`${room.hebrewName} - ${room.name} hotel room`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Room Emoji Badge */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border-2 border-white/30">
                    {room.emoji}
                  </div>

                  {/* Active Promotions Badges */}
                  {scarletHotelConfig.activePromotions && scarletHotelConfig.activePromotions.length > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      {scarletHotelConfig.activePromotions.slice(0, 2).map((promo) => (
                        <Badge 
                          key={promo.id}
                          className={`${promo.badgeColor} text-white font-bold border-0 shadow-lg animate-pulse`}
                        >
                          {promo.badge}
                        </Badge>
                      ))}
                    </div>
                  )}

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
                      aria-label={`Previous image of ${room.name}`}
                      title="Previous image"
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
                      aria-label={`Next image of ${room.name}`}
                      title="Next image"
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
                    <div className="text-2xl font-bold">
                      {room.currency === 'USD' ? '$' : room.currency === 'EUR' ? '€' : '₪'}{room.basePrice}
                    </div>
                    <div className="text-xs text-gray-200">{t('perNight')}</div>
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
                      <div className="text-sm text-gray-400">{t('size')}</div>
                      <div className="font-bold">{room.size} {t('sqm')}</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-sm text-gray-400">{t('guests')}</div>
                      <div className="font-bold">{t('upToGuests', { count: room.maxGuests })}</div>
                    </div>
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-red-400" />
                      <div className="text-sm text-gray-400">{t('fullBathroom')}</div>
                      <div className="font-bold">{locale === 'he' ? 'מלאה' : 'Full'}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-red-400">{t('whatsIncluded')}</h4>
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
                        <span className="font-semibold">{t('unique')}</span>
                      </div>
                      <p className="text-sm text-gray-300">{room.special}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectRoom(room)}
                    disabled={booking.isLoading}
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all disabled:opacity-50"
                  >
                    {booking.isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        {t('processing') || 'מעבד...'}
                      </>
                    ) : (
                      t('bookNow')
                    )}
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
              {t('ourAmenities')}
            </h2>
            <p className="text-gray-400">{t('everythingForPerfectVacation')}</p>
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
              {t('discountsAndDeals')}
            </h2>
            <p className="text-gray-400">{t('saveMore')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Promo Code */}
            <Card className="bg-gradient-to-br from-red-900/20 via-gray-900/50 to-gray-900/50 backdrop-blur-sm border-red-500/30 p-6">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-400" />
                {t('promoCode')}
              </h3>
              <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('promoCodeAvailableInBooking')}
              </p>
            </Card>

            {/* Loyalty Club */}
            <Card className="bg-gradient-to-br from-pink-900/20 via-gray-900/50 to-gray-900/50 backdrop-blur-sm border-pink-500/30 p-6">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-pink-400" />
                {t('loyaltyClub')}
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
                {t('vipBenefits')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">{t('discount10Percent')}</h4>
                <p className="text-sm text-gray-400">{t('onAllBookings')}</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">{t('freeUpgrade')}</h4>
                <p className="text-sm text-gray-400">{t('subjectToAvailability')}</p>
              </div>
              <div className="text-center">
                <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">{t('fastCheckIn')}</h4>
                <p className="text-sm text-gray-400">{t('noWaiting')}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Marketing Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-assistant)' }}>
              {t('specialOffersMarketing')}
            </h2>
            <p className="text-xl text-gray-400" style={{ fontFamily: 'var(--font-assistant)' }}>
              {t('saveMoreWithPromos')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Promo Codes Card */}
            <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('promoCodes')}
                </h3>
                <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('usePromoCodeDescription')}
                </p>
                <p className="text-gray-300 text-sm mb-2" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('promoCodeAvailableInBooking')}
                </p>
                <ul className="text-right text-sm text-gray-400 mt-4 space-y-2" style={{ fontFamily: 'var(--font-assistant)' }}>
                  <li>✨ הנחות עד 30%</li>
                  <li>🎁 מבצעים עונתיים</li>
                  <li>🔥 קופונים בלעדיים</li>
                </ul>
              </div>
            </Card>

            {/* Loyalty Program Card */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('loyaltyProgram')}
                </h3>
                <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('loyaltyProgramDescription')}
                </p>
                <LoyaltyBadge hotelId={scarletHotelConfig.hotelId} variant="luxury" />
                <div className="mt-4">
                  <LoyaltySignup hotelId={scarletHotelConfig.hotelId} />
                </div>
                <ul className="text-right text-sm text-gray-400 mt-4 space-y-2" style={{ fontFamily: 'var(--font-assistant)' }}>
                  <li>👑 {t('threeMembershipLevels')}</li>
                  <li>💎 {t('cumulativeDiscounts')}</li>
                  <li>🎯 {t('exclusiveBenefits')}</li>
                  <li>🌟 {t('roomUpgrades')}</li>
                </ul>
              </div>
            </Card>

            {/* Affiliate Program Card */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('affiliateProgram')}
                </h3>
                <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('affiliateProgramDescription')}
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/20 font-bold"
                  style={{ fontFamily: 'var(--font-assistant)' }}
                  onClick={() => window.open('/api/affiliate/register', '_blank')}
                >
                  {t('joinAsPartner')}
                </Button>
                <ul className="text-right text-sm text-gray-400 mt-4 space-y-2" style={{ fontFamily: 'var(--font-assistant)' }}>
                  <li>💰 {t('commissionPerBooking')}</li>
                  <li>🔗 {t('personalLink')}</li>
                  <li>📊 {t('salesManagement')}</li>
                  <li>🎁 {t('specialBonuses')}</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Active Promotions Banner */}
          <div className="mb-8">
            <PromotionBanner />
          </div>

          {/* Special Offers Info */}
          <Card className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border-red-500/30">
            <div className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('moreOffersAvailable')}
              </h3>
              <p className="text-xl text-gray-300 mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('clickBookNowToSee')}
              </p>
              <Button 
                onClick={handleSearch}
                disabled={booking.isLoading}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6 shadow-2xl shadow-red-500/50 disabled:opacity-50"
                style={{ fontFamily: 'var(--font-assistant)' }}
              >
                {booking.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin ml-2" />
                ) : (
                  <Sparkles className="ml-2 h-6 w-6" />
                )}
                {t('discoverOffers')}
              </Button>
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

          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-sm text-gray-400">{t('shareWithUs')}</span>
            <SocialShare 
              variant="minimal" 
              title={`${scarletHotelConfig.hebrewName} - ${scarletHotelConfig.hebrewTagline}`}
              description={scarletHotelConfig.description}
              hashtags={['ScarletHotel', 'TelAviv', 'BoutiqueHotel']}
              className="text-gray-400 hover:text-red-400"
            />
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 Scarlet Hotel Tel Aviv. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setShowAiChat(!showAiChat)}
          className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-500/50 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {showAiChat && (
          <div className="absolute bottom-16 left-0 w-96 h-[600px] shadow-2xl rounded-lg overflow-hidden border border-red-500/30 bg-black">
            <div className="p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-assistant)' }}>
                  {t('chatWithAssistant')}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAiChat(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm mt-1 text-white/90" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('askUsAnything', { hotelName: locale === 'he' ? scarletHotelConfig.hebrewName : t('scarletHotelName') })}
              </p>
            </div>
            <div className="p-4 h-[500px] overflow-y-auto bg-gray-950">
              <p className="text-gray-400 text-center py-8" style={{ fontFamily: 'var(--font-assistant)' }} dangerouslySetInnerHTML={{ __html: t('assistantComingSoon') }}>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ScarletTemplate() {
  return (
    <ErrorBoundary>
      <I18nProvider defaultLocale="he">
        <ScarletTemplateContent />
      </I18nProvider>
    </ErrorBoundary>
  )
}
