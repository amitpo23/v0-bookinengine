#!/usr/bin/env node

// Direct test of Knowaa API integration
const TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc2ODg5Mzc0OCwiZXhwIjoyMDg0NDI2NTQ4LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eY7rKMlW8wTklJLFa-z2JMnyNKf7mcEzSIH_AOQ3nyU"

async function testKnowaaSearch() {
  console.log("\n🧪 Testing Knowaa API Search...\n")

  const body = {
    dateFrom: "2026-02-01",
    dateTo: "2026-02-05",
    city: "Tel Aviv",
    pax: [{ adults: 2, children: [] }],
    stars: null,
    limit: 10,
    ShowExtendedData: true,
  }

  console.log("📤 Request:", JSON.stringify(body, null, 2))

  try {
    const response = await fetch("https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("📥 Response Status:", response.status, response.statusText)

    if (!response.ok) {
      const text = await response.text()
      console.error("❌ Error Response:", text)
      return
    }

    const data = await response.json()
    console.log("\n✅ Success! Found", data.items?.length || 0, "hotels\n")

    // Show first 3 hotels
    if (data.items && data.items.length > 0) {
      data.items.slice(0, 3).forEach((hotel, i) => {
        console.log(`${i + 1}. ${hotel.name}`)
        console.log(`   City: ${hotel.city || "N/A"}`)
        console.log(`   Stars: ${hotel.stars || 0}`)
        console.log(`   Rooms: ${hotel.items?.length || 0}`)
        console.log()
      })
    }

    console.log("📊 Total results:", data.items?.length || 0)
  } catch (error) {
    console.error("❌ Request failed:", error.message)
  }
}

testKnowaaSearch()
