import { type NextRequest, NextResponse } from "next/server"
import type { User } from "./types"
import { PermissionChecker } from "./permissions"
import { AuditLogger } from "./audit"

export interface WithAuthOptions {
  endpointKey: string
  requireAuth?: boolean
}

/**
 * Get user from request (mock implementation - replace with your auth)
 */
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  // TODO: Replace with your actual authentication logic
  // This could be JWT, session, API key, etc.

  const authHeader = req.headers.get("authorization")

  // Mock implementation - check for API key or session
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)

    // Mock user lookup - replace with your database query
    if (token === "admin-token-123") {
      return {
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        flags: { sql_write_enabled: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    if (token === "booker-token-456") {
      return {
        id: "booker-1",
        email: "booker@example.com",
        name: "Booker User",
        role: "booker",
        flags: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  }

  return null
}

/**
 * Middleware to check RBAC permissions
 */
export function withRBAC(handler: (req: NextRequest, user: User) => Promise<NextResponse>, options: WithAuthOptions) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get user from request
      const user = await getUserFromRequest(req)

      if (!user && options.requireAuth !== false) {
        return NextResponse.json({ error: "Unauthorized", message: "Authentication required" }, { status: 401 })
      }

      // If no auth required and no user, allow
      if (!user && options.requireAuth === false) {
        // Create anonymous user for audit
        const anonymousUser: User = {
          id: "anonymous",
          email: "anonymous",
          name: "Anonymous",
          role: "booker", // lowest permission
          flags: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return handler(req, anonymousUser)
      }

      // Check permissions
      const permissionCheck = PermissionChecker.canAccessEndpoint(user!, options.endpointKey)

      if (!permissionCheck.allowed) {
        // Log failed permission check
        await AuditLogger.log({
          userId: user!.id,
          action: "ACCESS_DENIED",
          resource: options.endpointKey,
          method: req.method,
          path: req.nextUrl.pathname,
          status: 403,
          error: permissionCheck.reason,
          ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
          userAgent: req.headers.get("user-agent") || undefined,
        })

        return NextResponse.json(
          {
            error: "Forbidden",
            message: permissionCheck.reason,
            missing_scopes: permissionCheck.missing_scopes,
          },
          { status: 403 },
        )
      }

      // Call handler
      const response = await handler(req, user!)

      // Log successful access if audit is enabled
      const endpoint = require("./config").ENDPOINT_CAPABILITIES[options.endpointKey]
      if (endpoint?.audit) {
        await AuditLogger.log({
          userId: user!.id,
          action: "ACCESS_GRANTED",
          resource: options.endpointKey,
          method: req.method,
          path: req.nextUrl.pathname,
          status: response.status,
          ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
          userAgent: req.headers.get("user-agent") || undefined,
        })
      }

      return response
    } catch (error) {
      console.error("[RBAC Middleware] Error:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  }
}

/**
 * Helper to extract request body safely
 */
export async function getRequestBody(req: NextRequest): Promise<any> {
  try {
    const clone = req.clone()
    return await clone.json()
  } catch {
    return null
  }
}
