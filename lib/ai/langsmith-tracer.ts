/**
 * LangSmith Integration
 * Observability and monitoring for AI booking conversations
 * Tracks all AI interactions, performance metrics, and user feedback
 */

import { Client } from "langsmith"
import { logger } from "@/lib/logger"

const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY
const LANGSMITH_PROJECT = process.env.LANGSMITH_PROJECT || "booking-engine"

class LangSmithTracer {
  private client: Client | null = null
  private enabled: boolean = false

  constructor() {
    if (LANGSMITH_API_KEY) {
      this.client = new Client({
        apiKey: LANGSMITH_API_KEY,
      })
      this.enabled = true
      logger.info("[LangSmith] Tracing enabled", {
        project: LANGSMITH_PROJECT,
      })
    } else {
      logger.warn("[LangSmith] API key not configured - tracing disabled")
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Trace AI chat interaction
   */
  async traceChat(params: {
    conversationId: string
    userMessage: string
    aiResponse: string
    model: string
    duration: number
    metadata?: Record<string, any>
    tags?: string[]
  }) {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      await this.client.createRun({
        name: "booking-chat",
        run_type: "llm",
        inputs: {
          messages: [{ role: "user", content: params.userMessage }],
        },
        outputs: {
          content: params.aiResponse,
        },
        start_time: Date.now() - params.duration,
        end_time: Date.now(),
        extra: {
          metadata: {
            conversationId: params.conversationId,
            model: params.model,
            duration: params.duration,
            ...params.metadata,
          },
          tags: params.tags || ["booking", "chat"],
        },
        project_name: LANGSMITH_PROJECT,
      })

      logger.debug("[LangSmith] ✅ Chat interaction traced", {
        conversationId: params.conversationId,
      })
    } catch (error: any) {
      // Don't fail the request if tracing fails
      logger.error("[LangSmith] Failed to trace chat", {
        error: error.message,
      })
    }
  }

  /**
   * Trace booking search operation
   */
  async traceBookingSearch(params: {
    searchId: string
    query: {
      dateFrom: string
      dateTo: string
      hotelName?: string
      city?: string
      adults: number
      children: number[]
    }
    results: any[]
    duration: number
    apiUsed: "medici-direct" | "manus"
    success: boolean
    error?: string
  }) {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      await this.client.createRun({
        name: "booking-search",
        run_type: "chain",
        inputs: params.query,
        outputs: {
          results: params.results.length,
          success: params.success,
        },
        start_time: Date.now() - params.duration,
        end_time: Date.now(),
        error: params.error,
        extra: {
          metadata: {
            searchId: params.searchId,
            apiUsed: params.apiUsed,
            duration: params.duration,
            resultCount: params.results.length,
          },
          tags: ["booking", "search", params.apiUsed],
        },
        project_name: LANGSMITH_PROJECT,
      })

      logger.debug("[LangSmith] ✅ Booking search traced", {
        searchId: params.searchId,
        results: params.results.length,
      })
    } catch (error: any) {
      logger.error("[LangSmith] Failed to trace booking search", {
        error: error.message,
      })
    }
  }

  /**
   * Trace booking completion
   */
  async traceBooking(params: {
    bookingId: string
    hotelName: string
    dateFrom: string
    dateTo: string
    totalPrice: number
    currency: string
    duration: number
    apiUsed: "medici-direct" | "manus"
    success: boolean
    error?: string
  }) {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      await this.client.createRun({
        name: "booking-completion",
        run_type: "chain",
        inputs: {
          hotelName: params.hotelName,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
        outputs: {
          bookingId: params.bookingId,
          totalPrice: params.totalPrice,
          currency: params.currency,
          success: params.success,
        },
        start_time: Date.now() - params.duration,
        end_time: Date.now(),
        error: params.error,
        extra: {
          metadata: {
            bookingId: params.bookingId,
            apiUsed: params.apiUsed,
            duration: params.duration,
            revenue: params.totalPrice,
          },
          tags: ["booking", "completion", params.apiUsed, params.success ? "success" : "failed"],
        },
        project_name: LANGSMITH_PROJECT,
      })

      logger.debug("[LangSmith] ✅ Booking completion traced", {
        bookingId: params.bookingId,
        success: params.success,
      })
    } catch (error: any) {
      logger.error("[LangSmith] Failed to trace booking", {
        error: error.message,
      })
    }
  }

  /**
   * Log user feedback on AI response
   */
  async logFeedback(params: {
    conversationId: string
    score: number // 0-1 or 1-5
    comment?: string
    metadata?: Record<string, any>
  }) {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      await this.client.createFeedback(params.conversationId, "user_feedback", {
        score: params.score,
        comment: params.comment,
        metadata: params.metadata,
      })

      logger.debug("[LangSmith] ✅ User feedback logged", {
        conversationId: params.conversationId,
        score: params.score,
      })
    } catch (error: any) {
      logger.error("[LangSmith] Failed to log feedback", {
        error: error.message,
      })
    }
  }

  /**
   * Create dataset for testing and evaluation
   */
  async createDataset(params: { name: string; description?: string; examples: Array<{ input: any; output: any }> }) {
    if (!this.enabled || !this.client) {
      throw new Error("LangSmith not configured")
    }

    try {
      const dataset = await this.client.createDataset(params.name, {
        description: params.description,
      })

      // Add examples to dataset
      for (const example of params.examples) {
        await this.client.createExample(example.input, example.output, {
          datasetId: dataset.id,
        })
      }

      logger.info("[LangSmith] ✅ Dataset created", {
        name: params.name,
        examples: params.examples.length,
      })

      return dataset
    } catch (error: any) {
      logger.error("[LangSmith] Failed to create dataset", {
        error: error.message,
      })
      throw error
    }
  }
}

// Export singleton instance
export const langsmithTracer = new LangSmithTracer()

// Export class for testing
export { LangSmithTracer }
