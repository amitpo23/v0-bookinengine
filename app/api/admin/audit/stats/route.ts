import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { AuditLogger } from "@/lib/rbac/audit"

export const GET = withRBAC(
  async (req: NextRequest) => {
    try {
      const stats = await AuditLogger.getStats()

      return NextResponse.json({
        success: true,
        stats,
      })
    } catch (error: any) {
      console.error("[Audit Stats API] Error:", error)
      return NextResponse.json({ error: "Failed to get audit stats", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "ADMIN.AUDIT.READ" },
)
