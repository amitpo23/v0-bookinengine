import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { jsonRequest } = body

    if (!jsonRequest || typeof jsonRequest !== "string") {
      return NextResponse.json(
        {
          error: "jsonRequest is required - must be the requestJson from search results",
          received: { jsonRequest: typeof jsonRequest },
        },
        { status: 400 },
      )
    }

    const result = await mediciApi.preBook({
      jsonRequest,
    })

    const hasValidResponse = result.token || result.preBookId || result.status === "done" || result.priceConfirmed > 0

    if (!hasValidResponse) {
      return NextResponse.json(
        {
          success: false,
          error: "PreBook failed - room may no longer be available",
          debug: result,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      preBookId: result.preBookId,
      token: result.token,
      priceConfirmed: result.priceConfirmed,
      currency: result.currency,
      status: result.status,
      requestJson: result.requestJson,
      responseJson: result.responseJson,
    })
  } catch (error: any) {
    console.error("PreBook API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "PreBook failed",
      },
      { status: 500 },
    )
  }
}
