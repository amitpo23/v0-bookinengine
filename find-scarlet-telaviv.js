const https = require('https');

const TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

const payload = JSON.stringify({
  hotelName: 'Scarlet',
  dateFrom: '2027-02-04',
  dateTo: '2027-02-08',
  pax: [{ adults: 1, children: [] }],
  ShowExtendedData: true,
  limit: 50
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

console.log('🔍 Searching for "Scarlet" hotels with Knowaa token...\n');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response length: ${data.length} bytes\n`);
    
    if (!data || data.length === 0) {
      console.log('❌ Empty response from API');
      return;
    }
    
    try {
      const result = JSON.parse(data);
      const hotels = result.items || [];
      
      console.log(`✅ Found ${hotels.length} hotels matching "Scarlet"\n`);
      
      // Show ALL hotels
      console.log('All hotels found:');
      hotels.forEach((h, idx) => {
        console.log(`\n${idx + 1}. ${h.name || 'N/A'}`);
        console.log(`   ID: ${h.id || h.hotelId || 'N/A'}`);
        console.log(`   Address: ${h.address || 'N/A'}`);
        console.log(`   City: ${h.city || 'N/A'}`);
        console.log(`   Stars: ${h.stars || 'N/A'}⭐`);
        console.log(`   Price From: $${h.priceFrom || 'N/A'}`);
      });
      
      console.log('\n═══════════════════════════════════════\n');
      
      // Search for Scarlet or Gordon Street
      const scarlet = hotels.find(h => {
        const name = (h.name || '').toLowerCase();
        const address = (h.address || '').toLowerCase();
        return name.includes('scarlet') || 
               address.includes('gordon') ||
               address.includes('j. l. gordon') ||
               address.includes('ג׳ורדון');
      });
      
      if (scarlet) {
        console.log('🎯 FOUND MATCH!\n');
        console.log('═══════════════════════════════════════');
        console.log(`Hotel Name: ${scarlet.name}`);
        console.log(`Hotel ID: ${scarlet.id || scarlet.hotelId}`);
        console.log(`Address: ${scarlet.address || 'N/A'}`);
        console.log(`Stars: ${scarlet.stars || 'N/A'}⭐`);
        console.log(`Price From: $${scarlet.priceFrom || 'N/A'}`);
        console.log('═══════════════════════════════════════\n');
        
        const rooms = scarlet.items || [];
        console.log(`🛏️  ROOM TYPES (${rooms.length} found):\n`);
        
        rooms.forEach((room, idx) => {
          console.log(`${idx + 1}. ${room.name || room.category || 'Unknown'}`);
          console.log(`   Category: ${room.category || 'N/A'}`);
          console.log(`   Bedding: ${room.bedding || 'N/A'}`);
          console.log(`   Price: $${room.price || room.priceFrom || 'N/A'}`);
          console.log(`   Board: ${room.board || 'N/A'}`);
          console.log(`   Refundable: ${room.refundable ? 'Yes' : 'No'}`);
          console.log('');
        });
        
        // Output for easy parsing
        console.log('\n📋 SUMMARY FOR MAPPING:');
        console.log(`Hotel ID: ${scarlet.id || scarlet.hotelId}`);
        console.log(`Total Rooms: ${rooms.length}`);
        console.log('Unique Room Names:');
        const uniqueRooms = [...new Set(rooms.map(r => r.name || r.category))];
        uniqueRooms.forEach(name => console.log(`  - ${name}`));
        
      } else {
        console.log('❌ SCARLET/GORDON NOT FOUND in Tel Aviv results');
        console.log(`\nAll ${hotels.length} hotel names:`);
        const uniqueNames = [...new Set(hotels.map(h => h.name))].sort();
        uniqueNames.forEach((name, idx) => {
          console.log(`${idx + 1}. ${name}`);
        });
      }
      
    } catch (err) {
      console.error('Error parsing response:', err.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(payload);
req.end();
