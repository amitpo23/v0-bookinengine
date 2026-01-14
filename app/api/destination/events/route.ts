/**
 * Destination Events API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EventInfo } from '@/lib/services/destination-info-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      );
    }

    // Mock events data
    const mockEvents: EventInfo[] = [
      { name: 'Local Food Festival', type: 'festival', date: checkIn || undefined, description: 'Annual culinary celebration' },
      { name: 'Art Exhibition', type: 'exhibition', description: 'Contemporary art showcase' },
      { name: 'Music Concert', type: 'concert', description: 'Live performances' }
    ];

    return NextResponse.json({ success: true, data: mockEvents });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { destination, checkIn, checkOut } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      );
    }

    const mockEvents: EventInfo[] = [
      { name: 'Cultural Festival', type: 'festival', date: checkIn },
      { name: 'Sports Event', type: 'sports', date: checkOut }
    ];

    return NextResponse.json({ success: true, data: mockEvents });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
