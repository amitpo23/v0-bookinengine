const https = require('https');

// טוקן Knowaa מה-medici-client.ts
const KNOWAA_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

console.log('🔍 Scarlet Hotel Tel Aviv - Multi-Strategy Search Test');
console.log('══════════════════════════════════════════════════════\n');

// פונקציה לביצוע API request
async function makeRequest(payload, testName) {
  return new Promise((resolve) => {
    const payloadStr = JSON.stringify(payload);
    
    const options = {
      hostname: 'medici-backend.azurewebsites.net',
      path: '/api/hotels/GetInnstantSearchPrice',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KNOWAA_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
      }
    };

    console.log(`\n🚀 ${testName}`);
    console.log(`   Parameters: ${JSON.stringify(payload, null, 2).substring(0, 100)}...`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const hotels = result.items || [];
          
          // חיפוש Scarlet בדרכים שונות
          const scarletHotels = hotels.filter(h => {
            const name = (h.name || '').toLowerCase();
            const address = (h.address || '').toLowerCase();
            const hotelId = String(h.id || h.hotelId || '');
            
            return (
              name.includes('scarlet') ||
              address.includes('gordon') ||
              address.includes('j. l. gordon') ||
              hotelId === '863233' ||
              hotelId === '12466' ||
              hotelId === '5054'
            );
          });
          
          console.log(`   📊 Status: ${res.statusCode}`);
          console.log(`   🏨 Total Hotels: ${hotels.length}`);
          console.log(`   🎯 Scarlet Found: ${scarletHotels.length}`);
          
          if (scarletHotels.length > 0) {
            console.log(`   ✅ SUCCESS!`);
            scarletHotels.forEach((hotel, idx) => {
              console.log(`\n   🏨 Scarlet Hotel #${idx + 1}:`);
              console.log(`      Name: ${hotel.name}`);
              console.log(`      ID: ${hotel.id || hotel.hotelId}`);
              console.log(`      Address: ${hotel.address || 'N/A'}`);
              console.log(`      Stars: ${hotel.stars || 'N/A'}⭐`);
              console.log(`      Rooms: ${(hotel.items || []).length}`);
              
              // הצג חדרים ראשונים
              if (hotel.items && hotel.items.length > 0) {
                console.log(`      First 3 Rooms:`);
                hotel.items.slice(0, 3).forEach((room, ridx) => {
                  console.log(`        ${ridx + 1}. ${room.name || room.category || 'Unknown'} - $${room.price || hotel.price?.amount || 'N/A'}`);
                });
              }
            });
            
            resolve({ success: true, scarletHotels, totalHotels: hotels.length, testName });
          } else {
            console.log(`   ❌ Scarlet NOT found`);
            if (hotels.length > 0) {
              console.log(`   📝 First 5 hotels found:`);
              hotels.slice(0, 5).forEach((h, idx) => {
                console.log(`      ${idx + 1}. ${h.name} (ID: ${h.id || h.hotelId})`);
              });
            }
            resolve({ success: false, scarletHotels: [], totalHotels: hotels.length, testName });
          }
        } catch (e) {
          console.log(`   ❌ ERROR: ${e.message}`);
          console.log(`   📄 Raw response (first 200 chars): ${data.substring(0, 200)}`);
          resolve({ success: false, error: e.message, testName });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   ❌ Request error: ${e.message}`);
      resolve({ success: false, error: e.message, testName });
    });

    req.write(payloadStr);
    req.end();
  });
}

async function runAllTests() {
  const baseParams = {
    dateFrom: '2026-02-10',
    dateTo: '2026-02-12',
    pax: [{ adults: 2, children: [] }],
    ShowExtendedData: true
  };

  const testStrategies = [
    // Strategy 1: Direct hotel name search
    {
      ...baseParams,
      hotelName: 'Scarlet'
    },
    
    // Strategy 2: Alternate names
    {
      ...baseParams,
      hotelName: 'The Scarlet'
    },
    
    // Strategy 3: Full name
    {
      ...baseParams,
      hotelName: 'Scarlet Hotel'
    },
    
    // Strategy 4: Tel Aviv city search (small limit)
    {
      ...baseParams,
      city: 'Tel Aviv',
      limit: 20
    },
    
    // Strategy 5: Tel Aviv city search (large limit)
    {
      ...baseParams,
      city: 'Tel Aviv',
      limit: 100
    },
    
    // Strategy 6: Tel Aviv-Yafo variant
    {
      ...baseParams,
      city: 'Tel Aviv-Yafo'
    }
  ];

  const results = [];
  
  for (let i = 0; i < testStrategies.length; i++) {
    const strategy = testStrategies[i];
    const testName = strategy.hotelName 
      ? `STRATEGY ${i + 1}: Search by hotelName="${strategy.hotelName}"`
      : `STRATEGY ${i + 1}: Search by city="${strategy.city}" (limit: ${strategy.limit || 'default'})`;
    
    const result = await makeRequest(strategy, testName);
    results.push(result);
    
    // תן זמן קצר בין requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n📋 SUMMARY OF ALL TESTS:');
  console.log('══════════════════════════════════════════════════════');
  
  let successfulTests = 0;
  let totalScarletFound = 0;
  
  results.forEach((result, idx) => {
    const status = result.success ? '✅' : '❌';
    const scarletCount = result.scarletHotels ? result.scarletHotels.length : 0;
    
    console.log(`${status} Test ${idx + 1}: ${result.testName.split(':')[1]} - Found ${scarletCount} Scarlet hotels`);
    
    if (result.success) {
      successfulTests++;
      totalScarletFound += scarletCount;
    }
  });
  
  console.log(`\n📊 FINAL RESULTS:`);
  console.log(`   ✅ Successful tests: ${successfulTests}/${results.length}`);
  console.log(`   🎯 Total Scarlet hotels found: ${totalScarletFound}`);
  console.log(`   🏨 Best strategy: ${results.find(r => r.success && r.scarletHotels?.length > 0)?.testName || 'None found'}`);
  
  if (totalScarletFound === 0) {
    console.log(`\n⚠️  WARNING: No Scarlet Hotel found with any strategy!`);
    console.log(`   This needs investigation - check if:`);
    console.log(`   1. Hotel name is different in the system`);
    console.log(`   2. Hotel is not available in Tel Aviv`);
    console.log(`   3. Token permissions are limited`);
  } else {
    console.log(`\n🎉 SUCCESS: Scarlet Hotel Tel Aviv found and accessible!`);
    console.log(`   Ready to implement in template.`);
  }
}

// רץ את כל הבדיקות
runAllTests().catch(console.error);