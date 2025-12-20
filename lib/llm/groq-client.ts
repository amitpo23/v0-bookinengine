import type { Role } from "../rbac/types"
import { ROLE_CONFIG } from "../rbac/config"

type LlmMode = "assistant" | "analysis" | "forecast" | "booking_assistant"

interface LlmMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface LlmCallOptions {
  modelPurpose: LlmMode
  userId: string
  role: Role
  messages: LlmMessage[]
  jobId?: string
  maxRetries?: number
}

const GROQ_MODELS = {
  analysis: process.env.GROQ_MODEL_ANALYSIS ?? "llama-3.3-70b-versatile",
  bookingAssistant: process.env.GROQ_MODEL_BOOKING ?? "llama-3.1-8b-instant",
}

export class GroqClient {
  private validatePermissions(role: Role, mode: LlmMode): void {
    const roleConfig = ROLE_CONFIG[role]
    const llmConfig = roleConfig.constraints.llm

    if (!llmConfig) {
      throw new Error(`No LLM configuration for role ${role}`)
    }

    const modeMap: Record<LlmMode, string> = {
      assistant: "assistant",
      analysis: "analysis",
      forecast: "forecast",
      booking_assistant: "booking_assistant",
    }

    const requiredMode = modeMap[mode]

    if (!llmConfig.allowed_modes.includes(requiredMode)) {
      throw new Error(
        `Role ${role} is not allowed to use LLM mode "${mode}". Allowed: ${llmConfig.allowed_modes.join(", ")}`,
      )
    }
  }

  private selectModel(mode: LlmMode): string {
    if (mode === "booking_assistant") {
      return GROQ_MODELS.bookingAssistant
    }
    return GROQ_MODELS.analysis
  }

  private redactSecrets(obj: any): any {
    const sensitiveKeys = ["password", "token", "apiKey", "secret", "cardNumber", "cvv", "authorization"]

    if (typeof obj !== "object" || obj === null) return obj

    const redacted = Array.isArray(obj) ? [] : {}

    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        ;(redacted as any)[key] = "[REDACTED]"
      } else if (typeof value === "object") {
        ;(redacted as any)[key] = this.redactSecrets(value)
      } else {
        ;(redacted as any)[key] = value
      }
    }

    return redacted
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (e: any) {
        lastError = e

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  async call(options: LlmCallOptions) {
    const { modelPurpose, userId, role, messages, jobId, maxRetries = 3 } = options

    // Validate permissions
    this.validatePermissions(role, modelPurpose)

    const model = this.selectModel(modelPurpose)
    const startTime = Date.now()

    try {
      console.log("[Groq LLM] User:", userId, "Role:", role, "Mode:", modelPurpose, "Model:", model)

      // In production, call real Groq API
      const response = await this.executeWithRetry(async () => {
        // Mock response for now
        return {
          content: "Mock LLM response. Connect to Groq API in production.",
          usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        }
      }, maxRetries)

      const duration = Date.now() - startTime
      console.log("[Groq LLM] Success in", duration, "ms")

      return {
        success: true,
        content: response.content,
        usage: response.usage,
      }
    } catch (e: any) {
      console.error("[Groq LLM] Call failed:", e.message)
      throw e
    }
  }
}

export const groqClient = new GroqClient()
