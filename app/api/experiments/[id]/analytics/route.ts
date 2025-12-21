import { type NextRequest, NextResponse } from "next/server"
import { experimentService } from "@/lib/ab-testing/experiment-service"
import { logger } from "@/lib/logger"

/**
 * GET /api/experiments/[id]/analytics
 * Get analytics and performance metrics for an experiment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experimentId = params.id

    logger.info("[Experiments API] Getting analytics", { experimentId })

    const analytics = await experimentService.getExperimentAnalytics(experimentId)

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error: any) {
    logger.error("[Experiments API] Error getting analytics", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to get analytics",
      },
      { status: 500 }
    )
  }
}
