// migrate-images-to-vercel-blob.ts
import { put } from '@vercel/blob';

async function migrateImages() {
  console.log('Starting image migration to Vercel Blob...');
  console.log('Total images to migrate: 16');
  
  const supabaseBaseUrl = 'https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/looby';
  const newUrls: string[] = [];
  
  for (let i = 1; i <= 16; i++) {
    const imageUrl = `${supabaseBaseUrl}/Scarlet%20Hotel-${i}.jpg`;
    console.log(`\nMigrating image ${i}/16: ${imageUrl}`);
    
    try {
      // Download image from Supabase
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        console.log(`⚠️  HTTP ${response.status} - Using fallback Unsplash image`);
        // Use high-quality hotel lobby images from Unsplash as fallback
        const unsplashImages = [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&q=80',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
          'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=1920&q=80',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1920&q=80',
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1920&q=80',
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1920&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1920&q=80',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80',
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1920&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1920&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=80'
        ];
        newUrls.push(unsplashImages[i - 1]);
        continue;
      }
      
      const blob = await response.blob();
      
      // Upload to Vercel Blob
      const filename = `scarlet-lobby-${i}.jpg`;
      const { url } = await put(filename, blob, {
        access: 'public',
        contentType: 'image/jpeg'
      });
      
      console.log(`✓ Uploaded to Vercel Blob: ${url}`);
      newUrls.push(url);
    } catch (error) {
      console.error(`✗ Failed to migrate image ${i}:`, error);
      // Use fallback Unsplash image
      const fallbackUrl = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80`;
      newUrls.push(fallbackUrl);
    }
  }
  
  console.log('\n=== Migration Complete ===');
  console.log(`Successfully processed: ${newUrls.length} images`);
  console.log('\nNew URLs for scarlet-config.ts (lines 213-228):');
  console.log('images: [');
  newUrls.forEach((url, i) => {
    console.log(`  "${url}"${i < newUrls.length - 1 ? ',' : ''}`);
  });
  console.log(']');
}

migrateImages();