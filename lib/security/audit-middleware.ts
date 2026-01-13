// Audit Middleware - תיעוד אוטומטי של כל הבקשות
// מיושם כ-Next.js middleware לתפיסת כל פעולות המשתמשים

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { auditLogger, AuditAction, AuditSeverity } from '@/lib/security/audit-log'

/**
 * רשימת endpoints שדורשים תיעוד
 */
const AUDIT_ENDPOINTS = {
  // API Routes שצריכים תיעוד מלא
  sensitiveApis: [
    '/api/admin',
    '/api/users',
    '/api/bookings',
    '/api/settings',
    '/api/export',
  ],
  
  // Authentication routes
  authRoutes: [
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/callback',
  ],
  
  // Data export/deletion
  dataRoutes: [
    '/api/data/export',
    '/api/data/delete',
  ],
}

/**
 * בדיקה אם endpoint צריך תיעוד
 */
function shouldAudit(pathname: string): boolean {
  return [
    ...AUDIT_ENDPOINTS.sensitiveApis,
    ...AUDIT_ENDPOINTS.authRoutes,
    ...AUDIT_ENDPOINTS.dataRoutes,
  ].some(route => pathname.startsWith(route))
}

/**
 * קביעת severity לפי endpoint
 */
function getSeverity(pathname: string, method: string): AuditSeverity {
  // DELETE operations are high severity
  if (method === 'DELETE') return AuditSeverity.HIGH
  
  // Data export/deletion
  if (pathname.includes('/data/')) return AuditSeverity.HIGH
  
  // Admin operations
  if (pathname.includes('/admin')) return AuditSeverity.MEDIUM
  
  // Authentication
  if (pathname.includes('/auth')) return AuditSeverity.INFO
  
  return AuditSeverity.LOW
}

/**
 * קביעת action type לפי endpoint ו-method
 */
function getActionType(pathname: string, method: string): AuditAction {
  // Authentication
  if (pathname.includes('/signin')) return AuditAction.LOGIN
  if (pathname.includes('/signout')) return AuditAction.LOGOUT
  
  // Data operations
  if (pathname.includes('/export')) return AuditAction.DATA_EXPORTED
  if (pathname.includes('/delete')) return AuditAction.DATA_DELETION_REQUESTED
  
  // User management
  if (pathname.includes('/users')) {
    if (method === 'POST') return AuditAction.USER_CREATED
    if (method === 'PUT' || method === 'PATCH') return AuditAction.USER_UPDATED
    if (method === 'DELETE') return AuditAction.USER_DELETED
    return AuditAction.DATA_VIEWED
  }
  
  // Bookings
  if (pathname.includes('/bookings')) {
    if (method === 'POST') return AuditAction.BOOKING_CREATED
    if (method === 'PUT' || method === 'PATCH') return AuditAction.BOOKING_UPDATED
    if (method === 'DELETE') return AuditAction.BOOKING_CANCELLED
    return AuditAction.BOOKING_VIEWED
  }
  
  // Settings
  if (pathname.includes('/settings')) return AuditAction.SETTINGS_CHANGED
  
  // Default
  return AuditAction.DATA_VIEWED
}

/**
 * Middleware function
 */
export async function auditMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method
  
  // בדוק אם צריך תיעוד
  if (!shouldAudit(pathname)) {
    return NextResponse.next()
  }
  
  try {
    // קבל פרטי משתמש מה-session
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    const userId = token?.sub || 'anonymous'
    const userEmail = token?.email || 'anonymous'
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // קבע action ו-severity
    const action = getActionType(pathname, method)
    const severity = getSeverity(pathname, method)
    
    // תעד את הבקשה (async - לא לחסום)
    auditLogger.log({
      userId,
      userEmail,
      ipAddress,
      userAgent,
      action,
      severity,
      resource: pathname,
      success: true, // נעדכן לאחר התגובה
      metadata: {
        method,
        timestamp: new Date().toISOString(),
      },
    }).catch(error => {
      console.error('Audit logging failed:', error)
    })
    
  } catch (error) {
    console.error('Audit middleware error:', error)
    // אל תחסום את הבקשה גם אם התיעוד נכשל
  }
  
  return NextResponse.next()
}

/**
 * Rate limiting לזיהוי התקפות
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, limit: number = 100): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

/**
 * ניקוי מפת rate limiting (להרצה כל דקה)
 */
export function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}

// Cleanup every minute
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitMap, 60 * 1000)
}
