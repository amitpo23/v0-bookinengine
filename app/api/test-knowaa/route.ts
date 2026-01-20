import { type NextRequest, NextResponse } from "next/server"
import { knowaaClient, getTokenCacheStatus } from "@/lib/api/knowaa-client"

/**
 * Test Knowaa authentication and search
 * GET /api/test-knowaa?action=search&city=Tel%20Aviv&dateFrom=2025-02-01&dateTo=2025-02-05
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "status"
    const city = searchParams.get("city") || "Tel Aviv"
    const dateFrom = searchParams.get("dateFrom") || "2025-02-01"
    const dateTo = searchParams.get("dateTo") || "2025-02-05"
    const hotelName = searchParams.get("hotelName")

    console.log(`\n🚀 [Knowaa Test] Action: ${action}`)

    if (action === "status") {
      const cacheStatus = getTokenCacheStatus()
      return NextResponse.json({
        message: "Knowaa API Integration Status",
        timestamp: new Date().toISOString(),
        tokenCache: cacheStatus,
        endpoints: {
          search: "/api/test-knowaa?action=search&city=Tel%20Aviv&dateFrom=2025-02-01&dateTo=2025-02-05",
          searchByHotel: "/api/test-knowaa?action=search&hotelName=Scarlet&dateFrom=2025-02-01&dateTo=2025-02-05",
        },
      })
    }

    if (action === "search") {
      console.log(`\n🔍 Searching: ${hotelName ? `Hotel: ${hotelName}` : `City: ${city}`}`)

      const results = await knowaaClient.searchHotels({
        dateFrom,
        dateTo,
        hotelName: hotelName || undefined,
        city: hotelName ? undefined : city,
        adults: 2,
      })

      return NextResponse.json({
        success: true,
        count: results.length,
        dateRange: { dateFrom, dateTo },
        query: hotelName ? { hotelName } : { city },
        hotels: results.map((h) => ({
          id: h.hotelId,
          name: h.hotelName,
          city: h.city,
          stars: h.stars,
          rooms: h.rooms.length,
        })),
        fullResults: results,
      })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error: any) {
    console.error("❌ [Knowaa Test] Error:", error.message)
    return NextResponse.json(
      {
        error: error.message || "Test failed",
        details: error.response?.data || error.toString(),
      },
      { status: 500 }
    )
  }
}

/**
 * POST for search with custom body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action = "search", ...params } = body

    console.log(`\n🚀 [Knowaa API POST] Action: ${action}`)

    if (action === "search") {
      const results = await knowaaClient.searchHotels({
        dateFrom: params.dateFrom || "2025-02-01",
        dateTo: params.dateTo || "2025-02-05",
        hotelName: params.hotelName,
        city: params.city || "Tel Aviv",
        adults: params.adults || 2,
        stars: params.stars,
        limit: params.limit,
      })

      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
      })
    }

    if (action === "prebook") {
      const result = await knowaaClient.preBook({
        jsonRequest: params.jsonRequest,
      })

      return NextResponse.json({
        success: result.success,
        preBookId: result.preBookId,
        token: result.token,
        status: result.status,
        price: result.priceConfirmed,
      })
    }

    if (action === "book") {
      const result = await knowaaClient.book({
        jsonRequest: params.jsonRequest,
      })

      return NextResponse.json({
        success: result.success,
        bookingId: result.bookingId,
        status: result.status,
      })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error: any) {
    console.error("❌ [Knowaa API POST] Error:", error.message)
    return NextResponse.json(
      {
        error: error.message || "Request failed",
      },
      { status: 500 }
    )
  }
}
