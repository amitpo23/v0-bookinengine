/**
 * Simple In-Memory Cache
 *
 * NOTE: This is a basic in-memory implementation suitable for:
 * - Development environments
 * - Single-server deployments
 * - Small to medium traffic
 *
 * For production with multiple servers, consider:
 * - Upstash Redis
 * - Redis with ioredis
 * - CDN-level caching (Cloudflare, Vercel Edge)
 */

import { logger } from "./logger"

interface CacheEntry<T> {
  data: T
  expiresAt: number
  createdAt: number
  hits: number
}

class InMemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Get value from cache
   * Returns null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      logger.debug(`Cache miss: ${key}`)
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      logger.debug(`Cache expired: ${key}`)
      this.cache.delete(key)
      return null
    }

    // Increment hit counter
    entry.hits++
    logger.debug(`Cache hit: ${key} (hits: ${entry.hits})`)

    return entry.data as T
  }

  /**
   * Set value in cache with TTL (time to live) in seconds
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlSeconds - Time to live in seconds (default: 300 = 5 minutes)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const now = Date.now()
    const expiresAt = now + ttlSeconds * 1000

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: now,
      hits: 0,
    })

    logger.debug(`Cache set: ${key} (TTL: ${ttlSeconds}s)`)
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`)
    }
    return deleted
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    logger.info(`Cache cleared: ${size} entries removed`)
  }

  /**
   * Get cached value or compute and cache it
   * @param key - Cache key
   * @param fetcher - Function to fetch data if not cached
   * @param ttlSeconds - Time to live in seconds
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch and cache
    logger.debug(`Cache fetching: ${key}`)
    const data = await fetcher()
    this.set(key, data, ttlSeconds)

    return data
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        toDelete.push(key)
      }
    }

    toDelete.forEach((key) => this.cache.delete(key))

    if (toDelete.length > 0) {
      logger.info(`Cache cleanup: removed ${toDelete.length} expired entries`)
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number
    activeEntries: number
    totalHits: number
    averageAge: number
  } {
    const now = Date.now()
    let activeCount = 0
    let totalHits = 0
    let totalAge = 0

    for (const entry of this.cache.values()) {
      if (now <= entry.expiresAt) {
        activeCount++
        totalHits += entry.hits
        totalAge += now - entry.createdAt
      }
    }

    return {
      totalEntries: this.cache.size,
      activeEntries: activeCount,
      totalHits,
      averageAge: activeCount > 0 ? Math.round(totalAge / activeCount / 1000) : 0, // in seconds
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
    this.cache.clear()
  }
}

// Singleton instance
export const cache = new InMemoryCache()

/**
 * Cache configurations for different data types
 */
export const CacheConfig = {
  // Hotel search results - 5 minutes
  search: {
    ttl: 5 * 60, // 5 minutes
    keyPrefix: "search:",
  },

  // Hotel details - 10 minutes
  hotelDetails: {
    ttl: 10 * 60, // 10 minutes
    keyPrefix: "hotel:",
  },

  // Room availability - 3 minutes (changes frequently)
  roomAvailability: {
    ttl: 3 * 60, // 3 minutes
    keyPrefix: "rooms:",
  },

  // Static data - 1 hour
  static: {
    ttl: 60 * 60, // 1 hour
    keyPrefix: "static:",
  },
}

/**
 * Helper function to create cache key from search parameters
 */
export function createSearchCacheKey(params: {
  dateFrom: string
  dateTo: string
  city?: string
  hotelName?: string
  adults: number
  children: number[]
}): string {
  const childrenStr = params.children.length > 0 ? params.children.join(",") : "none"
  const location = params.hotelName || params.city || "any"

  return `${CacheConfig.search.keyPrefix}${location}:${params.dateFrom}:${params.dateTo}:${params.adults}:${childrenStr}`
}

/**
 * Helper to invalidate all search cache (e.g., after price update)
 */
export function invalidateSearchCache(): void {
  const keysToDelete: string[] = []

  for (const [key] of (cache as any).cache.entries()) {
    if (key.startsWith(CacheConfig.search.keyPrefix)) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => cache.delete(key))

  logger.info(`Invalidated ${keysToDelete.length} search cache entries`)
}

export type { CacheEntry }
