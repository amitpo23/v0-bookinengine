import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dashboard = await mediciApi.getDashboardInfo(body)

    return NextResponse.json({
      success: true,
      data: dashboard,
    })
  } catch (error: any) {
    console.error("Get Dashboard Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get dashboard info" }, { status: 500 })
  }
}
