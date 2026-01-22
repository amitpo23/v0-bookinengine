const fetch = require('node-fetch');

async function testApi() {
  for (let port of [3000, 3001, 3002]) {
    try {
      const url = `http://localhost:${port}/api/hotels/search`;
      console.log(`\n🔗 Trying ${url}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: 'Tel Aviv',
          dateFrom: '2026-02-10',
          dateTo: '2026-02-11',
          adults: 2,
          children: []
        }),
        timeout: 5000
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        console.log(`\n✅ Found working server on port ${port}!\n`);
        console.log('📊 Hotels found:', data.data.length);
        console.log('\n🏨 Hotels:');
        data.data.forEach((h, i) => {
          console.log(`${i+1}. ${h.hotelName} (ID: ${h.hotelId}) - ${h.rooms?.length || 0} rooms`);
        });
        
        const scarlet = data.data.find(h => h.hotelName.toLowerCase().includes('scarlet'));
        if (scarlet) {
          console.log('\n✅ SCARLET FOUND!');
          console.log(`   Name: ${scarlet.hotelName}`);
          console.log(`   ID: ${scarlet.hotelId}`);
          console.log(`   City: ${scarlet.city}`);
          console.log(`   Stars: ${scarlet.stars}⭐`);
          console.log(`   Rooms: ${scarlet.rooms.length}`);
          scarlet.rooms.forEach((r, i) => {
            console.log(`     ${i+1}. ${r.roomName} - ₪${r.buyPrice}`);
          });
        } else {
          console.log('\n❌ Scarlet not found');
        }
        return;
      }
    } catch (err) {
      console.log(`❌ Port ${port}: ${err.message}`);
    }
  }
  console.log('\n❌ No working server found');
}

testApi();
