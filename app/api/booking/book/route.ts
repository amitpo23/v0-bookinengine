import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { BookingSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { applyRateLimit, RateLimitConfig } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, RateLimitConfig.book)
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for booking", {
      path: "/api/booking/book",
    })
    return rateLimitResult.response
  }

  try {
    const body = await request.json()

    logger.apiRequest("POST", "/api/booking/book", {
      hotelId: body.hotelId,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      customerEmail: body.customer?.email,
    })

    // Validate input with Zod
    const validated = BookingSchema.parse(body)

    logger.debug("Calling mediciApi.book", {
      hotelId: validated.hotelId,
      preBookId: validated.preBookId,
      customerName: `${validated.customer.firstName} ${validated.customer.lastName}`,
    })

    const result = await mediciApi.book({
      code: validated.code,
      token: validated.token,
      preBookId: validated.preBookId,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      hotelId: validated.hotelId,
      adults: validated.adults,
      children: validated.children,
      customer: validated.customer,
      voucherEmail: validated.voucherEmail,
      agencyReference: validated.agencyReference,
    })

    logger.debug("Booking result received", {
      success: result.success,
      bookingId: result.bookingId,
      status: result.status,
    })

    if (!result.success) {
      logger.warn("Booking failed from Medici API", { error: result.error })

      const duration = Date.now() - startTime
      logger.apiResponse("POST", "/api/booking/book", 400, duration)

      return NextResponse.json({ error: result.error || "Booking failed" }, { status: 400 })
    }

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/booking/book", 200, duration)

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
    })
  } catch (error) {
    const duration = Date.now() - startTime

    if (error instanceof z.ZodError) {
      logger.warn("Booking validation failed", { errors: error.errors })
      logger.apiResponse("POST", "/api/booking/book", 400, duration)

      return NextResponse.json(
        {
          error: "Invalid booking parameters",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error("Booking API error", error)
    logger.apiResponse("POST", "/api/booking/book", 500, duration)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Booking failed",
      },
      { status: 500 }
    )
  }
}
