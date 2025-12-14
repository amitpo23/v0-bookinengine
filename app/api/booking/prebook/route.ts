import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== PREBOOK API ROUTE ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { code, dateFrom, dateTo, hotelId, adults, children } = body

    if (!code || typeof code !== "string" || code.length < 5) {
      console.log("[v0] Invalid code:", code)
      return NextResponse.json(
        {
          error: "Invalid room code - must be a valid booking code from search results",
          received: { code, type: typeof code, length: code?.length },
        },
        { status: 400 },
      )
    }

    if (!dateFrom || !dateTo) {
      console.log("[v0] Missing dates")
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelId || hotelId === 0) {
      console.log("[v0] Invalid hotelId:", hotelId)
      return NextResponse.json(
        {
          error: "Invalid hotelId - must be a valid hotel ID from search results",
          received: { hotelId },
        },
        { status: 400 },
      )
    }

    console.log("[v0] Calling mediciApi.preBook with valid params:")
    console.log("[v0] - code:", code.substring(0, 50) + "...")
    console.log("[v0] - hotelId:", hotelId)
    console.log("[v0] - dates:", dateFrom, "to", dateTo)
    console.log("[v0] - adults:", adults)

    const result = await mediciApi.preBook({
      code,
      dateFrom,
      dateTo,
      hotelId: hotelId
      adults: Number(adults) || 2,
      children: children || [],
    })

    console.log("[v0] PreBook result:", JSON.stringify(result, null, 2))

    const hasValidResponse = result.token || result.preBookId || result.status === "done" || result.priceConfirmed > 0

    if (!hasValidResponse) {
      console.log("[v0] PreBook failed - no valid response indicators")
      return NextResponse.json(
        {
          success: false,
          error: "PreBook failed - room may no longer be available",
          debug: result,
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
