import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const session = await getServerSession()

    // Check if already a member
    const { data: existing } = await supabase
      .from("loyalty_members")
      .select("id, membership_tier, discount_percentage")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyMember: true,
        member: existing,
      })
    }

    // Create new member
    const { data: newMember, error } = await supabase
      .from("loyalty_members")
      .insert({
        user_id: session?.user?.id || null,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        membership_tier: "bronze",
        discount_percentage: 5,
        points: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Loyalty join error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      member: newMember,
      message: "נרשמת בהצלחה למועדון הלקוחות! תקבל 5% הנחה בהזמנה הבאה",
    })
  } catch (error: any) {
    console.error("Loyalty join error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
