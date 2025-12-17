import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { BookingSearchSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()

    logger.apiRequest("POST", "/api/booking/search", {
      hotelName: body.hotelName,
      city: body.city,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    })

    // Validate input with Zod
    const validated = BookingSearchSchema.parse(body)

    const results = await mediciApi.searchHotels({
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      hotelName: validated.hotelName,
      city: validated.city,
      adults: validated.adults,
      children: validated.children,
      stars: validated.stars || undefined,
      limit: validated.limit || 50,
    })

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/booking/search", 200, duration)

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    })
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      logger.warn("Search validation failed", { errors: error.errors })
      logger.apiResponse("POST", "/api/booking/search", 400, duration)

      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error("Search API error", error)
    logger.apiResponse("POST", "/api/booking/search", 500, duration)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Search failed",
      },
      { status: 500 }
    )
  }
}
