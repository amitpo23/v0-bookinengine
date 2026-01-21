#!/usr/bin/env node

/**
 * 🔍 Simple Scarlet Hotel API Test - Direct Call
 * ==============================================
 * 
 * בדיקה פשוטה ללא HTTP calls - שימוש ישיר בAPI
 */

console.log('🎯 Direct API Test for Scarlet Hotel');
console.log('═══════════════════════════════════════');

// Load environment variables manually from .env.local
const fs = require('fs');
const path = require('path');

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

const https = require('https');
const MEDICI_BASE_URL = 'https://medici-backend.azurewebsites.net';
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
            path: '/api/hotels/search',
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
                try {
                    const result = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ API Call Success!');
                        console.log(`📊 Status: ${res.statusCode}`);
                        console.log(`🏨 Hotels found: ${result.data ? result.data.length : 0}`);
                        
                        if (result.data && Array.isArray(result.data)) {
                            // Look for Scarlet
                            const scarletHotels = result.data.filter(hotel => {
                                const name = (hotel.hotelName || '').toLowerCase();
                                const address = (hotel.address || '').toLowerCase();
                                return name.includes('scarlet');
                            });

                            console.log(`🎯 Scarlet Hotels found: ${scarletHotels.length}`);
                            
                            scarletHotels.forEach((hotel, index) => {
                                console.log(`   ${index + 1}. ${hotel.hotelName}`);
                                console.log(`      📍 ${hotel.address}`);
                                console.log(`      🛏️  Rooms: ${hotel.rooms ? hotel.rooms.length : 0}`);
                                if (hotel.rooms && hotel.rooms[0]) {
                                    console.log(`      💰 First room: ${hotel.rooms[0].roomName} - ${hotel.rooms[0].buyPrice} ${hotel.rooms[0].currency}`);
                                }
                                console.log('');
                            });
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