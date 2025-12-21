import { type NextRequest, NextResponse } from "next/server"
import { sessionStore } from "@/lib/rbac/session"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      sessionStore.delete(token)
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: any) {
    console.error("[Logout] Error:", error)
    return NextResponse.json({ error: "Logout failed", details: error.message }, { status: 500 })
  }
}
