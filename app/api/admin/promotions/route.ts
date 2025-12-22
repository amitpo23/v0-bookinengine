import { NextResponse } from "next/server"
import { addPromotion, updatePromotion, deletePromotion, getAllPromotions } from "@/lib/promotions/promotions-db"
import type { Promotion } from "@/lib/promotions/types"

export async function GET() {
  const promotions = getAllPromotions()
  return NextResponse.json({ success: true, data: promotions })
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
