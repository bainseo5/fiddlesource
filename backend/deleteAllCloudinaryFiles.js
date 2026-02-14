/**
 * Delete all audio files from Cloudinary
 * Run this before uploading the new Doolin-only files
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddtyxauci',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function deleteAllAudioFiles() {
  console.log('\n🗑️  Deleting all audio files from Cloudinary...\n');
  
  try {
    // Get all resources in the Cloudinary account
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video', // MP3s are stored as 'video' type in Cloudinary
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} files to delete\n`);
    
    if (result.resources.length === 0) {
      console.log('✓ No files to delete');
      return;
    }
    
    // Delete all files
    const publicIds = result.resources.map(r => r.public_id);
    
    for (let i = 0; i < publicIds.length; i++) {
      const publicId = publicIds[i];
      console.log(`[${i + 1}/${publicIds.length}] Deleting: ${publicId}`);
      
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        console.log(`  ✓ Deleted`);
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
      }
    }
    
    console.log(`\n✓ Deletion complete!`);
    console.log(`\nNext steps:`);
    console.log(`1. Upload the 63 Doolin MP3s from output/ to Cloudinary`);
    console.log(`2. Run fetchCloudinaryUrls.js to update tunes.json with new URLs`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

deleteAllAudioFiles();
