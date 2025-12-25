"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function AffiliateTrackerInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackAffiliate = async () => {
      // Get UTM parameters
      const utmSource = searchParams?.get("utm_source")
      const utmMedium = searchParams?.get("utm_medium")
      const utmCampaign = searchParams?.get("utm_campaign")
      const utmTerm = searchParams?.get("utm_term")
      const utmContent = searchParams?.get("utm_content")
      const affiliateCode = searchParams?.get("ref") || searchParams?.get("affiliate")

      // Skip if no tracking parameters
      if (!utmSource && !utmMedium && !utmCampaign && !affiliateCode) {
        return
      }

      // Only run in browser
      if (typeof window === 'undefined') return

      // Generate session ID (or get from localStorage)
      let sessionId = localStorage.getItem("affiliate_session_id")
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("affiliate_session_id", sessionId)
      }

      // Store tracking data in localStorage for later use
      const trackingData = {
        sessionId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        affiliateCode,
        referrerUrl: document.referrer,
        landingPage: window.location.href,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("affiliate_tracking", JSON.stringify(trackingData))

      // Send to API
      try {
        await fetch("/api/affiliate/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingData),
        })
      } catch (error) {
        console.error("Affiliate tracking failed:", error)
      }
    }

    trackAffiliate()
  }, [searchParams])

  return null
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerInner />
    </Suspense>
  )
}
