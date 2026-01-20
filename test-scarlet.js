const fetch = require('node-fetch');

async function testScarlet() {
  try {
    console.log('🔗 Testing Scarlet Hotel search...\n');
    
    const response = await fetch('http://localhost:3000/api/hotels/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: 'Tel Aviv',
        dateFrom: '2026-02-10',
        dateTo: '2026-02-11',
        adults: 2,
        children: []
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ API Error:', data.error);
      return;
    }
    
    console.log('📊 Total hotels:', data.data.length);
    console.log('\n🏨 All hotels:');
    data.data.forEach((h, i) => {
      if (h.hotelName) {
        console.log(`${i}. ${h.hotelName} (ID: ${h.hotelId}) - ${h.rooms?.length || 0} rooms`);
      }
    });
    
    // Filter for Scarlet
    const scarlet = data.data.find(h => h.hotelName && h.hotelName.toLowerCase().includes('scarlet'));
    
    if (scarlet) {
      console.log('\n✅✅✅ SCARLET FOUND! ✅✅✅');
      console.log(`\n📍 ${scarlet.hotelName}`);
      console.log(`   Hotel ID: ${scarlet.hotelId}`);
      console.log(`   City: ${scarlet.city}`);
      console.log(`   Rating: ${scarlet.stars}⭐`);
      console.log(`   Address: ${scarlet.address}`);
      console.log(`   Rooms available: ${scarlet.rooms.length}`);
      console.log('\n🛏️  Room Types:');
      
      scarlet.rooms.forEach((room, idx) => {
        console.log(`\n   ${idx+1}. ${room.roomName}`);
        console.log(`      ID: ${room.roomId}`);
        console.log(`      Code: ${room.code}`);
        console.log(`      Price: ₪${room.buyPrice}`);
        console.log(`      Occupancy: ${room.maxOccupancy} guests`);
        console.log(`      Size: ${room.size}m²`);
        console.log(`      Amenities: ${room.amenities.join(', ')}`);
      });
      
      console.log('\n✅✅✅ All data looks correct! ✅✅✅');
    } else {
      console.log('\n❌ Scarlet NOT found');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testScarlet();
