import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== API ROUTE DEBUG ======")
    console.log("[v0] Raw request body:", JSON.stringify(body, null, 2))

    const dateFrom = body.dateFrom
    const dateTo = body.dateTo
    const hotelName = body.hotelName || undefined
    const city = body.city || undefined
    const adults = body.adults || 2
    const children = body.children || []
    const stars = body.stars || undefined
    const limit = body.limit || 20

    console.log("[v0] Parsed params:", {
      dateFrom,
      dateTo,
      hotelName,
      city,
      adults,
      children,
      stars,
      limit,
    })

    // Validate required fields
    if (!dateFrom || !dateTo) {
      console.log("[v0] ERROR: Missing dates")
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    // Must have either hotelName or city
    if (!hotelName && !city) {
      console.log("[v0] ERROR: Missing hotelName and city")
      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    console.log("[v0] Calling mediciApi.searchHotels...")

    const results = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName,
      city,
      adults: Number(adults),
      children,
      stars,
      limit,
    })

    console.log("[v0] Search returned", results.length, "results")
    if (results.length > 0) {
      console.log("[v0] First result:", JSON.stringify(results[0], null, 2))
    }

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    })
  } catch (error: any) {
    console.error("[v0] ====== API ERROR ======")
    console.error("[v0] Error:", error.message)
    console.error("[v0] Stack:", error.stack)
    return NextResponse.json({ error: error.message || "Failed to search hotels" }, { status: 500 })
  }
}
