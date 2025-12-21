import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { mcpSqlTool } from "@/lib/mcp/sql-tool"

async function handler(req: NextRequest, context: any) {
  const { user } = context
  const body = await req.json()

  const { query, params, reason, jobId } = body

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const result = await mcpSqlTool.execute({ query, params, reason, jobId }, user)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export const POST = withRBAC(handler, {
  tool: "mcp_sql",
  action: "execute",
  resource: "database",
})
