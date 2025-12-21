/**
 * Simple In-Memory Rate Limiter
 *
 * NOTE: This is a basic in-memory implementation suitable for:
 * - Development environments
 * - Single-server deployments
 * - Small to medium traffic
 *
 * For production with multiple servers, consider:
 * - Upstash Redis (@upstash/ratelimit)
 * - Redis with ioredis
 * - Rate limiting at CDN/proxy level (Cloudflare, etc.)
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class InMemoryRateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request should be allowed
   * @param identifier - IP address or user ID
   * @param limit - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns { success: boolean, remaining: number, reset: number }
   */
  async check(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{
    success: boolean
    remaining: number
    reset: number
    current: number
  }> {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // No entry or expired entry
    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })

      return {
        success: true,
        remaining: limit - 1,
        reset: now + windowMs,
        current: 1,
      }
    }

    // Entry exists and not expired
    if (entry.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetTime,
        current: entry.count,
      }
    }

    // Increment counter
    entry.count++
    this.requests.set(identifier, entry)

    return {
      success: true,
      remaining: limit - entry.count,
      reset: entry.resetTime,
      current: entry.count,
    }
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        toDelete.push(key)
      }
    }

    toDelete.forEach((key) => this.requests.delete(key))

    if (toDelete.length > 0) {
      console.log(`[RateLimiter] Cleaned up ${toDelete.length} expired entries`)
    }
  }

  /**
   * Get current statistics
   */
  getStats(): { totalEntries: number; activeEntries: number } {
    const now = Date.now()
    let activeCount = 0

    for (const entry of this.requests.values()) {
      if (now <= entry.resetTime) {
        activeCount++
      }
    }

    return {
      totalEntries: this.requests.size,
      activeEntries: activeCount,
    }
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.requests.clear()
  }
}

// Singleton instance
const rateLimiter = new InMemoryRateLimiter()

/**
 * Rate limit configurations for different endpoints
 */
export const RateLimitConfig = {
  // Search endpoints - moderate limits
  search: {
    limit: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  },

  // Booking endpoints - strict limits
  prebook: {
    limit: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  },

  book: {
    limit: 5,
    windowMs: 60 * 1000, // 5 bookings per minute
  },

  // Payment endpoints - very strict
  payment: {
    limit: 3,
    windowMs: 60 * 1000, // 3 payment attempts per minute
  },

  // API endpoints - standard limits
  api: {
    limit: 60,
    windowMs: 60 * 1000, // 60 requests per minute
  },

  // Strict limits for sensitive operations
  strict: {
    limit: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },
}

/**
 * Get client identifier from request
 * Uses IP address and user agent for basic fingerprinting
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  const ip = cfConnectingIp || realIp || forwardedFor?.split(",")[0] || "unknown"

  // Add user agent for better fingerprinting
  const userAgent = request.headers.get("user-agent") || "unknown"
  const fingerprint = `${ip}-${hashString(userAgent)}`

  return fingerprint
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Apply rate limiting to an API route
 * Usage in route handler:
 *
 * const rateLimitResult = await applyRateLimit(request, RateLimitConfig.search)
 * if (!rateLimitResult.success) {
 *   return rateLimitResult.response
 * }
 */
export async function applyRateLimit(
  request: Request,
  config: { limit: number; windowMs: number }
): Promise<
  | { success: true }
  | {
      success: false
      response: Response
    }
> {
  const identifier = getClientIdentifier(request)
  const result = await rateLimiter.check(identifier, config.limit, config.windowMs)

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)

    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          retryAfter: retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(result.reset).toISOString(),
          },
        }
      ),
    }
  }

  return { success: true }
}

/**
 * Export singleton instance for direct access
 */
export { rateLimiter }

/**
 * Export type for rate limit result
 */
export type RateLimitResult = Awaited<ReturnType<typeof applyRateLimit>>
