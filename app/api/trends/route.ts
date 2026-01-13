import { NextRequest, NextResponse } from 'next/server';
import {
  getDestinationTrends,
  getTravelTrends,
  getTopTrendingDestinations,
} from '@/lib/services/google-trends-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'destination') {
      const destination = searchParams.get('destination');
      const country = searchParams.get('country') || 'IL';

      if (!destination) {
        return NextResponse.json(
          { error: 'Destination parameter is required' },
          { status: 400 }
        );
      }

      const trends = await getDestinationTrends(destination, country);

      return NextResponse.json({
        success: true,
        data: trends,
      });
    }

    if (action === 'travel') {
      const keywordsParam = searchParams.get('keywords');
      const region = searchParams.get('region') || 'IL';

      if (!keywordsParam) {
        return NextResponse.json(
          { error: 'Keywords parameter is required' },
          { status: 400 }
        );
      }

      const keywords = keywordsParam.split(',').map(k => k.trim());
      const trends = await getTravelTrends(keywords, region);

      return NextResponse.json({
        success: true,
        data: trends,
      });
    }

    if (action === 'top') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const destinations = await getTopTrendingDestinations(limit);

      return NextResponse.json({
        success: true,
        data: destinations,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: destination, travel, or top' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API Trends] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, destination, country, keywords, region, limit } = body;

    if (action === 'destination') {
      if (!destination) {
        return NextResponse.json(
          { error: 'Destination is required' },
          { status: 400 }
        );
      }

      const trends = await getDestinationTrends(destination, country || 'IL');

      return NextResponse.json({
        success: true,
        data: trends,
      });
    }

    if (action === 'travel') {
      if (!keywords || !Array.isArray(keywords)) {
        return NextResponse.json(
          { error: 'Keywords array is required' },
          { status: 400 }
        );
      }

      const trends = await getTravelTrends(keywords, region || 'IL');

      return NextResponse.json({
        success: true,
        data: trends,
      });
    }

    if (action === 'top') {
      const destinations = await getTopTrendingDestinations(limit || 10);

      return NextResponse.json({
        success: true,
        data: destinations,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: destination, travel, or top' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API Trends] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends data' },
      { status: 500 }
    );
  }
}
