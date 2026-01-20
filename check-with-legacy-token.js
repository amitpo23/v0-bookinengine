const https = require('https');
const fs = require('fs');

const LEGACY_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE';

const searchBody = {
  city: 'Tel Aviv',
  dateFrom: '2026-02-01',
  dateTo: '2026-02-05',
  pax: [{ adults: 2, children: [] }],
  limit: 100,
  ShowExtendedData: true
};

const postData = JSON.stringify(searchBody);

const options = {
  hostname: 'medici-backend.azurewebsites.net',
  path: '/api/hotels/GetInnstantSearchPrice',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LEGACY_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔍 Searching Tel Aviv hotels with Legacy token...');

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.hotels) {
        console.log(`✅ Found ${result.hotels.length} hotels total\n`);
        
        // Search for Scarlet
        const scarlet = result.hotels.filter(h => 
          h.hotelName && h.hotelName.toLowerCase().includes('scarlet')
        );
        
        if (scarlet.length > 0) {
          console.log(`🎯 FOUND ${scarlet.length} SCARLET HOTEL(S)!\n`);
          scarlet.forEach((h, i) => {
            console.log(`${i+1}. ${h.hotelName}`);
            console.log(`   City: ${h.cityName || 'N/A'}`);
            console.log(`   Stars: ${h.stars || 'N/A'}`);
            console.log(`   Rooms: ${h.rooms?.length || 0}`);
            if (h.rooms && h.rooms[0]) {
              console.log(`   Price: ${h.rooms[0].price} ${h.rooms[0].currency}`);
            }
            console.log('');
          });
        } else {
          console.log('❌ No Scarlet hotel found\n');
          console.log('📋 First 20 hotels:');
          result.hotels.slice(0, 20).forEach((h, i) => {
            console.log(`${i+1}. ${h.hotelName} (${h.cityName || 'N/A'})`);
          });
        }
        
        fs.writeFileSync('legacy-search-results.json', JSON.stringify(result, null, 2));
        console.log('\n✅ Full results saved to legacy-search-results.json');
      } else {
        console.log('❌ No hotels in response');
        console.log(JSON.stringify(result, null, 2).substring(0, 500));
      }
    } catch (e) {
      console.error('❌ Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('❌ Request error:', e.message));
req.write(postData);
req.end();
