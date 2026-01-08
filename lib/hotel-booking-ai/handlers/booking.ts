/**
 * Hotel Booking AI - Booking Handler
 * Handles hotel search, prebook, booking, and cancellation operations
 */

import type { ConversationContext, ToolResult } from '../types';
import { registerToolHandler } from '../engine-manager';

// ========================================
// MEDICI API INTEGRATION
// ========================================

const MEDICI_API_URL = process.env.MEDICI_API_URL || 'https://api.medici.com';
const MEDICI_API_KEY = process.env.MEDICI_API_KEY;

interface MediciApiOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  token?: string;
}

async function callMediciApi(options: MediciApiOptions): Promise<any> {
  const { endpoint, method, body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (MEDICI_API_KEY) {
    headers['x-api-key'] = MEDICI_API_KEY;
  }

  try {
    const response = await fetch(`${MEDICI_API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Medici API error:', error);
    throw error;
  }
}

// ========================================
// HOTEL SEARCH HANDLER
// ========================================

interface SearchHotelsParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children?: number;
  currency?: string;
  filters?: {
    starRating?: number[];
    priceRange?: { min: number; max: number };
    amenities?: string[];
    propertyTypes?: string[];
  };
}

async function handleSearchHotels(
  params: SearchHotelsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const searchParams = {
      destination: params.destination,
      checkin: params.checkIn,
      checkout: params.checkOut,
      rooms: params.rooms,
      adults: params.adults,
      children: params.children || 0,
      currency: params.currency || 'USD',
      ...params.filters
    };

    const result = await callMediciApi({
      endpoint: '/v1/hotels/search',
      method: 'POST',
      body: searchParams
    });

    // Store search ID in context for later use
    if (result.searchId) {
      context.metadata.lastSearchId = result.searchId;
    }

    return {
      success: true,
      data: {
        searchId: result.searchId,
        totalResults: result.hotels?.length || 0,
        hotels: result.hotels?.slice(0, 10).map((hotel: any) => ({
          hotelId: hotel.hotelId,
          name: hotel.name,
          address: hotel.address,
          starRating: hotel.starRating,
          rating: hotel.rating,
          reviewCount: hotel.reviewCount,
          mainImage: hotel.images?.[0],
          lowestPrice: hotel.lowestPrice,
          currency: hotel.currency,
          amenities: hotel.amenities?.slice(0, 5),
          distanceFromCenter: hotel.distanceFromCenter
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to search hotels'
    };
  }
}

registerToolHandler('search_hotels', handleSearchHotels as any);

// ========================================
// DESTINATION SEARCH HANDLER
// ========================================

interface SearchDestinationsParams {
  query: string;
  limit?: number;
}

async function handleSearchDestinations(
  params: SearchDestinationsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const result = await callMediciApi({
      endpoint: `/v1/destinations/search?q=${encodeURIComponent(params.query)}&limit=${params.limit || 10}`,
      method: 'GET'
    });

    return {
      success: true,
      data: {
        destinations: result.destinations?.map((dest: any) => ({
          id: dest.id,
          name: dest.name,
          type: dest.type,
          country: dest.country,
          region: dest.region,
          coordinates: dest.coordinates
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to search destinations'
    };
  }
}

registerToolHandler('search_destinations', handleSearchDestinations as any);

// ========================================
// PREBOOK HANDLER
// ========================================

interface PrebookParams {
  hotelId: string;
  roomId: string;
  rateId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children?: number;
    childAges?: number[];
  };
}

async function handlePrebook(
  params: PrebookParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const result = await callMediciApi({
      endpoint: '/v1/booking/prebook',
      method: 'POST',
      body: {
        hotelId: params.hotelId,
        roomId: params.roomId,
        rateId: params.rateId,
        checkin: params.checkIn,
        checkout: params.checkOut,
        guests: params.guests
      }
    });

    // Store prebook token in context
    if (result.prebookToken) {
      context.metadata.prebookToken = result.prebookToken;
      context.metadata.prebookExpiry = result.expiresAt;
    }

    return {
      success: true,
      data: {
        prebookToken: result.prebookToken,
        expiresAt: result.expiresAt,
        totalPrice: result.totalPrice,
        currency: result.currency,
        cancellationPolicy: result.cancellationPolicy,
        roomDetails: {
          name: result.room?.name,
          bedType: result.room?.bedType,
          maxOccupancy: result.room?.maxOccupancy,
          amenities: result.room?.amenities
        },
        rateDetails: {
          name: result.rate?.name,
          mealPlan: result.rate?.mealPlan,
          refundable: result.rate?.refundable
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to prebook room'
    };
  }
}

registerToolHandler('prebook_room', handlePrebook as any);

// ========================================
// BOOKING HANDLER
// ========================================

interface BookingParams {
  prebookToken: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality?: string;
    specialRequests?: string;
  };
  payment?: {
    method: string;
    cardToken?: string;
  };
}

async function handleBooking(
  params: BookingParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // Use stored prebook token if not provided
    const prebookToken = params.prebookToken || context.metadata.prebookToken;

    if (!prebookToken) {
      return {
        success: false,
        data: null,
        error: 'No prebook token available. Please prebook a room first.'
      };
    }

    const result = await callMediciApi({
      endpoint: '/v1/booking/book',
      method: 'POST',
      body: {
        prebookToken,
        guest: params.guest,
        payment: params.payment
      }
    });

    // Store booking info in context
    context.metadata.lastBookingId = result.bookingId;
    context.metadata.lastConfirmationNumber = result.confirmationNumber;

    return {
      success: true,
      data: {
        bookingId: result.bookingId,
        confirmationNumber: result.confirmationNumber,
        status: result.status,
        hotelName: result.hotel?.name,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        roomType: result.room?.name,
        totalPrice: result.totalPrice,
        currency: result.currency,
        guestName: `${params.guest.firstName} ${params.guest.lastName}`,
        confirmationEmail: params.guest.email
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to complete booking'
    };
  }
}

registerToolHandler('complete_booking', handleBooking as any);

// ========================================
// CANCELLATION HANDLER
// ========================================

interface CancellationParams {
  bookingId?: string;
  confirmationNumber?: string;
  email?: string;
  reason?: string;
}

async function handleCancellation(
  params: CancellationParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // Use stored booking info if not provided
    const bookingId = params.bookingId || context.metadata.lastBookingId;
    const confirmationNumber = params.confirmationNumber || context.metadata.lastConfirmationNumber;

    if (!bookingId && !confirmationNumber) {
      return {
        success: false,
        data: null,
        error: 'Please provide a booking ID or confirmation number.'
      };
    }

    const result = await callMediciApi({
      endpoint: '/v1/booking/cancel',
      method: 'POST',
      body: {
        bookingId,
        confirmationNumber,
        email: params.email,
        reason: params.reason
      }
    });

    return {
      success: true,
      data: {
        cancellationId: result.cancellationId,
        bookingId: result.bookingId,
        confirmationNumber: result.confirmationNumber,
        status: result.status,
        refundAmount: result.refundAmount,
        refundCurrency: result.refundCurrency,
        refundStatus: result.refundStatus,
        cancellationFee: result.cancellationFee,
        message: result.message || 'Booking successfully cancelled'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to cancel booking'
    };
  }
}

registerToolHandler('cancel_booking', handleCancellation);

// ========================================
// BOOKING LOOKUP HANDLER
// ========================================

interface BookingLookupParams {
  bookingId?: string;
  confirmationNumber?: string;
  email?: string;
}

async function handleBookingLookup(
  params: BookingLookupParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const queryParams = new URLSearchParams();
    if (params.bookingId) queryParams.set('bookingId', params.bookingId);
    if (params.confirmationNumber) queryParams.set('confirmationNumber', params.confirmationNumber);
    if (params.email) queryParams.set('email', params.email);

    const result = await callMediciApi({
      endpoint: `/v1/booking/lookup?${queryParams.toString()}`,
      method: 'GET'
    });

    return {
      success: true,
      data: {
        bookingId: result.bookingId,
        confirmationNumber: result.confirmationNumber,
        status: result.status,
        hotelName: result.hotel?.name,
        hotelAddress: result.hotel?.address,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        roomType: result.room?.name,
        guestName: result.guest?.name,
        totalPrice: result.totalPrice,
        currency: result.currency,
        cancellationPolicy: result.cancellationPolicy,
        canCancel: result.canCancel,
        canModify: result.canModify
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to find booking'
    };
  }
}

registerToolHandler('lookup_booking', handleBookingLookup);

// ========================================
// HOTEL DETAILS HANDLER
// ========================================

interface HotelDetailsParams {
  hotelId: string;
}

async function handleHotelDetails(
  params: HotelDetailsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const result = await callMediciApi({
      endpoint: `/v1/hotels/${params.hotelId}`,
      method: 'GET'
    });

    return {
      success: true,
      data: {
        hotelId: result.hotelId,
        name: result.name,
        description: result.description,
        address: result.address,
        city: result.city,
        country: result.country,
        coordinates: result.coordinates,
        starRating: result.starRating,
        rating: result.rating,
        reviewCount: result.reviewCount,
        images: result.images,
        amenities: result.amenities,
        policies: {
          checkIn: result.policies?.checkIn,
          checkOut: result.policies?.checkOut,
          cancellation: result.policies?.cancellation,
          children: result.policies?.children,
          pets: result.policies?.pets
        },
        contact: result.contact
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get hotel details'
    };
  }
}

registerToolHandler('get_hotel_details', handleHotelDetails as any);

export {
  handleSearchHotels,
  handleSearchDestinations,
  handlePrebook,
  handleBooking,
  handleCancellation,
  handleBookingLookup,
  handleHotelDetails
};
