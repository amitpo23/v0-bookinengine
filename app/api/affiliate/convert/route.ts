import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, bookingId, conversionValue, commissionRate } = await request.json()

    if (!sessionId || !bookingId) {
      return NextResponse.json(
        { error: "Session ID and booking ID are required" },
        { status: 400 }
      )
    }

    // Calculate commission
    const commissionAmount = commissionRate
      ? (conversionValue * commissionRate) / 100
      : 0

    // Update tracking record
    const { error } = await supabase
      .from("affiliate_tracking")
      .update({
        booking_id: bookingId,
        converted: true,
        conversion_value: conversionValue,
        commission_amount: commissionAmount,
        commission_rate: commissionRate || 0,
        converted_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId)
      .is("booking_id", null) // Only update if not already converted

    if (error) {
      console.error("Affiliate conversion error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Affiliate conversion error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
