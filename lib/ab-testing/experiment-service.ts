/**
 * A/B Testing Service for AI Prompts
 * Test different prompt variations to optimize AI performance
 */

import { logger } from "@/lib/logger"
import { prisma } from "@/lib/db"

export interface PromptVariant {
  id: string
  name: string
  systemPrompt: string
  weight: number // 0-100, determines traffic split
  active: boolean
}

export interface Experiment {
  id: string
  name: string
  description: string
  variants: PromptVariant[]
  startDate: Date
  endDate?: Date
  active: boolean
  metrics: {
    conversions: number
    totalSessions: number
    avgResponseTime: number
    userSatisfaction: number
  }
}

export interface ExperimentResult {
  variantId: string
  sessionId: string
  metrics: {
    conversions?: number
    responseTime?: number
    userSatisfaction?: number
    completedBooking?: boolean
  }
}

class ExperimentService {
  /**
   * Get active prompt variant for a session
   * Uses weighted random selection for A/B testing
   */
  async getVariant(experimentId: string, sessionId: string): Promise<PromptVariant | null> {
    try {
      // Check if variant is already assigned to this session
      const existingAssignment = await prisma.experimentAssignment.findFirst({
        where: {
          experimentId,
          sessionId,
        },
      })

      if (existingAssignment) {
        // Return cached variant
        const variant = await prisma.promptVariant.findUnique({
          where: { id: existingAssignment.variantId },
        })
        return variant as PromptVariant | null
      }

      // Get all active variants for this experiment
      const variants = await prisma.promptVariant.findMany({
        where: {
          experimentId,
          active: true,
        },
      })

      if (variants.length === 0) {
        logger.warn("[A/B Test] No active variants found", { experimentId })
        return null
      }

      // Weighted random selection
      const selectedVariant = this.selectVariantByWeight(variants)

      // Save assignment
      await prisma.experimentAssignment.create({
        data: {
          experimentId,
          sessionId,
          variantId: selectedVariant.id,
        },
      })

      logger.info("[A/B Test] Variant assigned", {
        experimentId,
        sessionId,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      })

      return selectedVariant as PromptVariant
    } catch (error: any) {
      logger.error("[A/B Test] Failed to get variant", error)
      return null
    }
  }

  /**
   * Select variant based on weight distribution
   */
  private selectVariantByWeight(variants: any[]): any {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
    let random = Math.random() * totalWeight

    for (const variant of variants) {
      random -= variant.weight
      if (random <= 0) {
        return variant
      }
    }

    return variants[0] // Fallback
  }

  /**
   * Track experiment result
   */
  async trackResult(params: ExperimentResult): Promise<void> {
    try {
      const { variantId, sessionId, metrics } = params

      await prisma.experimentResult.create({
        data: {
          variantId,
          sessionId,
          conversions: metrics.conversions || 0,
          responseTime: metrics.responseTime || 0,
          userSatisfaction: metrics.userSatisfaction || 0,
          completedBooking: metrics.completedBooking || false,
        },
      })

      logger.info("[A/B Test] Result tracked", {
        variantId,
        sessionId,
        completedBooking: metrics.completedBooking,
      })
    } catch (error: any) {
      logger.error("[A/B Test] Failed to track result", error)
    }
  }

  /**
   * Get experiment analytics
   */
  async getExperimentAnalytics(experimentId: string): Promise<{
    variants: Array<{
      id: string
      name: string
      sessions: number
      conversions: number
      conversionRate: number
      avgResponseTime: number
      avgSatisfaction: number
    }>
    winner?: string
  }> {
    try {
      const variants = await prisma.promptVariant.findMany({
        where: { experimentId },
        include: {
          _count: {
            select: { assignments: true, results: true },
          },
        },
      })

      const analytics = await Promise.all(
        variants.map(async (variant) => {
          const results = await prisma.experimentResult.findMany({
            where: { variantId: variant.id },
          })

          const totalSessions = variant._count.assignments
          const conversions = results.filter((r) => r.completedBooking).length
          const conversionRate = totalSessions > 0 ? (conversions / totalSessions) * 100 : 0

          const avgResponseTime =
            results.length > 0
              ? results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
              : 0

          const avgSatisfaction =
            results.length > 0
              ? results.reduce((sum, r) => sum + r.userSatisfaction, 0) / results.length
              : 0

          return {
            id: variant.id,
            name: variant.name,
            sessions: totalSessions,
            conversions,
            conversionRate: Math.round(conversionRate * 100) / 100,
            avgResponseTime: Math.round(avgResponseTime),
            avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
          }
        })
      )

      // Determine winner (highest conversion rate with statistical significance)
      const winner = this.determineWinner(analytics)

      return {
        variants: analytics,
        winner,
      }
    } catch (error: any) {
      logger.error("[A/B Test] Failed to get analytics", error)
      return { variants: [] }
    }
  }

  /**
   * Determine winning variant
   * Simple winner selection - can be enhanced with statistical significance testing
   */
  private determineWinner(
    analytics: Array<{
      id: string
      name: string
      sessions: number
      conversions: number
      conversionRate: number
    }>
  ): string | undefined {
    // Need at least 30 sessions per variant for basic significance
    const MIN_SESSIONS = 30

    const qualifiedVariants = analytics.filter((v) => v.sessions >= MIN_SESSIONS)

    if (qualifiedVariants.length === 0) {
      return undefined
    }

    // Find variant with highest conversion rate
    const winner = qualifiedVariants.reduce((best, current) =>
      current.conversionRate > best.conversionRate ? current : best
    )

    return winner.id
  }

  /**
   * Create new experiment
   */
  async createExperiment(params: {
    name: string
    description: string
    variants: Array<{
      name: string
      systemPrompt: string
      weight: number
    }>
  }): Promise<{ success: boolean; experimentId?: string; error?: string }> {
    try {
      const { name, description, variants } = params

      // Validate weights sum to 100
      const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
      if (Math.abs(totalWeight - 100) > 0.01) {
        return {
          success: false,
          error: `Variant weights must sum to 100 (got ${totalWeight})`,
        }
      }

      const experiment = await prisma.experiment.create({
        data: {
          name,
          description,
          active: true,
          startDate: new Date(),
          variants: {
            create: variants.map((v) => ({
              name: v.name,
              systemPrompt: v.systemPrompt,
              weight: v.weight,
              active: true,
            })),
          },
        },
      })

      logger.info("[A/B Test] Experiment created", {
        experimentId: experiment.id,
        name,
        variantCount: variants.length,
      })

      return {
        success: true,
        experimentId: experiment.id,
      }
    } catch (error: any) {
      logger.error("[A/B Test] Failed to create experiment", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * End experiment and select winner
   */
  async endExperiment(experimentId: string): Promise<{
    success: boolean
    winner?: string
    analytics?: any
  }> {
    try {
      // Get final analytics
      const analytics = await this.getExperimentAnalytics(experimentId)

      // Mark experiment as ended
      await prisma.experiment.update({
        where: { id: experimentId },
        data: {
          active: false,
          endDate: new Date(),
        },
      })

      logger.info("[A/B Test] Experiment ended", {
        experimentId,
        winner: analytics.winner,
      })

      return {
        success: true,
        winner: analytics.winner,
        analytics,
      }
    } catch (error: any) {
      logger.error("[A/B Test] Failed to end experiment", error)
      return {
        success: false,
      }
    }
  }
}

// Export singleton instance
export const experimentService = new ExperimentService()

// Export class for testing
export { ExperimentService }
