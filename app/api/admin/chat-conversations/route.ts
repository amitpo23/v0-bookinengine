import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Chat Conversations API - returns real conversations from database
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const template = searchParams.get("template") || "scarlet"
  const limit = parseInt(searchParams.get("limit") || "50")

  // If no Supabase configured, return empty array
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: true,
      conversations: [],
      message: "Database not configured"
    })
  }

  try {
    // Fetch chat sessions with messages
    const { data: sessions, error } = await supabaseAdmin
      .from("chat_sessions")
      .select(`
        id,
        session_id,
        hotel_id,
        guest_name,
        guest_email,
        guest_phone,
        started_at,
        ended_at,
        message_count,
        topics,
        sentiment,
        lead_to_booking,
        booking_id,
        booking_value,
        device,
        source,
        rating,
        feedback,
        created_at,
        chat_messages (
          id,
          role,
          content,
          skill,
          created_at
        )
      `)
      .eq("hotel_id", template)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching chat conversations:", error)
      // Return empty array if table doesn't exist yet
      return NextResponse.json({
        success: true,
        conversations: [],
        message: "No conversations found or table not set up"
      })
    }

    // Transform to expected format
    const conversations = (sessions || []).map(session => ({
      id: session.id,
      sessionId: session.session_id,
      guestName: session.guest_name,
      guestEmail: session.guest_email,
      guestPhone: session.guest_phone,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      messageCount: session.message_count || 0,
      messages: (session.chat_messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
        skill: msg.skill
      })),
      topics: session.topics || [],
      sentiment: session.sentiment || "neutral",
      leadToBooking: session.lead_to_booking || false,
      bookingId: session.booking_id,
      bookingValue: session.booking_value,
      device: session.device || "desktop",
      source: session.source || "direct",
      rating: session.rating,
      feedback: session.feedback
    }))

    return NextResponse.json({
      success: true,
      conversations
    })
  } catch (error) {
    console.error("Error in chat-conversations API:", error)
    return NextResponse.json({
      success: true,
      conversations: [],
      message: "Database not connected"
    })
  }
}
