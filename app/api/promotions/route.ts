import { NextResponse } from "next/server"
import { getAllPromotions, getActivePromotions } from "@/lib/promotions/promotions-db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isMobile = searchParams.get("mobile") === "true"
  const activeOnly = searchParams.get("active") !== "false"

  const promotions = activeOnly ? getActivePromotions(isMobile) : getAllPromotions()

  return NextResponse.json({ success: true, data: promotions })
}
