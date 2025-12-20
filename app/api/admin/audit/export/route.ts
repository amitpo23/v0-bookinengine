import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { AuditLogger } from "@/lib/rbac/audit"

export const GET = withRBAC(
  async (req: NextRequest) => {
    try {
      const { searchParams } = req.nextUrl
      const format = (searchParams.get("format") || "json") as "json" | "csv"

      const exported = await AuditLogger.exportLogs(format)

      const contentType = format === "json" ? "application/json" : "text/csv"
      const filename = `audit-logs-${new Date().toISOString()}.${format}`

      return new NextResponse(exported, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } catch (error: any) {
      console.error("[Audit Export API] Error:", error)
      return NextResponse.json({ error: "Failed to export audit logs", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "ADMIN.AUDIT.READ" },
)
