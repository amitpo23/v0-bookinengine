/**
 * Price History API Route
 */

import { NextRequest, NextResponse } from 'next/server';

interface PriceHistoryPoint {
  date: string;
  price: number;
  source: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Generate mock price history
    const today = new Date();
    const mockHistory: PriceHistoryPoint[] = Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i - 1));
      const sources = ['Booking.com', 'Expedia', 'Hotels.com'];
      return {
        date: date.toISOString().split('T')[0],
        price: 150 + Math.floor(Math.random() * 100) - 50 + Math.round(Math.sin(i / 5) * 20),
        source: sources[Math.floor(Math.random() * sources.length)]
      };
    });

    return NextResponse.json({ success: true, data: mockHistory });
  } catch (error) {
    console.error('Price history API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hotelId, checkIn, checkOut, days = 30 } = await request.json();

    if (!hotelId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID and dates are required' },
        { status: 400 }
      );
    }

    // Mock history
    const mockHistory: PriceHistoryPoint[] = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
      price: 180 + Math.floor(Math.random() * 80),
      source: 'Aggregated'
    }));

    return NextResponse.json({ success: true, data: mockHistory });
  } catch (error) {
    console.error('Price history API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
