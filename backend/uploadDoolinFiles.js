/**
 * Upload all Doolin session MP3s to Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddtyxauci',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const OUTPUT_DIR = path.join(__dirname, '../output');

async function uploadDoolinFiles() {
  console.log('\n📤 Uploading Doolin session files to Cloudinary...\n');
  
  // Get all MP3 files from output directory
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3'));
  
  console.log(`Found ${files.length} files to upload\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(OUTPUT_DIR, filename);
    const publicId = filename.replace('.mp3', '');
    
    console.log(`[${i + 1}/${files.length}] Uploading: ${filename}`);
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: publicId,
        folder: '', // Upload to root
        overwrite: true
      });
      
      console.log(`  ✓ Uploaded: ${result.secure_url}`);
      successCount++;
      
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n✓ Upload complete!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log(`\nNext step:`);
  console.log(`  Run: node fetchCloudinaryUrls.js`);
}

uploadDoolinFiles();
