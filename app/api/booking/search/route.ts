import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    const results = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: adults || 2,
      children: children || [],
      stars: stars || undefined,
      limit: limit || 50,
    })

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    })
  } catch (error: any) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 })
  }
}
