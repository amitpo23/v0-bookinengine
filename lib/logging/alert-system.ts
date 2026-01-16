// Alert System for API Monitoring
// Tracks failures, anomalies, and business logic issues

import { apiLogger } from "./api-logger"

// Alert severity levels
export type AlertSeverity = "low" | "medium" | "high" | "critical"

// Alert types
export type AlertType = 
  | "api_failure"           // API call failed
  | "booking_failed"        // Booking operation failed
  | "payment_failed"        // Payment processing failed
  | "cancellation_issue"    // Cancellation problem
  | "price_mismatch"        // Price changed between search and book
  | "availability_change"   // Room no longer available
  | "rate_limit"            // Too many requests
  | "timeout"               // Request timeout
  | "authentication"        // Auth failure
  | "data_integrity"        // Data consistency issue
  | "business_logic"        // Business rule violation
  | "system_health"         // System health issue

// Alert structure
export interface Alert {
  id: string
  timestamp: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  source: string
  metadata: Record<string, any>
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  relatedAlerts?: string[]
  requestId?: string
  userId?: string
  bookingId?: string
}

// Alert rules configuration
export interface AlertRule {
  id: string
  name: string
  type: AlertType
  condition: (context: any) => boolean
  severity: AlertSeverity
  cooldown: number // seconds between same alerts
  actions: AlertAction[]
}

export type AlertAction = "log" | "email" | "webhook" | "slack" | "sms"

// In-memory alert storage
const alertBuffer: Alert[] = []
const MAX_ALERTS = 500
const alertCooldowns: Map<string, number> = new Map()

// Alert rules
const alertRules: AlertRule[] = [
  {
    id: "booking_failure",
    name: "Booking Failed",
    type: "booking_failed",
    condition: (ctx) => ctx.action === "book" && ctx.success === false,
    severity: "high",
    cooldown: 60,
    actions: ["log", "webhook"],
  },
  {
    id: "payment_failure",
    name: "Payment Failed",
    type: "payment_failed",
    condition: (ctx) => ctx.action === "payment" && ctx.success === false,
    severity: "critical",
    cooldown: 30,
    actions: ["log", "email", "webhook"],
  },
  {
    id: "price_mismatch",
    name: "Price Mismatch Detected",
    type: "price_mismatch",
    condition: (ctx) => ctx.originalPrice && ctx.currentPrice && 
      Math.abs(ctx.originalPrice - ctx.currentPrice) / ctx.originalPrice > 0.05,
    severity: "medium",
    cooldown: 120,
    actions: ["log"],
  },
  {
    id: "high_error_rate",
    name: "High Error Rate",
    type: "api_failure",
    condition: (ctx) => ctx.errorRate > 0.1, // >10% error rate
    severity: "high",
    cooldown: 300,
    actions: ["log", "webhook"],
  },
  {
    id: "cancellation_failure",
    name: "Cancellation Failed",
    type: "cancellation_issue",
    condition: (ctx) => ctx.action === "cancel" && ctx.success === false,
    severity: "high",
    cooldown: 60,
    actions: ["log", "email"],
  },
  {
    id: "medici_timeout",
    name: "Medici API Timeout",
    type: "timeout",
    condition: (ctx) => ctx.category === "medici" && ctx.duration > 30000,
    severity: "medium",
    cooldown: 120,
    actions: ["log"],
  },
  {
    id: "auth_failure",
    name: "Authentication Failure",
    type: "authentication",
    condition: (ctx) => ctx.statusCode === 401,
    severity: "high",
    cooldown: 60,
    actions: ["log", "webhook"],
  },
]

// Generate unique alert ID
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

// Check cooldown
function isInCooldown(ruleId: string, cooldownSeconds: number): boolean {
  const lastAlert = alertCooldowns.get(ruleId)
  if (!lastAlert) return false
  return Date.now() - lastAlert < cooldownSeconds * 1000
}

// Alert Manager class
class AlertManager {
  private static instance: AlertManager
  private webhookUrl?: string
  private emailHandler?: (alert: Alert) => Promise<void>

  private constructor() {
    this.webhookUrl = process.env.ALERT_WEBHOOK_URL
  }

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager()
    }
    return AlertManager.instance
  }

  // Create an alert
  async createAlert(params: Omit<Alert, "id" | "timestamp" | "resolved">): Promise<Alert> {
    const alert: Alert = {
      ...params,
      id: generateAlertId(),
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    // Add to buffer
    alertBuffer.unshift(alert)
    if (alertBuffer.length > MAX_ALERTS) {
      alertBuffer.pop()
    }

    // Log the alert
    apiLogger.log({
      level: alert.severity === "critical" ? "error" : 
             alert.severity === "high" ? "error" : 
             alert.severity === "medium" ? "warn" : "info",
      category: "system",
      action: `🚨 ALERT: ${alert.title}`,
      metadata: {
        alertId: alert.id,
        type: alert.type,
        severity: alert.severity,
        description: alert.description,
        ...alert.metadata,
      },
    })

    // Execute actions
    await this.executeActions(alert, ["log", "webhook"])

    return alert
  }

  // Check context against rules
  async checkRules(context: Record<string, any>): Promise<Alert[]> {
    const triggeredAlerts: Alert[] = []

    for (const rule of alertRules) {
      try {
        if (rule.condition(context) && !isInCooldown(rule.id, rule.cooldown)) {
          alertCooldowns.set(rule.id, Date.now())
          
          const alert = await this.createAlert({
            type: rule.type,
            severity: rule.severity,
            title: rule.name,
            description: `Rule ${rule.id} triggered`,
            source: context.source || "system",
            metadata: context,
            requestId: context.requestId,
            userId: context.userId,
            bookingId: context.bookingId,
          })
          
          triggeredAlerts.push(alert)
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error)
      }
    }

    return triggeredAlerts
  }

  // Execute alert actions
  private async executeActions(alert: Alert, actions: AlertAction[]): Promise<void> {
    for (const action of actions) {
      try {
        switch (action) {
          case "webhook":
            await this.sendWebhook(alert)
            break
          case "email":
            await this.sendEmail(alert)
            break
          case "slack":
            await this.sendSlack(alert)
            break
          // Other actions...
        }
      } catch (error) {
        console.error(`Failed to execute action ${action}:`, error)
      }
    }
  }

  // Send webhook notification
  private async sendWebhook(alert: Alert): Promise<void> {
    if (!this.webhookUrl) return

    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alert",
          alert,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Webhook failed:", error)
    }
  }

  // Send email notification (placeholder)
  private async sendEmail(alert: Alert): Promise<void> {
    if (this.emailHandler) {
      await this.emailHandler(alert)
    }
  }

  // Send Slack notification
  private async sendSlack(alert: Alert): Promise<void> {
    const slackUrl = process.env.SLACK_WEBHOOK_URL
    if (!slackUrl) return

    const color = alert.severity === "critical" ? "#dc3545" :
                  alert.severity === "high" ? "#fd7e14" :
                  alert.severity === "medium" ? "#ffc107" : "#17a2b8"

    try {
      await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachments: [{
            color,
            title: `🚨 ${alert.title}`,
            text: alert.description,
            fields: [
              { title: "Severity", value: alert.severity, short: true },
              { title: "Type", value: alert.type, short: true },
              { title: "Source", value: alert.source, short: true },
            ],
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000),
          }],
        }),
      })
    } catch (error) {
      console.error("Slack notification failed:", error)
    }
  }

  // Resolve an alert
  resolveAlert(alertId: string, resolvedBy?: string): boolean {
    const alert = alertBuffer.find(a => a.id === alertId)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedAt = new Date().toISOString()
      alert.resolvedBy = resolvedBy
      return true
    }
    return false
  }

  // Get alerts
  getAlerts(filter?: {
    type?: AlertType
    severity?: AlertSeverity
    resolved?: boolean
    from?: Date
    to?: Date
    limit?: number
  }): Alert[] {
    let alerts = [...alertBuffer]

    if (filter) {
      if (filter.type) alerts = alerts.filter(a => a.type === filter.type)
      if (filter.severity) alerts = alerts.filter(a => a.severity === filter.severity)
      if (filter.resolved !== undefined) alerts = alerts.filter(a => a.resolved === filter.resolved)
      if (filter.from) alerts = alerts.filter(a => new Date(a.timestamp) >= filter.from!)
      if (filter.to) alerts = alerts.filter(a => new Date(a.timestamp) <= filter.to!)
    }

    return alerts.slice(0, filter?.limit || 100)
  }

  // Get alert statistics
  getStats(): {
    total: number
    unresolved: number
    bySeverity: Record<AlertSeverity, number>
    byType: Record<string, number>
    last24h: number
  } {
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000

    return {
      total: alertBuffer.length,
      unresolved: alertBuffer.filter(a => !a.resolved).length,
      bySeverity: {
        critical: alertBuffer.filter(a => a.severity === "critical").length,
        high: alertBuffer.filter(a => a.severity === "high").length,
        medium: alertBuffer.filter(a => a.severity === "medium").length,
        low: alertBuffer.filter(a => a.severity === "low").length,
      },
      byType: alertBuffer.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      last24h: alertBuffer.filter(a => new Date(a.timestamp).getTime() > dayAgo).length,
    }
  }

  // Set email handler
  setEmailHandler(handler: (alert: Alert) => Promise<void>): void {
    this.emailHandler = handler
  }
}

// Export singleton
export const alertManager = AlertManager.getInstance()

// Convenience functions
export async function triggerAlert(
  type: AlertType,
  severity: AlertSeverity,
  title: string,
  description: string,
  metadata?: Record<string, any>
): Promise<Alert> {
  return alertManager.createAlert({
    type,
    severity,
    title,
    description,
    source: "manual",
    metadata: metadata || {},
  })
}

// Check for booking issues
export async function checkBookingAlert(context: {
  action: "search" | "prebook" | "book" | "cancel"
  success: boolean
  bookingId?: string
  userId?: string
  originalPrice?: number
  currentPrice?: number
  error?: string
  duration?: number
}): Promise<Alert[]> {
  return alertManager.checkRules({
    ...context,
    source: "booking",
    timestamp: new Date().toISOString(),
  })
}

// Check for API issues
export async function checkApiAlert(context: {
  endpoint: string
  statusCode: number
  duration: number
  error?: string
  category?: string
}): Promise<Alert[]> {
  return alertManager.checkRules({
    ...context,
    source: "api",
    timestamp: new Date().toISOString(),
  })
}
