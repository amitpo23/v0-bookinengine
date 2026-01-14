/**
 * Destination Info API Routes
 * Real-time destination intelligence using Tavily
 */

import { NextRequest, NextResponse } from 'next/server';
import type { DestinationInfo } from '@/lib/services/destination-info-service';

// In production, integrate with Tavily API
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

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

    // Mock response - in production, call Tavily API
    const mockData: DestinationInfo = {
      destination,
      country: 'Unknown',
      weather: {
        current: { temperature: 22, condition: 'Sunny', humidity: 60 },
        seasonal: 'Pleasant weather expected'
      },
      events: [
        { name: 'Local Festival', type: 'festival', description: 'Annual celebration' }
      ],
      attractions: [
        { name: 'City Center', type: 'landmark', rating: 4.5, description: 'Historic district' }
      ],
      travelTips: ['Book accommodation early', 'Try local cuisine'],
      bestTimeToVisit: 'Spring and Fall',
      safety: { level: 'safe', tips: ['Standard travel precautions'] },
      localInfo: { language: 'English', currency: 'USD', timezone: 'UTC' },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: mockData });
  } catch (error) {
    console.error('Destination info API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, checkIn, checkOut, includeWeather, includeEvents, includeAttractions } = body;

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      );
    }

    // In production, call Tavily API for real data
    const mockData: DestinationInfo = {
      destination,
      country: 'Detected Country',
      weather: includeWeather !== false ? {
        current: { temperature: 24, condition: 'Partly Cloudy', humidity: 55 },
        forecast: checkIn ? [
          { date: checkIn, high: 26, low: 18, condition: 'Sunny' }
        ] : undefined
      } : undefined,
      events: includeEvents !== false ? [
        { name: 'Cultural Event', type: 'exhibition', date: checkIn }
      ] : undefined,
      attractions: includeAttractions !== false ? [
        { name: 'Main Attraction', type: 'landmark', rating: 4.8 }
      ] : undefined,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: mockData });
  } catch (error) {
    console.error('Destination info API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
