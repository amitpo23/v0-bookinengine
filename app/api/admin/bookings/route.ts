import { type NextRequest, NextResponse } from "next/server"
import { bookingRepository } from "@/lib/db/booking-repository"
import { logger } from "@/lib/logger"

/**
 * GET /api/admin/bookings
 * Fetch all bookings for admin dashboard
 * Supports filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0
    const status = searchParams.get("status") as any
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    logger.info("[Admin] Fetching all bookings", { limit, offset, status })

    const params: any = { limit, offset }

    if (status && status !== "all") {
      params.status = status.toUpperCase()
    }

    if (dateFrom) {
      params.dateFrom = new Date(dateFrom)
    }

    if (dateTo) {
      params.dateTo = new Date(dateTo)
    }

    const { bookings, total } = await bookingRepository.getAllBookings(params)

    logger.info("[Admin] ✅ Retrieved bookings", {
      count: bookings.length,
      total,
    })

    return NextResponse.json({
      success: true,
      bookings,
      total,
      count: bookings.length,
    })
  } catch (error: any) {
    logger.error("[Admin] Failed to fetch bookings", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch bookings",
      },
      { status: 500 }
    )
  }
}
