import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rooms = await mediciApi.getActiveRooms(body)

    return NextResponse.json({
      success: true,
      data: rooms,
      count: rooms.length,
    })
  } catch (error: any) {
    console.error("Get Active Rooms Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get active rooms" }, { status: 500 })
  }
}
