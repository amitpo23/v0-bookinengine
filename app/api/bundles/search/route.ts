/**
 * Travel Bundle Search API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import type { BundleSearchParams, BundleSearchResult } from '@/lib/services/travel-bundle-service';

export async function POST(request: NextRequest) {
  try {
    const params: BundleSearchParams = await request.json();

    if (!params.origin || !params.destination || !params.checkIn || !params.checkOut || !params.adults) {
      return NextResponse.json(
        { success: false, error: 'Origin, destination, dates, and adults are required' },
        { status: 400 }
      );
    }

    // Mock bundle search results - in production, integrate with actual flight/hotel APIs
    const mockBundles: BundleSearchResult = {
      bundles: [
        {
          id: `bundle-${Date.now()}-1`,
          type: 'flight_hotel',
          outboundFlight: {
            airline: 'El Al',
            flightNumber: 'LY123',
            origin: params.origin,
            originAirport: `${params.origin} Int'l`,
            destination: params.destination,
            destinationAirport: `${params.destination} Airport`,
            departureTime: `${params.checkIn}T08:00:00Z`,
            arrivalTime: `${params.checkIn}T12:00:00Z`,
            duration: '4h 00m',
            stops: 0,
            class: params.class || 'economy',
            baggage: { cabin: '7kg', checked: '23kg' },
            price: 450,
            currency: 'USD'
          },
          returnFlight: {
            airline: 'El Al',
            flightNumber: 'LY124',
            origin: params.destination,
            originAirport: `${params.destination} Airport`,
            destination: params.origin,
            destinationAirport: `${params.origin} Int'l`,
            departureTime: `${params.checkOut}T18:00:00Z`,
            arrivalTime: `${params.checkOut}T22:00:00Z`,
            duration: '4h 00m',
            stops: 0,
            class: params.class || 'economy',
            baggage: { cabin: '7kg', checked: '23kg' },
            price: 450,
            currency: 'USD'
          },
          hotel: {
            hotelId: 'hotel-123',
            hotelName: 'Grand Plaza Hotel',
            stars: 4,
            roomType: 'Deluxe Room',
            boardType: 'breakfast',
            price: 800,
            currency: 'USD'
          },
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          nights: Math.ceil((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
          totalPrice: 1500,
          originalPrice: 1700,
          savings: 200,
          savingsPercentage: 11.8,
          currency: 'USD',
          pricePerPerson: 750,
          provider: 'Bundle Express',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          seatsRemaining: 5
        },
        {
          id: `bundle-${Date.now()}-2`,
          type: 'flight_hotel_transfer',
          outboundFlight: {
            airline: 'British Airways',
            flightNumber: 'BA456',
            origin: params.origin,
            originAirport: `${params.origin} Int'l`,
            destination: params.destination,
            destinationAirport: `${params.destination} Airport`,
            departureTime: `${params.checkIn}T10:00:00Z`,
            arrivalTime: `${params.checkIn}T15:00:00Z`,
            duration: '5h 00m',
            stops: 1,
            stopLocations: ['London'],
            class: params.class || 'economy',
            baggage: { cabin: '7kg', checked: '23kg' },
            price: 380,
            currency: 'USD'
          },
          returnFlight: {
            airline: 'British Airways',
            flightNumber: 'BA457',
            origin: params.destination,
            originAirport: `${params.destination} Airport`,
            destination: params.origin,
            destinationAirport: `${params.origin} Int'l`,
            departureTime: `${params.checkOut}T16:00:00Z`,
            arrivalTime: `${params.checkOut}T22:00:00Z`,
            duration: '6h 00m',
            stops: 1,
            stopLocations: ['London'],
            class: params.class || 'economy',
            baggage: { cabin: '7kg', checked: '23kg' },
            price: 380,
            currency: 'USD'
          },
          hotel: {
            hotelId: 'hotel-456',
            hotelName: 'City Center Suites',
            stars: 5,
            roomType: 'Executive Suite',
            boardType: 'half_board',
            price: 1200,
            currency: 'USD'
          },
          transfer: {
            type: 'private',
            provider: 'VIP Transfers',
            price: 120,
            currency: 'USD',
            included: true
          },
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          nights: Math.ceil((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
          totalPrice: 1950,
          originalPrice: 2200,
          savings: 250,
          savingsPercentage: 11.4,
          currency: 'USD',
          pricePerPerson: 975,
          provider: 'Luxury Packages',
          validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          seatsRemaining: 3
        }
      ],
      totalResults: 2,
      filters: {
        airlines: ['El Al', 'British Airways'],
        hotelStars: [4, 5],
        priceRange: { min: 1500, max: 1950 },
        boardTypes: ['breakfast', 'half_board']
      }
    };

    // Set best/cheapest/fastest
    mockBundles.cheapest = mockBundles.bundles[0];
    mockBundles.bestDeal = mockBundles.bundles[1]; // More savings
    mockBundles.fastest = mockBundles.bundles[0]; // Direct flight

    return NextResponse.json({ success: true, data: mockBundles });
  } catch (error) {
    console.error('Bundle search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
