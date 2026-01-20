const TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc2ODg5Mzc0OCwiZXhwIjoyMDg0NDI2NTQ4LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eY7rKMlW8wTklJLFa-z2JMnyNKf7mcEzSIH_AOQ3nyU"

async function search() {
  console.log("🔍 Searching for Scarlet hotel...")
  
  const res = await fetch("https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hotelName: "Scarlet",
      city: "Tel Aviv",
      dateFrom: "2026-02-01",
      dateTo: "2026-02-05",
      pax: [{ adults: 2, children: [] }],
      limit: 100,
      ShowExtendedData: true,
    }),
  })

  console.log(`📊 Status: ${res.status}`)
  const data = await res.json()
  
  // Check all possible response formats
  const hotels = data.hotels || data.items || []
  console.log(`✅ Found ${hotels.length} results`)
  
  const scarlet = hotels.filter(h => 
    (h.hotelName || h.name || "").toLowerCase().includes("scarlet")
  )
  
  if (scarlet.length > 0) {
    console.log(`\n🎯 SCARLET FOUND! (${scarlet.length} results)\n`)
    scarlet.forEach(h => {
      console.log(`  • ${h.hotelName || h.name}`)
      console.log(`    City: ${h.cityName || h.city || "N/A"}`)
      console.log(`    Rooms: ${h.rooms?.length || h.items?.length || 0}`)
      console.log()
    })
  } else {
    console.log("\n❌ Scarlet NOT found. First 10 hotels:")
    hotels.slice(0, 10).forEach((h, i) => {
      console.log(`${i+1}. ${h.hotelName || h.name}`)
    })
  }
}

search().catch(console.error)
