const https = require('https');

const TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

function testHotelId(hotelId, testName) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      hotelIds: [hotelId],
      dateFrom: '2027-02-04',
      dateTo: '2027-02-08',
      pax: [{ adults: 1, children: [] }],
      ShowExtendedData: true
    });

    const options = {
      hostname: 'medici-backend.azurewebsites.net',
      path: '/api/hotels/GetInnstantSearchPrice',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`\n${testName}:`);
        console.log(`Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            const hotels = result.items || [];
            
            if (hotels.length > 0) {
              const hotel = hotels[0];
              console.log(`✅ FOUND HOTEL!`);
              console.log(`Name: ${hotel.name || 'N/A'}`);
              console.log(`ID: ${hotel.id || hotel.hotelId || 'N/A'}`);
              console.log(`Address: ${hotel.address || 'N/A'}`);
              console.log(`City: ${hotel.city || 'N/A'}`);
              console.log(`Stars: ${hotel.stars || 'N/A'}⭐`);
              console.log(`Rooms: ${(hotel.items || []).length}`);
              
              // Check if address contains Gordon or Tel Aviv
              const address = (hotel.address || '').toLowerCase();
              const city = (hotel.city || '').toLowerCase();
              if (address.includes('gordon') || city.includes('tel aviv')) {
                console.log(`🎯 TEL AVIV MATCH - Gordon Street!`);
              } else {
                console.log(`📍 Location: ${hotel.address}, ${hotel.city}`);
              }
              
            } else {
              console.log(`❌ No hotels found`);
            }
          } catch (e) {
            console.log(`Error: ${e.message}`);
          }
        } else {
          console.log(`❌ Status: ${res.statusCode}`);
          console.log(`Response: ${data.substring(0, 100)}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n${testName}:`);
      console.log(`Error: ${e.message}`);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function runDirectTests() {
  console.log('🔍 Testing Direct Hotel IDs...\n');
  console.log('═══════════════════════════════════════');
  
  // Test known IDs
  await testHotelId(12466, 'TEST: Hotel ID 12466 (Scarlet Singapore?)');
  await testHotelId('12466', 'TEST: Hotel ID "12466" (String)');
  await testHotelId(5054, 'TEST: Hotel ID 5054 (User mentioned)');
  await testHotelId('5054', 'TEST: Hotel ID "5054" (String)');
  await testHotelId(863233, 'TEST: Hotel ID 863233 (Found in code)');
  
  // Try some other possible IDs
  await testHotelId(839235, 'TEST: Hotel ID 839235 (Fallback from docs)');
  
  console.log('\n═══════════════════════════════════════');
  console.log('Direct ID tests complete!');
}

runDirectTests();