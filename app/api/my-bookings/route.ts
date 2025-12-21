import { type NextRequest, NextResponse } from "next/server"
import { bookingRepository } from "@/lib/db/booking-repository"
import { logger } from "@/lib/logger"

/**
 * GET /api/my-bookings
 * Fetch booking history for a user by email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    logger.info("[My Bookings] Fetching bookings", { email })

    const bookings = await bookingRepository.getUserBookings(email)

    logger.info("[My Bookings] ✅ Retrieved bookings", {
      email,
      count: bookings.length,
    })

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    })
  } catch (error: any) {
    logger.error("[My Bookings] Failed to fetch bookings", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch bookings",
      },
      { status: 500 }
    )
  }
}
