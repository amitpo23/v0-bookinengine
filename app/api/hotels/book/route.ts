import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { DEMO_MODE } from "@/lib/demo/demo-mode"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🔍 BOOK API - Body received:", JSON.stringify(body, null, 2))

    // Support both old format (opportunityId) and new format (preBookId, token, guestInfo)
    const { opportunityId, code, preBookId, token, guestInfo } = body

    console.log("🔍 DEMO_MODE:", DEMO_MODE)

    if (DEMO_MODE) {
      console.log("🎭 DEMO MODE: Using mock booking data")
      
      return NextResponse.json({
        success: true,
        bookingId: `DEMO_${Date.now()}`,
        confirmation: `SCR${Math.floor(Math.random() * 100000)}`,
        status: "confirmed",
        totalPrice: 1200,
        currency: "ILS",
        guestInfo: guestInfo || {},
        requestJson: JSON.stringify(body),
        responseJson: JSON.stringify({ demo: true }),
      })
    }

    console.log("🌐 REAL API MODE: Calling Medici Book...")

    // Old format - manual book
    if (opportunityId) {
      if (!opportunityId) {
        return NextResponse.json({ error: "opportunityId is required" }, { status: 400 })
      }

      const result = await mediciApi.manualBook(opportunityId, code)

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
