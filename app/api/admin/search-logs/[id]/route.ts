/**
 * API Route for Deleting Individual Search Logs
 */

import { NextRequest, NextResponse } from "next/server"
import { SearchLogger } from "@/lib/search-logger"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: "Missing log ID" },
        { status: 400 }
      )
    }

    const success = await SearchLogger.deleteLog(id)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete log" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Log deleted successfully",
    })
  } catch (error) {
    console.error("[Search Log Delete API] Error:", error)
    return NextResponse.json(
      { error: "Failed to delete log" },
      { status: 500 }
    )
  }
}
