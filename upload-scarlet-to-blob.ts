import { put } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

async function uploadScarletImages() {
  console.log('🚀 Starting upload of Scarlet lobby images to Vercel Blob...\n');
  
  // Change this to your local folder path where the lobby images are
  const localImageFolder = './scarlet-lobby-images'; // Update this path
  
  try {
    // Get all jpg files from folder
    const files = readdirSync(localImageFolder).filter(f => 
      f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')
    );
    
    console.log(`Found ${files.length} images to upload\n`);
    
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = join(localImageFolder, file);
      
      console.log(`[${i + 1}/${files.length}] Uploading: ${file}`);
      
      try {
        // Read file as buffer
        const fileBuffer = readFileSync(filePath);
        
        // Upload to Vercel Blob
        const { url } = await put(`scarlet-lobby-${i + 1}.jpg`, fileBuffer, {
          access: 'public',
          contentType: 'image/jpeg'
        });
        
        console.log(`✅ Uploaded: ${url}\n`);
        uploadedUrls.push(url);
        
      } catch (error) {
        console.error(`❌ Failed to upload ${file}:`, error);
      }
    }
    
    console.log('\n=== Upload Complete! ===');
    console.log(`Successfully uploaded: ${uploadedUrls.length}/${files.length} images\n`);
    
    console.log('📋 Copy these URLs to scarlet-config.ts:\n');
    console.log('images: [');
    uploadedUrls.forEach((url, i) => {
      console.log(`  "${url}"${i < uploadedUrls.length - 1 ? ',' : ''}`);
    });
    console.log(']');
    
  } catch (error) {
    console.error('Error reading folder:', error);
    console.log('\n💡 Make sure to:');
    console.log('1. Download the lobby images from Supabase to a local folder');
    console.log('2. Update the localImageFolder path in this script');
    console.log('3. Run: export BLOB_READ_WRITE_TOKEN="your-token"');
    console.log('4. Run: npx tsx upload-scarlet-to-blob.ts');
  }
}

uploadScarletImages();
