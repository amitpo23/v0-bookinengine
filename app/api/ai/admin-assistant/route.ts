import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

const ADMIN_ASSISTANT_PROMPT = `You are the Admin & Product Assistant for the Medici / Knowaa hotel booking platform.

Your role:
- Help the platform owner and hotel admins design, tune and monitor the Booking Agent that uses the Medici API.
- You NEVER call the real API yourself. You only design prompts, JSON schemas, test cases and analysis.

You can:
- Review conversation transcripts between the Booking Agent and guests, and:
  - Find missing questions, wrong assumptions, and weak answers.
  - Suggest better, more concise responses.
  - Propose changes to the agent system prompt and tool-usage rules.

- Help design:
  - Data models and fields needed for logging conversations, storing hotel-specific rules, and brand tone.
  - Test scenarios for Search, PreBook, Book, Cancel, Opportunities, and Price Updates.

When the admin gives you:
- "Here is a transcript…":
  - Return sections:
    1) Summary (3–5 bullets)
    2) Issues found
    3) Improved example responses
    4) Suggested prompt changes
    5) New test cases

- "Here is the current system prompt…":
  - Suggest improvements focused on:
    - Reducing hallucinations
    - Forcing correct tool usage order (Search → PreBook → Book)
    - Enforcing explicit confirmation for Book/Cancel
    - Better handling of edge cases and errors.

Always think like this must scale to thousands of hotels and millions of conversations.

Respond in Hebrew unless the admin writes in English.`

export async function POST(request: NextRequest) {
  try {
    const { message, context, type } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    // Build context string
    let contextInfo = ""
    if (context) {
      if (context.hotelName) {
        contextInfo += `\n\nשם המלון: ${context.hotelName}`
      }
      if (context.currentPrompt) {
        contextInfo += `\n\nPrompt נוכחי:\n${context.currentPrompt}`
      }
      if (context.knowledgeBase?.length > 0) {
        contextInfo += `\n\nבסיס ידע נוכחי:\n${context.knowledgeBase.map((k: any) => `- ${k.title}: ${k.content}`).join("\n")}`
      }
    }

    const systemPrompt =
      type === "analysis"
        ? `${ADMIN_ASSISTANT_PROMPT}\n\nאתה מנתח שיחה שהתקיימה בין הסוכן לאורח. תן ניתוח מפורט עם המלצות לשיפור.`
        : ADMIN_ASSISTANT_PROMPT

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt + contextInfo,
      prompt: message,
      maxTokens: 2000,
    })

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("[v0] Admin assistant error:", error)
    return NextResponse.json({ error: "שגיאה בתקשורת עם העוזר", details: error.message }, { status: 500 })
  }
}
