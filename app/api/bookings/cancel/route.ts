/**
 * Booking Cancellation API
 * Handles booking cancellations and refunds
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const cancellationSchema = z.object({
  bookingId: z.string(),
  reason: z.string().min(10, 'סיבת הביטול חייבת להכיל לפחות 10 תווים'),
  email: z.string().email('אימייל לא תקין'),
})

// Cancellation policy - days before check-in
const CANCELLATION_POLICY = {
  FREE_CANCELLATION_DAYS: 7, // Free cancellation up to 7 days before
  PARTIAL_REFUND_DAYS: 3, // 50% refund 3-7 days before
  NO_REFUND_DAYS: 1, // No refund less than 1 day before
}

function calculateRefund(
  totalPrice: number,
  checkInDate: Date,
  cancellationDate: Date
): { refundAmount: number; refundPercentage: number; policy: string } {
  const daysUntilCheckIn = Math.ceil(
    (checkInDate.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilCheckIn >= CANCELLATION_POLICY.FREE_CANCELLATION_DAYS) {
    return {
      refundAmount: totalPrice,
      refundPercentage: 100,
      policy: 'ביטול חינם - החזר מלא',
    }
  } else if (daysUntilCheckIn >= CANCELLATION_POLICY.PARTIAL_REFUND_DAYS) {
    return {
      refundAmount: totalPrice * 0.5,
      refundPercentage: 50,
      policy: 'החזר חלקי - 50%',
    }
  } else if (daysUntilCheckIn >= CANCELLATION_POLICY.NO_REFUND_DAYS) {
    return {
      refundAmount: totalPrice * 0.25,
      refundPercentage: 25,
      policy: 'החזר חלקי - 25%',
    }
  } else {
    return {
      refundAmount: 0,
      refundPercentage: 0,
      policy: 'ללא החזר כספי',
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = cancellationSchema.safeParse(body)
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

    const { bookingId, reason, email } = validation.data

    // TODO: Fetch booking from database
    // const booking = await prisma.booking.findUnique({
    //   where: { id: bookingId },
    // })

    // Mock booking data for demonstration
    const mockBooking = {
      id: bookingId,
      bookingReference: 'BK-' + bookingId.slice(-8).toUpperCase(),
      guestEmail: email,
      checkIn: new Date('2026-02-15'),
      totalPrice: 1500,
      status: 'CONFIRMED',
      hotelName: 'Grand Hotel',
      roomType: 'Deluxe Room',
    }

    // Verify email matches
    if (mockBooking.guestEmail !== email) {
      return NextResponse.json(
        {
          success: false,
          error: 'האימייל אינו תואם להזמנה',
        },
        { status: 403 }
      )
    }

    // Check if already cancelled
    if (mockBooking.status === 'CANCELLED') {
      return NextResponse.json(
        {
          success: false,
          error: 'ההזמנה כבר בוטלה',
        },
        { status: 400 }
      )
    }

    // Calculate refund
    const cancellationDate = new Date()
    const refundInfo = calculateRefund(
      mockBooking.totalPrice,
      mockBooking.checkIn,
      cancellationDate
    )

    // TODO: Update booking in database
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     status: 'CANCELLED',
    //     cancelledAt: cancellationDate,
    //     cancellationReason: reason,
    //     refundAmount: refundInfo.refundAmount,
    //   },
    // })

    // TODO: Process refund through payment gateway
    // if (refundInfo.refundAmount > 0) {
    //   await stripe.refunds.create({
    //     payment_intent: booking.paymentId,
    //     amount: Math.round(refundInfo.refundAmount * 100),
    //   })
    // }

    // TODO: Send cancellation confirmation email
    // await emailService.sendCancellationConfirmation({
    //   to: email,
    //   bookingReference: mockBooking.bookingReference,
    //   hotelName: mockBooking.hotelName,
    //   refundAmount: refundInfo.refundAmount,
    //   refundPercentage: refundInfo.refundPercentage,
    // })

    // Log activity
    // await prisma.activityLog.create({
    //   data: {
    //     type: 'cancellation',
    //     action: 'Booking Cancelled',
    //     description: `Booking ${mockBooking.bookingReference} cancelled`,
    //     resourceId: bookingId,
    //     resourceType: 'booking',
    //     success: true,
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'ההזמנה בוטלה בהצלחה',
      data: {
        bookingReference: mockBooking.bookingReference,
        cancellationDate: cancellationDate.toISOString(),
        refundAmount: refundInfo.refundAmount,
        refundPercentage: refundInfo.refundPercentage,
        policy: refundInfo.policy,
        hotelName: mockBooking.hotelName,
        roomType: mockBooking.roomType,
      },
    })
  } catch (error) {
    console.error('Cancellation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בביטול ההזמנה',
        message: error instanceof Error ? error.message : 'שגיאה לא צפויה',
      },
      { status: 500 }
    )
  }
}

// GET - Check cancellation policy
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  const checkInDate = searchParams.get('checkIn')

  if (!bookingId || !checkInDate) {
    return NextResponse.json(
      {
        success: false,
        error: 'חסרים פרמטרים',
      },
      { status: 400 }
    )
  }

  const checkIn = new Date(checkInDate)
  const now = new Date()
  const refundInfo = calculateRefund(1000, checkIn, now) // Mock price

  return NextResponse.json({
    success: true,
    data: {
      bookingId,
      checkInDate: checkIn.toISOString(),
      currentDate: now.toISOString(),
      daysUntilCheckIn: Math.ceil(
        (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
      refundPercentage: refundInfo.refundPercentage,
      policy: refundInfo.policy,
      cancellationPolicy: {
        freeCancellationDays: CANCELLATION_POLICY.FREE_CANCELLATION_DAYS,
        partialRefundDays: CANCELLATION_POLICY.PARTIAL_REFUND_DAYS,
        noRefundDays: CANCELLATION_POLICY.NO_REFUND_DAYS,
      },
    },
  })
}
