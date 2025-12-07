import { generateText } from "ai"
import { CONVERSATION_REVIEWER_PROMPT } from "@/lib/prompts/conversation-reviewer-prompt"

export async function POST(request: Request) {
  try {
    const { conversation } = await request.json()

    if (!conversation || conversation.trim().length === 0) {
      return Response.json({ error: "No conversation provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: CONVERSATION_REVIEWER_PROMPT,
      prompt: `נתח את השיחה הבאה:\n\n${conversation}`,
      temperature: 0.3,
    })

    return Response.json({
      success: true,
      analysis: text,
    })
  } catch (error) {
    console.error("[v0] Analyze conversation error:", error)
    return Response.json(
      {
        error: "Failed to analyze conversation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
