import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { bookingId, reason } = body

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 })
    }

    const result = await apiClient.cancelRoom({ prebookId: Number(bookingId) })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Cancellation failed" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error: any) {
    console.error("Cancel API Error:", error)
    return NextResponse.json({ error: error.message || "Cancellation failed" }, { status: 500 })
  }
}
