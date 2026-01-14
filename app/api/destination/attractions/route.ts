/**
 * Destination Attractions API Route
 */

import { NextRequest, NextResponse } from 'next/server';

type AttractionType = 'landmark' | 'museum' | 'beach' | 'restaurant' | 'shopping' | 'nature' | 'entertainment';

interface AttractionInfo {
  name: string;
  type: AttractionType;
  rating?: number;
  description?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') as AttractionType | null;

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      );
    }

    // Mock attractions data
    const mockAttractions: AttractionInfo[] = [
      { name: 'Historic Castle', type: 'landmark' as const, rating: 4.8, description: 'Ancient fortress with stunning views' },
      { name: 'National Museum', type: 'museum' as const, rating: 4.6, description: 'Art and history collections' },
      { name: 'Central Beach', type: 'beach' as const, rating: 4.5, description: 'Beautiful sandy beach' },
      { name: 'Old Town Square', type: 'landmark' as const, rating: 4.7, description: 'Historic city center' },
      { name: 'Botanical Garden', type: 'nature' as const, rating: 4.4, description: 'Diverse plant collections' }
    ].slice(0, limit);

    const filtered = type 
      ? mockAttractions.filter(a => a.type === type)
      : mockAttractions;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Attractions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { destination, type } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      );
    }

    const attractionType: AttractionType = type || 'landmark';
    const mockAttractions: AttractionInfo[] = [
      { name: 'Top Attraction', type: attractionType, rating: 4.9 }
    ];

    return NextResponse.json({ success: true, data: mockAttractions });
  } catch (error) {
    console.error('Attractions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
