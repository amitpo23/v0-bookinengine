#!/usr/bin/env node

const https = require('https');

// Your Knowaa Bearer Token from env
const BEARER_TOKEN = process.env.KNOWAA_BEARER_TOKEN || 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGFydG5lcnNoaXBzQGtub3dhYWdsb2JhbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI0IiwiZXhwIjozNjE0NDc5NTA1fQ.b3_6IHKT75ZBh-TDhbKn02Tky2dPGgzbHFH9sDsIoqQ';

const searchBody = {
  // Search specifically for Scarlet hotel in Tel Aviv
  hotelName: 'Scarlet',
  city: 'Tel Aviv',
  dateFrom: '2026-02-01',
  dateTo: '2026-02-05',
  pax: [
    {
      adults: 2,
      children: []
    }
  ],
  stars: null,
  limit: 50,
  ShowExtendedData: true
};

console.log('🔍 Searching for Scarlet Hotel in Tel Aviv...\n');
console.log('📤 Request:', JSON.stringify(searchBody, null, 2));

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

const req = https.request(options, (res) => {
  console.log(`📥 Response Status: ${res.statusCode} ${res.statusMessage}\n`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success && result.hotels) {
        console.log(`✅ Success! Found ${result.hotels.length} hotels\n`);
        
        // Look for Scarlet specifically
        const scarletHotels = result.hotels.filter(h => 
          h.hotelName && h.hotelName.toLowerCase().includes('scarlet')
        );
        
        if (scarletHotels.length > 0) {
          console.log('🎯 FOUND SCARLET HOTEL(S)!\n');
          scarletHotels.forEach((hotel, index) => {
            console.log(`${index + 1}. ${hotel.hotelName}`);
            console.log(`   City: ${hotel.cityName || 'N/A'}`);
            console.log(`   Address: ${hotel.address || 'N/A'}`);
            console.log(`   Stars: ${hotel.stars || 'N/A'}`);
            console.log(`   Rooms Available: ${hotel.rooms?.length || 0}`);
            if (hotel.rooms && hotel.rooms.length > 0) {
              console.log(`   First Room Price: ${hotel.rooms[0].price} ${hotel.rooms[0].currency}`);
            }
            console.log('');
          });
        } else {
          console.log('❌ No Scarlet hotel found in results.\n');
          console.log('📋 All hotels found:');
          result.hotels.slice(0, 10).forEach((hotel, index) => {
            console.log(`${index + 1}. ${hotel.hotelName || 'N/A'}`);
            console.log(`   City: ${hotel.cityName || 'N/A'}`);
            console.log(`   Stars: ${hotel.stars || 'N/A'}`);
            console.log('');
          });
        }
        
        console.log(`📊 Total results: ${result.hotels.length}`);
      } else {
        console.log('❌ Search failed or returned no results');
        console.log('Response:', JSON.stringify(result, null, 2));
      }
    } catch (e) {
      console.error('❌ Failed to parse response:', e.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(postData);
req.end();
