import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"
import { bookingRepository } from "@/lib/db/booking-repository"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { bookingId, reason } = body

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 })
    }

    logger.info("[Cancel] Attempting to cancel booking", { bookingId })

    const result = await apiClient.cancelRoom({ prebookId: Number(bookingId) })

    if (!result.success) {
      logger.warn("[Cancel] Cancellation failed from Medici API", {
        bookingId,
        error: result.error,
      })

      // Log failed cancellation attempt
      await bookingRepository.createAuditLog({
        action: "CANCEL",
        status: "FAILED",
        apiUsed: result.apiSource || "medici-direct",
        requestData: { bookingId, reason },
        responseData: result,
        errorMessage: result.error,
      })

      return NextResponse.json({ error: result.error || "Cancellation failed" }, { status: 400 })
    }

    // ✅ Medici API cancellation succeeded - now update database
    try {
      // Update booking status in database
      await bookingRepository.updateBookingStatus(bookingId.toString(), "CANCELLED", reason)

      // Create audit log
      await bookingRepository.createAuditLog({
        action: "CANCEL",
        status: "SUCCESS",
        apiUsed: result.apiSource || "medici-direct",
        requestData: { bookingId, reason },
        responseData: result,
      })

      logger.info("[Cancel] ✅ Booking cancelled successfully", { bookingId })
    } catch (dbError) {
      // Database errors should NOT fail the cancellation
      logger.error("[DB] Failed to update cancellation in database (non-critical)", {
        bookingId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error: any) {
    logger.error("Cancel API Error:", error)
    return NextResponse.json({ error: error.message || "Cancellation failed" }, { status: 500 })
  }
}
