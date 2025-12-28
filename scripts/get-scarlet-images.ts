// Script to retrieve all Scarlet hotel images from Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getScarletImages() {
  const hotelId = 'scarlet-hotel';
  const roomTypes = [
    'classic-double',
    'romantic-double',
    'classic-triple',
    'family-suite',
    'luxury-superior',
    'luxury-premium',
    'accessible-room'
  ];

  console.log('🔍 חיפוש תמונות ל-Scarlet Hotel...\n');

  const roomImages: Record<string, string[]> = {};

  for (const roomType of roomTypes) {
    const path = `${hotelId}/${roomType}`;
    
    try {
      const { data: files, error } = await supabase.storage
        .from('hotel-assets')
        .list(path);

      if (error) {
        console.error(`❌ שגיאה ב-${roomType}:`, error.message);
        continue;
      }

      if (!files || files.length === 0) {
        console.log(`⚠️  לא נמצאו תמונות ב-${roomType}`);
        continue;
      }

      const urls: string[] = [];
      for (const file of files) {
        const filePath = `${path}/${file.name}`;
        const { data } = supabase.storage
          .from('hotel-assets')
          .getPublicUrl(filePath);
        
        urls.push(data.publicUrl);
      }

      roomImages[roomType] = urls;
      console.log(`✅ ${roomType}: ${urls.length} תמונות`);
      urls.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));
      console.log('');
    } catch (err) {
      console.error(`❌ שגיאה כללית ב-${roomType}:`, err);
    }
  }

  console.log('\n📋 סיכום - קוד להעתקה ל-scarlet-config.ts:\n');
  console.log('const roomImages = ' + JSON.stringify(roomImages, null, 2));
}

getScarletImages();
