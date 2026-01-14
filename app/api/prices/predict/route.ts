/**
 * Price Prediction API Route
 */

import { NextRequest, NextResponse } from 'next/server';

interface PricePrediction {
  trend: 'rising' | 'stable' | 'falling';
  confidence: number;
  recommendation: 'book_now' | 'wait' | 'monitor';
  expectedChange?: number;
  bestTimeToBook?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!hotelId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID and travel dates are required' },
        { status: 400 }
      );
    }

    // Mock prediction based on dates
    const daysUntilTrip = Math.ceil((new Date(checkIn).getTime() - Date.now()) / 86400000);
    
    const prediction: PricePrediction = {
      trend: daysUntilTrip > 30 ? 'falling' : daysUntilTrip > 14 ? 'stable' : 'rising',
      confidence: 0.75,
      recommendation: daysUntilTrip > 30 ? 'wait' : daysUntilTrip > 14 ? 'monitor' : 'book_now',
      expectedChange: daysUntilTrip > 30 ? -15 : daysUntilTrip > 14 ? 5 : 20,
      bestTimeToBook: daysUntilTrip > 30 ? '2-3 weeks before travel' : 'Book now'
    };

    return NextResponse.json({ success: true, data: prediction });
  } catch (error) {
    console.error('Price prediction API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hotelId, checkIn, checkOut } = await request.json();

    if (!hotelId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID and dates are required' },
        { status: 400 }
      );
    }

    const prediction: PricePrediction = {
      trend: 'stable',
      confidence: 0.8,
      recommendation: 'monitor',
      expectedChange: 10,
      bestTimeToBook: 'Within the next week'
    };

    return NextResponse.json({ success: true, data: prediction });
  } catch (error) {
    console.error('Price prediction API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
