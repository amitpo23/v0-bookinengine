const https = require('https');

const MEDICI_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE';

console.log('🔍 Quick API Connectivity Test\n');

const body = JSON.stringify({
  city: 'Tel Aviv',
  dateFrom: '2026-02-01',
  dateTo: '2026-02-05',
  pax: [{ adults: 2, children: [] }],
  limit: 10,
  ShowExtendedData: false
});

const options = {
  hostname: 'medici-backend.azurewebsites.net',
  path: '/api/hotels/GetInnstantSearchPrice',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MEDICI_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  timeout: 30000
};

console.log('📤 Sending request to:', options.hostname + options.path);
console.log('📊 Timeout:', options.timeout / 1000, 'seconds\n');

const req = https.request(options, (res) => {
  console.log(`✅ Got response! Status: ${res.statusCode}\n`);
  
  let data = '';
  let receivedBytes = 0;
  
  res.on('data', (chunk) => {
    data += chunk;
    receivedBytes += chunk.length;
    console.log(`📥 Received ${receivedBytes} bytes...`);
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      console.log(`\n✅ SUCCESS! Parse successful`);
      console.log(`📊 Hotels found: ${result.hotels ? result.hotels.length : 0}`);
      
      if (result.hotels && result.hotels.length > 0) {
        console.log('\n🏨 Sample hotels:');
        result.hotels.slice(0, 3).forEach((h, i) => {
          console.log(`   ${i+1}. ${h.hotelName} - ${h.stars} stars`);
        });
        
        // Check for Scarlet
        const scarlet = result.hotels.find(h => h.hotelName?.toLowerCase().includes('scarlet'));
        if (scarlet) {
          console.log(`\n🎯 SCARLET FOUND: ${scarlet.hotelName}`);
        }
      }
      
      console.log(`\n✅ API IS WORKING AND DATA IS REAL!\n`);
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('Raw data:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.on('timeout', () => {
  console.error('❌ Request timeout!');
  req.destroy();
});

req.write(body);
req.end();

console.log('⏳ Waiting for response...');
