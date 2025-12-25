#!/usr/bin/env tsx
/**
 * Test Real Flow with Medici API
 * Based on actual API responses
 * 
 * This script demonstrates the complete booking flow:
 * 1. Search for hotels
 * 2. Select a room
 * 3. PreBook (reserve for 30 minutes)
 * 4. Book (final booking)
 */

import { mediciApi } from "../lib/api/medici-client"

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logSection(title: string) {
  console.log("\n" + "=".repeat(60))
  log(title, colors.bright + colors.cyan)
  console.log("=".repeat(60) + "\n")
}

function logStep(step: string, details: string) {
  log(`✓ ${step}`, colors.green)
  if (details) {
    console.log(`  ${details}\n`)
  }
}

function logError(error: string) {
  log(`✗ Error: ${error}`, colors.red)
}

async function testRealFlow() {
  try {
    // ========================================
    // STEP 1: SEARCH
    // ========================================
    logSection("STEP 1: חיפוש מלונות (Search)")
    
    log("Searching for: Dizengoff Inn", colors.blue)
    log("Dates: 2025-12-11 to 2025-12-12", colors.blue)
    log("Guests: 2 adults", colors.blue)
    
    const searchResults = await mediciApi.searchHotels({
      dateFrom: "2025-12-11",
      dateTo: "2025-12-12",
      hotelName: "Dizengoff Inn",
      adults: 2,
      children: [],
    })

    if (searchResults.length === 0) {
      logError("No hotels found!")
      return
    }

    logStep("Search completed!", `Found ${searchResults.length} hotels`)

    // Display first hotel
    const hotel = searchResults[0]
    console.log(`Hotel: ${hotel.hotelName}`)
    console.log(`ID: ${hotel.hotelId}`)
    console.log(`City: ${hotel.city}`)
    console.log(`Stars: ${hotel.stars}⭐`)
    console.log(`Rooms available: ${hotel.rooms.length}`)

    // Display first room
    if (hotel.rooms.length > 0) {
      const room = hotel.rooms[0]
      console.log(`\nFirst Room:`)
      console.log(`  Name: ${room.roomName}`)
      console.log(`  Code: ${room.code.substring(0, 50)}...`)
      console.log(`  Price: $${room.price} ${room.currency}`)
      console.log(`  Board: ${room.board} (${room.boardType})`)
      console.log(`  Max Occupancy: ${room.maxOccupancy} guests`)
      console.log(`  Cancellation: ${room.cancellationPolicy}`)

      // ========================================
      // STEP 2: PREBOOK
      // ========================================
      logSection("STEP 2: טרום-הזמנה (PreBook)")
      
      log("Creating PreBook with selected room...", colors.blue)
      log("⏱️  This reservation will be valid for 30 minutes", colors.yellow)

      // In a real scenario, you would extract requestJson from the search response
      // For this test, we'll create a proper structure
      const prebookRequest = {
        services: [{
          searchCodes: [{
            code: room.code,
            pax: [{
              adults: 2,
              children: []
            }]
          }],
          searchRequest: {
            currencies: ["USD"],
            customerCountry: "IL",
            dates: {
              from: "2025-12-11",
              to: "2025-12-12"
            },
            destinations: [{
              id: Number(hotel.hotelId),
              type: "hotel"
            }],
            filters: [
              { name: "payAtTheHotel", value: true },
              { name: "onRequest", value: false },
              { name: "showSpecialDeals", value: true }
            ],
            pax: [{
              adults: 2,
              children: []
            }],
            service: "hotels"
          }
        }]
      }

      const prebookResponse = await mediciApi.preBook({
        jsonRequest: JSON.stringify(prebookRequest)
      })

      if (!prebookResponse.success) {
        logError("PreBook failed!")
        console.log("Response:", prebookResponse)
        return
      }

      logStep("PreBook successful!", "")
      console.log(`Token: ${prebookResponse.token}`)
      console.log(`PreBook ID: ${prebookResponse.preBookId}`)
      console.log(`Price Confirmed: $${prebookResponse.priceConfirmed} ${prebookResponse.currency}`)
      console.log(`Status: ${prebookResponse.status}`)

      // ========================================
      // STEP 3: BOOK
      // ========================================
      logSection("STEP 3: הזמנה סופית (Book)")
      
      log("Creating final booking...", colors.blue)

      // Build the book request
      const bookRequest = {
        customer: {
          title: "MR",
          name: {
            first: "Test",
            last: "User"
          },
          birthDate: "1990-01-01",
          contact: {
            address: "Test Street 123",
            city: "Tel Aviv",
            country: "IL",
            email: "test@example.com",
            phone: "+972501234567",
            state: "IL",
            zip: "6439602"
          }
        },
        paymentMethod: {
          methodName: "account_credit"
        },
        reference: {
          agency: "v0-bookinengine-test",
          voucherEmail: "test@example.com"
        },
        services: [{
          bookingRequest: [{
            code: room.code,
            pax: [{
              adults: [{
                lead: true,
                title: "MR",
                name: {
                  first: "Test",
                  last: "User"
                },
                contact: {
                  address: "Test Street 123",
                  city: "Tel Aviv",
                  country: "IL",
                  email: "test@example.com",
                  phone: "+972501234567",
                  state: "IL",
                  zip: "6439602"
                }
              }],
              children: []
            }],
            token: prebookResponse.token
          }],
          searchRequest: prebookRequest.services[0].searchRequest
        }]
      }

      const bookResponse = await mediciApi.book({
        jsonRequest: JSON.stringify(bookRequest)
      })

      if (!bookResponse.success) {
        logError("Booking failed!")
        console.log("Response:", bookResponse)
        if (bookResponse.error) {
          console.log("Error:", bookResponse.error)
        }
        return
      }

      // ========================================
      // SUCCESS!
      // ========================================
      logSection("🎉 הזמנה הושלמה בהצלחה!")
      
      console.log(`Booking ID: ${bookResponse.bookingId}`)
      console.log(`Supplier Reference: ${bookResponse.supplierReference}`)
      console.log(`Status: ${bookResponse.status}`)
      
      if (bookResponse.status === "confirmed") {
        log("\n✅ Booking is CONFIRMED!", colors.green + colors.bright)
        console.log("\nNext steps:")
        console.log("1. Send confirmation email to customer")
        console.log("2. Save booking to database")
        console.log("3. Send voucher to hotel")
      }

    } else {
      logError("No rooms available in the selected hotel")
    }

  } catch (error: any) {
    logError(error.message)
    console.error("Full error:", error)
  }
}

// Run the test
console.log("\n" + "🏨 Medici API - Real Flow Test".padStart(50))
console.log("Based on actual API responses\n")

testRealFlow().then(() => {
  console.log("\n" + "=".repeat(60))
  log("Test completed!", colors.bright + colors.green)
  console.log("=".repeat(60) + "\n")
}).catch((error) => {
  console.error("\n❌ Test failed:", error)
  process.exit(1)
})
