/**
 * Analytics Service
 * Provides booking metrics, revenue tracking, and performance analytics
 */

import { prisma } from "@/lib/db/prisma"
import { logger } from "@/lib/logger"
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, format } from "date-fns"

export interface AnalyticsParams {
  dateFrom?: Date
  dateTo?: Date
  days?: number // Number of days to look back from today
}

export interface BookingStats {
  totalBookings: number
  totalRevenue: number
  avgBookingValue: number
  conversionRate: number
  cancelledBookings: number
  cancellationRate: number
}

export interface RevenueData {
  date: string
  revenue: number
  bookings: number
}

export interface ConversionData {
  date: string
  searches: number
  bookings: number
  rate: number
}

export interface SourceBreakdown {
  source: string
  bookings: number // Total bookings from this source
  revenue: number
  percentage: number
}

class AnalyticsService {
  /**
   * Get overall booking statistics
   */
  async getBookingStats(params: AnalyticsParams = {}): Promise<BookingStats> {
    const dateFrom = params.dateFrom || (params.days ? subDays(new Date(), params.days) : subDays(new Date(), 30))
    const dateTo = params.dateTo || new Date()

    try {
      logger.debug("[Analytics] Fetching booking stats", { dateFrom, dateTo })

      const [bookings, cancelledBookings] = await Promise.all([
        prisma.booking.findMany({
          where: {
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
          },
          select: {
            totalPrice: true,
            status: true,
          },
        }),
        prisma.booking.count({
          where: {
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
            status: "CANCELLED",
          },
        }),
      ])

      const totalBookings = bookings.length
      const totalRevenue = bookings
        .filter((b) => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + Number(b.totalPrice), 0)

      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
      const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0

      // Calculate conversion rate from audit logs
      const searchCount = await prisma.auditLog.count({
        where: {
          action: "SEARCH",
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      })

      const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length
      const conversionRate = searchCount > 0 ? (confirmedBookings / searchCount) * 100 : 0

      logger.info("[Analytics] ✅ Booking stats calculated", {
        totalBookings,
        totalRevenue,
      })

      return {
        totalBookings,
        totalRevenue,
        avgBookingValue,
        conversionRate,
        cancelledBookings,
        cancellationRate,
      }
    } catch (error: any) {
      logger.error("[Analytics] Failed to get booking stats", error)
      throw error
    }
  }

  /**
   * Get daily revenue breakdown
   */
  async getRevenueByDay(params: AnalyticsParams = {}): Promise<RevenueData[]> {
    const dateFrom = params.dateFrom || subDays(new Date(), 30)
    const dateTo = params.dateTo || new Date()

    try {
      const bookings = await prisma.booking.findMany({
        where: {
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
          status: "CONFIRMED",
        },
        select: {
          createdAt: true,
          totalPrice: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      // Group by day
      const dailyData = new Map<string, { revenue: number; bookings: number }>()

      bookings.forEach((booking) => {
        const dateKey = format(booking.createdAt, "yyyy-MM-dd")
        const existing = dailyData.get(dateKey) || { revenue: 0, bookings: 0 }

        dailyData.set(dateKey, {
          revenue: existing.revenue + Number(booking.totalPrice),
          bookings: existing.bookings + 1,
        })
      })

      // Fill in missing dates with zeros
      const result: RevenueData[] = []
      let currentDate = startOfDay(dateFrom)
      const endDate = endOfDay(dateTo)

      while (currentDate <= endDate) {
        const dateKey = format(currentDate, "yyyy-MM-dd")
        const data = dailyData.get(dateKey) || { revenue: 0, bookings: 0 }

        result.push({
          date: dateKey,
          revenue: data.revenue,
          bookings: data.bookings,
        })

        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }

      logger.info("[Analytics] ✅ Revenue by day calculated", {
        days: result.length,
      })

      return result
    } catch (error: any) {
      logger.error("[Analytics] Failed to get revenue by day", error)
      throw error
    }
  }

  /**
   * Get conversion rate over time
   */
  async getConversionByDay(params: AnalyticsParams = {}): Promise<ConversionData[]> {
    const dateFrom = params.dateFrom || subDays(new Date(), 30)
    const dateTo = params.dateTo || new Date()

    try {
      const [searchLogs, bookings] = await Promise.all([
        prisma.auditLog.findMany({
          where: {
            action: "SEARCH",
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
          },
          select: {
            createdAt: true,
          },
        }),
        prisma.booking.findMany({
          where: {
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
            status: "CONFIRMED",
          },
          select: {
            createdAt: true,
          },
        }),
      ])

      // Group by day
      const dailySearches = new Map<string, number>()
      const dailyBookings = new Map<string, number>()

      searchLogs.forEach((log) => {
        const dateKey = format(log.createdAt, "yyyy-MM-dd")
        dailySearches.set(dateKey, (dailySearches.get(dateKey) || 0) + 1)
      })

      bookings.forEach((booking) => {
        const dateKey = format(booking.createdAt, "yyyy-MM-dd")
        dailyBookings.set(dateKey, (dailyBookings.get(dateKey) || 0) + 1)
      })

      // Calculate conversion rates
      const result: ConversionData[] = []
      let currentDate = startOfDay(dateFrom)
      const endDate = endOfDay(dateTo)

      while (currentDate <= endDate) {
        const dateKey = format(currentDate, "yyyy-MM-dd")
        const searches = dailySearches.get(dateKey) || 0
        const bookingCount = dailyBookings.get(dateKey) || 0
        const rate = searches > 0 ? (bookingCount / searches) * 100 : 0

        result.push({
          date: dateKey,
          searches,
          bookings: bookingCount,
          rate,
        })

        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }

      logger.info("[Analytics] ✅ Conversion by day calculated", {
        days: result.length,
      })

      return result
    } catch (error: any) {
      logger.error("[Analytics] Failed to get conversion by day", error)
      throw error
    }
  }

  /**
   * Get breakdown by API source (Medici Direct vs MANUS)
   */
  async getSourceBreakdown(params: AnalyticsParams = {}): Promise<SourceBreakdown[]> {
    const dateFrom = params.dateFrom || subDays(new Date(), 30)
    const dateTo = params.dateTo || new Date()

    try {
      const bookings = await prisma.booking.groupBy({
        by: ["apiSource"],
        where: {
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
          status: "CONFIRMED",
        },
        _count: true,
        _sum: {
          totalPrice: true,
        },
      })

      const totalCount = bookings.reduce((sum, b) => sum + b._count, 0)
      const totalRevenue = bookings.reduce((sum, b) => sum + Number(b._sum.totalPrice || 0), 0)

      const result: SourceBreakdown[] = bookings.map((item) => ({
        source: item.apiSource,
        bookings: item._count,
        revenue: Number(item._sum.totalPrice || 0),
        percentage: totalCount > 0 ? (item._count / totalCount) * 100 : 0,
      }))

      logger.info("[Analytics] ✅ Source breakdown calculated", {
        sources: result.length,
      })

      return result
    } catch (error: any) {
      logger.error("[Analytics] Failed to get source breakdown", error)
      throw error
    }
  }

  /**
   * Get top hotels by bookings
   */
  async getTopHotels(params: AnalyticsParams & { limit?: number } = {}) {
    const dateFrom = params.dateFrom || subDays(new Date(), 30)
    const dateTo = params.dateTo || new Date()
    const limit = params.limit || 10

    try {
      const hotels = await prisma.booking.groupBy({
        by: ["hotelName", "hotelId"],
        where: {
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
          status: "CONFIRMED",
        },
        _count: true,
        _sum: {
          totalPrice: true,
        },
        orderBy: {
          _count: {
            _all: "desc",
          },
        },
        take: limit,
      })

      const result = hotels.map((hotel) => ({
        hotelName: hotel.hotelName,
        hotelId: hotel.hotelId,
        bookings: hotel._count,
        revenue: Number(hotel._sum.totalPrice || 0),
      }))

      logger.info("[Analytics] ✅ Top hotels calculated", {
        count: result.length,
      })

      return result
    } catch (error: any) {
      logger.error("[Analytics] Failed to get top hotels", error)
      throw error
    }
  }

  /**
   * Get AI performance metrics (GROQ vs Claude)
   */
  async getAIPerformance(params: AnalyticsParams = {}) {
    const dateFrom = params.dateFrom || subDays(new Date(), 30)
    const dateTo = params.dateTo || new Date()

    try {
      // This would require LangSmith data or custom tracking
      // For now, return mock data structure
      // TODO: Integrate with LangSmith API

      logger.info("[Analytics] AI performance metrics (requires LangSmith integration)")

      return {
        groq: {
          avgResponseTime: 0,
          totalRequests: 0,
          successRate: 0,
        },
        claude: {
          avgResponseTime: 0,
          totalRequests: 0,
          successRate: 0,
        },
      }
    } catch (error: any) {
      logger.error("[Analytics] Failed to get AI performance", error)
      throw error
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(params: AnalyticsParams = {}) {
    try {
      const [stats, revenue, conversion, sources, topHotels] = await Promise.all([
        this.getBookingStats(params),
        this.getRevenueByDay(params),
        this.getConversionByDay(params),
        this.getSourceBreakdown(params),
        this.getTopHotels(params),
      ])

      return {
        stats,
        revenue,
        conversion,
        sources,
        topHotels,
      }
    } catch (error: any) {
      logger.error("[Analytics] Failed to get dashboard data", error)
      throw error
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()

// Export class for testing
export { AnalyticsService }
