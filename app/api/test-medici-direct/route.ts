// Direct API test route - runs on server to avoid CORS
export async function POST(req: Request) {
  const MEDICI_API_BASE = "https://medici-backend.azurewebsites.net"
  const MEDICI_TOKEN =
    "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE"

  try {
    const body = await req.json()

    console.log("[v0] Test API - Request body:", JSON.stringify(body, null, 2))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(`${MEDICI_API_BASE}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Test API - Response status:", response.status)

    const responseText = await response.text()
    console.log("[v0] Test API - Response length:", responseText.length)
    console.log("[v0] Test API - Response preview:", responseText.slice(0, 1000))

    let parsedData = null
    try {
      parsedData = JSON.parse(responseText)
      console.log(
        "[v0] Test API - Parsed successfully, type:",
        typeof parsedData,
        Array.isArray(parsedData) ? "(array)" : "",
      )
      if (Array.isArray(parsedData)) {
        console.log("[v0] Test API - Array length:", parsedData.length)
        if (parsedData.length > 0) {
          console.log("[v0] Test API - First item keys:", Object.keys(parsedData[0]))
        }
      }
    } catch (e) {
      console.log("[v0] Test API - Could not parse as JSON")
    }

    return Response.json({
      status: response.status,
      responseLength: responseText.length,
      responsePreview: responseText.slice(0, 2000),
      parsedData: parsedData,
      isArray: Array.isArray(parsedData),
      arrayLength: Array.isArray(parsedData) ? parsedData.length : null,
    })
  } catch (error: any) {
    console.error("[v0] Test API - Error:", error)

    if (error.name === "AbortError") {
      return Response.json({
        error: "Request timeout after 30 seconds",
        status: 408,
      })
    }

    return Response.json({
      error: error.message,
      stack: error.stack,
    })
  }
}
