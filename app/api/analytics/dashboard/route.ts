/**
 * Analytics Dashboard API
 * Provides real-time analytics data
 */

import { NextRequest, NextResponse } from 'next/server'
import { startOfMonth, endOfMonth, subMonths, eachDayOfInterval } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month, year
    const hotelId = searchParams.get('hotelId')

    // TODO: Fetch real data from database
    // const bookings = await prisma.booking.findMany({
    //   where: {
    //     ...(hotelId && { hotelId }),
    //     createdAt: { gte: startDate, lte: endDate },
    //   },
    // })

    // Generate mock analytics data
    const now = new Date()
    const startDate = startOfMonth(subMonths(now, 2))
    const endDate = endOfMonth(now)

    // Revenue by day
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const revenueData = days.map((day) => ({
      date: day.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 10000) + 5000,
      bookings: Math.floor(Math.random() * 20) + 5,
    }))

    // Occupancy rate
    const occupancyData = days.map((day) => ({
      date: day.toISOString().split('T')[0],
      occupancy: Math.floor(Math.random() * 30) + 60, // 60-90%
    }))

    // Room type distribution
    const roomTypes = [
      { type: 'Standard', count: 45, revenue: 135000 },
      { type: 'Deluxe', count: 32, revenue: 128000 },
      { type: 'Suite', count: 18, revenue: 108000 },
      { type: 'Presidential', count: 5, revenue: 50000 },
    ]

    // Booking sources
    const sources = [
      { source: 'Direct', count: 48, percentage: 48 },
      { source: 'OTA', count: 30, percentage: 30 },
      { source: 'Travel Agent', count: 15, percentage: 15 },
      { source: 'Corporate', count: 7, percentage: 7 },
    ]

    // Guest demographics
    const demographics = {
      countries: [
        { country: 'ישראל', count: 65, percentage: 65 },
        { country: 'USA', count: 15, percentage: 15 },
        { country: 'UK', count: 10, percentage: 10 },
        { country: 'אחר', count: 10, percentage: 10 },
      ],
      ageGroups: [
        { age: '18-30', count: 20, percentage: 20 },
        { age: '31-45', count: 40, percentage: 40 },
        { age: '46-60', count: 30, percentage: 30 },
        { age: '60+', count: 10, percentage: 10 },
      ],
    }

    // Key metrics
    const metrics = {
      totalRevenue: 421000,
      revenueGrowth: 12.5,
      totalBookings: 100,
      bookingsGrowth: 8.3,
      averageStay: 3.2,
      averageRate: 950,
      occupancyRate: 78,
      cancellationRate: 5.2,
    }

    return NextResponse.json({
      success: true,
      data: {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        revenue: revenueData,
        occupancy: occupancyData,
        roomTypes,
        sources,
        demographics,
        metrics,
      },
    })
  } catch (error) {
    console.error('[Analytics] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בטעינת נתוני אנליטיקה',
      },
      { status: 500 }
    )
  }
}
