import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount, template } = await request.json()

    if (!code || !orderAmount) {
      return NextResponse.json(
        { error: "Code and order amount are required" },
        { status: 400 }
      )
    }

    // Fetch promo code
    const { data: promoCode, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !promoCode) {
      return NextResponse.json(
        { valid: false, error: "קוד פרומו לא תקין או לא קיים" },
        { status: 404 }
      )
    }

    // Check validity dates
    const now = new Date()
    const validFrom = new Date(promoCode.valid_from)
    const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null

    if (now < validFrom) {
      return NextResponse.json({
        valid: false,
        error: "קוד הפרומו עדיין לא תקף",
      })
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({
        valid: false,
        error: "קוד הפרומו פג תוקף",
      })
    }

    // Check usage limit
    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) {
      return NextResponse.json({
        valid: false,
        error: "קוד הפרומו הגיע למגבלת השימוש",
      })
    }

    // Check minimum purchase
    if (promoCode.min_purchase_amount && orderAmount < promoCode.min_purchase_amount) {
      return NextResponse.json({
        valid: false,
        error: `סכום הזמנה מינימלי: ${promoCode.min_purchase_amount}₪`,
      })
    }

    // Check applicable templates
    if (
      template &&
      promoCode.applicable_templates &&
      promoCode.applicable_templates.length > 0 &&
      !promoCode.applicable_templates.includes(template)
    ) {
      return NextResponse.json({
        valid: false,
        error: "קוד הפרומו לא תקף עבור תבנית זו",
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (promoCode.discount_type === "percentage") {
      discountAmount = (orderAmount * promoCode.discount_value) / 100
      if (promoCode.max_discount_amount) {
        discountAmount = Math.min(discountAmount, promoCode.max_discount_amount)
      }
    } else {
      discountAmount = promoCode.discount_value
    }

    discountAmount = Math.round(discountAmount * 100) / 100

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discountType: promoCode.discount_type,
        discountValue: promoCode.discount_value,
        discountAmount,
      },
      newTotal: orderAmount - discountAmount,
    })
  } catch (error: any) {
    console.error("Promo validation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
