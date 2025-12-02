import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.opportunityId) {
      return NextResponse.json({ error: "opportunityId is required" }, { status: 400 })
    }

    const result = await mediciApi.manualBook(body.opportunityId, body.code)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to book room" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
    })
  } catch (error: any) {
    console.error("Manual Book Error:", error)
    return NextResponse.json({ error: error.message || "Failed to book room" }, { status: 500 })
  }
}
