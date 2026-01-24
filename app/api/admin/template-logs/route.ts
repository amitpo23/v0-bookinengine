import { NextRequest, NextResponse } from "next/server"

// In-memory store for search logs (in production, use Supabase)
const searchLogs: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")
    const status = searchParams.get("status")
    const source = searchParams.get("source")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const limit = parseInt(searchParams.get("limit") || "100")

    let filteredLogs = [...searchLogs]

    // Filter by template
    if (templateId) {
      filteredLogs = filteredLogs.filter(log => log.templateId === templateId)
    }

    // Filter by status
    if (status === "completed") {
      filteredLogs = filteredLogs.filter(log => log.completed)
    } else if (status === "abandoned") {
      filteredLogs = filteredLogs.filter(log => !log.completed)
    }

    // Filter by source
    if (source && source !== "all") {
      filteredLogs = filteredLogs.filter(log => log.source === source)
    }

    // Filter by date range
    if (dateFrom) {
      filteredLogs = filteredLogs.filter(log => new Date(log.createdAt) >= new Date(dateFrom))
    }
    if (dateTo) {
      filteredLogs = filteredLogs.filter(log => new Date(log.createdAt) <= new Date(dateTo))
    }

    // Sort by date (newest first)
    filteredLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Limit results
    filteredLogs = filteredLogs.slice(0, limit)

    // Calculate stats
    const stats = {
      total: filteredLogs.length,
      completed: filteredLogs.filter(l => l.completed).length,
      abandoned: filteredLogs.filter(l => !l.completed).length,
      conversionRate: filteredLogs.length > 0 
        ? Math.round((filteredLogs.filter(l => l.completed).length / filteredLogs.length) * 100) 
        : 0,
      byStage: {
        search: filteredLogs.filter(l => l.stage === "search").length,
        room_selected: filteredLogs.filter(l => l.stage === "room_selected").length,
        guest_details: filteredLogs.filter(l => l.stage === "guest_details").length,
        payment: filteredLogs.filter(l => l.stage === "payment").length,
        confirmed: filteredLogs.filter(l => l.stage === "confirmed").length,
      },
      bySource: filteredLogs.reduce((acc, log) => {
        const source = log.source || "direct"
        acc[source] = (acc[source] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }

    return NextResponse.json({
      logs: filteredLogs,
      stats,
    })
  } catch (error) {
    console.error("Error fetching search logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch search logs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const log = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      templateId: body.templateId || "scarlet",
      sessionId: body.sessionId || `sess_${Date.now()}`,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      guests: body.guests || 2,
      children: body.children || 0,
      resultsCount: body.resultsCount || 0,
      selectedRoom: body.selectedRoom,
      selectedRoomCode: body.selectedRoomCode,
      priceShown: body.priceShown,
      stage: body.stage || "search",
      completed: body.completed || false,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      source: body.source || getSourceFromReferrer(body.referrer),
      referrer: body.referrer,
      userAgent: body.userAgent,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    searchLogs.push(log)

    // Keep only last 10000 logs in memory
    if (searchLogs.length > 10000) {
      searchLogs.shift()
    }

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("Error creating search log:", error)
    return NextResponse.json(
      { error: "Failed to create search log" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, ...updates } = body

    const logIndex = searchLogs.findIndex(log => log.sessionId === sessionId)
    
    if (logIndex === -1) {
      return NextResponse.json(
        { error: "Log not found" },
        { status: 404 }
      )
    }

    searchLogs[logIndex] = {
      ...searchLogs[logIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, log: searchLogs[logIndex] })
  } catch (error) {
    console.error("Error updating search log:", error)
    return NextResponse.json(
      { error: "Failed to update search log" },
      { status: 500 }
    )
  }
}

function getSourceFromReferrer(referrer?: string): string {
  if (!referrer) return "direct"
  
  const url = referrer.toLowerCase()
  
  if (url.includes("google")) return "google"
  if (url.includes("facebook") || url.includes("fb.com")) return "facebook"
  if (url.includes("instagram")) return "instagram"
  if (url.includes("tiktok")) return "tiktok"
  if (url.includes("twitter") || url.includes("x.com")) return "twitter"
  if (url.includes("linkedin")) return "linkedin"
  if (url.includes("youtube")) return "youtube"
  
  return "referral"
}
