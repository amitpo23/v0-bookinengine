"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// ============= ADMIN TRACKING =============
// Helper function to log search/booking activity to admin
const logToAdmin = async (data: {
  stage: string
  sessionId: string
  dateFrom?: string
  dateTo?: string
  guests?: number
  selectedRoom?: string
  selectedRoomCode?: string
  priceShown?: number
  completed?: boolean
  customerEmail?: string
  customerName?: string
  customerPhone?: string
}) => {
  try {
    await fetch('/api/admin/template-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'scarlet',
        ...data,
        source: document.referrer ? new URL(document.referrer).hostname : 'direct',
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.warn('Failed to log to admin:', error)
  }
}

// Helper to track abandoned bookings
const trackAbandoned = async (data: {
  sessionId: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  roomType: string
  roomCode?: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  stage: string
}) => {
  try {
    await fetch('/api/admin/abandoned-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'scarlet',
        hotelId: scarletHotelConfig.hotelId,
        hotelName: scarletHotelConfig.hebrewName,
        currency: 'ILS',
        source: document.referrer ? new URL(document.referrer).hostname : 'direct',
        ...data,
      }),
    })
  } catch (error) {
    console.warn('Failed to track abandoned booking:', error)
  }
}

// Generate unique session ID for tracking
const getSessionId = (): string => {
  if (typeof window === 'undefined') return `sess_${Date.now()}`
  
  let sessionId = sessionStorage.getItem('scarlet_session_id')
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    sessionStorage.setItem('scarlet_session_id', sessionId)
  }
  return sessionId
}

// Custom Payment Form for Scarlet (works with useBookingEngine)
function ScarletPaymentForm({ 
  totalPrice, 
  currency, 
  onSubmit, 
  isProcessing 
}: { 
  totalPrice: number
  currency: string
  onSubmit: () => void
  isProcessing: boolean
}) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2, 4)
    return v
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) newErrors.cardNumber = "מספר כרטיס לא תקין"
    if (!expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = "תוקף לא תקין"
    if (!cvv.match(/^\d{3,4}$/)) newErrors.cvv = "CVV לא תקין"
    if (!cardName.trim()) newErrors.cardName = "שדה חובה"
    if (!agreed) newErrors.agreed = "יש לאשר את תנאי ההזמנה"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            💳 פרטי כרטיס אשראי
          </h3>
          <span className="text-sm text-green-400 flex items-center gap-1">
            🔒 מאובטח SSL
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">מספר כרטיס</Label>
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              dir="ltr"
              className={`bg-white text-black ${errors.cardNumber ? "border-red-500" : ""}`}
            />
            {errors.cardNumber && <p className="text-xs text-red-400 mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <Label className="text-gray-300">שם בעל הכרטיס</Label>
            <Input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="ישראל ישראלי"
              dir="rtl"
              className={`bg-white text-black ${errors.cardName ? "border-red-500" : ""}`}
            />
            {errors.cardName && <p className="text-xs text-red-400 mt-1">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">תוקף</Label>
              <Input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                dir="ltr"
                className={`bg-white text-black ${errors.expiry ? "border-red-500" : ""}`}
              />
              {errors.expiry && <p className="text-xs text-red-400 mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <Label className="text-gray-300">CVV</Label>
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
                type="password"
                dir="ltr"
                className={`bg-white text-black ${errors.cvv ? "border-red-500" : ""}`}
              />
              {errors.cvv && <p className="text-xs text-red-400 mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox 
          id="terms" 
          checked={agreed} 
          onCheckedChange={(checked) => setAgreed(checked === true)}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
            קראתי ואני מסכים/ה ל
            <a href="#" className="text-pink-400 hover:underline mx-1">תנאי השימוש</a>
            ול
            <a href="#" className="text-pink-400 hover:underline mx-1">מדיניות הביטולים</a>
          </Label>
          {errors.agreed && <p className="text-xs text-red-400">{errors.agreed}</p>}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              🛡️
            </div>
            <span className="text-lg text-white">סה״כ לתשלום</span>
          </div>
          <span className="text-3xl font-bold text-white">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            מעבד הזמנה...
          </span>
        ) : (
          "אשר הזמנה ושלם"
        )}
      </Button>
    </form>
  )
}

// Custom Guest Form for Scarlet (light background, good contrast)
function ScarletGuestForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (details: any) => void
  isLoading: boolean
}) {
  const { t, locale } = useI18n()
  const [formData, setFormData] = useState({
    title: 'mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'IL',
    city: '',
    address: '',
    specialRequests: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const requiredMsg = locale === 'he' ? 'שדה חובה' : 'Required field'
    const invalidEmailMsg = locale === 'he' ? 'אימייל לא תקין' : 'Invalid email'
    const invalidPhoneMsg = locale === 'he' ? 'טלפון לא תקין' : 'Invalid phone'
    
    if (!formData.firstName.trim()) newErrors.firstName = requiredMsg
    if (!formData.lastName.trim()) newErrors.lastName = requiredMsg
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = invalidEmailMsg
    if (!formData.phone.match(/^[\d\-\+\s]{9,15}$/)) newErrors.phone = invalidPhoneMsg
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & First Name */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'תואר' : 'Title'} *</Label>
          <select
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="mr">{locale === 'he' ? 'מר' : 'Mr'}</option>
            <option value="mrs">{locale === 'he' ? 'גברת' : 'Mrs'}</option>
            <option value="ms">{locale === 'he' ? 'גב׳' : 'Ms'}</option>
          </select>
        </div>
        <div className="col-span-3">
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'שם פרטי' : 'First Name'} *</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder={locale === 'he' ? 'הכנס שם פרטי' : 'Enter first name'}
            className={`mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400 ${errors.firstName ? "border-red-500" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
      </div>

      {/* Last Name & Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'שם משפחה' : 'Last Name'} *</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder={locale === 'he' ? 'הכנס שם משפחה' : 'Enter last name'}
            className={`mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400 ${errors.lastName ? "border-red-500" : ""}`}
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'דוא״ל' : 'Email'} *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            dir="ltr"
            className={`mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'טלפון' : 'Phone'} *</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="050-0000000"
            dir="ltr"
            className={`mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400 ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'מדינה' : 'Country'}</Label>
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="IL">{locale === 'he' ? 'ישראל' : 'Israel'}</option>
            <option value="US">{locale === 'he' ? 'ארה״ב' : 'United States'}</option>
            <option value="GB">{locale === 'he' ? 'בריטניה' : 'United Kingdom'}</option>
            <option value="FR">{locale === 'he' ? 'צרפת' : 'France'}</option>
            <option value="DE">{locale === 'he' ? 'גרמניה' : 'Germany'}</option>
          </select>
        </div>
      </div>

      {/* City & Address */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'עיר' : 'City'}</Label>
          <Input
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder={locale === 'he' ? 'שם העיר' : 'City name'}
            className="mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400"
          />
        </div>
        <div>
          <Label className="text-gray-700 font-medium">{locale === 'he' ? 'כתובת' : 'Address'}</Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder={locale === 'he' ? 'רחוב ומספר' : 'Street and number'}
            className="mt-1 bg-white text-gray-900 border-gray-300 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <Label className="text-gray-700 font-medium">{locale === 'he' ? 'בקשות מיוחדות' : 'Special Requests'}</Label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          placeholder={locale === 'he' ? 'אלרגיות, העדפות חדר, וכו׳' : 'Allergies, room preferences, etc.'}
          rows={3}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {locale === 'he' ? 'שומר פרטים...' : 'Saving details...'}
          </span>
        ) : (
          locale === 'he' ? 'המשך לתשלום' : 'Continue to Payment'
        )}
      </Button>
    </form>
  )
}

// Helper function to normalize API rooms to display format
// Maps Knowaa API results to Scarlet Hotel template room types
// API Room Mapping (based on actual Knowaa Live results):
// - "standard" + "triple" → deluxe-balcony-bathtub (3 guests, $110.11)
// - "suite" + "double" → suite (2-4 guests, $275.46)
function normalizeApiRoom(apiRoom: any, index: number) {
  const roomName = (apiRoom.roomName || '').toLowerCase()
  const roomCategory = (apiRoom.roomCategory || apiRoom.category || '').toLowerCase()
  const bedding = (apiRoom.bedding || '').toLowerCase()
  
  console.log('🔄 Normalizing API room:', { roomName, roomCategory, bedding, price: apiRoom.buyPrice })
  
  // MAPPING TABLE: API → Template
  // standard+triple → deluxe-balcony-bathtub (דלאקס עם מרפסת ואמבטיה)
  // suite+double → suite (הסוויטה)
  
  let templateRoom = scarletRoomTypes[0] // Default fallback
  let matchReason = 'default'
  
  // Match 1: Standard Triple → Deluxe Balcony & Bathtub (3 guests)
  if (roomCategory.includes('standard') && (bedding.includes('triple') || roomName.includes('triple'))) {
    templateRoom = scarletRoomTypes.find(r => r.id === 'deluxe-balcony-bathtub') || scarletRoomTypes[5]
    matchReason = 'standard+triple→deluxe-balcony-bathtub'
  }
  
  // Match 2: Suite Double → The Suite (2-5 guests)
  else if (roomCategory.includes('suite') || roomName.includes('suite')) {
    templateRoom = scarletRoomTypes.find(r => r.id === 'suite') || scarletRoomTypes[6]
    matchReason = 'suite→suite'
  }
  
  // Match 3: Standard Double → Classic Double (fallback for 2 guests)
  else if (roomCategory.includes('standard') && (bedding.includes('double') || roomName.includes('double'))) {
    templateRoom = scarletRoomTypes.find(r => r.id === 'classic-double') || scarletRoomTypes[0]
    matchReason = 'standard+double→classic-double'
  }
  
  // Match 4: Deluxe → Deluxe Room (4 guests)
  else if (roomCategory.includes('deluxe')) {
    templateRoom = scarletRoomTypes.find(r => r.id === 'deluxe') || scarletRoomTypes[4]
    matchReason = 'deluxe→deluxe'
  }
  
  console.log(`✅ Matched: ${matchReason}`, templateRoom.id, templateRoom.hebrewName)

  // Return normalized room with REAL API price and template styling
  return {
    id: apiRoom.roomId || apiRoom.code || `scarlet-room-${index}`,
    name: templateRoom.name,
    hebrewName: templateRoom.hebrewName,
    emoji: templateRoom.emoji,
    tagline: templateRoom.tagline,
    description: templateRoom.description,
    size: templateRoom.size,
    maxGuests: templateRoom.maxGuests,
    basePrice: Math.round(apiRoom.buyPrice || apiRoom.basePrice || 0), // REAL API PRICE!
    currency: apiRoom.currency || "USD",
    features: templateRoom.features,
    isPremium: templateRoom.isPremium || false,
    wowFactor: templateRoom.wowFactor || false,
    special: templateRoom.special,
    suitableFor: templateRoom.suitableFor,
    images: templateRoom.images,
    
    // Preserve fallback/static data markers
    isFallback: apiRoom.isFallback || false,
    isStaticData: apiRoom.isStaticData || false,
    available: apiRoom.available !== false, // Default to true unless explicitly false
    unavailableMessage: apiRoom.unavailableMessage,
    
    apiRoom: apiRoom // Keep original API data for PreBook
  }
}

function ScarletTemplateContent() {
  const { t, locale, dir } = useI18n()
  
  // Helper function to check if a hotel is Scarlet Hotel Tel Aviv
  // CRITICAL: ONLY accept hotel ID 863233 - no fallbacks!
  const isScarletHotel = (hotel: any) => {
    if (!hotel) return false
    
    // STRICT CHECK: Hotel ID MUST be exactly 863233
    const hotelId = String(hotel.hotelId || hotel.id || '')
    
    // Explicitly reject Dave Gordon TLV (850086) - it's a different hotel
    if (hotelId === '850086') {
      console.log('❌ Rejected Dave Gordon TLV (850086) - not Scarlet Hotel')
      return false
    }
    
    // Accept ONLY Scarlet Hotel with ID 863233
    if (hotelId === '863233') {
      console.log('✅ Scarlet Hotel found by ID:', hotelId, hotel.hotelName)
      return true
    }
    
    // No fallbacks - reject everything else
    return false
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
  const [showApiResults, setShowApiResults] = useState(true) // Start with true to prefer API results
  const [prebookExpiry, setPrebookExpiry] = useState<Date | null>(null)
  const [scarletSearchResults, setScarletSearchResults] = useState<any[]>([])
  const [hasAutoSearched, setHasAutoSearched] = useState(false)
  
  // 🔥 LAYER 1: Use refs to avoid closure issues
  const searchParamsRef = useRef({ checkIn, checkOut, guests })
  const isSearchingRef = useRef(false)

  // Update ref whenever search params change
  useEffect(() => {
    searchParamsRef.current = { checkIn, checkOut, guests }
    console.log('📦 Search params ref updated:', searchParamsRef.current)
  }, [checkIn, checkOut, guests])

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

  // Debug: Log date changes
  useEffect(() => {
    console.log('📅 === DATES CHANGED ===')
    console.log('checkIn:', checkIn)
    console.log('checkOut:', checkOut)
    console.log('guests:', guests)
  }, [checkIn, checkOut, guests])

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
    console.log('=== PREFILL DATES EFFECT ===')
    console.log('checkIn:', checkIn, 'checkOut:', checkOut)
    if (!checkIn) {
      const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd")
      console.log('Setting checkIn to:', tomorrow)
      setCheckIn(tomorrow)
    }
    if (!checkOut) {
      // Set to 4 days from now (3 nights) to ensure minimum stay requirement
      const dayAfter = format(addDays(new Date(), 4), "yyyy-MM-dd")
      console.log('Setting checkOut to:', dayAfter)
      setCheckOut(dayAfter)
    }
  }, [])

  // Auto-adjust checkout date if it's before or equal to checkin date
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      
      // If checkout is before or same as checkin, set it to checkin + 1 day
      if (checkOutDate <= checkInDate) {
        const newCheckOut = format(addDays(checkInDate, 1), "yyyy-MM-dd")
        console.log('Auto-adjusting checkout from', checkOut, 'to', newCheckOut)
        setCheckOut(newCheckOut)
      }
    }
  }, [checkIn])

  // Auto-run search once dates exist (so Scarlet page renders live data on load)
  useEffect(() => {
    console.log('Auto search effect - checkIn:', checkIn, 'checkOut:', checkOut, 'hasAutoSearched:', hasAutoSearched)
    if (!checkIn || !checkOut || hasAutoSearched) return
    
    console.log('Starting auto search...')
    setHasAutoSearched(true)
    // handleSearch will be defined below
  }, [checkIn, checkOut, hasAutoSearched])

  // 🔥 LAYER 2: Retry logic with exponential backoff
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  const searchWithRetry = async (searchFn: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`)
        const result = await searchFn()
        console.log(`✅ Attempt ${attempt} succeeded`)
        return result
      } catch (error) {
        console.warn(`⚠️ Attempt ${attempt} failed:`, error)
        
        if (attempt === maxRetries) {
          console.error(`❌ All ${maxRetries} attempts failed`)
          throw error
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const waitTime = 1000 * Math.pow(2, attempt - 1)
        console.log(`⏳ Waiting ${waitTime}ms before retry...`)
        await sleep(waitTime)
      }
    }
  }

  // 🔥 LAYER 3: Static Data Fallback (via backend proxy to avoid CORS)
  const fetchStaticDataFallback = async (hotelId: string) => {
    try {
      console.log('🏨 Fetching static data via backend proxy for hotel:', hotelId)
      const response = await fetch(`/api/hotels/static-data/${hotelId}`)
      
      if (!response.ok) {
        throw new Error(`Static data proxy returned ${response.status}`)
      }
      
      const staticData = await response.json()
      console.log('✅ Static data received via proxy:', staticData)
      
      // Create hotel object with config rooms
      return {
        hotelId: staticData.id,
        hotelName: staticData.name,
        address: staticData.address,
        city: staticData.city,
        stars: staticData.stars,
        rating: staticData.rating,
        images: scarletHotelConfig.images,
        description: scarletHotelConfig.description,
        rooms: scarletRoomTypes.map((room) => ({
          roomId: `static_${room.id}`,
          roomType: room.id,
          roomName: room.hebrewName,
          roomCategory: room.id,
          description: room.description,
          images: room.images,
          maxOccupancy: room.maxGuests,
          basePrice: room.basePrice,
          totalPrice: room.basePrice,
          currency: "USD",
          boardType: "Room Only",
          amenities: room.features,
          available: false,
          isStaticData: true,
          unavailableMessage: "מחירים משוערים - אנא התקשרו לאישור"
        }))
      }
    } catch (error) {
      console.error('❌ Static data fallback failed:', error)
      return null
    }
  }

  // Real API Search with all 5 layers of protection
  const handleSearch = useCallback(async (silent?: boolean) => {
    // Prevent concurrent searches
    if (isSearchingRef.current) {
      console.warn('⚠️ Search already in progress, skipping...')
      return
    }

    isSearchingRef.current = true
    
    try {
      // CRITICAL FIX: Use latest state values, not ref!
      // The ref may be stale if called immediately after state update
      const currentCheckIn = checkIn || searchParamsRef.current.checkIn
      const currentCheckOut = checkOut || searchParamsRef.current.checkOut
      const currentGuests = guests || searchParamsRef.current.guests
      
      console.log('🔍 === HANDLE SEARCH CALLED ===')
      console.log('📅 State values:', { checkIn, checkOut, guests })
      console.log('📦 Ref values:', searchParamsRef.current)
      console.log('✅ Using values:', { currentCheckIn, currentCheckOut, currentGuests })
      console.log('🔇 Silent mode:', silent)
      console.log('⏰ Timestamp:', new Date().toISOString())

      if (!currentCheckIn || !currentCheckOut) {
        console.warn('⚠️ Missing dates!')
        console.warn('⚠️ State:', { checkIn, checkOut })
        console.warn('⚠️ Ref:', searchParamsRef.current)
        showToast.error('אנא בחרו תאריכים')
        return
      }

      // Check number of nights
      const checkInDate = new Date(currentCheckIn)
      const checkOutDate = new Date(currentCheckOut)
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      console.log(`📅 Nights: ${nights}`)

      setShowApiResults(false)
      setScarletSearchResults([])

      trackSearch(`${currentCheckIn} to ${currentCheckOut}, ${currentGuests} guests`, {
        check_in: currentCheckIn,
        check_out: currentCheckOut,
        guests: currentGuests,
        hotel_id: scarletHotelConfig.hotelId
      })

      try {
        let searchResult = null
        let searchError = null
        
        // 🔥 LAYER 2: Strategy 1 with retry - City search
        try {
          console.log('🔍 Strategy 1: Searching Tel Aviv with limit 100 (with retry)...')
          const searchParams = {
            checkIn: new Date(currentCheckIn),
            checkOut: new Date(currentCheckOut),
            adults: currentGuests,
            children: [],
            city: "Tel Aviv",
            limit: 100
          }
          console.log('📤 API Request Params:', {
            checkIn: searchParams.checkIn.toISOString(),
            checkOut: searchParams.checkOut.toISOString(),
            adults: searchParams.adults,
            city: searchParams.city,
            limit: searchParams.limit
          })
          searchResult = await searchWithRetry(async () => {
            return await booking.searchHotels(searchParams)
          })
        } catch (error) {
          console.warn('❌ Strategy 1 (city) failed after retries:', error)
          searchError = error
        }

        // Strategy 2 with retry: Fallback to hotelName search if city failed
        if (!searchResult && searchError) {
          try {
            console.log('🔍 Strategy 2: Searching by hotelName "Scarlet" (with retry)...')
            searchResult = await searchWithRetry(async () => {
              return await booking.searchHotels({
                checkIn: new Date(currentCheckIn),
                checkOut: new Date(currentCheckOut),
                adults: currentGuests,
                children: [],
                hotelName: "Scarlet"
              })
            })
          } catch (fallbackError) {
            console.warn('❌ Strategy 2 (name) failed after retries:', fallbackError)
          }
        }

        // Filter ONLY Scarlet Hotel Tel Aviv by ID 863233
        console.log(`📊 Total API results before filter: ${searchResult?.length || 0}`)
        
        let scarletHotels = searchResult?.filter((hotel: any) => {
          const match = isScarletHotel(hotel)
          if (!match && hotel.hotelId) {
            console.log('❌ Filtered out hotel:', hotel.hotelId, hotel.hotelName)
          }
          return match
        }) || []

        console.log(`🎯 Found ${scarletHotels.length} Scarlet Hotel (ID: 863233) results after filter`)
        
        // Strategy 3 with retry: If city search didn't return Scarlet, try searching with "Scarlet Hotel"
        if (scarletHotels.length === 0 && searchResult && searchResult.length > 0) {
          console.log('🔍 Strategy 3: Trying search with full hotel name "Scarlet Hotel" (with retry)...')
          try {
            const directSearch = await searchWithRetry(async () => {
              return await booking.searchHotels({
                checkIn: new Date(currentCheckIn),
                checkOut: new Date(currentCheckOut),
                adults: currentGuests,
                children: [],
                city: "Tel Aviv",
                hotelName: "Scarlet Hotel"
              })
            })
            
            console.log(`📊 Strategy 3 returned ${directSearch?.length || 0} results`)
            if (directSearch && directSearch.length > 0) {
              console.log('🔍 Hotels from Strategy 3:', directSearch.map((h: any) => `${h.hotelId} - ${h.hotelName}`))
              const filteredDirect = directSearch.filter(isScarletHotel)
              if (filteredDirect.length > 0) {
                console.log('✅ Found Scarlet via full hotel name search!')
                scarletHotels = filteredDirect
              } else {
                console.warn('⚠️ Strategy 3 returned results but none matched Scarlet (863233)')
              }
            } else {
              console.warn('⚠️ Strategy 3 returned no results')
            }
          } catch (directError) {
            console.warn('❌ Strategy 3 (full hotel name) failed after retries:', directError)
          }
        }
        
        // 🔥 LAYER 3: Static Data Fallback if all strategies failed
        if (scarletHotels.length === 0) {
          console.log('🏨 All API strategies failed - trying static data fallback...')
          const staticData = await fetchStaticDataFallback("863233")
          
          if (staticData) {
            console.log('✅ Static data fallback successful!')
            scarletHotels = [staticData]
          }
        }
        
        if (scarletHotels.length > 0) {
          console.log('Scarlet hotels:', scarletHotels.map((h: any) => ({ 
            id: h.hotelId, 
            name: h.hotelName, 
            rooms: h.rooms?.length || 0 
          })))
        } else if (searchResult && searchResult.length > 0) {
          console.warn('⚠️ API returned results but Scarlet (863233) was not found!')
          console.log('📦 ALL hotels from API:', searchResult.map((h: any) => ({ 
            id: h.hotelId, 
            name: h.hotelName,
            rooms: h.rooms?.length || 0
          })))
          console.log('🔍 Raw first hotel from API:', JSON.stringify(searchResult[0], null, 2))
        }

        // 🔥 LAYER 4 & 5: Config Fallback - If no API results, create fallback display from config
        if (scarletHotels.length === 0 || (scarletHotels[0] && scarletHotels[0].rooms?.length === 0)) {
          console.log('🔄 LAYER 5: Activating config fallback - displaying all rooms from config as unavailable')
          
          // Create fallback hotel object with all rooms from config marked as unavailable
          const fallbackHotel = {
          hotelId: scarletHotelConfig.hotelId,
          hotelName: scarletHotelConfig.hebrewName,
          hotelNameEn: scarletHotelConfig.name,
          address: scarletHotelConfig.location.address,
          city: "Tel Aviv",
          stars: 4,
          rating: 4.5,
          images: [scarletHotelConfig.images[0]],
          description: scarletHotelConfig.description,
          rooms: scarletRoomTypes.map((room) => ({
            roomId: `fallback_${room.id}`,
            roomType: room.id,
            roomName: room.hebrewName,
            roomNameEn: room.name,
            roomCategory: room.id,
            description: room.description,
            images: room.images,
            maxOccupancy: room.maxGuests,
            basePrice: room.basePrice,
            totalPrice: room.basePrice,
            currency: "USD",
            boardType: "Room Only",
            amenities: room.features,
            
            // Mark as unavailable for these dates
            available: false,
            unavailableMessage: nights < 2 
              ? "המלון דורש מינימום 2 לילות - נסו תאריכים ארוכים יותר" 
              : "לא זמין לתאריכים אלו",
            isFallback: true,
            
            // Add suggested alternative dates
            suggestAlternativeDates: true
          }))
        }
        
        setScarletSearchResults([fallbackHotel])
        setShowApiResults(true)
        
        console.log(`💡 Fallback: Showing ${fallbackHotel.rooms.length} rooms from config as unavailable`)
        
        // Show specific message for short stays
        if (nights < 2 && !silent) {
          showToast.warning('המלון דורש מינימום 2 לילות. מוצגים כל החדרים - אנא בחרו תאריכים ארוכים יותר.')
        } else if (!silent) {
          showToast.warning('אין זמינות לתאריכים אלו. מציג את כל סוגי החדרים - נסו תאריכים אחרים.')
        }
      } else {
        // API results exist - use them
        setScarletSearchResults(scarletHotels)
        setShowApiResults(true)
      }

      // ===== LOG SEARCH TO ADMIN =====
      const roomCount = scarletHotels[0]?.rooms?.length || 0
      const isFallback = scarletHotels.length === 0
      
      logToAdmin({
        stage: 'search',
        sessionId: getSessionId(),
        dateFrom: checkIn,
        dateTo: checkOut,
        guests,
        completed: false,
      })

      if (!silent) {
        if (scarletHotels.length > 0 && scarletHotels[0]?.rooms?.length > 0) {
          showToast.success(`נמצאו ${scarletHotels[0].rooms.length} חדרים זמינים במלון סקרלט תל אביב`)
        } else if (scarletHotels.length === 0 || scarletHotels[0]?.rooms?.length === 0) {
          // No API results - fallback activated
          console.warn('⚠️ No availability from API - showing fallback rooms')
          console.log('Total API results:', searchResult?.length || 0)
          showToast.warning('אין זמינות לתאריכים אלו. מציג את כל סוגי החדרים - נסו תאריכים אחרים.')
        }
      }
      } catch (err: any) {
        console.error('❌ Scarlet Hotel search failed:', err)
        
        // Clear results on error
        setScarletSearchResults([])
        setShowApiResults(false)
        
        // Determine error type and show appropriate message
        let errorMessage = 'שגיאה בחיפוש המלון. אנא נסו שוב.'
        
        if (err.message?.includes('401') || err.message?.includes('token')) {
          errorMessage = 'שגיאת הרשאה. אנא רענן את הדף ונסה שוב.'
          console.error('🔐 Token authentication failed - token may be expired')
        } else if (err.message?.includes('404') || err.message?.includes('not found')) {
          errorMessage = 'מלון סקרלט תל אביב לא נמצא במערכת.'
          console.error('🏨 Scarlet Hotel not found in system')  
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = 'בעיית תקשורת. אנא בדקו את החיבור לאינטרנט.'
          console.error('🌐 Network error during search')
        } else if (err.message?.includes('timeout')) {
          errorMessage = 'החיפוש ארך זמן רב מידי. אנא נסו שוב.'
          console.error('⏰ Search timeout')
        }
        
        if (!silent) {
          showToast.error(errorMessage)
        }
      }
    } catch (err: any) {
      console.error('❌ Unexpected error in handleSearch:', err)
      if (!silent) {
        showToast.error('שגיאה לא צפויה בחיפוש')
      }
    } finally {
      isSearchingRef.current = false
      console.log('🏁 Search completed')
    }
  }, [checkIn, checkOut, guests, booking, showToast]) // CRITICAL: Include state values in dependencies!

  // Trigger auto-search once handleSearch is defined
  useEffect(() => {
    if (!checkIn || !checkOut || hasAutoSearched) return
    
    console.log('Triggering auto search with handleSearch defined')
    handleSearch(true).catch((err) => console.error('Auto search failed', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, hasAutoSearched]) // handleSearch intentionally excluded to avoid circular dependency

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
        console.log('booking.step after selectRoom:', booking.step)
        
        if (success) {
          // Set prebook expiry (30 minutes)
          setPrebookExpiry(new Date(Date.now() + 30 * 60 * 1000))
          trackEvent({
            event: 'room_selected',
            room_name: room.hebrewName,
            price: roomResult.buyPrice,
            hotel_id: scarletHotelConfig.hotelId
          })

          // ===== LOG ROOM SELECTION TO ADMIN =====
          logToAdmin({
            stage: 'room_selected',
            sessionId: getSessionId(),
            dateFrom: checkIn,
            dateTo: checkOut,
            guests,
            selectedRoom: room.hebrewName || room.name,
            selectedRoomCode: roomResult.code,
            priceShown: roomResult.buyPrice,
            completed: false,
          })
          
          // Scroll to details section
          window.scrollTo({ top: 0, behavior: 'smooth' })
          
          console.log('✅ PreBook successful - should show details form now')
        } else {
          console.error('❌ PreBook failed')
          showToast.error('שגיאה בהכנת ההזמנה. אנא נסו שוב.')
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
    showToast.error("זמן ההזמנה פג. אנא חפש שוב.")
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
            <form onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              
              console.log('📝 === FORM SUBMITTED ===')
              console.log('📅 Form values - checkIn:', checkIn, 'checkOut:', checkOut, 'guests:', guests)
              
              if (!checkIn || !checkOut) {
                console.warn('⚠️ Missing dates on submit!')
                showToast.error('אנא בחרו תאריכי כניסה ויציאה')
                return
              }
              
              if (new Date(checkOut) <= new Date(checkIn)) {
                console.warn('⚠️ Invalid date range on submit!')
                showToast.error('תאריך היציאה חייב להיות אחרי תאריך הכניסה')
                return
              }
              
              console.log('✅ Form validation passed - calling handleSearch')
              
              // Clear previous results
              setShowApiResults(false)
              setScarletSearchResults([])
              
              // Call search
              handleSearch().catch(err => {
                console.error('❌ Form handleSearch failed:', err)
              })
            }}>
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
                  min={checkIn ? format(addDays(new Date(checkIn), 1), "yyyy-MM-dd") : ""}
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
                  type="submit"
                  disabled={booking.isLoading || !checkIn || !checkOut}
                  className="w-full h-[52px] bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/50 disabled:opacity-50 cursor-pointer"
                >
                  {booking.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      {'מחפש...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 ml-2" />
                      {t('searchRooms')}
                    </>
                  )}
                </Button>
              </div>
            </div>
            </form>

            {/* Minimum Nights Warning */}
            {checkIn && checkOut && (() => {
              const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
              return nights < 2 && (
                <Alert className="mt-4 bg-yellow-900/30 border-yellow-500/50 text-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    ⚠️ <strong>שימו לב:</strong> Scarlet Hotel דורש מינימום 2 לילות. 
                    כרגע בחרתם {nights} {nights === 1 ? 'לילה' : 'לילות'} בלבד. 
                    אנא בחרו תאריכים עם לפחות 2 לילות לקבלת תוצאות עם מחירים בפועל.
                  </AlertDescription>
                </Alert>
              )
            })()}

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
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guest Form - 2 columns */}
            <div className="md:col-span-2">
              <Card className="bg-white border-gray-200 p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {locale === 'he' ? 'פרטי האורח' : 'Guest Details'}
                </h2>
                <ScarletGuestForm 
                  onSubmit={(details) => {
                    booking.setGuestInfo(details)
                    
                    // ===== LOG GUEST DETAILS TO ADMIN =====
                    logToAdmin({
                      stage: 'guest_details',
                      sessionId: getSessionId(),
                      dateFrom: checkIn,
                      dateTo: checkOut,
                      guests,
                      selectedRoom: booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory,
                      selectedRoomCode: booking.selectedRoom?.code,
                      priceShown: booking.selectedRoom?.buyPrice,
                      customerEmail: details.email,
                      customerName: `${details.firstName} ${details.lastName}`,
                      customerPhone: details.phone,
                      completed: false,
                    })
                    
                    // Track potential abandoned booking
                    if (booking.selectedRoom) {
                      trackAbandoned({
                        sessionId: getSessionId(),
                        customerEmail: details.email,
                        customerName: `${details.firstName} ${details.lastName}`,
                        customerPhone: details.phone,
                        roomType: booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory || 'Unknown',
                        roomCode: booking.selectedRoom?.code,
                        checkIn,
                        checkOut,
                        guests,
                        totalPrice: booking.selectedRoom?.buyPrice || 0,
                        stage: 'guest_details',
                      })
                    }
                  }}
                  isLoading={booking.isLoading}
                />
              </Card>
            </div>
            
            {/* Booking Summary Sidebar */}
            <div className="md:col-span-1">
              <Card className="bg-gray-900 border-pink-500/30 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📋 {locale === 'he' ? 'סיכום הזמנה' : 'Booking Summary'}
                </h3>
                
                {/* Hotel Info */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏨</span>
                    <div>
                      <p className="text-white font-semibold">{locale === 'he' ? 'מלון סקרלט' : 'Scarlet Hotel'}</p>
                      <p className="text-gray-400 text-sm">{locale === 'he' ? 'תל אביב' : 'Tel Aviv'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Room Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>🛏️ חדר:</span>
                    <span className="text-white">{booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory || 'חדר נבחר'}</span>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>📅 כניסה:</span>
                    <span className="text-white">{booking.searchParams?.checkIn ? format(booking.searchParams.checkIn, 'dd/MM/yyyy') : '-'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>📅 יציאה:</span>
                    <span className="text-white">{booking.searchParams?.checkOut ? format(booking.searchParams.checkOut, 'dd/MM/yyyy') : '-'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>🌙 לילות:</span>
                    <span className="text-white">{booking.nights || 1}</span>
                  </div>
                </div>
                
                {/* Guests */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>👥 אורחים:</span>
                    <span className="text-white">{booking.searchParams?.adults || 2} מבוגרים</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>מחיר ללילה:</span>
                    <span className="text-white">${Math.round((booking.totalPrice || 0) / (booking.nights || 1))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                    <span className="text-lg font-semibold text-white">סה״כ לתשלום:</span>
                    <span className="text-2xl font-bold text-green-400">${booking.totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2 text-gray-400 text-sm">
                  <span>🔒</span>
                  <span>תשלום מאובטח SSL</span>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Payment Step */}
      {booking.step === 'payment' && (
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <Card className="bg-gray-900/80 border-red-500/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              תשלום
            </h2>
            
            {/* Error Display */}
            {booking.error && (
              <Alert className="mb-6 border-red-500 bg-red-900/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {booking.error}
                </AlertDescription>
              </Alert>
            )}
            
            <ScarletPaymentForm
              totalPrice={booking.totalPrice}
              currency={booking.selectedRoom?.currency || "USD"}
              onSubmit={async () => {
                console.log('🔄 Starting booking completion...')
                
                // ===== LOG PAYMENT STAGE TO ADMIN =====
                logToAdmin({
                  stage: 'payment',
                  sessionId: getSessionId(),
                  dateFrom: checkIn,
                  dateTo: checkOut,
                  guests,
                  selectedRoom: booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory,
                  selectedRoomCode: booking.selectedRoom?.code,
                  priceShown: booking.totalPrice,
                  customerEmail: booking.guestInfo?.email,
                  customerName: booking.guestInfo ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : undefined,
                  customerPhone: booking.guestInfo?.phone,
                  completed: false,
                })
                
                try {
                  const success = await booking.completeBooking()
                  if (success) {
                    console.log('✅ Booking completed successfully!')
                    showToast.success('ההזמנה אושרה בהצלחה! 🎉')
                    
                    // ===== LOG COMPLETED BOOKING TO ADMIN =====
                    logToAdmin({
                      stage: 'confirmed',
                      sessionId: getSessionId(),
                      dateFrom: checkIn,
                      dateTo: checkOut,
                      guests,
                      selectedRoom: booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory,
                      selectedRoomCode: booking.selectedRoom?.code,
                      priceShown: booking.totalPrice,
                      customerEmail: booking.guestInfo?.email,
                      customerName: booking.guestInfo ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : undefined,
                      customerPhone: booking.guestInfo?.phone,
                      completed: true,
                    })
                  } else {
                    console.error('❌ Booking failed')
                    showToast.error('ההזמנה נכשלה. אנא נסה שוב.')
                    
                    // Track abandoned at payment stage
                    if (booking.selectedRoom && booking.guestInfo) {
                      trackAbandoned({
                        sessionId: getSessionId(),
                        customerEmail: booking.guestInfo.email,
                        customerName: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
                        customerPhone: booking.guestInfo.phone,
                        roomType: booking.selectedRoom?.roomName || booking.selectedRoom?.roomCategory || 'Unknown',
                        roomCode: booking.selectedRoom?.code,
                        checkIn,
                        checkOut,
                        guests,
                        totalPrice: booking.totalPrice || 0,
                        stage: 'payment',
                      })
                    }
                  }
                } catch (error: any) {
                  console.error('❌ Booking error:', error)
                  showToast.error(error.message || 'שגיאה בהזמנה')
                }
              }}
              isProcessing={booking.isLoading}
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

      {/* Rooms Section - hide when in booking flow */}
      {(!booking.step || booking.step === 'search' || booking.step === 'results') && (
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
          {/* Loading state */}
          {booking.isLoading && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
                <Loader2 className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white mb-4">🔍 מחפש חדרים זמינים...</h3>
                <p className="text-gray-300">אנא המתן בזמן שאנו בודקים זמינות במלון סקרלט תל אביב</p>
              </div>
            </div>
          )}
          
          {/* Fallback warning banner */}
          {!booking.isLoading && showApiResults && scarletSearchResults.length > 0 && scarletSearchResults[0]?.rooms?.[0]?.isFallback && (
            <Alert className="mb-8 bg-yellow-900/30 border-yellow-500/50 text-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <AlertDescription className="text-base font-medium">
                <div className="mb-2">⚠️ <strong>אין זמינות לתאריכים שבחרת</strong></div>
                <div className="text-sm text-yellow-300">
                  מציג את כל סוגי החדרים במלון סקרלט. אנא בחר תאריכים אחרים כדי לבדוק זמינות ומחירים עדכניים.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Room cards - show API results */}
          {!booking.isLoading && (() => {
            const shouldShowApi = showApiResults && scarletSearchResults.length > 0
            
            const roomsToRender = shouldShowApi 
              ? (scarletSearchResults[0]?.rooms || []).map((apiRoom: any, idx: number) => normalizeApiRoom(apiRoom, idx))
              : []
            
            console.log('=== ROOM RENDER ===')
            console.log('showApiResults:', showApiResults)
            console.log('scarletSearchResults.length:', scarletSearchResults?.length || 0)
            console.log('shouldShowApi:', shouldShowApi)
            console.log('roomsToRender.length:', roomsToRender.length)
            console.log('First room:', roomsToRender[0])
            if (roomsToRender[0]) {
              console.log('First room price (basePrice):', roomsToRender[0].basePrice)
              console.log('First room currency:', roomsToRender[0].currency)
              console.log('First room isFallback:', roomsToRender[0].isFallback)
            }
            
            return roomsToRender
          })().map((room: any, index: number) => (
            <Card
              key={room.id}
              className={`bg-gradient-to-br ${
                room.isFallback
                  ? "from-gray-800/40 via-gray-900/40 to-gray-900/40 border-gray-600/30 opacity-75"
                  : room.isPremium
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
                      {room.images.map((_: string, imgIndex: number) => (
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

                  {/* Price Tag or Unavailable Badge */}
                  {room.isFallback || !room.basePrice || room.basePrice === 0 || room.available === false ? (
                    <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-md px-6 py-3 rounded-full border-2 border-yellow-500/50">
                      <div className="text-lg font-bold text-yellow-400">
                        {room.isStaticData ? 'התקשרו למחירים' : 'לא זמין'}
                      </div>
                      <div className="text-xs text-gray-300">
                        {room.unavailableMessage || 'לתאריכים אלו'}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 bg-red-600/90 backdrop-blur-md px-6 py-3 rounded-full">
                      <div className="text-2xl font-bold">
                        {room.currency === 'USD' ? '$' : room.currency === 'EUR' ? '€' : '₪'}{room.basePrice}
                      </div>
                      <div className="text-xs text-gray-200">{t('perNight')}</div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold mb-2 text-white">
                      {locale === 'he' ? room.hebrewName : room.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-1">{locale === 'he' ? room.name : room.hebrewName}</p>
                    <p className="text-lg text-red-400 italic">
                      {locale === 'he' ? room.tagline : (room.taglineEn || room.tagline)}
                    </p>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 text-right" dir={locale === 'he' ? 'rtl' : 'ltr'}>
                    {locale === 'he' ? room.description : (room.descriptionEn || room.description)}
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
                      {(locale === 'he' ? room.features : (room.featuresEn || room.features)).map((feature: string, idx: number) => (
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
                      <p className="text-sm text-gray-300">
                        {locale === 'he' ? room.special : (room.specialEn || room.special)}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => room.isFallback ? window.scrollTo({ top: 0, behavior: 'smooth' }) : handleSelectRoom(room)}
                    disabled={booking.isLoading}
                    className={`w-full h-14 ${
                      room.isFallback
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    } text-white font-bold text-lg rounded-lg shadow-lg ${
                      room.isFallback ? "shadow-yellow-500/30 hover:shadow-yellow-500/50" : "shadow-red-500/30 hover:shadow-red-500/50"
                    } transition-all disabled:opacity-50`}
                  >
                    {booking.isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        {'מעבד...'}
                      </>
                    ) : room.isFallback ? (
                      <>
                        <Calendar className="h-5 w-5 ml-2" />
                        בחר תאריכים אחרים
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
      )}

      {/* Amenities Section - hide when in booking flow */}
      {(!booking.step || booking.step === 'search' || booking.step === 'results') && (
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
      )}

      {/* Promo Code & Loyalty Section - hide when in booking flow */}
      {(!booking.step || booking.step === 'search' || booking.step === 'results') && (
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
      )}

      {/* Marketing Features Section - hide when in booking flow */}
      {(!booking.step || booking.step === 'search' || booking.step === 'results') && (
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
                onClick={() => handleSearch(false)}
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
      )}

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
