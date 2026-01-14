/**
 * Customer History API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import type { HistoryEventType } from '@/lib/services/customer-memory-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, eventType, eventData } = body;

    if (!customerId || !eventType || !eventData) {
      return NextResponse.json(
        { success: false, error: 'Customer ID, event type, and event data are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes: HistoryEventType[] = ['booking', 'search', 'cancellation', 'inquiry', 'review', 'preference_update'];
    if (!validTypes.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // In production, save to Supabase
    // await supabase?.from('customer_history').insert({ customer_id: customerId, event_type: eventType, event_data: eventData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Record event API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
