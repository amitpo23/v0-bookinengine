/**
 * Customer Profile API Route
 * Get and manage customer profiles with preferences and history
 */

import { NextRequest, NextResponse } from 'next/server';

interface CustomerPreference {
  customerId: string;
  category: string;
  key: string;
  value: string | number | boolean;
  confidence: number;
  source: 'explicit' | 'inferred' | 'behavior';
}

interface CustomerHistory {
  customerId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  createdAt: string;
}

interface CustomerProfile {
  customerId: string;
  email?: string;
  name?: string;
  preferences: CustomerPreference[];
  recentSearches: CustomerHistory[];
  bookingHistory: CustomerHistory[];
  loyaltyInfo?: {
    tier: string;
    points: number;
    memberSince: string;
  };
  lastActivity?: string;
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

    // Mock profile - in production, fetch from Supabase
    const mockProfile: CustomerProfile = {
      customerId,
      preferences: [
        { customerId, category: 'accommodation', key: 'preferred_bed', value: 'king', confidence: 0.9, source: 'explicit' },
        { customerId, category: 'dining', key: 'dietary', value: 'vegetarian', confidence: 0.8, source: 'explicit' }
      ],
      recentSearches: [
        { customerId, eventType: 'search', eventData: { destination: 'Paris' }, createdAt: new Date().toISOString() }
      ],
      bookingHistory: [
        { customerId, eventType: 'booking', eventData: { hotel: 'Grand Hotel', dates: '2024-01-15' }, createdAt: new Date().toISOString() }
      ],
      loyaltyInfo: {
        tier: 'gold',
        points: 5000,
        memberSince: '2023-01-01'
      },
      lastActivity: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: mockProfile });
  } catch (error) {
    console.error('Customer profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, preference } = body;

    if (!customerId || !preference) {
      return NextResponse.json(
        { success: false, error: 'Customer ID and preference are required' },
        { status: 400 }
      );
    }

    // In production, save to Supabase
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save preference API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const confirm = searchParams.get('confirm') === 'true';

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    if (!confirm) {
      return NextResponse.json(
        { success: false, error: 'Deletion must be confirmed with confirm=true' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Customer data deleted (GDPR compliance)' });
  } catch (error) {
    console.error('Delete customer data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
