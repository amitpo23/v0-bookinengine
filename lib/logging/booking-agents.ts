// Booking Verification Agents
// Automated agents that verify booking operations and detect issues

import { apiLogger } from "./api-logger"
import { alertManager, triggerAlert, type AlertType, type AlertSeverity } from "./alert-system"
import { requestTracker } from "./request-tracker"

// Agent types
export type AgentType = 
  | "booking_verifier"      // Verifies booking consistency
  | "cancellation_checker"  // Checks cancellation status
  | "payment_reconciler"    // Reconciles payments
  | "price_watcher"         // Monitors price changes
  | "availability_monitor"  // Monitors availability
  | "integrity_checker"     // Checks data integrity

// Agent status
export type AgentStatus = "idle" | "running" | "paused" | "error"

// Agent result
export interface AgentResult {
  agentId: string
  type: AgentType
  runAt: string
  duration: number
  success: boolean
  itemsChecked: number
  issuesFound: number
  issues: AgentIssue[]
}

// Issue found by agent
export interface AgentIssue {
  id: string
  severity: AlertSeverity
  type: string
  description: string
  entityType: "booking" | "payment" | "hotel" | "user"
  entityId: string
  data: Record<string, any>
  suggestedAction?: string
}

// Agent configuration
export interface AgentConfig {
  id: string
  type: AgentType
  name: string
  description: string
  enabled: boolean
  schedule?: string // cron expression
  lastRun?: string
  lastResult?: AgentResult
}

// Booking record for verification
export interface BookingRecord {
  id: string
  status: "pending" | "confirmed" | "cancelled" | "completed" | "failed"
  hotelId: number
  hotelName: string
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
  totalPrice: number
  currency: string
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  paymentAmount?: number
  createdAt: string
  updatedAt: string
  cancelledAt?: string
  cancellationReason?: string
  mediciBookingId?: string
  prebookToken?: string
}

// Agent Manager
class BookingAgentManager {
  private static instance: BookingAgentManager
  private agents: Map<string, AgentConfig> = new Map()
  private running: Set<string> = new Set()

  private constructor() {
    this.initializeAgents()
  }

  static getInstance(): BookingAgentManager {
    if (!BookingAgentManager.instance) {
      BookingAgentManager.instance = new BookingAgentManager()
    }
    return BookingAgentManager.instance
  }

  private initializeAgents(): void {
    const defaultAgents: AgentConfig[] = [
      {
        id: "booking_verifier_1",
        type: "booking_verifier",
        name: "Booking Status Verifier",
        description: "Verifies booking status consistency between local DB and Medici",
        enabled: true,
      },
      {
        id: "cancellation_checker_1",
        type: "cancellation_checker",
        name: "Cancellation Status Checker",
        description: "Checks if cancelled bookings are properly refunded",
        enabled: true,
      },
      {
        id: "payment_reconciler_1",
        type: "payment_reconciler",
        name: "Payment Reconciliation Agent",
        description: "Ensures payment amounts match booking totals",
        enabled: true,
      },
      {
        id: "price_watcher_1",
        type: "price_watcher",
        name: "Price Change Monitor",
        description: "Detects significant price changes between search and book",
        enabled: true,
      },
      {
        id: "integrity_checker_1",
        type: "integrity_checker",
        name: "Data Integrity Checker",
        description: "Checks for orphaned records and data inconsistencies",
        enabled: true,
      },
    ]

    for (const agent of defaultAgents) {
      this.agents.set(agent.id, agent)
    }
  }

  // Run a specific agent
  async runAgent(agentId: string, bookings: BookingRecord[]): Promise<AgentResult> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    if (this.running.has(agentId)) {
      throw new Error(`Agent ${agentId} is already running`)
    }

    this.running.add(agentId)
    const startTime = Date.now()
    const issues: AgentIssue[] = []

    apiLogger.info("system", `Agent started: ${agent.name}`, {
      agentId,
      type: agent.type,
      bookingsCount: bookings.length,
    })

    try {
      switch (agent.type) {
        case "booking_verifier":
          issues.push(...await this.runBookingVerifier(bookings))
          break
        case "cancellation_checker":
          issues.push(...await this.runCancellationChecker(bookings))
          break
        case "payment_reconciler":
          issues.push(...await this.runPaymentReconciler(bookings))
          break
        case "price_watcher":
          issues.push(...await this.runPriceWatcher(bookings))
          break
        case "integrity_checker":
          issues.push(...await this.runIntegrityChecker(bookings))
          break
      }

      const result: AgentResult = {
        agentId,
        type: agent.type,
        runAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: true,
        itemsChecked: bookings.length,
        issuesFound: issues.length,
        issues,
      }

      agent.lastRun = result.runAt
      agent.lastResult = result

      // Create alerts for issues
      for (const issue of issues) {
        await triggerAlert(
          this.mapIssueToAlertType(issue.type),
          issue.severity,
          `Agent Issue: ${issue.type}`,
          issue.description,
          {
            agentId,
            entityType: issue.entityType,
            entityId: issue.entityId,
            ...issue.data,
          }
        )
      }

      apiLogger.info("system", `Agent completed: ${agent.name}`, {
        agentId,
        duration: result.duration,
        issuesFound: issues.length,
      })

      return result
    } catch (error: any) {
      apiLogger.error("system", `Agent failed: ${agent.name}`, error.message, {
        agentId,
      })

      return {
        agentId,
        type: agent.type,
        runAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: false,
        itemsChecked: bookings.length,
        issuesFound: 0,
        issues: [],
      }
    } finally {
      this.running.delete(agentId)
    }
  }

  // Booking Status Verifier
  private async runBookingVerifier(bookings: BookingRecord[]): Promise<AgentIssue[]> {
    const issues: AgentIssue[] = []

    for (const booking of bookings) {
      // Check for stuck pending bookings (>1 hour)
      if (booking.status === "pending") {
        const createdTime = new Date(booking.createdAt).getTime()
        const hourAgo = Date.now() - 60 * 60 * 1000
        
        if (createdTime < hourAgo) {
          issues.push({
            id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            severity: "high",
            type: "stuck_pending_booking",
            description: `Booking ${booking.id} has been pending for over 1 hour`,
            entityType: "booking",
            entityId: booking.id,
            data: {
              createdAt: booking.createdAt,
              hotelName: booking.hotelName,
              guestName: booking.guestName,
            },
            suggestedAction: "Review and either confirm or cancel the booking",
          })
        }
      }

      // Check for confirmed bookings without Medici ID
      if (booking.status === "confirmed" && !booking.mediciBookingId) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "critical",
          type: "missing_medici_id",
          description: `Confirmed booking ${booking.id} has no Medici booking ID`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            hotelName: booking.hotelName,
            guestName: booking.guestName,
          },
          suggestedAction: "Manually verify with Medici and update booking",
        })
      }

      // Check for past check-in dates with pending status
      const checkInDate = new Date(booking.checkIn)
      if (checkInDate < new Date() && booking.status === "pending") {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "high",
          type: "past_checkin_pending",
          description: `Booking ${booking.id} check-in date passed but still pending`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            checkIn: booking.checkIn,
            hotelName: booking.hotelName,
          },
          suggestedAction: "Contact guest and hotel to resolve",
        })
      }
    }

    return issues
  }

  // Cancellation Status Checker
  private async runCancellationChecker(bookings: BookingRecord[]): Promise<AgentIssue[]> {
    const issues: AgentIssue[] = []

    for (const booking of bookings) {
      // Check cancelled bookings that are not refunded
      if (booking.status === "cancelled" && booking.paymentStatus === "paid") {
        const cancelTime = booking.cancelledAt ? new Date(booking.cancelledAt).getTime() : 0
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000
        
        if (cancelTime < dayAgo) {
          issues.push({
            id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            severity: "critical",
            type: "cancelled_not_refunded",
            description: `Cancelled booking ${booking.id} has not been refunded after 24 hours`,
            entityType: "booking",
            entityId: booking.id,
            data: {
              cancelledAt: booking.cancelledAt,
              paymentAmount: booking.paymentAmount,
              guestEmail: booking.guestEmail,
            },
            suggestedAction: "Process refund immediately",
          })
        }
      }

      // Check for cancelled bookings without cancellation reason
      if (booking.status === "cancelled" && !booking.cancellationReason) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "low",
          type: "missing_cancellation_reason",
          description: `Cancelled booking ${booking.id} has no cancellation reason`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            cancelledAt: booking.cancelledAt,
          },
          suggestedAction: "Update with cancellation reason for records",
        })
      }
    }

    return issues
  }

  // Payment Reconciliation
  private async runPaymentReconciler(bookings: BookingRecord[]): Promise<AgentIssue[]> {
    const issues: AgentIssue[] = []

    for (const booking of bookings) {
      // Check payment amount mismatch
      if (booking.paymentStatus === "paid" && booking.paymentAmount) {
        const diff = Math.abs(booking.totalPrice - booking.paymentAmount)
        const threshold = booking.totalPrice * 0.01 // 1% tolerance
        
        if (diff > threshold) {
          issues.push({
            id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            severity: "high",
            type: "payment_amount_mismatch",
            description: `Payment amount mismatch for booking ${booking.id}`,
            entityType: "payment",
            entityId: booking.id,
            data: {
              totalPrice: booking.totalPrice,
              paymentAmount: booking.paymentAmount,
              difference: diff,
              currency: booking.currency,
            },
            suggestedAction: "Review payment and adjust if needed",
          })
        }
      }

      // Check confirmed bookings with failed payment
      if (booking.status === "confirmed" && booking.paymentStatus === "failed") {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "critical",
          type: "confirmed_payment_failed",
          description: `Booking ${booking.id} is confirmed but payment failed`,
          entityType: "payment",
          entityId: booking.id,
          data: {
            totalPrice: booking.totalPrice,
            guestEmail: booking.guestEmail,
          },
          suggestedAction: "Either collect payment or cancel booking",
        })
      }

      // Check completed bookings with pending payment
      if (booking.status === "completed" && booking.paymentStatus === "pending") {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "medium",
          type: "completed_payment_pending",
          description: `Completed booking ${booking.id} still has pending payment`,
          entityType: "payment",
          entityId: booking.id,
          data: {
            totalPrice: booking.totalPrice,
            checkOut: booking.checkOut,
          },
          suggestedAction: "Verify and update payment status",
        })
      }
    }

    return issues
  }

  // Price Change Monitor
  private async runPriceWatcher(bookings: BookingRecord[]): Promise<AgentIssue[]> {
    // This would typically compare prices from search logs
    // For now, we check for zero or negative prices
    const issues: AgentIssue[] = []

    for (const booking of bookings) {
      if (booking.totalPrice <= 0) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "critical",
          type: "invalid_price",
          description: `Booking ${booking.id} has invalid price: ${booking.totalPrice}`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            totalPrice: booking.totalPrice,
            hotelName: booking.hotelName,
          },
          suggestedAction: "Review booking and correct price",
        })
      }
    }

    return issues
  }

  // Data Integrity Checker
  private async runIntegrityChecker(bookings: BookingRecord[]): Promise<AgentIssue[]> {
    const issues: AgentIssue[] = []

    for (const booking of bookings) {
      // Check for missing required fields
      if (!booking.guestEmail) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "medium",
          type: "missing_guest_email",
          description: `Booking ${booking.id} has no guest email`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            guestName: booking.guestName,
          },
          suggestedAction: "Update with guest email for communications",
        })
      }

      // Check for invalid date ranges
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      if (checkOut <= checkIn) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "high",
          type: "invalid_date_range",
          description: `Booking ${booking.id} has invalid date range`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
          },
          suggestedAction: "Correct date range with guest",
        })
      }

      // Check for very long stays (>30 days) - might be data error
      const stayDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      if (stayDays > 30) {
        issues.push({
          id: `issue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          severity: "low",
          type: "unusually_long_stay",
          description: `Booking ${booking.id} has ${stayDays} night stay`,
          entityType: "booking",
          entityId: booking.id,
          data: {
            nights: stayDays,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
          },
          suggestedAction: "Verify this is intentional",
        })
      }
    }

    return issues
  }

  // Map issue type to alert type
  private mapIssueToAlertType(issueType: string): AlertType {
    const mapping: Record<string, AlertType> = {
      stuck_pending_booking: "booking_failed",
      missing_medici_id: "data_integrity",
      past_checkin_pending: "business_logic",
      cancelled_not_refunded: "cancellation_issue",
      missing_cancellation_reason: "business_logic",
      payment_amount_mismatch: "payment_failed",
      confirmed_payment_failed: "payment_failed",
      completed_payment_pending: "payment_failed",
      invalid_price: "data_integrity",
      missing_guest_email: "data_integrity",
      invalid_date_range: "data_integrity",
      unusually_long_stay: "business_logic",
    }
    return mapping[issueType] || "business_logic"
  }

  // Get all agents
  getAgents(): AgentConfig[] {
    return Array.from(this.agents.values())
  }

  // Get agent by ID
  getAgent(agentId: string): AgentConfig | undefined {
    return this.agents.get(agentId)
  }

  // Enable/disable agent
  setAgentEnabled(agentId: string, enabled: boolean): void {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.enabled = enabled
    }
  }

  // Run all enabled agents
  async runAllAgents(bookings: BookingRecord[]): Promise<AgentResult[]> {
    const results: AgentResult[] = []
    
    for (const agent of this.agents.values()) {
      if (agent.enabled) {
        try {
          const result = await this.runAgent(agent.id, bookings)
          results.push(result)
        } catch (error) {
          console.error(`Failed to run agent ${agent.id}:`, error)
        }
      }
    }

    return results
  }
}

// Export singleton
export const bookingAgentManager = BookingAgentManager.getInstance()
