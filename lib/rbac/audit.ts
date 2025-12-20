import type { AuditLog } from "./types"

/**
 * In-memory audit log store (for demo)
 * In production, use a database or logging service
 */
class AuditLogStore {
  private logs: AuditLog[] = []
  private maxLogs = 10000 // Keep last 10k logs in memory

  add(log: AuditLog): void {
    this.logs.push(log)

    // Trim if exceeds max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  getAll(): AuditLog[] {
    return [...this.logs]
  }

  getByUser(userId: string): AuditLog[] {
    return this.logs.filter((log) => log.userId === userId)
  }

  getByAction(action: string): AuditLog[] {
    return this.logs.filter((log) => log.action === action)
  }

  getByResource(resource: string): AuditLog[] {
    return this.logs.filter((log) => log.resource === resource)
  }

  getByDateRange(start: Date, end: Date): AuditLog[] {
    return this.logs.filter((log) => log.timestamp >= start && log.timestamp <= end)
  }

  search(filters: {
    userId?: string
    action?: string
    resource?: string
    method?: string
    status?: number
    startDate?: Date
    endDate?: Date
  }): AuditLog[] {
    let results = this.logs

    if (filters.userId) {
      results = results.filter((log) => log.userId === filters.userId)
    }

    if (filters.action) {
      results = results.filter((log) => log.action === filters.action)
    }

    if (filters.resource) {
      results = results.filter((log) => log.resource.includes(filters.resource))
    }

    if (filters.method) {
      results = results.filter((log) => log.method === filters.method)
    }

    if (filters.status) {
      results = results.filter((log) => log.status === filters.status)
    }

    if (filters.startDate) {
      results = results.filter((log) => log.timestamp >= filters.startDate!)
    }

    if (filters.endDate) {
      results = results.filter((log) => log.timestamp <= filters.endDate!)
    }

    return results
  }

  clear(): void {
    this.logs = []
  }
}

export const auditLogStore = new AuditLogStore()

/**
 * Audit Logger - logs all RBAC-protected actions
 */
export class AuditLogger {
  static async log(params: {
    userId: string
    action: string
    resource: string
    method: string
    path: string
    status: number
    ip?: string
    userAgent?: string
    requestBody?: any
    responseBody?: any
    error?: string
  }): Promise<void> {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      method: params.method,
      path: params.path,
      status: params.status,
      ip: params.ip,
      userAgent: params.userAgent,
      requestBody: params.requestBody,
      responseBody: params.responseBody,
      error: params.error,
      timestamp: new Date(),
    }

    // Add to store
    auditLogStore.add(log)

    // Also log to console for visibility
    console.log(
      `[Audit] ${log.action} | User: ${log.userId} | Resource: ${log.resource} | Status: ${log.status} | ${log.timestamp.toISOString()}`,
    )

    // TODO: In production, also send to:
    // - Database (PostgreSQL, MongoDB)
    // - Logging service (Datadog, CloudWatch, etc.)
    // - SIEM system
  }

  static async getStats(): Promise<{
    totalLogs: number
    byAction: Record<string, number>
    byUser: Record<string, number>
    byStatus: Record<string, number>
  }> {
    const logs = auditLogStore.getAll()

    const byAction: Record<string, number> = {}
    const byUser: Record<string, number> = {}
    const byStatus: Record<string, number> = {}

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1
      byUser[log.userId] = (byUser[log.userId] || 0) + 1
      byStatus[log.status] = (byStatus[log.status] || 0) + 1
    }

    return {
      totalLogs: logs.length,
      byAction,
      byUser,
      byStatus,
    }
  }

  static async exportLogs(format: "json" | "csv" = "json"): Promise<string> {
    const logs = auditLogStore.getAll()

    if (format === "json") {
      return JSON.stringify(logs, null, 2)
    }

    // CSV export
    const headers = ["id", "userId", "action", "resource", "method", "path", "status", "timestamp"]
    const rows = logs.map((log) => [
      log.id,
      log.userId,
      log.action,
      log.resource,
      log.method,
      log.path,
      log.status.toString(),
      log.timestamp.toISOString(),
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    return csv
  }
}
