import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== SEARCH API ROUTE ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body

    // Validate required fields
    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelName && !city) {
      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    const results = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: Number(adults) || 2,
      children: children || [],
      stars: stars ? Number(stars) : undefined,
      limit: limit ? Number(limit) : 20,
    })

    console.log("[v0] Search returned", results.length, "results")

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    })
  } catch (error: any) {
    console.error("[v0] Search API Error:", error.message)
    return NextResponse.json({ error: error.message || "Failed to search hotels" }, { status: 500 })
  }
}
