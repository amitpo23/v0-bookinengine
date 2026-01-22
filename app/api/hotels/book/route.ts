import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🔍 BOOK API - Body received:", JSON.stringify(body, null, 2))

    const { opportunityId, code, preBookId, token, guestInfo } = body

    console.log("🌐 Calling Medici Book API...")

    // Old format - manual book
    if (opportunityId) {
      const result = await mediciApi.manualBook(opportunityId, code)

      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to book room" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        bookingId: result.bookingId,
      })
    }

    // New format - book with preBookId and token
    if (preBookId && token) {
      const result = await mediciApi.book({
        preBookId,
        token,
        guestInfo,
      })

      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to book room" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        bookingId: result.bookingId,
        confirmation: result.supplierReference,
        status: result.status,
      })
    }

    return NextResponse.json({ error: "Either opportunityId or (preBookId + token) is required" }, { status: 400 })

  } catch (error: any) {
    console.error("Book API Error:", error)
    return NextResponse.json({ error: error.message || "Failed to book room" }, { status: 500 })
  }
}
