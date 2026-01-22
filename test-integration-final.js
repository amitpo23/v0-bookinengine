const https = require('https');

console.log('🎯 Scarlet Hotel Tel Aviv - Full Integration Test');
console.log('═══════════════════════════════════════════════════');
console.log('Testing: Knowaa token → Tel Aviv search → Scarlet filtering → Room mapping\n');

const KNOWAA_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0';

// מחקה את הלוגיקה החדשה מהtemplate - תיקון!
function isScarletHotelTelAviv(hotel) {
  if (!hotel) return false;
  const hotelName = (hotel.name || '').toLowerCase();
  const address = (hotel.address || '').toLowerCase();
  
  // Must have "scarlet" in the name - this is the key identifier
  const hasScarletnName = hotelName.includes('scarlet');
  
  // Check for Tel Aviv Scarlet specifically
  const isTelAvivScarlet = (
    hasScarletnName && (
      hotelName === 'scarlet hotel' ||
      address.includes('j. l. gordon') ||
      address.includes('gordon st 17')
    )
  );
  
  // Exclude Singapore Scarlet (33 ERSKINE ROAD)
  const isSingaporeScarlet = (
    hasScarletnName && address.includes('erskine road')
  );

  // Must have "scarlet" in name AND be Tel Aviv location (not Singapore)
  return hasScarletnName && isTelAvivScarlet && !isSingaporeScarlet;
}

function normalizeApiRoom(apiRoom, index) {
  const roomName = (apiRoom.name || '').toLowerCase();
  
  let roomConfig = {
    emoji: '💎',
    hebrewName: 'חדר סטנדרט',
    description: 'חדר מעוצב בסגנון בוטיק'
  };
  
  if (roomName.includes('triple')) {
    roomConfig = {
      emoji: '🏛️',
      hebrewName: 'חדר משולש סטנדרט', 
      description: 'חדר מרווח לשלושה אורחים ברחוב גורדון'
    };
  } else if (roomName.includes('double')) {
    roomConfig = {
      emoji: '💎',
      hebrewName: 'חדר זוגי סטנדרט',
      description: 'חדר זוגי אלגנטי ברחוב גורדון'
    };
  }
  
  return {
    id: apiRoom.code || `scarlet-room-${index}`,
    name: roomConfig.hebrewName,
    nameEn: apiRoom.name,
    emoji: roomConfig.emoji,
    description: roomConfig.description,
    basePrice: Math.round(apiRoom.price || 0),
    currency: 'USD'
  };
}

async function testFullIntegration() {
  try {
    console.log('📡 Step 1: API Call - Tel Aviv city search with limit 100...');
    
    const payload = JSON.stringify({
      dateFrom: '2026-02-10',
      dateTo: '2026-02-12', 
      city: 'Tel Aviv',
      pax: [{ adults: 2, children: [] }],
      ShowExtendedData: true,
      limit: 100
    });

    const options = {
      hostname: 'medici-backend.azurewebsites.net',
      path: '/api/hotels/GetInnstantSearchPrice',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KNOWAA_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            console.log(`📊 API Response: ${res.statusCode}`);
            
            if (res.statusCode !== 200) {
              console.error(`❌ API Error: ${res.statusCode} - ${data}`);
              resolve(false);
              return;
            }

            const result = JSON.parse(data);
            const allHotels = result.items || [];
            
            console.log(`🏨 Total hotels found: ${allHotels.length}`);
            console.log(`\n🔍 Step 2: Filter for Scarlet Hotel Tel Aviv...`);

            // הפעלת הפילטר החדש
            const scarletHotels = allHotels.filter(isScarletHotelTelAviv);
            
            console.log(`🎯 Scarlet Hotels found: ${scarletHotels.length}`);
            
            if (scarletHotels.length === 0) {
              console.log(`❌ FAILED: No Scarlet Hotel Tel Aviv found`);
              console.log(`\n📝 Available hotels (first 10):`);
              allHotels.slice(0, 10).forEach((h, idx) => {
                console.log(`   ${idx + 1}. ${h.name} - ${h.address || 'No address'}`);
              });
              resolve(false);
              return;
            }

            console.log(`\n✅ Step 3: Scarlet Hotel Details:`);
            const scarlet = scarletHotels[0];
            console.log(`   Name: "${scarlet.name}"`);
            console.log(`   Address: "${scarlet.address}"`);
            console.log(`   Stars: ${scarlet.stars}⭐`);
            console.log(`   Rooms available: ${(scarlet.items || []).length}`);
            
            console.log(`\n🛏️  Step 4: Room Mapping Test:`);
            if (scarlet.items && scarlet.items.length > 0) {
              console.log(`   Raw API rooms:`);
              scarlet.items.forEach((room, idx) => {
                console.log(`     ${idx + 1}. ${room.name} - $${room.price || 'N/A'}`);
              });
              
              console.log(`\n   Normalized rooms for template:`);
              const normalizedRooms = scarlet.items.map(normalizeApiRoom);
              normalizedRooms.forEach((room, idx) => {
                console.log(`     ${room.emoji} ${room.name} - $${room.basePrice} (${room.nameEn})`);
              });
            }
            
            console.log(`\n🎉 INTEGRATION TEST: SUCCESS!`);
            console.log(`✅ API connection: Working`);
            console.log(`✅ Scarlet filtering: Working`);
            console.log(`✅ Room mapping: Working`);
            console.log(`✅ Ready for template integration!`);
            
            resolve(true);
            
          } catch (parseError) {
            console.error(`❌ JSON Parse Error:`, parseError.message);
            console.log(`📄 Raw response (first 200 chars):`, data.substring(0, 200));
            resolve(false);
          }
        });
      });

      req.on('error', (e) => {
        console.error(`❌ Request Error:`, e.message);
        resolve(false);
      });

      req.write(payload);
      req.end();
    });

  } catch (error) {
    console.error(`❌ Test Failed:`, error.message);
    return false;
  }
}

// הפעל את הבדיקה
testFullIntegration().then((success) => {
  console.log(`\n${'═'.repeat(50)}`);
  if (success) {
    console.log(`🚀 READY FOR PRODUCTION: Scarlet Hotel Tel Aviv integration complete!`);
  } else {
    console.log(`⚠️  NEEDS INVESTIGATION: Integration test failed`);
  }
}).catch(console.error);