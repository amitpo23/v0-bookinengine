import { NextRequest, NextResponse } from "next/server"
import { addPromotion, updatePromotion, deletePromotion, getAllPromotions } from "@/lib/promotions/promotions-db"
import type { Promotion } from "@/lib/promotions/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const template = searchParams.get("template")
  
  const promotions = getAllPromotions()
  
  // Transform to expected format for admin
  const formattedPromotions = promotions.map(p => ({
    id: p.id,
    code: p.id,
    title: p.title,
    description: p.description,
    discountType: p.discountType,
    discountValue: p.discountValue,
    minNights: p.minNights,
    validFrom: p.validFrom,
    validTo: p.validTo,
    usageCount: 0, // Not tracked yet
    maxUsage: undefined,
    active: p.active,
    mobileOnly: p.mobileOnly,
  }))
  
  return NextResponse.json({ success: true, promotions: formattedPromotions })
}

export async function POST(request: Request) {
  try {
    const promotion: Promotion = await request.json()

    if (!promotion.id || !promotion.title) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    addPromotion(promotion)
    return NextResponse.json({ success: true, data: promotion })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create promotion" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing promotion ID" }, { status: 400 })
    }

    const success = updatePromotion(id, updates)

    if (!success) {
      return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update promotion" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing promotion ID" }, { status: 400 })
    }

    const success = deletePromotion(id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Promotion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete promotion" }, { status: 500 })
  }
}
