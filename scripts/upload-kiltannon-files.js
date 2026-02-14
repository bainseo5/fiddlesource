
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration from environment variables
// Make sure you have CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your env
// or set explicitly if running locally and secure
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddtyxauci',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const OUTPUT_DIR = path.join(__dirname, '../output');
const FOLDER_NAME = 'fiddlesource'; 

async function uploadKiltannonFiles() {
  console.log('\n📤 Uploading Kiltannon session files to Cloudinary (folder: ' + FOLDER_NAME + ')...\n');
  
  // Get all Kiltannon MP3 files from output directory
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('kiltannon-') && f.endsWith('.mp3'));
  
  if (files.length === 0) {
    console.log('❌ No kiltannon-*.mp3 files found in output directory.');
    return;
  }

  console.log(`Found ${files.length} files to upload\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(OUTPUT_DIR, filename);
    // Remove extension for public_id, but keep the filename structure
    const publicId = filename.replace('.mp3', '');
    
    console.log(`[${i + 1}/${files.length}] Uploading: ${filename}`);
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video', // 'video' is used for audio in Cloudinary
        public_id: publicId,
        folder: FOLDER_NAME,
        overwrite: true
      });
      
      console.log(`  ✓ Uploaded: ${result.secure_url}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed to upload ${filename}:`, error.message);
      failCount++;
    }
  }
  
  console.log('\nUpload Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failCount === 0) {
      console.log('\nAll files uploaded successfully! The tunes should now play on the site.');
  }
}

uploadKiltannonFiles().catch(console.error);
