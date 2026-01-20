const fs = require('fs');

// Run a search and save results
const https = require('https');

const BEARER_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGFydG5lcnNoaXBzQGtub3dhYWdsb2JhbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI0IiwiZXhwIjozNjE0NDc5NTA1fQ.b3_6IHKT75ZBh-TDhbKn02Tky2dPGgzbHFH9sDsIoqQ';

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
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Searching Tel Aviv hotels...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.hotels) {
        console.log(`Found ${result.hotels.length} hotels total\n`);
        
        // Search for Scarlet
        const scarlet = result.hotels.find(h => 
          h.hotelName && h.hotelName.toLowerCase().includes('scarlet')
        );
        
        if (scarlet) {
          console.log('✅ SCARLET HOTEL FOUND!');
          console.log(JSON.stringify(scarlet, null, 2));
        } else {
          console.log('❌ Scarlet not found. First 10 hotels:');
          result.hotels.slice(0, 10).forEach((h, i) => {
            console.log(`${i+1}. ${h.hotelName} - ${h.cityName}`);
          });
        }
        
        fs.writeFileSync('scarlet-search-results.json', JSON.stringify(result, null, 2));
        console.log('\nFull results saved to scarlet-search-results.json');
      }
    } catch (e) {
      console.error('Error:', e.message);
      fs.writeFileSync('scarlet-error.txt', data);
    }
  });
});

req.on('error', (e) => console.error('Request error:', e.message));
req.write(postData);
req.end();
