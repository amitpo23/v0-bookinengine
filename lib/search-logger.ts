/**
 * Search Logger - רישום חיפושים
 * Logs all search queries to the database for analytics and admin viewing
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseKey)

export interface SearchLogParams {
  // Hotel context
  hotelId?: string

  // Search parameters
  searchQuery?: string
  destination?: string
  hotelName?: string
  city?: string
  dateFrom?: string | Date
  dateTo?: string | Date
  adults?: number
  children?: number

  // Results
  resultsCount?: number
  foundHotels?: number
  foundRooms?: number

  // Performance
  durationMs?: number

  // Status
  success?: boolean
  errorMessage?: string

  // Context
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string

  // Source
  source?: "chat" | "widget" | "template" | "api"
  channel?: "web" | "mobile" | "embed"

  // Additional metadata
  metadata?: Record<string, any>
}

export class SearchLogger {
  /**
   * Log a search operation
   */
  static async logSearch(params: SearchLogParams): Promise<void> {
    try {
      // Format dates if provided
      const dateFrom =
        params.dateFrom instanceof Date
          ? params.dateFrom.toISOString().split("T")[0]
          : params.dateFrom

      const dateTo =
        params.dateTo instanceof Date
          ? params.dateTo.toISOString().split("T")[0]
          : params.dateTo

      const { error } = await supabase.from("search_logs").insert([
        {
          hotel_id: params.hotelId,
          search_query: params.searchQuery,
          destination: params.destination,
          hotel_name: params.hotelName,
          city: params.city,
          date_from: dateFrom,
          date_to: dateTo,
          adults: params.adults,
          children: params.children,
          results_count: params.resultsCount ?? 0,
          found_hotels: params.foundHotels,
          found_rooms: params.foundRooms,
          duration_ms: params.durationMs,
          success: params.success ?? true,
          error_message: params.errorMessage,
          user_id: params.userId,
          session_id: params.sessionId,
          ip_address: params.ipAddress,
          user_agent: params.userAgent,
          source: params.source,
          channel: params.channel,
          metadata: params.metadata,
        },
      ])

      if (error) {
        console.error("[SearchLogger] Supabase insert error:", error)
      }
    } catch (error) {
      console.error("[SearchLogger] Error logging search:", error)
      // Don't throw - logging errors shouldn't break the application
    }
  }

  /**
   * Get search logs with filtering
   */
  static async getSearchLogs(
    filters?: {
      hotelId?: string
      userId?: string
      dateFrom?: Date
      dateTo?: Date
      success?: boolean
      source?: string
      limit?: number
      offset?: number
    },
  ) {
    const limit = filters?.limit ?? 50
    const offset = filters?.offset ?? 0

    let query = supabase
      .from("search_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (filters?.hotelId) {
      query = query.eq("hotel_id", filters.hotelId)
    }

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }

    if (filters?.success !== undefined) {
      query = query.eq("success", filters.success)
    }

    if (filters?.source) {
      query = query.eq("source", filters.source)
    }

    if (filters?.dateFrom) {
      query = query.gte(
        "created_at",
        filters.dateFrom.toISOString()
      )
    }

    if (filters?.dateTo) {
      query = query.lte(
        "created_at",
        filters.dateTo.toISOString()
      )
    }

    const { data: logs, count, error } = await query

    if (error) {
      console.error("[SearchLogger] Error fetching logs:", error)
      return { logs: [], total: 0, limit, offset }
    }

    return { logs: logs || [], total: count || 0, limit, offset }
  }

  /**
   * Get search statistics
   */
  static async getSearchStats(filters?: {
    hotelId?: string
    dateFrom?: Date
    dateTo?: Date
  }) {
    let totalQuery = supabase.from("search_logs").select("*", { count: "exact", head: true })
    let successQuery = supabase
      .from("search_logs")
      .select("*", { count: "exact", head: true })
      .eq("success", true)

    if (filters?.hotelId) {
      totalQuery = totalQuery.eq("hotel_id", filters.hotelId)
      successQuery = successQuery.eq("hotel_id", filters.hotelId)
    }

    if (filters?.dateFrom) {
      const fromDate = filters.dateFrom.toISOString()
      totalQuery = totalQuery.gte("created_at", fromDate)
      successQuery = successQuery.gte("created_at", fromDate)
    }

    if (filters?.dateTo) {
      const toDate = filters.dateTo.toISOString()
      totalQuery = totalQuery.lte("created_at", toDate)
      successQuery = successQuery.lte("created_at", toDate)
    }

    const { count: total } = await totalQuery
    const { count: successful } = await successQuery
    const failed = (total || 0) - (successful || 0)

    return {
      total: total || 0,
      successful: successful || 0,
      failed,
      successRate: (total || 0) > 0 ? (((successful || 0) / total!) * 100).toFixed(2) + "%" : "0%",
      bySource: {},
      byDestination: {},
    }
  }

  /**
   * Delete old search logs (for cleanup)
   */
  static async deleteOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const { data, error } = await supabase
      .from("search_logs")
      .delete()
      .lt("created_at", cutoffDate.toISOString())

    if (error) {
      console.error("[SearchLogger] Error deleting old logs:", error)
      return 0
    }

    return data?.length || 0
  }

  /**
   * Delete a specific search log by ID
   */
  static async deleteLog(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("search_logs").delete().eq("id", id)

      if (error) {
        console.error("[SearchLogger] Error deleting log:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("[SearchLogger] Error deleting log:", error)
      return false
    }
  }
}
