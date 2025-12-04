import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== PREBOOK REQUEST ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { code, dateFrom, dateTo, hotelId, adults, children } = body

    if (!code || !dateFrom || !dateTo || !hotelId) {
      console.log("[v0] ERROR: Missing required fields")
      return NextResponse.json({ error: "code, dateFrom, dateTo, and hotelId are required" }, { status: 400 })
    }

    console.log("[v0] Calling mediciApi.preBook with:", {
      code,
      dateFrom,
      dateTo,
      hotelId,
      adults: adults || 2,
      children: children || [],
    })

    const result = await mediciApi.preBook({
      code,
      dateFrom,
      dateTo,
      hotelId,
      adults: adults || 2,
      children: children || [],
    })

    console.log("[v0] PreBook result:", JSON.stringify(result, null, 2))

    if (result.status !== "done") {
      console.log("[v0] ERROR: PreBook status is not 'done':", result.status)
      return NextResponse.json({ error: "PreBook failed - room may no longer be available" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      priceConfirmed: result.priceConfirmed,
      currency: result.currency,
    })
  } catch (error: any) {
    console.error("[v0] ====== PREBOOK ERROR ======")
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json({ error: error.message || "PreBook failed" }, { status: 500 })
  }
}
