// API test with fixed token (UserID 24, expires 2068)
export async function GET() {
  const MEDICI_API_BASE = "https://medici-backend.azurewebsites.net"

  const FIXED_TOKEN =
    "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U"

  const logs: string[] = []
  logs.push(`[${new Date().toISOString()}] Starting API test with FIXED token (UserID 24)...`)
  logs.push(`[${new Date().toISOString()}] Token expires: 2068`)

  try {
    // Search hotels with the fixed token
    const searchBody = {
      dateFrom: "2025-06-15",
      dateTo: "2025-06-16",
      city: "Dubai",
      pax: [{ adults: "2", children: [] }],
      ShowExtendedData: true,
      limit: 3,
    }

    logs.push(`[${new Date().toISOString()}] Search body: ${JSON.stringify(searchBody)}`)
    logs.push(`[${new Date().toISOString()}] Calling GetInnstantSearchPrice...`)

    const startTime = Date.now()
    const searchResponse = await fetch(`${MEDICI_API_BASE}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIXED_TOKEN}`,
      },
      body: JSON.stringify(searchBody),
    })
    const endTime = Date.now()

    logs.push(`[${new Date().toISOString()}] Response in ${endTime - startTime}ms`)
    logs.push(`[${new Date().toISOString()}] Status: ${searchResponse.status}`)

    const searchText = await searchResponse.text()
    logs.push(`[${new Date().toISOString()}] Response length: ${searchText.length} chars`)
    logs.push(`[${new Date().toISOString()}] Response preview: ${searchText.slice(0, 1000)}`)

    let parsedData = null
    let resultCount = 0
    try {
      parsedData = JSON.parse(searchText)
      if (Array.isArray(parsedData)) {
        resultCount = parsedData.length
        logs.push(`[${new Date().toISOString()}] SUCCESS! Found ${resultCount} hotels`)
      } else if (parsedData.items) {
        resultCount = parsedData.items.length
        logs.push(`[${new Date().toISOString()}] SUCCESS! Found ${resultCount} items`)
      } else {
        logs.push(`[${new Date().toISOString()}] Response structure: ${Object.keys(parsedData).join(", ")}`)
      }
    } catch (e) {
      logs.push(`[${new Date().toISOString()}] Could not parse as JSON: ${e}`)
    }

    return Response.json({
      success: searchResponse.status === 200 && resultCount > 0,
      status: searchResponse.status,
      responseTime: endTime - startTime,
      resultCount: resultCount,
      parsedData: parsedData,
      logs: logs,
    })
  } catch (error: any) {
    logs.push(`[${new Date().toISOString()}] ERROR: ${error.name} - ${error.message}`)
    return Response.json({
      success: false,
      error: error.message,
      logs: logs,
    })
  }
}
