import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const prebookId = searchParams.get("prebookId")

    if (!prebookId) {
      return NextResponse.json({ error: "prebookId is required" }, { status: 400 })
    }

    const result = await mediciApi.cancelRoom(Number.parseInt(prebookId))

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to cancel room" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Cancel Room Error:", error)
    return NextResponse.json({ error: error.message || "Failed to cancel room" }, { status: 500 })
  }
}
