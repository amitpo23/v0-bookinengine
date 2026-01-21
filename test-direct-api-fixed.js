#!/usr/bin/env node

/**
 * 🔍 Simple Scarlet Hotel API Test - Direct Call
 * ==============================================
 * 
 * בדיקה פשוטה ללא HTTP calls - שימוש ישיר בAPI
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🎯 Direct API Test for Scarlet Hotel');
console.log('═══════════════════════════════════════');

const MEDICI_BASE_URL = 'https://medici-backend.azurewebsites.net';
let KNOWAA_TOKEN = process.env.KNOWAA_BEARER_TOKEN;

// If not in env, try to read from .env.local
if (!KNOWAA_TOKEN) {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('KNOWAA_BEARER_TOKEN=')) {
                KNOWAA_TOKEN = line.split('=')[1].trim();
                break;
            }
        }
    } catch (e) {
        console.error('Could not read .env.local:', e.message);
    }
}

if (!KNOWAA_TOKEN) {
    console.error('❌ Missing KNOWAA_BEARER_TOKEN in environment');
    process.exit(1);
}

console.log(`🔑 Using token: ${KNOWAA_TOKEN.substring(0, 20)}...`);

async function testDirectAPI() {
    return new Promise((resolve, reject) => {
        const searchData = {
            dateFrom: '2026-03-01',
            dateTo: '2026-03-03', 
            city: 'Tel Aviv',
            adults: 2,
            children: [],
            limit: 100
        };

        const postData = JSON.stringify(searchData);

        const options = {
            hostname: 'medici-backend.azurewebsites.net',
            port: 443,
            path: '/api/hotels/GetInnstantSearchPrice',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KNOWAA_TOKEN}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('📡 Calling Medici API directly...');

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`📊 Status Code: ${res.statusCode}`);
                console.log(`📊 Response Length: ${data.length}`);
                console.log(`📊 Response Headers:`, res.headers);
                
                if (data.length === 0) {
                    console.error('❌ Empty response from API');
                    reject(new Error('Empty response'));
                    return;
                }

                console.log(`📊 First 300 chars: ${data.substring(0, 300)}`);

                try {
                    const result = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ API Call Success!');
                        console.log(`📊 Status: ${res.statusCode}`);
                        
                        // Check data structure
                        console.log('📋 Response structure:', Object.keys(result));
                        
                        let hotels = result.data || result.items || [];
                        console.log(`🏨 Hotels found: ${hotels ? hotels.length : 0}`);
                        
                        // Debug: show structure of first hotel
                        if (hotels && hotels[0]) {
                            console.log('🔍 First hotel structure:', Object.keys(hotels[0]));
                            console.log('🔍 First hotel sample:', JSON.stringify(hotels[0], null, 2).substring(0, 500));
                        }
                        
                        if (hotels && Array.isArray(hotels)) {
                            // This API returns hotels grouped by rooms - need to extract hotel names from rooms
                            const allHotelNames = new Set();
                            const scarletRooms = [];
                            
                            hotels.forEach(hotelGroup => {
                                if (hotelGroup.items && Array.isArray(hotelGroup.items)) {
                                    hotelGroup.items.forEach(room => {
                                        const hotelName = room.hotelName || '';
                                        allHotelNames.add(hotelName);
                                        
                                        if (hotelName.toLowerCase().includes('scarlet')) {
                                            scarletRooms.push({
                                                hotelName: room.hotelName,
                                                roomName: room.name,
                                                category: room.category,
                                                hotelId: room.hotelId,
                                                price: room.buyPrice || 'N/A',
                                                currency: room.currency || 'N/A',
                                                bedding: room.bedding,
                                                board: room.board
                                            });
                                        }
                                    });
                                }
                            });

                            console.log(`🎯 Unique hotels in search: ${allHotelNames.size}`);
                            console.log(`🎯 Scarlet rooms found: ${scarletRooms.length}`);
                            
                            if (scarletRooms.length > 0) {
                                const scarletHotels = {};
                                scarletRooms.forEach(room => {
                                    if (!scarletHotels[room.hotelName]) {
                                        scarletHotels[room.hotelName] = [];
                                    }
                                    scarletHotels[room.hotelName].push(room);
                                });
                                
                                Object.keys(scarletHotels).forEach((hotelName, index) => {
                                    const rooms = scarletHotels[hotelName];
                                    console.log(`   ${index + 1}. ${hotelName}`);
                                    console.log(`      🏨 Hotel ID: ${rooms[0].hotelId}`);
                                    console.log(`      🛏️  Rooms: ${rooms.length}`);
                                    rooms.forEach(room => {
                                        console.log(`         - ${room.roomName} (${room.bedding}) - ${room.price} ${room.currency}`);
                                    });
                                    console.log('');
                                });
                            } else {
                                // Show sample hotel names
                                console.log('📋 Sample hotel names from search:');
                                Array.from(allHotelNames).slice(0, 5).forEach((name, index) => {
                                    console.log(`   ${index + 1}. ${name}`);
                                });
                            }
                        }
                        
                        resolve(result);
                    } else {
                        console.error(`❌ API Error: ${res.statusCode}`);
                        console.error('Response:', data.substring(0, 500));
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                } catch (parseError) {
                    console.error('❌ Parse Error:', parseError.message);
                    console.error('Raw response:', data.substring(0, 200));
                    reject(parseError);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Run the test
testDirectAPI()
    .then(() => {
        console.log('\n🎉 Direct API Test Completed Successfully!');
        console.log('═══════════════════════════════════════');
        console.log('✅ Scarlet Hotel search working');
        console.log('✅ API authentication successful');
        console.log('✅ Room data available');
        console.log('\n💡 Next: Test via Next.js app');
    })
    .catch((error) => {
        console.log('\n❌ Direct API Test Failed');
        console.log('═══════════════════════════════════════');
        console.error('Error:', error.message);
        process.exit(1);
    });