"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { format } from "date-fns"
import { 
  trackEvent, 
  trackSearch, 
  trackSelectItem, 
  trackAddToCart, 
  trackPurchase,
  trackViewSearchResults,
  trackBeginCheckout,
  trackFormSubmit,
  trackPaymentMethod,
  trackPrebookExpiry,
  trackLoyaltyPointsUsed,
  trackAffiliateConversion,
  trackBookingStep,
  trackApplyPromotion,
  trackError
} from "@/lib/analytics/ga4"

// ============================================================================
// TYPES
// ============================================================================

export interface SearchParams {
  checkIn: Date
  checkOut: Date
  adults: number
  children: number[]
  hotelName?: string
  city?: string
  promoCode?: string
}

export interface RoomResult {
  code: string
  roomId: string
  roomName: string
  roomCategory: string
  categoryId: number
  boardId: number
  boardType: string
  buyPrice: number
  originalPrice: number
  currency: string
  maxOccupancy: number
  size: number
  view: string
  bedding: string
  amenities: string[]
  images: string[]
  cancellationPolicy: string
  available: number
  requestJson?: string
  pax?: { adults: number; children: number[] }
}

export interface HotelResult {
  hotelId: number
  hotelName: string
  city: string
  stars: number
  address: string
  imageUrl: string
  images: string[]
  description: string
  facilities: string[]
  rooms: RoomResult[]
}

export interface GuestInfo {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country?: string
  city?: string
  address?: string
  zip?: string
  specialRequests?: string
}

export interface PromoCodeResult {
  valid: boolean
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  message: string
}

export interface LoyaltyInfo {
  memberId: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  points: number
  pointsToUse: number
  pointsValue: number // monetary value of points used
}

export interface PaymentInfo {
  method: "credit_card" | "stripe" | "paypal" | "account_credit" | "loyalty_points"
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
  stripePaymentIntentId?: string
}

export type BookingStep = 
  | "search" 
  | "results" 
  | "details" 
  | "payment" 
  | "processing" 
  | "confirmation"

export interface BookingState {
  // Flow state
  step: BookingStep
  isLoading: boolean
  error: string | null
  
  // Search
  searchParams: SearchParams | null
  searchResults: HotelResult[]
  
  // Selection
  selectedHotel: HotelResult | null
  selectedRoom: RoomResult | null
  
  // PreBook
  prebookData: {
    token: string
    preBookId: number
    priceConfirmed: number
    currency: string
    expiresAt: Date
  } | null
  
  // Guest
  guestInfo: GuestInfo | null
  
  // Promotions & Loyalty
  appliedPromo: PromoCodeResult | null
  loyaltyInfo: LoyaltyInfo | null
  
  // Payment
  paymentInfo: PaymentInfo | null
  
  // Confirmation
  bookingConfirmation: {
    bookingId: string
    supplierReference: string
    status: string
    totalPaid: number
    currency: string
  } | null
  
  // Affiliate tracking
  affiliateCode: string | null
}

export interface UnifiedBookingEngine {
  // State
  state: BookingState
  
  // Computed values
  nights: number
  subtotal: number
  discount: number
  loyaltyDiscount: number
  totalPrice: number
  prebookTimeRemaining: number | null // seconds remaining
  isPrebookExpired: boolean
  
  // Search actions
  searchHotels: (params: SearchParams) => Promise<HotelResult[]>
  
  // Selection actions
  selectRoom: (hotel: HotelResult, room: RoomResult) => Promise<boolean>
  
  // Guest actions
  setGuestInfo: (info: GuestInfo) => void
  
  // Promo & Loyalty actions
  applyPromoCode: (code: string) => Promise<PromoCodeResult>
  removePromoCode: () => void
  checkLoyaltyStatus: (email: string) => Promise<LoyaltyInfo | null>
  setLoyaltyPointsToUse: (points: number) => void
  
  // Payment actions
  setPaymentInfo: (info: PaymentInfo) => void
  processPayment: () => Promise<boolean>
  
  // Booking actions
  completeBooking: () => Promise<boolean>
  
  // Navigation
  goToStep: (step: BookingStep) => void
  goBack: () => void
  reset: () => void
  clearError: () => void
  
  // Affiliate
  setAffiliateCode: (code: string) => void
  
  // Utils
  refreshPrebook: () => Promise<boolean>
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: BookingState = {
  step: "search",
  isLoading: false,
  error: null,
  searchParams: null,
  searchResults: [],
  selectedHotel: null,
  selectedRoom: null,
  prebookData: null,
  guestInfo: null,
  appliedPromo: null,
  loyaltyInfo: null,
  paymentInfo: null,
  bookingConfirmation: null,
  affiliateCode: null,
}

// ============================================================================
// HOOK
// ============================================================================

export function useUnifiedBookingEngine(): UnifiedBookingEngine {
  const [state, setState] = useState<BookingState>(initialState)
  const prebookTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [prebookTimeRemaining, setPrebookTimeRemaining] = useState<number | null>(null)

  // ============================================================================
  // PREBOOK TIMER
  // ============================================================================
  
  useEffect(() => {
    if (state.prebookData?.expiresAt) {
      const updateTimer = () => {
        const now = new Date()
        const expires = new Date(state.prebookData!.expiresAt)
        const remaining = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000))
        setPrebookTimeRemaining(remaining)
        
        if (remaining <= 0) {
          // PreBook expired
          setState(prev => ({
            ...prev,
            error: "ההזמנה פגה תוקף. אנא בחרו חדר מחדש.",
            prebookData: null,
            step: "results"
          }))
          trackPrebookExpiry(
            String(state.selectedHotel?.hotelId || ""),
            state.selectedRoom?.roomId || "",
            remaining
          )
        }
      }
      
      updateTimer()
      prebookTimerRef.current = setInterval(updateTimer, 1000)
      
      return () => {
        if (prebookTimerRef.current) {
          clearInterval(prebookTimerRef.current)
        }
      }
    } else {
      setPrebookTimeRemaining(null)
    }
  }, [state.prebookData?.expiresAt, state.selectedHotel, state.selectedRoom])

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const nights = state.searchParams?.checkIn && state.searchParams?.checkOut
    ? Math.ceil(
        (state.searchParams.checkOut.getTime() - state.searchParams.checkIn.getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    : 1

  const subtotal = state.prebookData?.priceConfirmed || 
                   state.selectedRoom?.buyPrice || 0

  const discount = state.appliedPromo
    ? state.appliedPromo.discountType === "percentage"
      ? subtotal * (state.appliedPromo.discountValue / 100)
      : state.appliedPromo.discountValue
    : 0

  const loyaltyDiscount = state.loyaltyInfo?.pointsValue || 0

  const totalPrice = Math.max(0, subtotal - discount - loyaltyDiscount)

  const isPrebookExpired = prebookTimeRemaining !== null && prebookTimeRemaining <= 0

  // ============================================================================
  // SEARCH
  // ============================================================================
  
  const searchHotels = useCallback(async (params: SearchParams): Promise<HotelResult[]> => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      searchParams: params,
      // Reset previous selection
      selectedHotel: null,
      selectedRoom: null,
      prebookData: null,
      appliedPromo: null,
    }))

    // Track analytics
    trackSearch(`${params.city || params.hotelName}`, {
      check_in: format(params.checkIn, "yyyy-MM-dd"),
      check_out: format(params.checkOut, "yyyy-MM-dd"),
      adults: params.adults,
      children: params.children.length,
    })

    try {
      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateFrom: format(params.checkIn, "yyyy-MM-dd"),
          dateTo: format(params.checkOut, "yyyy-MM-dd"),
          hotelName: params.hotelName,
          city: params.city,
          adults: params.adults,
          children: params.children,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "חיפוש נכשל")
      }

      const results = data.data || []
      
      setState(prev => ({
        ...prev,
        searchResults: results,
        step: results.length > 0 ? "results" : "search",
        isLoading: false,
        error: results.length === 0 ? "לא נמצאו תוצאות לחיפוש" : null,
      }))

      // Full analytics tracking
      trackViewSearchResults(
        params.city || params.hotelName || "all",
        results.length,
        {
          check_in: format(params.checkIn, "yyyy-MM-dd"),
          check_out: format(params.checkOut, "yyyy-MM-dd"),
          adults: params.adults,
          children_count: params.children.length,
        }
      )

      trackEvent({ 
        event: "search_results", 
        results_count: results.length,
        hotels_found: results.length,
        rooms_found: results.reduce((acc: number, h: HotelResult) => acc + h.rooms.length, 0)
      })

      return results
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "חיפוש נכשל",
        isLoading: false,
      }))
      trackError("search_error", error.message, {
        search_term: params.city || params.hotelName,
        check_in: format(params.checkIn, "yyyy-MM-dd"),
      })
      return []
    }
  }, [])

  // ============================================================================
  // SELECT ROOM & PREBOOK
  // ============================================================================
  
  const selectRoom = useCallback(async (
    hotel: HotelResult, 
    room: RoomResult
  ): Promise<boolean> => {
    setState(prev => ({
      ...prev,
      selectedHotel: hotel,
      selectedRoom: room,
      isLoading: true,
      error: null,
    }))

    // Track selection
    trackSelectItem({
      item_id: room.code,
      item_name: `${hotel.hotelName} - ${room.roomName}`,
      price: room.buyPrice,
      quantity: nights,
    })

    try {
      // Build PreBook request
      const prebookRequest = {
        services: [{
          searchCodes: [{
            code: room.code,
            pax: [{
              adults: state.searchParams?.adults || 2,
              children: state.searchParams?.children || []
            }]
          }],
          searchRequest: {
            currencies: ["USD"],
            customerCountry: "IL",
            dates: {
              from: state.searchParams ? format(state.searchParams.checkIn, "yyyy-MM-dd") : "",
              to: state.searchParams ? format(state.searchParams.checkOut, "yyyy-MM-dd") : ""
            },
            destinations: [{
              id: Number(hotel.hotelId),
              type: "hotel"
            }],
            filters: [
              { name: "payAtTheHotel", value: true },
              { name: "onRequest", value: false },
              { name: "showSpecialDeals", value: true }
            ],
            pax: [{
              adults: state.searchParams?.adults || 2,
              children: state.searchParams?.children || []
            }],
            service: "hotels"
          }
        }]
      }

      const response = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonRequest: JSON.stringify(prebookRequest)
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "PreBook נכשל")
      }

      // PreBook expires in 30 minutes
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

      setState(prev => ({
        ...prev,
        prebookData: {
          token: data.token,
          preBookId: data.preBookId,
          priceConfirmed: data.priceConfirmed || room.buyPrice,
          currency: data.currency || room.currency,
          expiresAt,
        },
        step: "details",
        isLoading: false,
      }))

      trackAddToCart({
        item_id: room.code,
        item_name: `${hotel.hotelName} - ${room.roomName}`,
        price: data.priceConfirmed || room.buyPrice,
        quantity: nights,
      })

      trackEvent({ event: "prebook_success", prebook_id: data.preBookId })

      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "בחירת החדר נכשלה",
        isLoading: false,
      }))
      trackEvent({ event: "prebook_error", error: error.message })
      return false
    }
  }, [state.searchParams, nights])

  // ============================================================================
  // GUEST INFO
  // ============================================================================
  
  const setGuestInfo = useCallback((info: GuestInfo) => {
    setState(prev => ({
      ...prev,
      guestInfo: info,
      step: "payment",
    }))
    trackEvent({ event: "guest_info_submitted" })
  }, [])

  // ============================================================================
  // PROMO CODE
  // ============================================================================
  
  const applyPromoCode = useCallback(async (code: string): Promise<PromoCodeResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code,
          totalPrice: subtotal,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        const result: PromoCodeResult = {
          valid: false,
          code,
          discountType: "percentage",
          discountValue: 0,
          message: data.message || "קוד קופון לא תקף",
        }
        setState(prev => ({ ...prev, isLoading: false }))
        trackEvent({ event: "promo_code_invalid", code })
        return result
      }

      const result: PromoCodeResult = {
        valid: true,
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        message: data.message || "קוד קופון הוחל בהצלחה!",
      }

      setState(prev => ({
        ...prev,
        appliedPromo: result,
        isLoading: false,
      }))

      // Track promo application with discount amount
      const discountAmount = data.discountType === "percentage" 
        ? (subtotal * data.discountValue / 100)
        : data.discountValue
      trackApplyPromotion(code, discountAmount)

      return result
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "אימות קוד קופון נכשל",
        isLoading: false,
      }))
      return {
        valid: false,
        code,
        discountType: "percentage",
        discountValue: 0,
        message: "שגיאה באימות קוד קופון",
      }
    }
  }, [subtotal])

  const removePromoCode = useCallback(() => {
    setState(prev => ({ ...prev, appliedPromo: null }))
    trackEvent({ event: "promo_code_removed" })
  }, [])

  // ============================================================================
  // LOYALTY
  // ============================================================================
  
  const checkLoyaltyStatus = useCallback(async (email: string): Promise<LoyaltyInfo | null> => {
    try {
      const response = await fetch("/api/loyalty/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.member) {
        return null
      }

      const loyaltyInfo: LoyaltyInfo = {
        memberId: data.member.id,
        tier: data.member.tier,
        points: data.member.points,
        pointsToUse: 0,
        pointsValue: 0,
      }

      setState(prev => ({
        ...prev,
        loyaltyInfo,
      }))

      trackEvent({ 
        event: "loyalty_check", 
        tier: loyaltyInfo.tier,
        points: loyaltyInfo.points,
      })

      return loyaltyInfo
    } catch (error) {
      return null
    }
  }, [])

  const setLoyaltyPointsToUse = useCallback((points: number) => {
    if (!state.loyaltyInfo) return

    // Calculate point value (e.g., 100 points = $1)
    const pointsValue = points / 100

    setState(prev => ({
      ...prev,
      loyaltyInfo: prev.loyaltyInfo 
        ? { ...prev.loyaltyInfo, pointsToUse: points, pointsValue }
        : null,
    }))

    trackEvent({ 
      event: "loyalty_points_applied", 
      points,
      value: pointsValue,
    })
  }, [state.loyaltyInfo])

  // ============================================================================
  // PAYMENT
  // ============================================================================
  
  const setPaymentInfo = useCallback((info: PaymentInfo) => {
    setState(prev => ({
      ...prev,
      paymentInfo: info,
    }))
  }, [])

  const processPayment = useCallback(async (): Promise<boolean> => {
    // Track begin checkout
    trackBeginCheckout(
      totalPrice,
      [{
        item_id: state.selectedRoom?.code || "",
        item_name: `${state.selectedHotel?.hotelName} - ${state.selectedRoom?.roomName}`,
        price: state.selectedRoom?.buyPrice || 0,
        quantity: nights,
      }],
      state.prebookData?.currency || "USD"
    )

    if (state.paymentInfo?.method === "stripe") {
      trackPaymentMethod("stripe", true)
      setState(prev => ({ ...prev, isLoading: true, step: "processing" }))
      
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalPrice * 100), // Stripe uses cents
            currency: state.prebookData?.currency?.toLowerCase() || "usd",
            metadata: {
              hotelId: state.selectedHotel?.hotelId,
              roomCode: state.selectedRoom?.code,
              prebookId: state.prebookData?.preBookId,
            },
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "עיבוד תשלום נכשל")
        }

        setState(prev => ({
          ...prev,
          paymentInfo: {
            ...prev.paymentInfo!,
            stripePaymentIntentId: data.paymentIntentId,
          },
        }))

        return true
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || "עיבוד תשלום נכשל",
          isLoading: false,
          step: "payment",
        }))
        trackError("payment_error", error.message)
        return false
      }
    } else {
      trackPaymentMethod("credit_card", false)
    }
    
    // For non-Stripe payments, just return true
    return true
  }, [state.paymentInfo, state.prebookData, state.selectedHotel, state.selectedRoom, totalPrice, nights])

  // ============================================================================
  // COMPLETE BOOKING
  // ============================================================================
  
  const completeBooking = useCallback(async (): Promise<boolean> => {
    if (!state.selectedRoom || !state.selectedHotel || !state.guestInfo || 
        !state.prebookData || !state.searchParams) {
      setState(prev => ({ ...prev, error: "מידע חסר להשלמת ההזמנה" }))
      return false
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, step: "processing" }))

    // Process payment first if needed
    const paymentProcessed = await processPayment()
    if (!paymentProcessed) {
      return false
    }

    try {
      const { guestInfo, searchParams, selectedRoom, selectedHotel, prebookData } = state

      // Build Book request
      const bookRequest = {
        customer: {
          title: guestInfo.title.toUpperCase(),
          name: {
            first: guestInfo.firstName,
            last: guestInfo.lastName,
          },
          birthDate: "1990-01-01",
          contact: {
            address: guestInfo.address || "Main St 123",
            city: guestInfo.city || "Tel Aviv",
            country: guestInfo.country || "IL",
            email: guestInfo.email,
            phone: guestInfo.phone,
            state: guestInfo.country || "IL",
            zip: guestInfo.zip || "6439602",
          },
        },
        paymentMethod: {
          methodName: state.paymentInfo?.stripePaymentIntentId 
            ? "stripe" 
            : "account_credit",
          stripePaymentIntentId: state.paymentInfo?.stripePaymentIntentId,
        },
        reference: {
          agency: "v0-bookinengine",
          voucherEmail: guestInfo.email,
          promoCode: state.appliedPromo?.code,
          affiliateCode: state.affiliateCode,
          loyaltyMemberId: state.loyaltyInfo?.memberId,
          loyaltyPointsUsed: state.loyaltyInfo?.pointsToUse,
        },
        services: [
          {
            bookingRequest: [
              {
                code: selectedRoom.code,
                pax: [
                  {
                    adults: Array.from({ length: searchParams.adults }, (_, i) => ({
                      lead: i === 0,
                      title: guestInfo.title.toUpperCase(),
                      name: {
                        first: i === 0 ? guestInfo.firstName : `Guest${i + 1}`,
                        last: guestInfo.lastName,
                      },
                      contact: {
                        address: guestInfo.address || "Main St 123",
                        city: guestInfo.city || "Tel Aviv",
                        country: guestInfo.country || "IL",
                        email: guestInfo.email,
                        phone: guestInfo.phone,
                        state: guestInfo.country || "IL",
                        zip: guestInfo.zip || "6439602",
                      },
                    })),
                    children: [],
                  },
                ],
                token: prebookData.token,
              },
            ],
            searchRequest: {
              currencies: ["USD"],
              customerCountry: "IL",
              dates: {
                from: format(searchParams.checkIn, "yyyy-MM-dd"),
                to: format(searchParams.checkOut, "yyyy-MM-dd"),
              },
              destinations: [
                {
                  id: Number(selectedHotel.hotelId),
                  type: "hotel",
                },
              ],
              filters: [
                { name: "payAtTheHotel", value: true },
                { name: "onRequest", value: false },
                { name: "showSpecialDeals", value: true },
              ],
              pax: [
                {
                  adults: searchParams.adults,
                  children: searchParams.children,
                },
              ],
              service: "hotels",
            },
          },
        ],
      }

      const response = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonRequest: JSON.stringify(bookRequest),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "ההזמנה נכשלה")
      }

      // Update loyalty points if used
      if (state.loyaltyInfo?.pointsToUse && state.loyaltyInfo.pointsToUse > 0) {
        await fetch("/api/loyalty/update-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: state.loyaltyInfo.memberId,
            bookingId: data.bookingId,
            pointsUsed: state.loyaltyInfo.pointsToUse,
            pointsEarned: Math.floor(totalPrice * 10), // Earn 10 points per dollar
          }),
        })
      }

      // Track affiliate conversion
      if (state.affiliateCode) {
        await fetch("/api/affiliate/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            affiliateCode: state.affiliateCode,
            bookingId: data.bookingId,
            amount: totalPrice,
          }),
        })
      }

      setState(prev => ({
        ...prev,
        bookingConfirmation: {
          bookingId: data.bookingId,
          supplierReference: data.supplierReference,
          status: data.status,
          totalPaid: totalPrice,
          currency: prebookData.currency,
        },
        step: "confirmation",
        isLoading: false,
      }))

      // Track purchase
      trackPurchase(
        data.bookingId,
        totalPrice,
        [{
          item_id: selectedRoom.code,
          item_name: `${selectedHotel.hotelName} - ${selectedRoom.roomName}`,
          price: totalPrice,
          quantity: nights,
        }]
      )

      trackEvent({
        event: "booking_confirmed",
        booking_id: data.bookingId,
        total_price: totalPrice,
        discount_applied: discount,
        loyalty_discount: loyaltyDiscount,
        promo_code: state.appliedPromo?.code,
        affiliate_code: state.affiliateCode,
      })

      // Track affiliate conversion
      if (state.affiliateCode) {
        trackAffiliateConversion(state.affiliateCode, data.bookingId, totalPrice)
      }

      // Track loyalty points used
      if (state.loyaltyInfo?.pointsToUse && state.loyaltyInfo.pointsToUse > 0) {
        trackLoyaltyPointsUsed(
          state.loyaltyInfo.pointsToUse,
          loyaltyDiscount,
          state.loyaltyInfo.tier
        )
      }

      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "ההזמנה נכשלה",
        isLoading: false,
        step: "payment",
      }))
      trackError("booking_error", error.message, {
        hotel_id: state.selectedHotel?.hotelId,
        room_code: state.selectedRoom?.code,
      })
      return false
    }
  }, [state, processPayment, totalPrice, nights, discount, loyaltyDiscount])

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  
  const goToStep = useCallback((step: BookingStep) => {
    setState(prev => ({ ...prev, step }))
    trackBookingStep(step, String(state.selectedHotel?.hotelId || ""), state.selectedRoom?.roomId)
  }, [state.selectedHotel, state.selectedRoom])

  const goBack = useCallback(() => {
    const stepOrder: BookingStep[] = ["search", "results", "details", "payment", "confirmation"]
    const currentIndex = stepOrder.indexOf(state.step)
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1]
      setState(prev => ({ ...prev, step: prevStep }))
      trackBookingStep(prevStep, String(state.selectedHotel?.hotelId || ""), state.selectedRoom?.roomId)
    }
  }, [state.step, state.selectedHotel, state.selectedRoom])

  const reset = useCallback(() => {
    if (prebookTimerRef.current) {
      clearInterval(prebookTimerRef.current)
    }
    setState(initialState)
    setPrebookTimeRemaining(null)
    trackEvent({ event: "booking_reset" })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // ============================================================================
  // AFFILIATE
  // ============================================================================
  
  const setAffiliateCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, affiliateCode: code }))
    trackEvent({ event: "affiliate_code_set", code })
  }, [])

  // ============================================================================
  // REFRESH PREBOOK
  // ============================================================================
  
  const refreshPrebook = useCallback(async (): Promise<boolean> => {
    if (!state.selectedHotel || !state.selectedRoom) {
      return false
    }
    return selectRoom(state.selectedHotel, state.selectedRoom)
  }, [state.selectedHotel, state.selectedRoom, selectRoom])

  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    state,
    nights,
    subtotal,
    discount,
    loyaltyDiscount,
    totalPrice,
    prebookTimeRemaining,
    isPrebookExpired,
    searchHotels,
    selectRoom,
    setGuestInfo,
    applyPromoCode,
    removePromoCode,
    checkLoyaltyStatus,
    setLoyaltyPointsToUse,
    setPaymentInfo,
    processPayment,
    completeBooking,
    goToStep,
    goBack,
    reset,
    clearError,
    setAffiliateCode,
    refreshPrebook,
  }
}

// Export types for consumers
export type { UnifiedBookingEngine as BookingEngine }
