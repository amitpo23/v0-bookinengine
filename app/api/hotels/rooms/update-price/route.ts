import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.prebookId || !body.newPushPrice) {
      return NextResponse.json({ error: "prebookId and newPushPrice are required" }, { status: 400 })
    }

    const result = await mediciApi.updatePushPrice(body.prebookId, body.newPushPrice)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update price" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update Price Error:", error)
    return NextResponse.json({ error: error.message || "Failed to update price" }, { status: 500 })
  }
}
