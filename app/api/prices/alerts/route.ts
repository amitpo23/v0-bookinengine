/**
 * Price Alerts API Route
 */

import { NextRequest, NextResponse } from 'next/server';

interface PriceAlert {
  id: string;
  customerId: string;
  hotelId: string;
  targetPrice: number;
  currentPrice: number;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
  triggeredAt?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Mock alerts - in production, fetch from database
    const mockAlerts: PriceAlert[] = [
      {
        id: 'alert-1',
        customerId,
        hotelId: 'hotel-123',
        targetPrice: 150,
        currentPrice: 180,
        checkIn: '2025-03-01',
        checkOut: '2025-03-05',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ success: true, data: mockAlerts });
  } catch (error) {
    console.error('Get price alerts API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, hotelId, targetPrice, checkIn, checkOut } = body;

    if (!customerId || !hotelId || !targetPrice || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create mock alert - in production, save to database
    const alert: PriceAlert = {
      id: `alert-${Date.now()}`,
      customerId,
      hotelId,
      targetPrice,
      currentPrice: targetPrice + 30, // Mock current price
      checkIn,
      checkOut,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: alert });
  } catch (error) {
    console.error('Create price alert API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
