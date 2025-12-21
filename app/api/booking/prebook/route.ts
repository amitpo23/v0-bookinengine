import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"
import { PreBookSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { applyRateLimit, RateLimitConfig } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validated = PreBookSchema.parse(body)

    logger.debug("Calling apiClient.preBook", {
      hotelId: validated.hotelId,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      adults: validated.adults,
      hasRequestJson: !!validated.requestJson,
    })

    const result = await apiClient.preBook({
      code: validated.code,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      hotelId: validated.hotelId,
      adults: validated.adults,
      children: validated.children,
      requestJson: validated.requestJson,
    })

    logger.debug("PreBook result received", {
      preBookId: result.preBookId,
      status: result.status,
      priceConfirmed: result.priceConfirmed,
    })

    const hasValidResponse = result.token || result.preBookId || result.status === "done" || result.priceConfirmed > 0

    if (!hasValidResponse) {
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
      requestJson: result.requestJson || validated.requestJson,
      responseJson: result.responseJson,
    })
  } catch (error: any) {
    console.error("PreBook API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "PreBook failed",
      },
      { status: 500 },
    )
  }
}
