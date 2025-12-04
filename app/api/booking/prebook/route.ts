import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== PREBOOK API ROUTE ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { code, dateFrom, dateTo, hotelId, adults, children } = body

    if (!code || !dateFrom || !dateTo || !hotelId) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "code, dateFrom, dateTo, and hotelId are required" }, { status: 400 })
    }

    const result = await mediciApi.preBook({
      code,
      dateFrom,
      dateTo,
      hotelId: Number(hotelId),
      adults: Number(adults) || 2,
      children: children || [],
    })

    console.log("[v0] PreBook result:", JSON.stringify(result, null, 2))

    if (!result.token && !result.preBookId) {
      console.log("[v0] PreBook failed - no token or preBookId returned")
      return NextResponse.json(
        {
          success: false,
          error: "PreBook failed - room may no longer be available",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      preBookId: result.preBookId,
      token: result.token,
      priceConfirmed: result.priceConfirmed,
      currency: result.currency,
      status: result.status,
    })
  } catch (error: any) {
    console.error("[v0] PreBook API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "PreBook failed",
      },
      { status: 500 },
    )
  }
}
