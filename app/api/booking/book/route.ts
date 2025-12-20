import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { jsonRequest } = body

    if (!jsonRequest || typeof jsonRequest !== "string") {
      return NextResponse.json(
        {
          error: "jsonRequest is required - must be from PreBook response",
          received: { jsonRequest: typeof jsonRequest },
        },
        { status: 400 },
      )
    }

    const result = await mediciApi.book({
      jsonRequest,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Booking failed" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
    })
  } catch (error: any) {
    console.error("Book API Error:", error.message)
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 })
  }
}
