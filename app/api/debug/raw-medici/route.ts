import { NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dateFrom, dateTo, city } = body

    console.log("🔍 Fetching RAW Medici response...")

    // Search directly with Medici API
    const response = await mediciApi.searchHotels({
      dateFrom: dateFrom || "2026-02-01",
      dateTo: dateTo || "2026-02-03",
      city: city || "Tel Aviv",
      adults: 2,
      children: [],
      limit: 5
    })

    // Save to file
    const outputPath = path.join(process.cwd(), "medici-raw-response.json")
    fs.writeFileSync(outputPath, JSON.stringify(response, null, 2), "utf-8")

    console.log("✅ Raw response saved to:", outputPath)

    return NextResponse.json({
      success: true,
      filePath: outputPath,
      preview: response.slice(0, 2), // First 2 hotels
      totalHotels: response.length
    })
  } catch (error: any) {
    console.error("❌ Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
