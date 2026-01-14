/**
 * Price Comparison API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { comparePrices } from '@/lib/services/price-comparison-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, checkIn, checkOut, guests, roomType } = body;

    if (!hotelId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID, dates, and guests are required' },
        { status: 400 }
      );
    }

    const comparison = await comparePrices(
      hotelId,
      checkIn,
      checkOut,
      guests,
      roomType
    );

    if (!comparison) {
      return NextResponse.json(
        { success: false, error: 'Failed to compare prices' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Price comparison API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
