// Test script for API
const fetch = require('node-fetch');

async function testApi() {
  try {
    console.log('🚀 Testing /api/hotels/search endpoint...\n');
    
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
    
    console.log('✅ API Response received');
    console.log('📊 Hotels found:', data.data?.length || 0);
    console.log('');
    
    if (data.data && data.data.length > 0) {
      console.log('🏨 First 5 hotels:');
      data.data.slice(0, 5).forEach((h, i) => {
        console.log(`${i+1}. ${h.hotelName} (ID: ${h.hotelId}) - ${h.rooms?.length || 0} rooms`);
      });
      
      console.log('\n🔍 Looking for Scarlet...');
      const scarlet = data.data.find(h => h.hotelName.toLowerCase().includes('scarlet'));
      if (scarlet) {
        console.log('✅ FOUND! Scarlet:', scarlet.hotelName, '(ID:', scarlet.hotelId + ')');
        console.log('📍 City:', scarlet.city);
        console.log('⭐ Stars:', scarlet.stars);
        console.log('📝 Description:', scarlet.description?.substring(0, 80) + '...');
        console.log('\n🛏️  Rooms (' + scarlet.rooms.length + '):');
        scarlet.rooms.forEach((r, i) => {
          console.log(`  ${i+1}. ${r.roomName}`);
          console.log(`     Code: ${r.code}`);
          console.log(`     Price: ₪${r.buyPrice}`);
          console.log(`     Occupancy: ${r.maxOccupancy} guests`);
          console.log(`     Available: ${r.available}`);
        });
      } else {
        console.log('❌ Scarlet not found in results');
        console.log('\nAll hotel names:');
        data.data.forEach((h, i) => {
          console.log(`${i+1}. ${h.hotelName}`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testApi();
