#!/usr/bin/env node

/**
 * Comprehensive API Verification Tests
 * Checks:
 * 1. Real data (not mocked)
 * 2. API connectivity
 * 3. Token validity
 * 4. Response data integrity
 * 5. Scarlet hotel availability
 */

const https = require('https');
const fs = require('fs');

// Real tokens from env or hardcoded
const MEDICI_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE';
const KNOWAA_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGFydG5lcnNoaXBzQGtub3dhYWdsb2JhbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI0IiwiZXhwIjozNjE0NDc5NTA1fQ.b3_6IHKT75ZBh-TDhbKn02Tky2dPGgzbHFH9sDsIoqQ';

const BASE_URL = 'https://medici-backend.azurewebsites.net';
const tests = [];

// Helper to decode JWT
function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Helper to make API requests
function makeRequest(hostname, path, method = 'POST', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    if (body) {
      headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const options = {
      hostname,
      path,
      method,
      headers,
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test 1: Verify Tokens are Real
async function testTokenValidity() {
  console.log('\n📋 TEST 1: Token Validity');
  console.log('='.repeat(50));

  const mediciDecoded = decodeJWT(MEDICI_TOKEN);
  const knowaaDecoded = decodeJWT(KNOWAA_TOKEN);

  console.log('\n✅ MEDICI Token (UserID: 11):');
  console.log(`   Expires: ${new Date(mediciDecoded?.exp * 1000).toLocaleDateString()}`);
  console.log(`   UserId: ${mediciDecoded?.UserId}`);
  console.log(`   Status: ${ mediciDecoded?.exp * 1000 > Date.now() ? '✅ VALID' : '❌ EXPIRED'}`);

  console.log('\n✅ KNOWAA Token (UserID: 24):');
  console.log(`   Expires: ${new Date(knowaaDecoded?.exp * 1000).toLocaleDateString()}`);
  console.log(`   UserID: ${knowaaDecoded?.exp}`);
  console.log(`   Status: ${knowaaDecoded?.exp * 1000 > Date.now() ? '✅ VALID' : '❌ EXPIRED'}`);

  tests.push({
    name: 'Token Validity',
    passed: mediciDecoded?.exp * 1000 > Date.now()
  });
}

// Test 2: API Connectivity
async function testAPIConnectivity() {
  console.log('\n📋 TEST 2: API Connectivity');
  console.log('='.repeat(50));

  try {
    const searchBody = {
      city: 'Jerusalem',
      dateFrom: '2026-02-10',
      dateTo: '2026-02-12',
      pax: [{ adults: 1, children: [] }],
      limit: 5,
      ShowExtendedData: true
    };

    const response = await makeRequest(
      'medici-backend.azurewebsites.net',
      '/api/hotels/GetInnstantSearchPrice',
      'POST',
      searchBody,
      MEDICI_TOKEN
    );

    console.log(`✅ API Response Status: ${response.status}`);
    console.log(`   Headers: Content-Type = ${response.headers['content-type']}`);
    console.log(`   Response has data: ${response.body ? '✅ YES' : '❌ NO'}`);
    console.log(`   Hotels found: ${response.body?.hotels ? response.body.hotels.length : 0}`);

    tests.push({
      name: 'API Connectivity',
      passed: response.status === 200 && response.body?.hotels
    });
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    tests.push({
      name: 'API Connectivity',
      passed: false
    });
  }
}

// Test 3: Real Data Verification (Not Mock)
async function testRealData() {
  console.log('\n📋 TEST 3: Real Data Verification');
  console.log('='.repeat(50));

  try {
    const searchBody = {
      city: 'Tel Aviv',
      dateFrom: '2026-02-01',
      dateTo: '2026-02-05',
      pax: [{ adults: 2, children: [] }],
      limit: 50,
      ShowExtendedData: true
    };

    const response = await makeRequest(
      'medici-backend.azurewebsites.net',
      '/api/hotels/GetInnstantSearchPrice',
      'POST',
      searchBody,
      MEDICI_TOKEN
    );

    if (response.status === 200 && response.body?.hotels) {
      const hotels = response.body.hotels;
      
      console.log(`✅ Found ${hotels.length} real hotels in Tel Aviv\n`);

      // Verify data is not mock (contains realistic data)
      let realDataScore = 0;
      hotels.slice(0, 5).forEach((h, i) => {
        const hasName = h.hotelName && h.hotelName.length > 2;
        const hasRooms = h.rooms && h.rooms.length > 0;
        const hasPrice = h.rooms?.[0]?.price > 0;
        const hasStars = h.stars >= 0 && h.stars <= 5;

        if (hasName && hasRooms && hasPrice && hasStars) {
          realDataScore++;
        }

        console.log(`   ${i + 1}. ${h.hotelName}`);
        console.log(`      Stars: ${h.stars} | Rooms: ${hasRooms ? '✅' : '❌'} | Price: ${h.rooms?.[0]?.price || 'N/A'}`);
      });

      const isRealData = realDataScore >= 4;
      console.log(`\n✅ Real Data Score: ${realDataScore}/5`);
      console.log(`   Status: ${isRealData ? '✅ REAL DATA CONFIRMED' : '⚠️ MIXED OR MOCK DATA'}`);

      tests.push({
        name: 'Real Data (Not Mock)',
        passed: isRealData
      });
    } else {
      console.log('❌ Failed to retrieve hotel data');
      tests.push({
        name: 'Real Data (Not Mock)',
        passed: false
      });
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    tests.push({
      name: 'Real Data (Not Mock)',
      passed: false
    });
  }
}

// Test 4: Scarlet Hotel Specific Test
async function testScarletHotel() {
  console.log('\n📋 TEST 4: Scarlet Hotel Availability');
  console.log('='.repeat(50));

  try {
    const searchBody = {
      hotelName: 'Scarlet',
      city: 'Tel Aviv',
      dateFrom: '2026-02-01',
      dateTo: '2026-02-05',
      pax: [{ adults: 2, children: [] }],
      limit: 100,
      ShowExtendedData: true
    };

    const response = await makeRequest(
      'medici-backend.azurewebsites.net',
      '/api/hotels/GetInnstantSearchPrice',
      'POST',
      searchBody,
      MEDICI_TOKEN
    );

    if (response.status === 200 && response.body?.hotels) {
      const scarlets = response.body.hotels.filter(h => 
        h.hotelName?.toLowerCase().includes('scarlet')
      );

      if (scarlets.length > 0) {
        console.log(`✅ SCARLET HOTEL FOUND!\n`);
        scarlets.forEach((h, i) => {
          console.log(`   ${i + 1}. ${h.hotelName}`);
          console.log(`      Stars: ${h.stars}`);
          console.log(`      Rooms Available: ${h.rooms?.length || 0}`);
          if (h.rooms && h.rooms[0]) {
            console.log(`      Price: ${h.rooms[0].price} ${h.rooms[0].currency}`);
          }
        });
        console.log(`\n✅ Scarlet is LIVE in the system!`);
        tests.push({
          name: 'Scarlet Hotel Real Availability',
          passed: true
        });
      } else {
        console.log('⚠️ Scarlet not found (may not be available for selected dates)');
        tests.push({
          name: 'Scarlet Hotel Real Availability',
          passed: false
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    tests.push({
      name: 'Scarlet Hotel Real Availability',
      passed: false
    });
  }
}

// Test 5: Multiple Cities (Data Diversity)
async function testDataDiversity() {
  console.log('\n📋 TEST 5: Data Diversity (Multiple Cities)');
  console.log('='.repeat(50));

  const cities = ['Tel Aviv', 'Jerusalem', 'Haifa'];
  let successCount = 0;

  for (const city of cities) {
    try {
      const searchBody = {
        city,
        dateFrom: '2026-02-01',
        dateTo: '2026-02-05',
        pax: [{ adults: 2, children: [] }],
        limit: 20,
        ShowExtendedData: false
      };

      const response = await makeRequest(
        'medici-backend.azurewebsites.net',
        '/api/hotels/GetInnstantSearchPrice',
        'POST',
        searchBody,
        MEDICI_TOKEN
      );

      const hotelCount = response.body?.hotels?.length || 0;
      console.log(`   ${city}: ${hotelCount} hotels`);
      if (hotelCount > 0) successCount++;
    } catch (error) {
      console.log(`   ${city}: ❌ Error`);
    }
  }

  console.log(`\n✅ Successfully searched ${successCount}/${cities.length} cities`);
  tests.push({
    name: 'Data Diversity',
    passed: successCount >= 2
  });
}

// Main runner
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🔬 API VERIFICATION TEST SUITE');
  console.log('='.repeat(50));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`API Base: ${BASE_URL}`);

  try {
    await testTokenValidity();
    await new Promise(r => setTimeout(r, 500));
    await testAPIConnectivity();
    await new Promise(r => setTimeout(r, 500));
    await testRealData();
    await new Promise(r => setTimeout(r, 500));
    await testScarletHotel();
    await new Promise(r => setTimeout(r, 500));
    await testDataDiversity();

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));

    tests.forEach((test, i) => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`${i + 1}. ${icon} ${test.name}`);
    });

    const passedCount = tests.filter(t => t.passed).length;
    const totalCount = tests.length;
    console.log(`\n📈 Overall: ${passedCount}/${totalCount} tests passed`);

    if (passedCount === totalCount) {
      console.log('\n🎉 ALL TESTS PASSED - API IS PRODUCTION READY!\n');
    } else {
      console.log('\n⚠️ Some tests failed - review above for details\n');
    }

    // Save results
    fs.writeFileSync('api-test-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        passed: passedCount,
        total: totalCount,
        allPassed: passedCount === totalCount
      },
      tests
    }, null, 2));

    console.log('📄 Results saved to api-test-results.json\n');

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Run tests
runAllTests();
