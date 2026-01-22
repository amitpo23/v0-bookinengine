const fetch = require('node-fetch');

async function testLiveAPI() {
  console.log('🌐 Testing LIVE Scarlet API...\n');
  
  const url = 'https://youraitravelagent.com/api/hotels/search';
  const payload = {
    hotelIds: ['2022882'], // Scarlet Hotel Tel Aviv
    checkIn: '2024-12-25',
    checkOut: '2024-12-27',
    adults: 2,
    children: 0
  };

  try {
    console.log('📡 Making request to:', url);
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('\n📊 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('\n✅ Success! Hotel data received:');
    
    if (data.hotels && data.hotels.length > 0) {
      const hotel = data.hotels[0];
      console.log(`🏨 Hotel: ${hotel.name}`);
      console.log(`📍 Location: ${hotel.address}`);
      
      if (hotel.rooms && hotel.rooms.length > 0) {
        console.log(`🛏️  Available rooms: ${hotel.rooms.length}`);
        hotel.rooms.forEach((room, i) => {
          console.log(`   Room ${i+1}: ${room.name} - $${room.price}/night`);
        });
      } else {
        console.log('⚠️  No rooms found');
      }
    } else {
      console.log('⚠️  No hotels found');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testLiveAPI();