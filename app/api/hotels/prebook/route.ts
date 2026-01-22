import { NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { DEMO_MODE } from "@/lib/demo/demo-mode"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🔍 PREBOOK API - Body received:", JSON.stringify(body, null, 2))

    const { jsonRequest } = body

    if (!jsonRequest) {
      return NextResponse.json({ error: "jsonRequest is required" }, { status: 400 })
    }

    console.log("🔍 DEMO_MODE:", DEMO_MODE)

    if (DEMO_MODE) {
      console.log("🎭 DEMO MODE: Using mock prebook data")
      
      // Mock prebook response
      return NextResponse.json({
        success: true,
        preBookId: Math.floor(Math.random() * 100000),
        token: `DEMO_TOKEN_${Date.now()}`,
        status: "done",
        priceConfirmed: 1200,
        currency: "ILS",
        requestJson: jsonRequest,
        responseJson: JSON.stringify({ demo: true }),
      })
    }

    console.log("🌐 REAL API MODE: Calling Medici PreBook...")
    
    const result = await mediciApi.preBook({
      jsonRequest
    })

    console.log("🎯 Medici PreBook result:", result)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("PreBook API error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "PreBook failed" },
      { status: 500 }
    )
  }
}