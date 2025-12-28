// migrate-images-to-vercel-blob.ts
import { put } from '@vercel/blob';
import { scarletHotelConfig } from './lib/hotels/scarlet-config';

async function migrateImages() {
  console.log('Starting image migration to Vercel Blob...');
  console.log('Total images to migrate:', scarletHotelConfig.images.length);
  
  const newUrls: string[] = [];
  
  for (let i = 0; i < scarletHotelConfig.images.length; i++) {
    const imageUrl = scarletHotelConfig.images[i];
    console.log(`Migrating image ${i + 1}/${scarletHotelConfig.images.length}: ${imageUrl}`);
    
    try {
      // Download image from Supabase
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Upload to Vercel Blob
      const filename = `scarlet-hotel-${i + 1}.jpg`;
      const { url } = await put(filename, blob, {
        access: 'public',
        contentType: 'image/jpeg'
      });
      
      console.log(`✓ Uploaded to: ${url}`);
      newUrls.push(url);
    } catch (error) {
      console.error(`✗ Failed to migrate image ${i + 1}:`, error);
      newUrls.push(imageUrl); // Keep old URL if migration fails
    }
  }
  
  console.log('\n=== Migration Complete ===');
  console.log('New URLs:');
  console.log(JSON.stringify(newUrls, null, 2));
  console.log('\nUpdate scarlet-config.ts with these URLs');
}

migrateImages();