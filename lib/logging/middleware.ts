// API Logging Middleware for Next.js
// Automatically logs all API requests and responses

import { NextRequest, NextResponse } from "next/server"
import { apiLogger } from "./api-logger"

export interface LoggingContext {
  startTime: number
  requestId: string
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

// Extract client info from request
function extractClientInfo(request: NextRequest) {
  return {
    ip: request.headers.get("x-forwarded-for") || 
        request.headers.get("x-real-ip") || 
        "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
    referer: request.headers.get("referer") || undefined,
  }
}

// Create logging wrapper for API routes
export function withLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  options?: {
    name?: string
    logRequestBody?: boolean
    logResponseBody?: boolean
  }
) {
  return async (...args: T): Promise<R> => {
    const request = args[0] as NextRequest
    const startTime = Date.now()
    const requestId = generateRequestId()
    const clientInfo = extractClientInfo(request)
    
    const endpoint = request.nextUrl.pathname
    const method = request.method
    
    let requestBody: any = null
    if (options?.logRequestBody !== false && ["POST", "PUT", "PATCH"].includes(method)) {
      try {
        requestBody = await request.clone().json()
      } catch {
        // Not JSON body
      }
    }

    // Log request start
    apiLogger.debug("api", `${options?.name || "API"} Request Started`, {
      requestId,
      method,
      endpoint,
      ...clientInfo,
    })

    try {
      const response = await handler(...args)
      const duration = Date.now() - startTime
      
      // Extract response info
      let statusCode = 200
      let responseBody: any = null
      
      if (response instanceof NextResponse || response instanceof Response) {
        statusCode = response.status
        if (options?.logResponseBody !== false) {
          try {
            responseBody = await response.clone().json()
          } catch {
            // Not JSON response
          }
        }
      }

      // Log successful response
      await apiLogger.logApiRequest({
        method,
        endpoint,
        requestBody: options?.logRequestBody !== false ? requestBody : undefined,
        responseBody: options?.logResponseBody !== false ? responseBody : undefined,
        statusCode,
        duration,
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
      })

      return response
    } catch (error: any) {
      const duration = Date.now() - startTime
      
      // Log error
      await apiLogger.logApiRequest({
        method,
        endpoint,
        requestBody: options?.logRequestBody !== false ? requestBody : undefined,
        statusCode: 500,
        duration,
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        error: error.message || "Unknown error",
      })

      throw error
    }
  }
}

// Simple timing decorator
export function logTiming(category: "api" | "medici" | "booking" | "auth" | "system", action: string) {
  return function <T extends any[], R>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const originalMethod = descriptor.value!
    
    descriptor.value = async function (...args: T): Promise<R> {
      const startTime = Date.now()
      
      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime
        
        apiLogger.info(category, `${action} completed`, { duration, success: true })
        return result
      } catch (error: any) {
        const duration = Date.now() - startTime
        apiLogger.error(category, `${action} failed`, error.message, { duration })
        throw error
      }
    }
    
    return descriptor
  }
}
