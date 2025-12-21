/**
 * GROQ API Client Configuration
 * Ultra-fast LLM inference with Llama, Mixtral, and other models
 * Perfect for booking AI where speed is critical
 */

import Groq from "groq-sdk"
import { logger } from "@/lib/logger"

const GROQ_API_KEY = process.env.GROQ_API_KEY

// Available models on GROQ (as of 2024)
export const GROQ_MODELS = {
  // Llama models - Best for general purpose
  LLAMA_3_3_70B: "llama-3.3-70b-versatile", // Recommended: Fast + Smart
  LLAMA_3_1_70B: "llama-3.1-70b-versatile",
  LLAMA_3_1_8B: "llama-3.1-8b-instant", // Ultra-fast for simple tasks

  // Mixtral models - Great for multilingual (Hebrew support)
  MIXTRAL_8X7B: "mixtral-8x7b-32768", // Excellent for Hebrew + English

  // Gemma models - Efficient and fast
  GEMMA_7B: "gemma-7b-it",
  GEMMA_2_9B: "gemma2-9b-it",
} as const

export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS]

class GroqClient {
  private client: Groq | null = null

  constructor() {
    if (GROQ_API_KEY) {
      this.client = new Groq({
        apiKey: GROQ_API_KEY,
      })
      logger.info("[GROQ] Client initialized successfully")
    } else {
      logger.warn("[GROQ] API key not configured - GROQ features disabled")
    }
  }

  isConfigured(): boolean {
    return !!this.client
  }

  /**
   * Generate chat completion with GROQ (ultra-fast inference)
   */
  async chat(params: {
    model?: GroqModel
    messages: Array<{
      role: "system" | "user" | "assistant"
      content: string
    }>
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }) {
    if (!this.client) {
      throw new Error("GROQ API key not configured")
    }

    const model = params.model || GROQ_MODELS.MIXTRAL_8X7B // Default: Best for Hebrew

    logger.debug("[GROQ] Generating chat completion", {
      model,
      messageCount: params.messages.length,
    })

    try {
      const startTime = Date.now()

      const completion = await this.client.chat.completions.create({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2048,
        stream: params.stream ?? false,
      })

      const duration = Date.now() - startTime

      logger.info("[GROQ] ✅ Chat completion generated", {
        model,
        duration: `${duration}ms`,
        tokens: completion.usage?.total_tokens,
      })

      return {
        content: completion.choices[0]?.message?.content || "",
        usage: completion.usage,
        duration,
      }
    } catch (error: any) {
      logger.error("[GROQ] ❌ Chat completion failed", {
        error: error.message,
        model,
      })
      throw error
    }
  }

  /**
   * Stream chat completion (for real-time responses)
   */
  async *streamChat(params: {
    model?: GroqModel
    messages: Array<{
      role: "system" | "user" | "assistant"
      content: string
    }>
    temperature?: number
    maxTokens?: number
  }) {
    if (!this.client) {
      throw new Error("GROQ API key not configured")
    }

    const model = params.model || GROQ_MODELS.MIXTRAL_8X7B

    logger.debug("[GROQ] Starting streaming chat", {
      model,
      messageCount: params.messages.length,
    })

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2048,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }

      logger.info("[GROQ] ✅ Streaming completed", { model })
    } catch (error: any) {
      logger.error("[GROQ] ❌ Streaming failed", {
        error: error.message,
        model,
      })
      throw error
    }
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return Object.entries(GROQ_MODELS).map(([key, value]) => ({
      id: value,
      name: key.replace(/_/g, " "),
    }))
  }
}

// Export singleton instance
export const groqClient = new GroqClient()

// Export for testing
export { GroqClient }
