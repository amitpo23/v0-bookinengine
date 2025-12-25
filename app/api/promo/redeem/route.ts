import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { promoCodeId, bookingId, userEmail, discountAmount, orderAmount } = await request.json()

    if (!promoCodeId || !bookingId) {
      return NextResponse.json(
        { error: "Promo code ID and booking ID are required" },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    // Record usage
    const { error: usageError } = await supabase.from("promo_code_usage").insert({
      promo_code_id: promoCodeId,
      booking_id: bookingId,
      user_email: userEmail,
      discount_amount: discountAmount,
      order_amount: orderAmount,
    })

    if (usageError) {
      console.error("Usage recording error:", usageError)
    }

    // Increment usage count
    const { error: updateError } = await supabase.rpc("increment", {
      table_name: "promo_codes",
      row_id: promoCodeId,
      column_name: "usage_count",
    })

    if (updateError) {
      // Fallback: manual update
      const { data: currentCode } = await supabase
        .from("promo_codes")
        .select("usage_count")
        .eq("id", promoCodeId)
        .single()

      if (currentCode) {
        await supabase
          .from("promo_codes")
          .update({ usage_count: (currentCode.usage_count || 0) + 1 })
          .eq("id", promoCodeId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Promo redemption error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
