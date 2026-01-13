import { NextRequest, NextResponse } from "next/server"
import { createAgent } from "@/lib/ai-chat/agent"
import { memoryManager } from "@/lib/ai-chat/memory"

export const runtime = "edge"

/**
 * POST /api/ai-chat
 * עיבוד הודעה מהמשתמש
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, userId } = body

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: message, sessionId" },
        { status: 400 }
      )
    }

    // צור או קבל agent
    const agent = createAgent(sessionId, {
      model: "gpt-4",
      temperature: 0.7,
    })

    // טען זיכרון אם יש
    await memoryManager.loadFromLongTermMemory(sessionId)

    // עבד את ההודעה
    const response = await agent.processMessage(message)

    // החזר תשובה
    return NextResponse.json({
      success: true,
      response,
      status: agent.getConversationStatus(),
    })
  } catch (error: any) {
    console.error("AI Chat API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai-chat?sessionId=xxx
 * קבל היסטוריית שיחה
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      )
    }

    // טען זיכרון
    await memoryManager.loadFromLongTermMemory(sessionId)

    // קבל הודעות
    const messages = memoryManager.getMessages(sessionId)
    const preferences = memoryManager.getUserPreferences(sessionId)
    const booking = memoryManager.getBookingContext(sessionId)

    return NextResponse.json({
      success: true,
      data: {
        messages,
        preferences,
        booking,
      },
    })
  } catch (error: any) {
    console.error("AI Chat GET error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ai-chat?sessionId=xxx
 * איפוס שיחה
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      )
    }

    const agent = createAgent(sessionId)
    agent.reset()

    return NextResponse.json({
      success: true,
      message: "Conversation reset",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
