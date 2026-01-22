import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 API Test endpoint called")
    
    // Test 1: Check environment variables
    const mediciToken = process.env.MEDICI_TOKEN
    const knowaaToken = process.env.KNOWAA_BEARER_TOKEN
    const mediciBaseUrl = process.env.MEDICI_BASE_URL
    
    console.log("Environment check:")
    console.log("MEDICI_TOKEN exists:", !!mediciToken)
    console.log("KNOWAA_BEARER_TOKEN exists:", !!knowaaToken) 
    console.log("MEDICI_BASE_URL:", mediciBaseUrl)
    
    // Test 2: Check DEMO_MODE
    const { DEMO_MODE } = await import("@/lib/demo/demo-mode")
    console.log("DEMO_MODE:", DEMO_MODE)
    
    // Test 3: Try simple Medici API call
    const token = knowaaToken || mediciToken
    console.log("Using token (first 20 chars):", token?.substring(0, 20) + "...")
    
    const testUrl = `${mediciBaseUrl}/api/hotels/GetInnstantSearchPrice`
    console.log("Test URL:", testUrl)
    
    const testResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        hotelName: "Test",
        dateFrom: "2026-02-01",
        dateTo: "2026-02-02",
        pax: [{ adults: 2, children: [] }],
        ShowExtendedData: true
      })
    })
    
    console.log("Medici API response status:", testResponse.status)
    console.log("Medici API response headers:", Object.fromEntries(testResponse.headers.entries()))
    
    const responseText = await testResponse.text()
    console.log("Medici API response (first 200 chars):", responseText.substring(0, 200))
    
    return NextResponse.json({
      success: true,
      environment: {
        hasToken: !!token,
        hasBaseUrl: !!mediciBaseUrl,
        demoMode: DEMO_MODE
      },
      apiTest: {
        status: testResponse.status,
        statusText: testResponse.statusText,
        responsePreview: responseText.substring(0, 200)
      }
    })
    
  } catch (error: any) {
    console.error("Test API error:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}