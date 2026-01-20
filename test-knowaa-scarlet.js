#!/usr/bin/env node

const TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc2ODg5Mzc0OCwiZXhwIjoyMDg0NDI2NTQ4LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eY7rKMlW8wTklJLFa-z2JMnyNKf7mcEzSIH_AOQ3nyU"

async function test(testName, body) {
  console.log(`\n🧪 ${testName}`)
  console.log("=" .repeat(60))
  
  try {
    const response = await fetch("https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log(`📥 Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const text = await response.text()
      console.error("❌ Error:", text.substring(0, 200))
      return null
    }

    const data = await response.json()
    const count = data.items?.length || 0
    console.log(`✅ Found ${count} hotels`)

    if (count > 0) {
      data.items.slice(0, 5).forEach((hotel, i) => {
        const rooms = hotel.items?.length || 0
        const price = hotel.price?.amount || hotel.netPrice?.amount || 0
        console.log(`   ${i + 1}. ${hotel.name} - ${hotel.stars}⭐ - ${rooms} rooms - $${price}`)
      })
    }
    
    return data
  } catch (error) {
    console.error("❌ Error:", error.message)
    return null
  }
}

async function runTests() {
  console.log("\n🚀 KNOWAA API TESTS")
  console.log("=" .repeat(60))

  // Test 1: Search by hotel name "Scarlet"
  await test("TEST 1: Search for Scarlet Hotel", {
    dateFrom: "2026-02-10",
    dateTo: "2026-02-11",
    hotelName: "Scarlet",
    pax: [{ adults: 2, children: [] }],
    ShowExtendedData: true,
  })

  // Test 2: Search by city Tel Aviv
  await test("TEST 2: Search Tel Aviv (limit 5)", {
    dateFrom: "2026-02-10",
    dateTo: "2026-02-11",
    city: "Tel Aviv",
    pax: [{ adults: 2, children: [] }],
    limit: 5,
    ShowExtendedData: true,
  })

  // Test 3: Search with ID 863233 (if API supports it)
  await test("TEST 3: Search Tel Aviv - Look for Scarlet ID", {
    dateFrom: "2026-02-10",
    dateTo: "2026-02-11",
    city: "Tel Aviv",
    pax: [{ adults: 2, children: [] }],
    limit: 20,
    ShowExtendedData: true,
  }).then(data => {
    if (data?.items) {
      const scarlet = data.items.find(h => 
        h.id === 863233 || 
        h.hotelId === 863233 || 
        (h.name && h.name.toLowerCase().includes('scarlet'))
      )
      if (scarlet) {
        console.log("\n🎯 FOUND SCARLET:", scarlet.name, "ID:", scarlet.id || scarlet.hotelId)
      } else {
        console.log("\n⚠️  Scarlet not found in Tel Aviv results")
      }
    }
  })

  console.log("\n✅ Tests completed!\n")
}

runTests()
