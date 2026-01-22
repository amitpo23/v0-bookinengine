const https = require('https');

const TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

function makeRequest(payload, testName) {
  return new Promise((resolve) => {
    const payloadStr = JSON.stringify(payload);
    
    const options = {
      hostname: 'medici-backend.azurewebsites.net',
      path: '/api/hotels/GetInnstantSearchPrice',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const hotels = result.items || [];
          
          const scarlet = hotels.find(h => 
            (h.name || '').toLowerCase().includes('scarlet') ||
            (h.address || '').toLowerCase().includes('gordon')
          );
          
          console.log(`\n${testName}:`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Hotels: ${hotels.length}`);
          if (scarlet) {
            console.log(`✅ FOUND SCARLET: ${scarlet.name} (ID: ${scarlet.id || scarlet.hotelId})`);
          } else {
            console.log(`❌ No Scarlet`);
            if (hotels.length > 0) {
              console.log(`First 3: ${hotels.slice(0, 3).map(h => h.name).join(', ')}`);
            }
          }
          resolve(scarlet);
        } catch (e) {
          console.log(`\n${testName}:`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Error: ${e.message}`);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`\n${testName}:`);
      console.log(`Error: ${e.message}`);
      resolve(null);
    });

    req.write(payloadStr);
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing multiple search parameters...\n');
  console.log('═══════════════════════════════════════');
  
  const baseParams = {
    dateFrom: '2027-02-04',
    dateTo: '2027-02-08',
    pax: [{ adults: 1, children: [] }],
    ShowExtendedData: true
  };

  // TEST 1: city name
  await makeRequest({
    ...baseParams,
    city: 'Tel Aviv',
    limit: 100
  }, 'TEST 1: city="Tel Aviv"');

  // TEST 2: city name variant
  await makeRequest({
    ...baseParams,
    city: 'Tel Aviv-Yafo',
    limit: 100
  }, 'TEST 2: city="Tel Aviv-Yafo"');

  // TEST 3: Try destination
  await makeRequest({
    ...baseParams,
    destinations: [{ id: 6117, type: 'location' }],
    limit: 100
  }, 'TEST 3: destinations (Tel Aviv)');

  // TEST 4: hotel ID directly
  await makeRequest({
    ...baseParams,
    hotelIds: ['5054']
  }, 'TEST 4: hotelIds=["5054"]');

  // TEST 5: hotel ID as number
  await makeRequest({
    ...baseParams,
    hotelIds: [5054]
  }, 'TEST 5: hotelIds=[5054]');

  // TEST 6: Different dates
  await makeRequest({
    city: 'Tel Aviv',
    dateFrom: '2026-03-01',
    dateTo: '2026-03-05',
    pax: [{ adults: 2, children: [] }],
    ShowExtendedData: true,
    limit: 150
  }, 'TEST 6: Different dates + 2 adults');

  console.log('\n═══════════════════════════════════════');
  console.log('Tests complete!');
}

runTests();
