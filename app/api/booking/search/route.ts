import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"
import { BookingSearchSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { applyRateLimit, RateLimitConfig } from "@/lib/rate-limit"
import { cache, createSearchCacheKey, CacheConfig } from "@/lib/cache"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()

    // Validate input with Zod
    const validated = BookingSearchSchema.parse(body)

    // Create cache key from search parameters
    const cacheKey = createSearchCacheKey({
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      city: validated.city,
      hotelName: validated.hotelName,
      adults: validated.adults,
      children: validated.children,
    })

    // Try to get from cache or fetch and cache
    const results = await cache.getOrSet(
      cacheKey,
      () =>
        apiClient.searchHotels({
          dateFrom: validated.dateFrom,
          dateTo: validated.dateTo,
          hotelName: validated.hotelName,
          city: validated.city,
          adults: validated.adults,
          children: validated.children,
          stars: validated.stars || undefined,
          limit: validated.limit || 50,
        }),
      CacheConfig.search.ttl
    )

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/booking/search", 200, duration)

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
