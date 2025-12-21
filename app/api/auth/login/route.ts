import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateSessionId, sessionStore } from "@/lib/rbac/session"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionId = generateSessionId()
    sessionStore.set(sessionId, user)

    // Return token (in production, use JWT or secure cookies)
    return NextResponse.json({
      success: true,
      token: sessionId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("[Login] Error:", error)
    return NextResponse.json({ error: "Login failed", details: error.message }, { status: 500 })
  }
}
