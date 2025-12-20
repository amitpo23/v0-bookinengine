import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { auditLogStore } from "@/lib/rbac/audit"

export const GET = withRBAC(
  async (req: NextRequest) => {
    try {
      const { searchParams } = req.nextUrl

      // Parse query parameters
      const userId = searchParams.get("userId") || undefined
      const action = searchParams.get("action") || undefined
      const resource = searchParams.get("resource") || undefined
      const method = searchParams.get("method") || undefined
      const status = searchParams.get("status") ? Number.parseInt(searchParams.get("status")!) : undefined
      const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
      const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined
      const limit = Number.parseInt(searchParams.get("limit") || "100")

      // Search logs
      let logs = auditLogStore.search({
        userId,
        action,
        resource,
        method,
        status,
        startDate,
        endDate,
      })

      // Sort by timestamp desc
      logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      // Apply limit
      logs = logs.slice(0, limit)

      return NextResponse.json({
        success: true,
        count: logs.length,
        logs,
      })
    } catch (error: any) {
      console.error("[Audit API] Error:", error)
      return NextResponse.json({ error: "Failed to fetch audit logs", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "ADMIN.AUDIT.READ" },
)
