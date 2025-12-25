import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referrerUrl,
      landingPage,
      affiliateCode,
    } = await request.json()

    // Get client info from headers
    const userAgent = request.headers.get("user-agent") || ""
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : request.headers.get("x-real-ip") || ""

    // Simple device detection
    const deviceType = userAgent.toLowerCase().includes("mobile") ? "mobile" : "desktop"
    const browser = userAgent.includes("Chrome")
      ? "Chrome"
      : userAgent.includes("Firefox")
        ? "Firefox"
        : userAgent.includes("Safari")
          ? "Safari"
          : "Other"

    // Insert tracking record
    const { data, error } = await supabase
      .from("affiliate_tracking")
      .insert({
        session_id: sessionId,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        referrer_url: referrerUrl,
        landing_page: landingPage,
        affiliate_code: affiliateCode,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser,
      })
      .select()
      .single()

    if (error) {
      console.error("Affiliate tracking error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, trackingId: data.id })
  } catch (error: any) {
    console.error("Affiliate tracking error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
