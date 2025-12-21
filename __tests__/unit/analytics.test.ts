/**
 * Unit Tests for Analytics Service
 */

import { AnalyticsService } from '@/lib/analytics/analytics-service'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
    auditLog: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}))

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(() => {
    service = new AnalyticsService()
    jest.clearAllMocks()
  })

  describe('getBookingStats', () => {
    it('should calculate booking statistics correctly', async () => {
      const mockBookings = [
        { totalPrice: 100, status: 'CONFIRMED' },
        { totalPrice: 200, status: 'CONFIRMED' },
        { totalPrice: 150, status: 'CANCELLED' },
      ]

      const { prisma } = require('@/lib/db')
      prisma.booking.findMany.mockResolvedValue(mockBookings)
      prisma.auditLog.count.mockResolvedValue(10) // 10 searches

      const stats = await service.getBookingStats({ days: 30 })

      expect(stats.totalBookings).toBe(3)
      expect(stats.totalRevenue).toBe(300) // Only CONFIRMED bookings
      expect(stats.avgBookingValue).toBe(150) // 300 / 2
      expect(stats.conversionRate).toBe(20) // 2 confirmed / 10 searches * 100
      expect(stats.cancelledBookings).toBe(1)
    })

    it('should handle no bookings gracefully', async () => {
      const { prisma } = require('@/lib/db')
      prisma.booking.findMany.mockResolvedValue([])
      prisma.auditLog.count.mockResolvedValue(0)

      const stats = await service.getBookingStats({ days: 30 })

      expect(stats.totalBookings).toBe(0)
      expect(stats.totalRevenue).toBe(0)
      expect(stats.avgBookingValue).toBe(0)
      expect(stats.conversionRate).toBe(0)
    })
  })

  describe('getSourceBreakdown', () => {
    it('should group bookings by API source', async () => {
      const mockGroupBy = [
        { apiSource: 'medici-direct', _count: 10, _sum: { totalPrice: 1000 } },
        { apiSource: 'manus', _count: 5, _sum: { totalPrice: 500 } },
      ]

      const { prisma } = require('@/lib/db')
      prisma.booking.groupBy.mockResolvedValue(mockGroupBy)

      const breakdown = await service.getSourceBreakdown({ days: 30 })

      expect(breakdown).toHaveLength(2)
      expect(breakdown[0].source).toBe('medici-direct')
      expect(breakdown[0].bookings).toBe(10)
      expect(breakdown[0].revenue).toBe(1000)
      expect(breakdown[1].source).toBe('manus')
      expect(breakdown[1].bookings).toBe(5)
    })
  })
})
