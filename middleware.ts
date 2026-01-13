import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Rate limiting using in-memory store (for production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
}

function getClientId(request: NextRequest): string {
  // Get IP from various headers (for production behind proxy)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  return ip
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const client = rateLimitStore.get(clientId)

  if (!client || now > client.resetTime) {
    // New window
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    })
    return true
  }

  if (client.count >= RATE_LIMIT.maxRequests) {
    return false // Rate limit exceeded
  }

  client.count++
  return true
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Rate Limiting (for API routes)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientId = getClientId(request)
    
    if (!checkRateLimit(clientId)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'אתה מבצע יותר מדי בקשות. נסה שוב בעוד דקה.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }
  }

  // CSRF Protection for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    // Allow same-origin requests
    if (origin && host && new URL(origin).host !== host) {
      // In production, verify CSRF token
      const csrfToken = request.headers.get('x-csrf-token')
      if (!csrfToken && request.nextUrl.pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            error: 'CSRF token missing',
            message: 'בקשה לא חוקית',
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
