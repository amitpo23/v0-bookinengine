#!/usr/bin/env node

const http = require('http');

const searchParams = new URLSearchParams({
  action: 'search',
  hotelName: 'Scarlet',
  dateFrom: '2026-02-01',
  dateTo: '2026-02-05'
});

const url = `http://localhost:3000/api/test-knowaa?${searchParams}`;

console.log('Searching for Scarlet hotel...\n');

http.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('=== SEARCH RESULTS ===');
      console.log(`Success: ${result.success}`);
      console.log(`Total Hotels Found: ${result.count || 0}`);
      
      if (result.hotels && result.hotels.length > 0) {
        console.log('\n=== HOTELS ===');
        result.hotels.forEach((hotel, index) => {
          console.log(`\n${index + 1}. ${hotel.name}`);
          console.log(`   City: ${hotel.city}`);
          console.log(`   Price: ${hotel.price} ${hotel.currency}`);
          console.log(`   Stars: ${hotel.stars || 'N/A'}`);
          if (hotel.name.toLowerCase().includes('scarlet')) {
            console.log('   ⭐ THIS IS SCARLET HOTEL! ⭐');
          }
        });
      } else {
        console.log('\nNo hotels found with "Scarlet" in the name.');
        console.log('Trying broader search...');
      }
      
      if (result.error) {
        console.log('\nError:', result.error);
      }
    } catch (e) {
      console.error('Failed to parse response:', e.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  console.log('\nMake sure the dev server is running: pnpm dev');
});
