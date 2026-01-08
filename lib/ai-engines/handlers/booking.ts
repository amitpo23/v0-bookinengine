/**
 * Booking Handlers
 * Tool handlers for hotel search, prebook, and booking operations
 * Based on: ai-travel-agent-platform Medici API integration
 */

import type { ConversationContext } from '../types';

const MEDICI_API_URL = process.env.MEDICI_API_URL || 'https://api.medicihotels.com';
const MEDICI_API_KEY = process.env.MEDICI_API_KEY || '';

// ========================================
// HOTEL SEARCH
// ========================================

interface SearchHotelsParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  stars?: number[];
  maxPrice?: number;
  amenities?: string[];
}

interface HotelSearchResult {
  hotelId: string;
  name: string;
  stars: number;
  address: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  rooms: RoomOption[];
  amenities: string[];
  distance?: string;
}

interface RoomOption {
  roomCode: string;
  roomName: string;
  boardType: string;
  price: number;
  originalPrice?: number;
  currency: string;
  cancellationPolicy: string;
  maxOccupancy: number;
  available: number;
}

export async function searchHotels(
  params: SearchHotelsParams,
  context: ConversationContext
): Promise<{ hotels: HotelSearchResult[]; searchId: string; totalResults: number }> {
  console.log(`[BookingHandler] Searching hotels:`, params);

  try {
    // Build search request for Medici API
    const searchRequest = {
      destination: params.destination,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      occupancies: [{
        adults: params.adults,
        children: params.children?.map(age => ({ age })) || []
      }],
      filters: {
        stars: params.stars,
        maxPrice: params.maxPrice,
        amenities: params.amenities
      }
    };

    // In production, call actual Medici API
    // const response = await fetch(`${MEDICI_API_URL}/search`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${MEDICI_API_KEY}`
    //   },
    //   body: JSON.stringify(searchRequest)
    // });

    // For now, return mock data
    const mockResults: HotelSearchResult[] = [
      {
        hotelId: 'htl-dubai-001',
        name: 'Burj Al Arab Jumeirah',
        stars: 5,
        address: 'Jumeirah Beach Road, Dubai, UAE',
        imageUrl: '/hotels/burj-al-arab.jpg',
        rating: 9.4,
        reviewCount: 12543,
        amenities: ['Spa', 'Pool', 'WiFi', 'Beach Access', 'Restaurant', 'Butler Service'],
        rooms: [
          {
            roomCode: 'room-001',
            roomName: 'Deluxe Suite',
            boardType: 'Breakfast Included',
            price: 2500,
            originalPrice: 2800,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 24h before',
            maxOccupancy: 2,
            available: 3
          },
          {
            roomCode: 'room-002',
            roomName: 'Panoramic Suite',
            boardType: 'Half Board',
            price: 3800,
            currency: 'USD',
            cancellationPolicy: 'Non-refundable',
            maxOccupancy: 3,
            available: 1
          }
        ]
      },
      {
        hotelId: 'htl-dubai-002',
        name: 'Atlantis The Palm',
        stars: 5,
        address: 'Crescent Road, The Palm, Dubai, UAE',
        imageUrl: '/hotels/atlantis.jpg',
        rating: 8.9,
        reviewCount: 28912,
        amenities: ['Waterpark', 'Pool', 'WiFi', 'Beach', 'Aquarium', 'Kids Club'],
        rooms: [
          {
            roomCode: 'room-003',
            roomName: 'Palm Beach Room',
            boardType: 'Room Only',
            price: 450,
            originalPrice: 520,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 48h before',
            maxOccupancy: 2,
            available: 8
          }
        ]
      },
      {
        hotelId: 'htl-dubai-003',
        name: 'Four Seasons Resort Dubai',
        stars: 5,
        address: 'Jumeirah Beach, Dubai, UAE',
        imageUrl: '/hotels/four-seasons.jpg',
        rating: 9.2,
        reviewCount: 8234,
        amenities: ['Spa', 'Pool', 'WiFi', 'Beach', 'Golf', 'Tennis'],
        rooms: [
          {
            roomCode: 'room-004',
            roomName: 'Premier Room',
            boardType: 'Breakfast Included',
            price: 680,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 72h before',
            maxOccupancy: 2,
            available: 5
          }
        ]
      }
    ];

    // Store search context
    if (context) {
      context.bookingData = {
        ...context.bookingData,
        lastSearch: {
          params,
          timestamp: new Date(),
          results: mockResults.map(h => ({ hotelId: h.hotelId, name: h.name }))
        }
      };
    }

    return {
      hotels: mockResults,
      searchId: `search-${Date.now()}`,
      totalResults: mockResults.length
    };
  } catch (error: any) {
    console.error(`[BookingHandler] Search error:`, error);
    throw new Error(`Hotel search failed: ${error.message}`);
  }
}

// ========================================
// PREBOOK ROOM
// ========================================

interface PrebookParams {
  roomCode: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children?: { age: number }[];
  };
}

interface PrebookResult {
  success: boolean;
  token: string;
  expiresAt: Date;
  pricing: {
    roomRate: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
  };
  cancellationPolicy: {
    freeCancellationUntil?: Date;
    penalties: { from: Date; amount: number }[];
  };
  hotelDetails: {
    hotelId: string;
    name: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
  };
}

export async function prebookRoom(
  params: PrebookParams,
  context: ConversationContext
): Promise<PrebookResult> {
  console.log(`[BookingHandler] Pre-booking room:`, params);

  try {
    // Calculate nights
    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Mock prebook response
    const result: PrebookResult = {
      success: true,
      token: `prebook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      pricing: {
        roomRate: 680 * nights,
        taxes: 68 * nights,
        fees: 25,
        total: (680 + 68) * nights + 25,
        currency: 'USD'
      },
      cancellationPolicy: {
        freeCancellationUntil: new Date(checkIn.getTime() - 72 * 60 * 60 * 1000),
        penalties: [
          { from: new Date(checkIn.getTime() - 72 * 60 * 60 * 1000), amount: 680 },
          { from: new Date(checkIn.getTime() - 24 * 60 * 60 * 1000), amount: 680 * nights }
        ]
      },
      hotelDetails: {
        hotelId: params.hotelId,
        name: 'Four Seasons Resort Dubai',
        roomName: 'Premier Room',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nights
      }
    };

    // Store prebook context
    if (context) {
      context.bookingData = {
        ...context.bookingData,
        prebook: {
          token: result.token,
          expiresAt: result.expiresAt,
          hotelId: params.hotelId,
          roomCode: params.roomCode,
          pricing: result.pricing
        }
      };
    }

    return result;
  } catch (error: any) {
    console.error(`[BookingHandler] Prebook error:`, error);
    throw new Error(`Pre-booking failed: ${error.message}`);
  }
}

// ========================================
// BOOK ROOM
// ========================================

interface BookRoomParams {
  token: string;
  roomCode: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
  };
  guests: Array<{
    firstName: string;
    lastName: string;
    isLeadGuest?: boolean;
  }>;
  specialRequests?: string;
  paymentMethod?: string;
}

interface BookingResult {
  success: boolean;
  bookingId: string;
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'failed';
  hotelConfirmation?: string;
  totalPaid: number;
  currency: string;
  bookingDetails: {
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: string[];
    specialRequests?: string;
  };
  paymentDetails: {
    method: string;
    last4?: string;
    transactionId: string;
  };
  cancellationPolicy: string;
}

export async function bookRoom(
  params: BookRoomParams,
  context: ConversationContext
): Promise<BookingResult> {
  console.log(`[BookingHandler] Completing booking:`, params);

  try {
    // Validate prebook token
    if (!context?.bookingData?.prebook?.token || context.bookingData.prebook.token !== params.token) {
      throw new Error('Invalid or expired prebook token');
    }

    // Check token expiration
    if (new Date() > new Date(context.bookingData.prebook.expiresAt)) {
      throw new Error('Prebook token has expired. Please search again.');
    }

    // Generate booking confirmation
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const confirmationNumber = `CNF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    const result: BookingResult = {
      success: true,
      bookingId,
      confirmationNumber,
      status: 'confirmed',
      hotelConfirmation: `HC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      totalPaid: context.bookingData.prebook.pricing.total,
      currency: context.bookingData.prebook.pricing.currency,
      bookingDetails: {
        hotelName: 'Four Seasons Resort Dubai',
        roomName: 'Premier Room',
        checkIn: context.bookingData.prebook.checkIn || '2024-03-15',
        checkOut: context.bookingData.prebook.checkOut || '2024-03-18',
        guests: params.guests.map(g => `${g.firstName} ${g.lastName}`),
        specialRequests: params.specialRequests
      },
      paymentDetails: {
        method: params.paymentMethod || 'card',
        last4: '4242',
        transactionId: `txn-${Date.now()}`
      },
      cancellationPolicy: 'Free cancellation until 72 hours before check-in'
    };

    // Update context with booking result
    if (context) {
      context.bookingData = {
        ...context.bookingData,
        confirmedBooking: {
          bookingId,
          confirmationNumber,
          status: 'confirmed',
          bookedAt: new Date()
        }
      };
    }

    return result;
  } catch (error: any) {
    console.error(`[BookingHandler] Booking error:`, error);
    throw new Error(`Booking failed: ${error.message}`);
  }
}

// ========================================
// CANCEL BOOKING
// ========================================

interface CancelBookingParams {
  bookingId: string;
  reason?: string;
  force?: boolean;
}

interface CancellationResult {
  success: boolean;
  cancellationId: string;
  refundAmount: number;
  refundCurrency: string;
  penaltyApplied: number;
  refundMethod: string;
  refundEta: string;
  message: string;
}

export async function cancelBooking(
  params: CancelBookingParams,
  context: ConversationContext
): Promise<CancellationResult> {
  console.log(`[BookingHandler] Cancelling booking:`, params);

  try {
    // Mock cancellation - check if within free cancellation period
    const isWithinFreePeriod = Math.random() > 0.3; // 70% chance it's within free period

    const originalAmount = 2244; // Example amount
    const penaltyAmount = isWithinFreePeriod ? 0 : 680;
    const refundAmount = originalAmount - penaltyAmount;

    const result: CancellationResult = {
      success: true,
      cancellationId: `CAN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      refundAmount,
      refundCurrency: 'USD',
      penaltyApplied: penaltyAmount,
      refundMethod: 'Original payment method',
      refundEta: '5-7 business days',
      message: isWithinFreePeriod 
        ? 'Your booking has been cancelled with a full refund.'
        : `Your booking has been cancelled. A cancellation fee of $${penaltyAmount} was applied.`
    };

    return result;
  } catch (error: any) {
    console.error(`[BookingHandler] Cancellation error:`, error);
    throw new Error(`Cancellation failed: ${error.message}`);
  }
}

// ========================================
// GET CANCELLATION POLICY
// ========================================

interface GetCancellationPolicyParams {
  bookingId: string;
}

interface CancellationPolicyResult {
  bookingId: string;
  hotelName: string;
  checkIn: string;
  currentStatus: string;
  policy: {
    freeCancellationUntil?: string;
    isWithinFreePeriod: boolean;
    penalties: Array<{
      fromDate: string;
      amount: number;
      currency: string;
      description: string;
    }>;
  };
  recommendation: string;
}

export async function getCancellationPolicy(
  params: GetCancellationPolicyParams,
  context: ConversationContext
): Promise<CancellationPolicyResult> {
  console.log(`[BookingHandler] Getting cancellation policy:`, params);

  const checkIn = new Date('2024-03-15');
  const freeCancellationDate = new Date(checkIn.getTime() - 72 * 60 * 60 * 1000);
  const now = new Date();
  const isWithinFreePeriod = now < freeCancellationDate;

  return {
    bookingId: params.bookingId,
    hotelName: 'Four Seasons Resort Dubai',
    checkIn: '2024-03-15',
    currentStatus: 'confirmed',
    policy: {
      freeCancellationUntil: freeCancellationDate.toISOString(),
      isWithinFreePeriod,
      penalties: [
        {
          fromDate: freeCancellationDate.toISOString(),
          amount: 680,
          currency: 'USD',
          description: 'First night penalty (72-24 hours before check-in)'
        },
        {
          fromDate: new Date(checkIn.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          amount: 2244,
          currency: 'USD',
          description: 'Full booking amount (less than 24 hours)'
        }
      ]
    },
    recommendation: isWithinFreePeriod
      ? 'You can cancel now for a full refund!'
      : 'Cancellation will incur a penalty. Consider rescheduling instead.'
  };
}

// Export all handlers
export const bookingHandlers = {
  searchHotels,
  prebookRoom,
  bookRoom,
  cancelBooking,
  getCancellationPolicy
};
