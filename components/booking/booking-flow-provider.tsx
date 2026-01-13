"use client"

import React, { createContext, useContext, useEffect, type ReactNode } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { useUnifiedBookingEngine, type UnifiedBookingEngine } from "@/hooks/use-unified-booking-engine"
import { trackEvent, trackPageView } from "@/lib/analytics/ga4"

// ============================================================================
// CONTEXT
// ============================================================================

const BookingEngineContext = createContext<UnifiedBookingEngine | null>(null)

// ============================================================================
// HOOK TO USE BOOKING ENGINE
// ============================================================================

export function useBookingFlow(): UnifiedBookingEngine {
  const context = useContext(BookingEngineContext)
  if (!context) {
    throw new Error("useBookingFlow must be used within a BookingFlowProvider")
  }
  return context
}

// ============================================================================
// PROVIDER PROPS
// ============================================================================

export interface BookingFlowProviderProps {
  children: ReactNode
  
  // Hotel configuration
  hotelId?: string | number
  hotelName?: string
  
  // Default search params
  defaultCity?: string
  defaultAdults?: number
  defaultChildren?: number[]
  
  // Affiliate tracking
  affiliateCode?: string
  
  // Feature flags
  enablePromo?: boolean
  enableLoyalty?: boolean
  enableStripe?: boolean
  enableAnalytics?: boolean
  
  // Locale
  defaultLocale?: "he" | "en"
  
  // Callbacks
  onBookingComplete?: (bookingId: string) => void
  onError?: (error: string) => void
  onStepChange?: (step: string) => void
}

// ============================================================================
// INNER PROVIDER (WITH I18N)
// ============================================================================

function BookingFlowProviderInner({
  children,
  hotelId,
  hotelName,
  affiliateCode,
  enableAnalytics = true,
  onBookingComplete,
  onError,
  onStepChange,
}: BookingFlowProviderProps) {
  const { locale } = useI18n()
  const booking = useUnifiedBookingEngine()

  // Set affiliate code on mount
  useEffect(() => {
    if (affiliateCode) {
      booking.setAffiliateCode(affiliateCode)
    }
  }, [affiliateCode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track page view on mount
  useEffect(() => {
    if (enableAnalytics) {
      trackPageView(window.location.href, hotelName || "Booking Engine")
    }
  }, [enableAnalytics, hotelName])

  // Handle step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(booking.state.step)
    }
    if (enableAnalytics) {
      trackEvent({ 
        event: "booking_step_viewed", 
        step: booking.state.step,
        hotel_id: hotelId,
      })
    }
  }, [booking.state.step, onStepChange, enableAnalytics, hotelId])

  // Handle errors
  useEffect(() => {
    if (booking.state.error && onError) {
      onError(booking.state.error)
    }
  }, [booking.state.error, onError])

  // Handle booking completion
  useEffect(() => {
    if (booking.state.bookingConfirmation?.bookingId && onBookingComplete) {
      onBookingComplete(booking.state.bookingConfirmation.bookingId)
    }
  }, [booking.state.bookingConfirmation?.bookingId, onBookingComplete])

  // Handle prebook expiration warning
  useEffect(() => {
    if (booking.prebookTimeRemaining !== null && booking.prebookTimeRemaining <= 300) {
      // 5 minutes warning
      if (booking.prebookTimeRemaining === 300) {
        trackEvent({ 
          event: "prebook_expiring_soon", 
          minutes_remaining: 5,
        })
      }
    }
  }, [booking.prebookTimeRemaining])

  return (
    <BookingEngineContext.Provider value={booking}>
      {children}
    </BookingEngineContext.Provider>
  )
}

// ============================================================================
// MAIN PROVIDER (WRAPS WITH I18N)
// ============================================================================

export function BookingFlowProvider({
  children,
  defaultLocale = "he",
  ...props
}: BookingFlowProviderProps) {
  return (
    <I18nProvider>
      <BookingFlowProviderInner {...props}>
        {children}
      </BookingFlowProviderInner>
    </I18nProvider>
  )
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Shows content only when on a specific step
 */
export function BookingStep({ 
  step, 
  children 
}: { 
  step: string | string[]
  children: ReactNode 
}) {
  const booking = useBookingFlow()
  const steps = Array.isArray(step) ? step : [step]
  
  if (!steps.includes(booking.state.step)) {
    return null
  }
  
  return <>{children}</>
}

/**
 * Shows loading overlay when booking is processing
 */
export function BookingLoading({ 
  children 
}: { 
  children: ReactNode 
}) {
  const booking = useBookingFlow()
  
  if (!booking.state.isLoading) {
    return null
  }
  
  return <>{children}</>
}

/**
 * Shows error message when there's an error
 */
export function BookingError({ 
  children 
}: { 
  children: (error: string, clearError: () => void) => ReactNode 
}) {
  const booking = useBookingFlow()
  
  if (!booking.state.error) {
    return null
  }
  
  return <>{children(booking.state.error, booking.clearError)}</>
}

/**
 * Shows prebook timer warning
 */
export function PrebookWarning({
  warningThreshold = 300, // 5 minutes
  children,
}: {
  warningThreshold?: number
  children: (secondsRemaining: number, refresh: () => Promise<boolean>) => ReactNode
}) {
  const booking = useBookingFlow()
  
  if (
    booking.prebookTimeRemaining === null || 
    booking.prebookTimeRemaining > warningThreshold
  ) {
    return null
  }
  
  return <>{children(booking.prebookTimeRemaining, booking.refreshPrebook)}</>
}

// ============================================================================
// EXPORTS
// ============================================================================

export { BookingEngineContext }
export type { UnifiedBookingEngine } from "@/hooks/use-unified-booking-engine"
