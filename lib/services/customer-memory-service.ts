/**
 * Customer Memory Service
 * Long-term customer preferences and history storage
 * Enables personalized recommendations and experiences
 */

import { supabase } from '@/lib/supabase';

// Types
export interface CustomerPreference {
  id?: string;
  customerId: string;
  category: PreferenceCategory;
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  confidence: number; // 0-1, how confident we are in this preference
  source: 'explicit' | 'inferred' | 'behavior';
  createdAt?: string;
  updatedAt?: string;
}

export type PreferenceCategory = 
  | 'accommodation' // bed type, room type, floor preference
  | 'amenities' // pool, gym, spa, wifi
  | 'dining' // breakfast included, dietary restrictions
  | 'location' // city center, beach, quiet
  | 'price' // budget range, value preference
  | 'travel_style' // business, leisure, family, romantic
  | 'destinations' // favorite cities, countries
  | 'communication' // language, contact preference
  | 'loyalty' // points, tier status
  | 'other';

export interface CustomerHistory {
  id?: string;
  customerId: string;
  eventType: HistoryEventType;
  eventData: Record<string, unknown>;
  timestamp?: string;
}

export type HistoryEventType =
  | 'search'
  | 'view_hotel'
  | 'prebook'
  | 'booking'
  | 'cancellation'
  | 'review'
  | 'support_ticket'
  | 'preference_update';

export interface CustomerProfile {
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

// In-memory cache for quick access
const profileCache = new Map<string, { profile: CustomerProfile; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get or create customer profile
 */
export async function getCustomerProfile(customerId: string): Promise<CustomerProfile | null> {
  // Check cache first
  const cached = profileCache.get(customerId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.profile;
  }

  try {
    const response = await fetch('/api/customer/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, action: 'get' }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (result.success && result.data) {
      // Update cache
      profileCache.set(customerId, {
        profile: result.data,
        timestamp: Date.now(),
      });
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return null;
  }
}

/**
 * Save customer preference
 */
export async function savePreference(
  customerId: string,
  preference: Omit<CustomerPreference, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>
): Promise<boolean> {
  try {
    const response = await fetch('/api/customer/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        preference,
      }),
    });

    if (response.ok) {
      // Invalidate cache
      profileCache.delete(customerId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving preference:', error);
    return false;
  }
}

/**
 * Get preferences by category
 */
export async function getPreferencesByCategory(
  customerId: string,
  category: PreferenceCategory
): Promise<CustomerPreference[]> {
  const profile = await getCustomerProfile(customerId);
  if (!profile) return [];
  
  return profile.preferences.filter(p => p.category === category);
}

/**
 * Record customer event/history
 */
export async function recordCustomerEvent(
  customerId: string,
  eventType: HistoryEventType,
  eventData: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch('/api/customer/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        eventType,
        eventData,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error recording customer event:', error);
    return false;
  }
}

/**
 * Infer preferences from booking history
 */
export async function inferPreferencesFromHistory(
  customerId: string
): Promise<CustomerPreference[]> {
  try {
    const response = await fetch('/api/customer/infer-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) return [];

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error inferring preferences:', error);
    return [];
  }
}

/**
 * Get personalized recommendations based on preferences
 */
export async function getPersonalizedRecommendations(
  customerId: string,
  context?: {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    budget?: number;
  }
): Promise<{
  hotels?: unknown[];
  destinations?: string[];
  tips?: string[];
}> {
  try {
    const response = await fetch('/api/customer/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, context }),
    });

    if (!response.ok) return {};

    const result = await response.json();
    return result.success ? result.data : {};
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {};
  }
}

/**
 * Clear customer data (GDPR compliance)
 */
export async function deleteCustomerData(customerId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/customer/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    if (response.ok) {
      profileCache.delete(customerId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting customer data:', error);
    return false;
  }
}

/**
 * Clear cache
 */
export function clearCustomerCache(): void {
  profileCache.clear();
}

/**
 * Merge two customer profiles (e.g., guest to registered)
 */
export async function mergeCustomerProfiles(
  guestId: string,
  registeredId: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/customer/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId, registeredId }),
    });

    if (response.ok) {
      profileCache.delete(guestId);
      profileCache.delete(registeredId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error merging profiles:', error);
    return false;
  }
}
