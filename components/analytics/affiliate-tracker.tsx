'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface AffiliateTrackerProps {
  hotelId?: string
}

export function AffiliateTracker({ hotelId }: AffiliateTrackerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackAffiliate = async () => {
      const ref = searchParams.get('ref') || searchParams.get('affiliate')
      
      if (!ref) return

      // Store in localStorage for later conversion
      localStorage.setItem('affiliate_ref', ref)
      localStorage.setItem('affiliate_timestamp', Date.now().toString())

      try {
        await fetch('/api/affiliate/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliateCode: ref,
            hotelId,
            source: searchParams.get('utm_source') || 'direct',
            medium: searchParams.get('utm_medium') || 'referral',
            campaign: searchParams.get('utm_campaign') || undefined
          })
        })
      } catch (err) {
        console.error('Affiliate tracking error:', err)
      }
    }

    trackAffiliate()
  }, [searchParams, hotelId])

  return null // This is a tracking component, no UI
}
