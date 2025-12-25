import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, bookingAmount } = await request.json()

    if (!email || !bookingAmount) {
      return NextResponse.json(
        { error: "Email and booking amount are required" },
        { status: 400 }
      )
    }

    // Get current member data
    const { data: member, error: fetchError } = await supabase
      .from("loyalty_members")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError || !member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Calculate new values
    const newTotalBookings = (member.total_bookings || 0) + 1
    const newTotalSpent = (member.total_spent || 0) + bookingAmount
    const newPoints = (member.points || 0) + Math.floor(bookingAmount / 10) // 1 point per 10₪

    // Update member
    const { error: updateError } = await supabase
      .from("loyalty_members")
      .update({
        total_bookings: newTotalBookings,
        total_spent: newTotalSpent,
        points: newPoints,
        last_booking_at: new Date().toISOString(),
      })
      .eq("email", email)

    if (updateError) {
      console.error("Loyalty update error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // The trigger will automatically update the tier

    // Fetch updated member data
    const { data: updatedMember } = await supabase
      .from("loyalty_members")
      .select("*")
      .eq("email", email)
      .single()

    return NextResponse.json({
      success: true,
      member: updatedMember,
    })
  } catch (error: any) {
    console.error("Loyalty update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
