import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { groqClient } from "@/lib/llm/groq-client"

async function handler(req: NextRequest, context: any) {
  const { user } = context
  const body = await req.json()

  const { messages, modelPurpose = "assistant", jobId } = body

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
  }

  try {
    const result = await groqClient.call({
      modelPurpose,
      userId: user.id,
      role: user.role,
      messages,
      jobId,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}

export const POST = withRBAC(handler, {
  tool: "llm",
  action: "call",
  resource: "ai",
})
