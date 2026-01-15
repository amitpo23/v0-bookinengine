// Test script for Medici API - run this to verify the API works
// Execute this script to see actual API responses

const MEDICI_API_BASE = "https://medici-backend.azurewebsites.net"
const MEDICI_TOKEN =
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE"

async function testMediciAPI() {
  console.log("=".repeat(60))
  console.log("[v0] TESTING MEDICI HOTELS API")
  console.log("=".repeat(60))

  // Test 1: Search by hotel name (Dizengoff Inn)
  console.log("\n[v0] --- Test 1: Search by Hotel Name (Dizengoff Inn) ---")

  const test1Body = {
    dateFrom: "2026-06-10",
    dateTo: "2026-06-12",
    hotelName: "Dizengoff Inn",
    adults: 2,
    paxChildren: [],
    stars: null,
    limit: 10,
  }

  console.log("[v0] Request body:", JSON.stringify(test1Body, null, 2))

  try {
    const response1 = await fetch(`${MEDICI_API_BASE}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(test1Body),
    })

    console.log("[v0] Response status:", response1.status)
    const text1 = await response1.text()
    console.log("[v0] Response length:", text1.length)
    console.log("[v0] Response preview:", text1.slice(0, 1500))

    if (text1.length > 10) {
      try {
        const json1 = JSON.parse(text1)
        console.log("\n[v0] Parsed JSON type:", typeof json1, Array.isArray(json1) ? "(array)" : "(object)")
        if (Array.isArray(json1)) {
          console.log("[v0] Number of results:", json1.length)
          if (json1.length > 0) {
            console.log("\n[v0] First result keys:", Object.keys(json1[0]))
            console.log("[v0] First result:", JSON.stringify(json1[0], null, 2).slice(0, 1000))
          }
        } else {
          console.log("[v0] Result keys:", Object.keys(json1))
          console.log("[v0] Full response:", JSON.stringify(json1, null, 2).slice(0, 1000))
        }
      } catch (e) {
        console.log("[v0] Could not parse as JSON:", e)
      }
    }
  } catch (error) {
    console.error("[v0] Test 1 error:", error)
  }

  // Test 2: Search by city (Tel Aviv)
  console.log("\n[v0] --- Test 2: Search by City (Tel Aviv) ---")

  const test2Body = {
    dateFrom: "2026-06-10",
    dateTo: "2026-06-12",
    city: "Tel Aviv",
    adults: 2,
    paxChildren: [],
    stars: null,
    limit: 5,
  }

  console.log("[v0] Request body:", JSON.stringify(test2Body, null, 2))

  try {
    const response2 = await fetch(`${MEDICI_API_BASE}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(test2Body),
    })

    console.log("[v0] Response status:", response2.status)
    const text2 = await response2.text()
    console.log("[v0] Response length:", text2.length)
    console.log("[v0] Response preview:", text2.slice(0, 1500))

    if (text2.length > 10) {
      try {
        const json2 = JSON.parse(text2)
        console.log("\n[v0] Parsed JSON type:", typeof json2, Array.isArray(json2) ? "(array)" : "(object)")
        if (Array.isArray(json2)) {
          console.log("[v0] Number of results:", json2.length)
          if (json2.length > 0) {
            console.log("\n[v0] First result keys:", Object.keys(json2[0]))
          }
        }
      } catch (e) {
        console.log("[v0] Could not parse as JSON")
      }
    }
  } catch (error) {
    console.error("[v0] Test 2 error:", error)
  }

  console.log("\n" + "=".repeat(60))
  console.log("[v0] TESTING COMPLETE")
  console.log("=".repeat(60))
}

// Run the test
testMediciAPI()
