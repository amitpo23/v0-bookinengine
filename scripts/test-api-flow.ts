import { mediciApi } from "../lib/api/medici-client"

const checkInDate = new Date()
checkInDate.setDate(checkInDate.getDate() + 14)
const checkOutDate = new Date(checkInDate)
checkOutDate.setDate(checkOutDate.getDate() + 2)

const dateFrom = checkInDate.toISOString().split("T")[0]
const dateTo = checkOutDate.toISOString().split("T")[0]

console.log("=".repeat(80))
console.log("TESTING API FLOW - FULL E2E TEST")
console.log("=".repeat(80))
console.log(`Check-in: ${dateFrom}`)
console.log(`Check-out: ${dateTo}`)
console.log(`Days from now: 14`)
console.log("")

async function testFullFlow() {
  try {
    // ===================
    // STEP 1: SEARCH
    // ===================
    console.log("--- STEP 1: SEARCH ---")
    const searchResults = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName: "Dizengoff Inn",
      adults: 2,
      children: [],
      limit: 5,
    })

    if (!searchResults || searchResults.length === 0) {
      console.error("❌ SEARCH FAILED: No results returned")
      console.error("   This might mean:")
      console.error("   - Hotel name is incorrect")
      console.error("   - No availability for these dates")
      console.error("   - API authentication issue")
      return
    }

    console.log(`✅ SEARCH SUCCESS: Found ${searchResults.length} hotels`)
    const hotel = searchResults[0]
    console.log(`   Hotel: ${hotel.hotelName} (ID: ${hotel.hotelId})`)
    console.log(`   City: ${hotel.city}`)
    console.log(`   Stars: ${hotel.stars}`)
    console.log(`   Rooms available: ${hotel.rooms.length}`)

    if (hotel.rooms.length === 0) {
      console.error("❌ No rooms available for these dates")
      return
    }

    const room = hotel.rooms[0]
    console.log(`   Selected Room: ${room.roomName}`)
    console.log(`   Board Type: ${room.boardType}`)
    console.log(`   Price: ${room.buyPrice} ${room.currency}`)
    console.log(`   Max Occupancy: ${room.maxOccupancy}`)
    console.log(`   Code: ${room.code?.substring(0, 50)}...`)
    console.log(`   Code length: ${room.code?.length}`)

    if (!room.code) {
      console.error("❌ CRITICAL: Room code is missing!")
      console.error("   Full room object:", JSON.stringify(room, null, 2))
      return
    }

    if (room.code.length < 10) {
      console.error("❌ CRITICAL: Room code too short!")
      console.error("   Code:", room.code)
      console.error("   Expected: at least 10 characters")
      return
    }

    // ===================
    // STEP 2: PREBOOK
    // ===================
    console.log("\n--- STEP 2: PREBOOK ---")
    console.log(`   Sending code: ${room.code.substring(0, 100)}...`)

    const preBookResult = await mediciApi.preBook({
      code: room.code,
      dateFrom,
      dateTo,
      hotelId: hotel.hotelId,
      adults: 2,
      children: [],
    })

    console.log(`   PreBook ID: ${preBookResult.preBookId}`)
    console.log(`   Token: ${preBookResult.token?.substring(0, 50)}...`)
    console.log(`   Token length: ${preBookResult.token?.length}`)
    console.log(`   Status: ${preBookResult.status}`)
    console.log(`   Price: ${preBookResult.priceConfirmed} ${preBookResult.currency}`)

    if (preBookResult.status !== "done") {
      console.error("❌ PREBOOK FAILED")
      console.error("   Status:", preBookResult.status)
      console.error("   Full response:", JSON.stringify(preBookResult, null, 2))
      return
    }

    if (!preBookResult.token) {
      console.error("⚠️  WARNING: Token is missing from PreBook response")
      console.error("   Continuing with room code as fallback")
    }

    console.log("✅ PREBOOK SUCCESS")

    // ===================
    // STEP 3: BOOK
    // ===================
    console.log("\n--- STEP 3: BOOK ---")

    const bookResult = await mediciApi.book({
      code: room.code,
      token: preBookResult.token || room.code,
      preBookId: preBookResult.preBookId,
      dateFrom,
      dateTo,
      hotelId: hotel.hotelId,
      adults: 2,
      children: [],
      customer: {
        title: "MR",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+972501234567",
        country: "IL",
        city: "Tel Aviv",
        address: "Dizengoff 89",
        zip: "6439602",
      },
      voucherEmail: "test@example.com",
      agencyReference: "TEST-" + Date.now(),
    })

    console.log(`   Booking ID: ${bookResult.bookingId}`)
    console.log(`   Supplier Ref: ${bookResult.supplierReference}`)
    console.log(`   Status: ${bookResult.status}`)
    console.log(`   Success: ${bookResult.success}`)

    if (!bookResult.success) {
      console.error("❌ BOOKING FAILED")
      console.error("   Error:", bookResult.error)
      console.error("   Full response:", JSON.stringify(bookResult, null, 2))
      return
    }

    console.log("✅ BOOKING SUCCESS")

    // ===================
    // SUMMARY
    // ===================
    console.log("\n" + "=".repeat(80))
    console.log("✅ ALL TESTS PASSED!")
    console.log("=".repeat(80))
    console.log(`Hotel: ${hotel.hotelName}`)
    console.log(`Room: ${room.roomName}`)
    console.log(`Price: ${room.buyPrice} ${room.currency}`)
    console.log(`Booking ID: ${bookResult.bookingId}`)
    console.log(`Dates: ${dateFrom} to ${dateTo}`)
    console.log("=".repeat(80))
  } catch (error: any) {
    console.error("\n" + "=".repeat(80))
    console.error("❌ TEST FAILED WITH ERROR:")
    console.error("=".repeat(80))
    console.error("Error message:", error.message)
    console.error("\nStack trace:")
    console.error(error.stack)
    console.error("=".repeat(80))
  }
}

testFullFlow()
