import type { Role } from "../rbac/types"
import { ROLE_CONFIG } from "../rbac/config"

interface SqlToolInput {
  query: string
  params?: any[]
  reason?: string
  jobId?: string
}

interface SafeSqlConfig {
  allowSchemas: string[]
  denyTables: string[]
  enforceLimit: boolean
  defaultLimit: number
  timeout: number
  blockMultiStatement: boolean
}

export class McpSqlTool {
  private config: SafeSqlConfig

  constructor() {
    this.config = {
      allowSchemas: ["public"],
      denyTables: ["secrets", "api_keys", "tokens", "users_private", "payment_methods"],
      enforceLimit: true,
      defaultLimit: 500,
      timeout: 15000,
      blockMultiStatement: true,
    }
  }

  private validateQuery(query: string, userRole: Role, userFlags: any): void {
    const normalizedQuery = query.trim().toLowerCase()

    // Check for multi-statement
    if (this.config.blockMultiStatement && normalizedQuery.split(";").length > 2) {
      throw new Error("Multi-statement queries are not allowed")
    }

    // Check for denied tables
    for (const table of this.config.denyTables) {
      if (normalizedQuery.includes(table.toLowerCase())) {
        throw new Error(`Access to table "${table}" is denied`)
      }
    }

    // Check write operations for admin
    const writeOps = ["insert", "update", "delete", "drop", "create", "alter", "truncate"]
    const isWrite = writeOps.some((op) => normalizedQuery.startsWith(op))

    if (isWrite) {
      if (userRole !== "admin") {
        throw new Error("Write operations require admin role")
      }

      const roleConfig = ROLE_CONFIG[userRole]
      const sqlConfig = roleConfig.constraints.mcp_sql

      if (sqlConfig?.allow_write_if && !userFlags.sql_write_enabled) {
        throw new Error("Write operations require sql_write_enabled flag")
      }
    }
  }

  private addLimitToSelect(query: string): string {
    const normalized = query.trim().toLowerCase()
    if (normalized.startsWith("select") && !normalized.includes("limit")) {
      return `${query.trim()} LIMIT ${this.config.defaultLimit}`
    }
    return query
  }

  async execute(input: SqlToolInput, user: { id: string; role: Role; flags: any }) {
    const startTime = Date.now()

    try {
      // Validate
      this.validateQuery(input.query, user.role, user.flags)

      // Add LIMIT if needed
      const finalQuery = this.addLimitToSelect(input.query)

      console.log("[MCP SQL] Executing query:", finalQuery)
      console.log("[MCP SQL] User:", user.id, "Role:", user.role)

      // In production, execute against real database
      // For now, return mock success
      return {
        success: true,
        query: finalQuery,
        message: "Query validated successfully. Connect to real DB in production.",
      }
    } catch (e: any) {
      console.error("[MCP SQL] Query failed:", e.message)
      throw e
    }
  }
}

export const mcpSqlTool = new McpSqlTool()
