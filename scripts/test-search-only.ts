#!/usr/bin/env tsx
/**
 * Simple Search Test
 * Tests only the search endpoint with real Dizengoff Inn data
 */

import { mediciApi } from "../lib/api/medici-client"

async function testSearch() {
  console.log("🔍 Testing Search API...")
  console.log("=" .repeat(60))
  
  try {
    console.log("\n📋 Search Parameters:")
    console.log("  Hotel: Dizengoff Inn")
    console.log("  Check-in: 2025-12-11")
    console.log("  Check-out: 2025-12-12")
    console.log("  Guests: 2 adults, 0 children")
    
    const results = await mediciApi.searchHotels({
      dateFrom: "2025-12-11",
      dateTo: "2025-12-12",
      hotelName: "Dizengoff Inn",
      adults: 2,
      children: [],
    })

    console.log("\n✅ Search successful!")
    console.log(`   Found ${results.length} hotel(s)`)
    
    if (results.length > 0) {
      console.log("\n" + "=".repeat(60))
      console.log("📊 Results:")
      console.log("=".repeat(60))
      
      results.forEach((hotel, hotelIdx) => {
        console.log(`\n🏨 Hotel #${hotelIdx + 1}:`)
        console.log(`   Name: ${hotel.hotelName}`)
        console.log(`   ID: ${hotel.hotelId}`)
        console.log(`   City: ${hotel.city}`)
        console.log(`   Stars: ${"⭐".repeat(hotel.stars)}`)
        console.log(`   Address: ${hotel.address}`)
        console.log(`   Rooms: ${hotel.rooms.length}`)
        
        if (hotel.rooms.length > 0) {
          console.log(`\n   💰 Room Options:`)
          hotel.rooms.slice(0, 3).forEach((room, roomIdx) => {
            console.log(`\n   Room #${roomIdx + 1}:`)
            console.log(`     Name: ${room.roomName}`)
            console.log(`     Category: ${room.roomCategory}`)
            console.log(`     Board: ${room.board} (${room.boardType})`)
            console.log(`     Price: $${room.price} ${room.currency}`)
            console.log(`     Max Guests: ${room.maxOccupancy}`)
            console.log(`     Cancellation: ${room.cancellationPolicy}`)
            console.log(`     Code: ${room.code.substring(0, 60)}...`)
          })
          
          if (hotel.rooms.length > 3) {
            console.log(`\n   ... and ${hotel.rooms.length - 3} more rooms`)
          }
        }
      })
      
      console.log("\n" + "=".repeat(60))
      console.log("\n✨ Search test completed successfully!")
      console.log("   You can now proceed to PreBook with any room code above.")
      
      // Show example PreBook call
      if (results[0]?.rooms[0]) {
        const room = results[0].rooms[0]
        console.log("\n📝 Example PreBook call:")
        console.log(`
const prebookResponse = await mediciApi.preBook({
  jsonRequest: JSON.stringify({
    services: [{
      searchCodes: [{
        code: "${room.code}",
        pax: [{ adults: 2, children: [] }]
      }],
      searchRequest: { /* ... search params ... */ }
    }]
  })
})
        `.trim())
      }
      
    } else {
      console.log("\n⚠️  No results found")
      console.log("   Try different search parameters or dates")
    }
    
  } catch (error: any) {
    console.error("\n❌ Search failed!")
    console.error("Error:", error.message)
    if (error.stack) {
      console.error("\nStack trace:")
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Run the test
testSearch()
