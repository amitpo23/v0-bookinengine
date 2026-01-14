/**
 * Customer Recommendations API Route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, context, limit = 5 } = body;

    if (!customerId || !context) {
      return NextResponse.json(
        { success: false, error: 'Customer ID and context are required' },
        { status: 400 }
      );
    }

    // Mock recommendations based on context
    const recommendations = [
      {
        hotelId: 'hotel-1',
        hotelName: 'Luxury Beach Resort',
        reason: 'Based on your preference for beachfront properties',
        matchScore: 0.95,
        priceRange: { min: 200, max: 400 }
      },
      {
        hotelId: 'hotel-2',
        hotelName: 'City Center Hotel',
        reason: 'You previously enjoyed similar city hotels',
        matchScore: 0.88,
        priceRange: { min: 150, max: 300 }
      },
      {
        hotelId: 'hotel-3',
        hotelName: 'Boutique Spa Hotel',
        reason: 'Matches your interest in wellness amenities',
        matchScore: 0.82,
        priceRange: { min: 180, max: 350 }
      }
    ].slice(0, limit);

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
