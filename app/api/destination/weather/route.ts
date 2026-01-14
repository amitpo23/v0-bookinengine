/**
 * Destination Weather API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import type { WeatherInfo } from '@/lib/services/destination-info-service';

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

    // Mock weather data - in production, use weather API
    const mockWeather: WeatherInfo = {
      current: {
        temperature: 22,
        condition: 'Sunny',
        humidity: 55
      },
      forecast: checkIn ? [
        { date: checkIn, high: 25, low: 18, condition: 'Sunny' },
        { date: checkOut || checkIn, high: 24, low: 17, condition: 'Partly Cloudy' }
      ] : undefined,
      seasonal: 'Pleasant weather with mild temperatures'
    };

    return NextResponse.json({ success: true, data: mockWeather });
  } catch (error) {
    console.error('Weather API error:', error);
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

    const mockWeather: WeatherInfo = {
      current: { temperature: 23, condition: 'Clear', humidity: 50 },
      forecast: checkIn ? [
        { date: checkIn, high: 26, low: 19, condition: 'Sunny' }
      ] : undefined
    };

    return NextResponse.json({ success: true, data: mockWeather });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
