// Request Tracking System
// Tracks the full lifecycle of requests through the system

import { apiLogger } from "./api-logger"

// Request status
export type RequestStatus = 
  | "started"
  | "processing"
  | "waiting_external"    // Waiting for external API (Medici, payment, etc.)
  | "completed"
  | "failed"
  | "cancelled"
  | "timeout"

// Request type
export type RequestType = 
  | "hotel_search"
  | "hotel_prebook"
  | "hotel_book"
  | "hotel_cancel"
  | "payment_process"
  | "payment_refund"
  | "user_auth"
  | "api_call"

// Request step/stage
export interface RequestStep {
  stepId: string
  name: string
  status: RequestStatus
  startedAt: string
  completedAt?: string
  duration?: number
  input?: any
  output?: any
  error?: string
}

// Full request tracking
export interface TrackedRequest {
  requestId: string
  type: RequestType
  status: RequestStatus
  startedAt: string
  completedAt?: string
  totalDuration?: number
  
  // Context
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  
  // Steps
  steps: RequestStep[]
  currentStep?: string
  
  // Related entities
  bookingId?: string
  hotelId?: number
  searchParams?: any
  
  // Results
  success?: boolean
  result?: any
  error?: string
  
  // Relationships
  parentRequestId?: string
  childRequestIds?: string[]
}

// In-memory request storage
const requestBuffer: Map<string, TrackedRequest> = new Map()
const MAX_REQUESTS = 1000
const requestOrder: string[] = []

// Generate request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

// Generate step ID
function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
}

// Request Tracker class
class RequestTracker {
  private static instance: RequestTracker

  private constructor() {}

  static getInstance(): RequestTracker {
    if (!RequestTracker.instance) {
      RequestTracker.instance = new RequestTracker()
    }
    return RequestTracker.instance
  }

  // Start tracking a new request
  startRequest(params: {
    type: RequestType
    userId?: string
    sessionId?: string
    ip?: string
    userAgent?: string
    parentRequestId?: string
    metadata?: any
  }): TrackedRequest {
    const requestId = generateRequestId()
    const now = new Date().toISOString()

    const request: TrackedRequest = {
      requestId,
      type: params.type,
      status: "started",
      startedAt: now,
      userId: params.userId,
      sessionId: params.sessionId,
      ip: params.ip,
      userAgent: params.userAgent,
      steps: [],
      parentRequestId: params.parentRequestId,
      searchParams: params.metadata,
    }

    // Add to buffer
    requestBuffer.set(requestId, request)
    requestOrder.push(requestId)

    // Clean old requests
    while (requestOrder.length > MAX_REQUESTS) {
      const oldId = requestOrder.shift()
      if (oldId) requestBuffer.delete(oldId)
    }

    // Link to parent
    if (params.parentRequestId) {
      const parent = requestBuffer.get(params.parentRequestId)
      if (parent) {
        parent.childRequestIds = parent.childRequestIds || []
        parent.childRequestIds.push(requestId)
      }
    }

    apiLogger.debug("system", `Request started: ${params.type}`, {
      requestId,
      type: params.type,
    })

    return request
  }

  // Start a new step in the request
  startStep(requestId: string, stepName: string, input?: any): RequestStep {
    const request = requestBuffer.get(requestId)
    if (!request) {
      throw new Error(`Request ${requestId} not found`)
    }

    const step: RequestStep = {
      stepId: generateStepId(),
      name: stepName,
      status: "processing",
      startedAt: new Date().toISOString(),
      input,
    }

    request.steps.push(step)
    request.currentStep = step.stepId
    request.status = "processing"

    apiLogger.debug("system", `Step started: ${stepName}`, {
      requestId,
      stepId: step.stepId,
    })

    return step
  }

  // Complete a step
  completeStep(requestId: string, stepId: string, output?: any): void {
    const request = requestBuffer.get(requestId)
    if (!request) return

    const step = request.steps.find(s => s.stepId === stepId)
    if (!step) return

    step.status = "completed"
    step.completedAt = new Date().toISOString()
    step.duration = new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()
    step.output = output

    apiLogger.debug("system", `Step completed: ${step.name}`, {
      requestId,
      stepId,
      duration: step.duration,
    })
  }

  // Fail a step
  failStep(requestId: string, stepId: string, error: string): void {
    const request = requestBuffer.get(requestId)
    if (!request) return

    const step = request.steps.find(s => s.stepId === stepId)
    if (!step) return

    step.status = "failed"
    step.completedAt = new Date().toISOString()
    step.duration = new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()
    step.error = error

    apiLogger.error("system", `Step failed: ${step.name}`, error, {
      requestId,
      stepId,
    })
  }

  // Mark request as waiting for external service
  setWaitingExternal(requestId: string, service: string): void {
    const request = requestBuffer.get(requestId)
    if (!request) return

    request.status = "waiting_external"
    
    apiLogger.debug("system", `Waiting for external: ${service}`, {
      requestId,
      service,
    })
  }

  // Complete the request
  completeRequest(requestId: string, result?: any): void {
    const request = requestBuffer.get(requestId)
    if (!request) return

    request.status = "completed"
    request.success = true
    request.completedAt = new Date().toISOString()
    request.totalDuration = new Date(request.completedAt).getTime() - new Date(request.startedAt).getTime()
    request.result = result

    apiLogger.info("system", `Request completed: ${request.type}`, {
      requestId,
      duration: request.totalDuration,
      stepsCount: request.steps.length,
    })
  }

  // Fail the request
  failRequest(requestId: string, error: string): void {
    const request = requestBuffer.get(requestId)
    if (!request) return

    request.status = "failed"
    request.success = false
    request.completedAt = new Date().toISOString()
    request.totalDuration = new Date(request.completedAt).getTime() - new Date(request.startedAt).getTime()
    request.error = error

    apiLogger.error("system", `Request failed: ${request.type}`, error, {
      requestId,
      duration: request.totalDuration,
    })
  }

  // Get request by ID
  getRequest(requestId: string): TrackedRequest | undefined {
    return requestBuffer.get(requestId)
  }

  // Get recent requests
  getRecentRequests(filter?: {
    type?: RequestType
    status?: RequestStatus
    userId?: string
    limit?: number
  }): TrackedRequest[] {
    let requests = Array.from(requestBuffer.values()).reverse()

    if (filter) {
      if (filter.type) requests = requests.filter(r => r.type === filter.type)
      if (filter.status) requests = requests.filter(r => r.status === filter.status)
      if (filter.userId) requests = requests.filter(r => r.userId === filter.userId)
    }

    return requests.slice(0, filter?.limit || 50)
  }

  // Get request chain (parent + children)
  getRequestChain(requestId: string): TrackedRequest[] {
    const chain: TrackedRequest[] = []
    const request = requestBuffer.get(requestId)
    
    if (!request) return chain

    // Find root
    let root = request
    while (root.parentRequestId) {
      const parent = requestBuffer.get(root.parentRequestId)
      if (!parent) break
      root = parent
    }

    // Build chain
    const buildChain = (req: TrackedRequest) => {
      chain.push(req)
      if (req.childRequestIds) {
        for (const childId of req.childRequestIds) {
          const child = requestBuffer.get(childId)
          if (child) buildChain(child)
        }
      }
    }

    buildChain(root)
    return chain
  }

  // Link booking to request
  linkBooking(requestId: string, bookingId: string): void {
    const request = requestBuffer.get(requestId)
    if (request) {
      request.bookingId = bookingId
    }
  }

  // Link hotel to request
  linkHotel(requestId: string, hotelId: number): void {
    const request = requestBuffer.get(requestId)
    if (request) {
      request.hotelId = hotelId
    }
  }

  // Get statistics
  getStats(): {
    total: number
    active: number
    completed: number
    failed: number
    byType: Record<string, number>
    avgDuration: Record<string, number>
  } {
    const requests = Array.from(requestBuffer.values())
    
    const byType: Record<string, number> = {}
    const durationByType: Record<string, number[]> = {}

    for (const req of requests) {
      byType[req.type] = (byType[req.type] || 0) + 1
      if (req.totalDuration) {
        durationByType[req.type] = durationByType[req.type] || []
        durationByType[req.type].push(req.totalDuration)
      }
    }

    const avgDuration: Record<string, number> = {}
    for (const [type, durations] of Object.entries(durationByType)) {
      avgDuration[type] = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    }

    return {
      total: requests.length,
      active: requests.filter(r => r.status === "started" || r.status === "processing" || r.status === "waiting_external").length,
      completed: requests.filter(r => r.status === "completed").length,
      failed: requests.filter(r => r.status === "failed").length,
      byType,
      avgDuration,
    }
  }
}

// Export singleton
export const requestTracker = RequestTracker.getInstance()

// Convenience wrapper for tracking async operations
export async function withRequestTracking<T>(
  type: RequestType,
  operation: (requestId: string) => Promise<T>,
  context?: {
    userId?: string
    sessionId?: string
  }
): Promise<T> {
  const request = requestTracker.startRequest({
    type,
    userId: context?.userId,
    sessionId: context?.sessionId,
  })

  try {
    const result = await operation(request.requestId)
    requestTracker.completeRequest(request.requestId, result)
    return result
  } catch (error: any) {
    requestTracker.failRequest(request.requestId, error.message)
    throw error
  }
}
