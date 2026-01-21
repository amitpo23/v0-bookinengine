const https = require('https');

const TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

const payload = JSON.stringify({
  city: 'Tel Aviv',
  dateFrom: '2027-02-04',
  dateTo: '2027-02-08', 
  pax: [{ adults: 1, children: [] }],
  ShowExtendedData: true,
  limit: 100
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

console.log('🔍 Deep search in Tel Aviv for ANY potential Scarlet matches...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      const hotels = result.items || [];
      
      console.log(`✅ Found ${hotels.length} hotels in Tel Aviv\n`);
      
      // Print ALL hotel details for inspection
      hotels.forEach((hotel, idx) => {
        const name = hotel.name || 'N/A';
        const address = hotel.address || 'N/A'; 
        const id = hotel.id || hotel.hotelId || 'N/A';
        const desc = hotel.description || '';
        const seoname = hotel.seoname || '';
        
        // Look for any scarlet-related keywords
        const searchText = `${name} ${address} ${desc} ${seoname}`.toLowerCase();
        const hasScarlet = searchText.includes('scarlet');
        const hasGordon = searchText.includes('gordon');
        const hasRed = searchText.includes('red') || searchText.includes('אדום');
        
        if (hasScarlet || hasGordon || hasRed || 
            name.toLowerCase().includes('scar') ||
            address.toLowerCase().includes('gordon')) {
          console.log(`🎯 POTENTIAL MATCH ${idx + 1}:`);
          console.log(`   Name: ${name}`);
          console.log(`   ID: ${id}`);
          console.log(`   Address: ${address}`);
          if (desc) console.log(`   Description: ${desc.substring(0, 100)}...`);
          if (seoname) console.log(`   SEO: ${seoname}`);
          console.log('');
        }
      });
      
      // Also show hotels on Gordon street
      console.log('🏨 Hotels on Gordon Street or similar addresses:');
      const gordonHotels = hotels.filter(h => 
        (h.address || '').toLowerCase().includes('gordon') ||
        (h.address || '').toLowerCase().includes('ג׳ורדון')
      );
      
      if (gordonHotels.length > 0) {
        gordonHotels.forEach((hotel, idx) => {
          console.log(`${idx + 1}. ${hotel.name} (ID: ${hotel.id || hotel.hotelId})`);
          console.log(`   Address: ${hotel.address}`);
          console.log('');
        });
      } else {
        console.log('❌ No hotels found on Gordon Street');
      }
      
      console.log('\n📋 All unique hotel names:');
      const uniqueNames = [...new Set(hotels.map(h => h.name))].sort();
      uniqueNames.forEach((name, idx) => {
        console.log(`${idx + 1}. ${name}`);
      });
      
    } catch (e) {
      console.error('Error:', e.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(payload);
req.end();