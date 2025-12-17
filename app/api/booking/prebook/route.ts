import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { PreBookSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { applyRateLimit, RateLimitConfig } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, RateLimitConfig.prebook)
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for prebook", {
      path: "/api/booking/prebook",
    })
    return rateLimitResult.response
  }

  try {
    const body = await request.json()

    logger.apiRequest("POST", "/api/booking/prebook", {
      hotelId: body.hotelId,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    })

    // Validate input with Zod
    const validated = PreBookSchema.parse(body)

    logger.debug("Calling mediciApi.preBook", {
      hotelId: validated.hotelId,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      adults: validated.adults,
    })

    const result = await mediciApi.preBook({
      code: validated.code,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      hotelId: validated.hotelId,
      adults: validated.adults,
      children: validated.children,
    })

    logger.debug("PreBook result received", {
      preBookId: result.preBookId,
      status: result.status,
      priceConfirmed: result.priceConfirmed,
    })

    const hasValidResponse = result.token || result.preBookId || result.status === "done" || result.priceConfirmed > 0

    if (!hasValidResponse) {
      logger.warn("PreBook failed - no valid response indicators", { result })

      const duration = Date.now() - startTime
      logger.apiResponse("POST", "/api/booking/prebook", 400, duration)

      return NextResponse.json(
        {
          success: false,
          error: "PreBook failed - room may no longer be available",
        },
        { status: 400 }
      )
    }

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/booking/prebook", 200, duration)

    return NextResponse.json({
      success: true,
      preBookId: result.preBookId,
      token: result.token,
      priceConfirmed: result.priceConfirmed,
      currency: result.currency,
      status: result.status,
    })
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      logger.warn("PreBook validation failed", { errors: error.errors })
      logger.apiResponse("POST", "/api/booking/prebook", 400, duration)

      return NextResponse.json(
        {
          success: false,
          error: "Invalid prebook parameters",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error("PreBook API error", error)
    logger.apiResponse("POST", "/api/booking/prebook", 500, duration)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "PreBook failed",
      },
      { status: 500 }
    )
  }
}
