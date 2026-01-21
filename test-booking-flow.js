#!/usr/bin/env node

/**
 * 🧪 Scarlet Hotel Demo Booking Test
 * ==================================
 * 
 * מבצע בדיקה מלאה של תהליך ההזמנה:
 * 1. חיפוש מלון Scarlet Tel Aviv
 * 2. בחירת חדר
 * 3. מילוי פרטי אורח  
 * 4. תשלום דמו
 * 5. אישור הזמנה
 * 6. שליחת מייל
 */

const https = require('https');

console.log('🎯 Scarlet Hotel Demo Booking Flow Test');
console.log('═══════════════════════════════════════');
console.log('Testing complete booking flow from search to confirmation\n');

const BASE_URL = 'http://localhost:3000';

// Test data
const testBooking = {
  searchParams: {
    dateFrom: '2026-03-01',
    dateTo: '2026-03-03',
    city: 'Tel Aviv',
    adults: 2,
    children: [],
    limit: 100
  },
  guestInfo: {
    title: 'MR',
    firstName: 'יוסי',
    lastName: 'כהן',
    email: 'test@example.com',
    phone: '050-1234567',
    address: 'דיזנגוף 100',
    city: 'תל אביב',
    country: 'IL',
    zip: '6439602'
  }
};

async function testStep(stepName, testFn) {
  console.log(`\n🔄 Step: ${stepName}`);
  try {
    const result = await testFn();
    console.log(`✅ ${stepName} - SUCCESS`);
    return result;
  } catch (error) {
    console.error(`❌ ${stepName} - FAILED: ${error.message}`);
    throw error;
  }
}

async function makeApiCall(endpoint, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${result.error || data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message} - Raw: ${data.substring(0, 100)}`));
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testSearchHotels() {
  const result = await makeApiCall('/api/hotels/search', 'POST', testBooking.searchParams);
  
  if (!result.data || !Array.isArray(result.data)) {
    throw new Error('Invalid search response format');
  }

  // Look for Scarlet Hotel Tel Aviv
  const scarletHotel = result.data.find(hotel => {
    const name = (hotel.hotelName || '').toLowerCase();
    const address = (hotel.address || '').toLowerCase();
    return name.includes('scarlet') && address.includes('gordon');
  });

  if (!scarletHotel) {
    throw new Error('Scarlet Hotel Tel Aviv not found in search results');
  }

  console.log(`   🏨 Found: ${scarletHotel.hotelName}`);
  console.log(`   📍 Address: ${scarletHotel.address}`);
  console.log(`   🛏️  Rooms: ${scarletHotel.rooms?.length || 0}`);

  return scarletHotel;
}

async function testPreBook(hotel, room) {
  const prebookData = {
    hotelId: hotel.hotelId,
    roomCode: room.code,
    dateFrom: testBooking.searchParams.dateFrom,
    dateTo: testBooking.searchParams.dateTo,
    adults: testBooking.searchParams.adults,
    children: testBooking.searchParams.children
  };

  const result = await makeApiCall('/api/booking/prebook', 'POST', prebookData);
  
  if (!result.success || !result.token) {
    throw new Error('PreBook failed - no token received');
  }

  console.log(`   🔖 PreBook Token: ${result.token.substring(0, 20)}...`);
  console.log(`   💰 Price Confirmed: ${result.priceConfirmed} ${result.currency}`);

  return result;
}

async function testCompleteBooking(hotel, room, prebookData) {
  const bookingData = {
    jsonRequest: JSON.stringify({
      customer: {
        title: testBooking.guestInfo.title,
        name: {
          first: testBooking.guestInfo.firstName,
          last: testBooking.guestInfo.lastName
        },
        contact: {
          email: testBooking.guestInfo.email,
          phone: testBooking.guestInfo.phone,
          address: testBooking.guestInfo.address,
          city: testBooking.guestInfo.city,
          country: testBooking.guestInfo.country,
          zip: testBooking.guestInfo.zip
        }
      },
      paymentMethod: { methodName: "demo_payment" },
      reference: { 
        agency: "demo-test",
        voucherEmail: testBooking.guestInfo.email 
      },
      services: [{
        bookingRequest: [{
          code: room.code,
          token: prebookData.token,
          pax: [{
            adults: Array(testBooking.searchParams.adults).fill(null).map((_, i) => ({
              lead: i === 0,
              title: testBooking.guestInfo.title,
              name: {
                first: i === 0 ? testBooking.guestInfo.firstName : `Guest${i + 1}`,
                last: testBooking.guestInfo.lastName
              },
              contact: {
                email: testBooking.guestInfo.email,
                phone: testBooking.guestInfo.phone,
                address: testBooking.guestInfo.address,
                city: testBooking.guestInfo.city,
                country: testBooking.guestInfo.country,
                zip: testBooking.guestInfo.zip
              }
            })),
            children: []
          }]
        }]
      }]
    })
  };

  const result = await makeApiCall('/api/booking/book', 'POST', bookingData);
  
  if (!result.success || !result.bookingId) {
    throw new Error('Booking failed - no booking ID received');
  }

  console.log(`   📋 Booking ID: ${result.bookingId}`);
  console.log(`   🏷️  Supplier Ref: ${result.supplierReference}`);

  return result;
}

async function runFullTest() {
  try {
    console.log('📊 Test Configuration:');
    console.log(`   Check-in: ${testBooking.searchParams.dateFrom}`);
    console.log(`   Check-out: ${testBooking.searchParams.dateTo}`);
    console.log(`   Guests: ${testBooking.searchParams.adults} adults`);
    console.log(`   Guest Email: ${testBooking.guestInfo.email}`);

    const hotel = await testStep('1. Search Scarlet Hotel', testSearchHotels);
    
    if (!hotel.rooms || hotel.rooms.length === 0) {
      throw new Error('No rooms available');
    }
    
    const room = hotel.rooms[0]; // Take first available room
    console.log(`   Selected Room: ${room.roomName} - ${room.buyPrice} ${room.currency}`);

    const prebookData = await testStep('2. Create PreBook', () => testPreBook(hotel, room));

    const bookingResult = await testStep('3. Complete Booking', () => testCompleteBooking(hotel, room, prebookData));

    console.log('\n🎉 DEMO BOOKING TEST: COMPLETE SUCCESS!');
    console.log('═══════════════════════════════════════');
    console.log('✅ Search: Scarlet Hotel found');
    console.log('✅ PreBook: Token generated');
    console.log('✅ Booking: Confirmed with ID');
    console.log('✅ Email: Should be sent to guest');
    console.log('\n📧 Check your email service logs for confirmation email');
    console.log(`💡 Booking Reference: ${bookingResult.bookingId}`);

  } catch (error) {
    console.log('\n❌ DEMO BOOKING TEST: FAILED');
    console.log('═══════════════════════════════════════');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the test
runFullTest();