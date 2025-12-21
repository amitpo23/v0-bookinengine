import { type NextRequest, NextResponse } from "next/server"
import { experimentService } from "@/lib/ab-testing/experiment-service"
import { logger } from "@/lib/logger"

/**
 * POST /api/experiments/create
 * Create a new A/B test experiment for AI prompts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, variants } = body

    // Validation
    if (!name || !variants || variants.length < 2) {
      return NextResponse.json(
        {
          error: "Name and at least 2 variants are required",
        },
        { status: 400 }
      )
    }

    logger.info("[Experiments API] Creating experiment", { name, variantCount: variants.length })

    const result = await experimentService.createExperiment({
      name,
      description,
      variants,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        experimentId: result.experimentId,
      })
    } else {
      return NextResponse.json(
        {
          error: result.error || "Failed to create experiment",
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    logger.error("[Experiments API] Error creating experiment", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create experiment",
      },
      { status: 500 }
    )
  }
}
