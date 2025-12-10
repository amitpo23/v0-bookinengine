import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('search') || '';
    
    const response = await fetch('https://static-data.innstant-servers.com/hotels', {
      headers: {
        'Authorization': `Bearer ${process.env.STATIC_DATA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Static Data API error: ${response.status}`);
    }
    
    const data = await response.json();
    const hotels = Array.isArray(data) ? data : (data.hotels || data.data || []);
    
    // Filter Isrotel hotels
    let isrotelHotels = hotels.filter((hotel: any) => 
      hotel.name?.toLowerCase().includes('isrotel') ||
      hotel.name?.toLowerCase().includes('port') ||
      hotel.name?.toLowerCase().includes('royal') ||
      hotel.name?.toLowerCase().includes('sea tower') ||
      hotel.name?.toLowerCase().includes('gymnasia') ||
      hotel.name?.toLowerCase().includes('alberto') ||
      hotel.chain?.toLowerCase() === 'isrotel'
    );
    
    // Additional search filter
    if (searchQuery) {
      isrotelHotels = isrotelHotels.filter((hotel: any) =>
        hotel.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    console.log(`[Static Data] Found ${isrotelHotels.length} Isrotel hotels`);
    
    return NextResponse.json({
      success: true,
      count: isrotelHotels.length,
      hotels: isrotelHotels
    });
    
  } catch (error: any) {
    console.error('[Static Data] Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
