/**
 * Booking Management API
 * CRUD operations for bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createBookingSchema = z.object({
  roomId: z.string(),
  hotelId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  adults: z.number().min(1).max(10),
  children: z.number().min(0).max(10),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
})

// GET - Fetch bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const hotelId = searchParams.get('hotelId')
    const status = searchParams.get('status')

    // TODO: Fetch from database
    // const bookings = await prisma.booking.findMany({
    //   where: {
    //     ...(userId && { userId }),
    //     ...(hotelId && { hotelId }),
    //     ...(status && { status }),
    //   },
    //   include: {
    //     hotel: true,
    //     room: true,
    //   },
    //   orderBy: { createdAt: 'desc' },
    // })

    // Mock data for now
    const mockBookings = [
      {
        id: '1',
        bookingReference: 'BK-ABC123',
        hotelName: 'Grand Hotel',
        roomType: 'Deluxe Room',
        checkIn: '2026-02-15',
        checkOut: '2026-02-20',
        status: 'CONFIRMED',
        totalPrice: 1500,
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockBookings,
      count: mockBookings.length,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בטעינת ההזמנות',
      },
      { status: 500 }
    )
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = createBookingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'נתונים לא תקינים',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Calculate nights
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (nights < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'תאריך צ\'ק-אאוט חייב להיות אחרי תאריך צ\'ק-אין',
        },
        { status: 400 }
      )
    }

    // Generate booking reference
    const bookingReference = 'BK-' + Date.now().toString(36).toUpperCase()

    // TODO: Create booking in database
    // const booking = await prisma.booking.create({
    //   data: {
    //     bookingReference,
    //     roomId: data.roomId,
    //     hotelId: data.hotelId,
    //     userId: 'current-user-id', // From auth session
    //     checkIn,
    //     checkOut,
    //     nights,
    //     adults: data.adults,
    //     children: data.children,
    //     guestName: data.guestName,
    //     guestEmail: data.guestEmail,
    //     guestPhone: data.guestPhone,
    //     specialRequests: data.specialRequests,
    //     status: 'PENDING',
    //     totalPrice: 0, // Calculate from room prices
    //   },
    // })

    // TODO: Send confirmation email
    // await emailService.sendBookingConfirmation(...)

    return NextResponse.json({
      success: true,
      message: 'ההזמנה נוצרה בהצלחה',
      data: {
        bookingReference,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        nights,
        status: 'PENDING',
      },
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה ביצירת ההזמנה',
      },
      { status: 500 }
    )
  }
}

// PATCH - Update booking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, status, specialRequests } = body

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: 'חסר מזהה הזמנה',
        },
        { status: 400 }
      )
    }

    // TODO: Update in database
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     ...(status && { status }),
    //     ...(specialRequests && { specialRequests }),
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'ההזמנה עודכנה בהצלחה',
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בעדכון ההזמנה',
      },
      { status: 500 }
    )
  }
}
