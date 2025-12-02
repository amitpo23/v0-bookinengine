import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { code, dateFrom, dateTo, hotelId, adults, children } = body

    if (!code || !dateFrom || !dateTo || !hotelId) {
      return NextResponse.json({ error: "code, dateFrom, dateTo, and hotelId are required" }, { status: 400 })
    }

    const result = await mediciApi.preBook({
      code,
      dateFrom,
      dateTo,
      hotelId,
      adults: adults || 2,
      children: children || [],
    })

    if (result.status !== "done") {
      return NextResponse.json({ error: "PreBook failed - room may no longer be available" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      priceConfirmed: result.priceConfirmed,
      currency: result.currency,
    })
  } catch (error: any) {
    console.error("PreBook API Error:", error)
    return NextResponse.json({ error: error.message || "PreBook failed" }, { status: 500 })
  }
}
