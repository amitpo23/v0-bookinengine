import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { data: member, error } = await supabase
      .from("loyalty_members")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !member) {
      return NextResponse.json({
        isMember: false,
        discount: 0,
      })
    }

    return NextResponse.json({
      isMember: true,
      member: {
        id: member.id,
        email: member.email,
        firstName: member.first_name,
        lastName: member.last_name,
        tier: member.membership_tier,
        discount: member.discount_percentage,
        points: member.points,
        totalBookings: member.total_bookings,
      },
    })
  } catch (error: any) {
    console.error("Loyalty check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
