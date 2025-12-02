// Test script for Medici Hotels API
// Based on official documentation

const BASE_URL = "https://medici-backend.azurewebsites.net"

// Token for UserID 24 (Production, Expires 2068)
const AUTH_TOKEN =
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U"

console.log("=".repeat(60))
console.log(" MEDICI HOTELS API - INTEGRATION TEST")
console.log("=".repeat(60))

async function testSearchByHotelName() {
  console.log("\n[TEST 1] Search by Hotel Name: Dizengoff Inn")
  console.log("-".repeat(50))

  // Exact format from documentation
  const requestBody = {
    dateFrom: "2025-12-11",
    dateTo: "2025-12-12",
    hotelName: "Dizengoff Inn",
    pax: [{ adults: "2", children: [] }],
    stars: null,
    limit: 5,
  }

  console.log("Request:", JSON.stringify(requestBody, null, 2))

  try {
    const response = await fetch(`${BASE_URL}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Status:", response.status)
    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      console.log(`SUCCESS! Found ${data.length} results`)
      console.log("First result:", JSON.stringify(data[0], null, 2).substring(0, 500))
    } else {
      console.log("Response:", JSON.stringify(data, null, 2).substring(0, 1000))
    }
  } catch (error) {
    console.log("ERROR:", error)
  }
}

async function testSearchByCity() {
  console.log("\n[TEST 2] Search by City: Dubai")
  console.log("-".repeat(50))

  const requestBody = {
    dateFrom: "2025-12-15",
    dateTo: "2025-12-17",
    city: "Dubai",
    pax: [{ adults: "2", children: [] }],
    stars: null,
    limit: 10,
  }

  console.log("Request:", JSON.stringify(requestBody, null, 2))

  try {
    const response = await fetch(`${BASE_URL}/api/hotels/GetInnstantSearchPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Status:", response.status)
    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      console.log(`SUCCESS! Found ${data.length} hotels`)
      data.slice(0, 3).forEach((hotel: any, i: number) => {
        console.log(
          `  ${i + 1}. ${hotel.hotelName || hotel.name} - ${hotel.price?.amount || hotel.buyPrice || "N/A"} USD`,
        )
      })
    } else {
      console.log("Response:", JSON.stringify(data, null, 2).substring(0, 1000))
    }
  } catch (error) {
    console.log("ERROR:", error)
  }
}

async function testGetActiveRooms() {
  console.log("\n[TEST 3] Get Active Rooms")
  console.log("-".repeat(50))

  const requestBody = {
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  }

  try {
    const response = await fetch(`${BASE_URL}/api/hotels/GetRoomsActive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Status:", response.status)
    const data = await response.json()

    if (Array.isArray(data)) {
      console.log(`Found ${data.length} active rooms`)
      if (data.length > 0) {
        console.log("First room:", JSON.stringify(data[0], null, 2).substring(0, 500))
      }
    } else {
      console.log("Response:", JSON.stringify(data, null, 2).substring(0, 500))
    }
  } catch (error) {
    console.log("ERROR:", error)
  }
}

async function testGetDashboard() {
  console.log("\n[TEST 4] Get Dashboard Info")
  console.log("-".repeat(50))

  const requestBody = {
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  }

  try {
    const response = await fetch(`${BASE_URL}/api/hotels/GetDashboardInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Status:", response.status)
    const data = await response.json()
    console.log("Dashboard:", JSON.stringify(data, null, 2).substring(0, 1000))
  } catch (error) {
    console.log("ERROR:", error)
  }
}

// Run tests
async function run() {
  await testSearchByHotelName()
  await testSearchByCity()
  await testGetActiveRooms()
  await testGetDashboard()

  console.log("\n" + "=".repeat(60))
  console.log(" TESTS COMPLETE")
  console.log("=".repeat(60))
}

run()
