/**
 * Update audio URLs to Cloudinary CDN URLs
 * 
 * Usage:
 * 1. Upload all MP3s from output/ to Cloudinary Media Library
 * 2. Get your cloud name from Cloudinary dashboard
 * 3. Update CLOUDINARY_CLOUD_NAME below
 * 4. Update FOLDER_PATH if you uploaded to a specific folder
 * 5. Run: node scripts/update-cloudinary-urls.js
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// UPDATE THIS with your Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = 'ddtyxauci';

// UPDATE THIS if you uploaded to a folder (e.g., 'audio/')
// Leave as '' if files are in root of Media Library
const FOLDER_PATH = 'audio/';

// Cloudinary base URL for audio/video files
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${FOLDER_PATH}`;

// Path to your database
const DB_PATH = join(__dirname, '..', 'backend', 'tunes.db');

function updateAudioUrls() {
  console.log('☁️  Updating audio URLs to Cloudinary CDN...\n');
  
  // Open database
  const db = new Database(DB_PATH);
  
  // Get all tunes with current URLs
  const tunes = db.prepare('SELECT id, title, audioUrl FROM tunes').all();
  
  console.log(`Found ${tunes.length} tunes to update\n`);
  
  // Prepare update statement
  const updateStmt = db.prepare('UPDATE tunes SET audioUrl = ? WHERE id = ?');
  
  let updatedCount = 0;
  
  for (const tune of tunes) {
    // Extract filename from current URL (e.g., /audio/file.mp3 -> file.mp3)
    const filename = tune.audioUrl.split('/').pop();
    
    // Cloudinary doesn't need URL encoding for most filenames
    // But we'll encode spaces and special characters to be safe
    const cloudinaryFilename = filename.replace(/ /g, '%20');
    
    // Create Cloudinary URL
    const cloudinaryUrl = `${CLOUDINARY_BASE_URL}${cloudinaryFilename}`;
    
    // Update database
    updateStmt.run(cloudinaryUrl, tune.id);
    updatedCount++;
    
    console.log(`✓ ${tune.title}`);
    console.log(`  Old: ${tune.audioUrl}`);
    console.log(`  New: ${cloudinaryUrl}\n`);
  }
  
  db.close();
  
  console.log(`\n✅ Successfully updated ${updatedCount} audio URLs!`);
  console.log('🚀 Your app will now stream audio from Cloudinary CDN');
  console.log('\nNext steps:');
  console.log('1. Test one URL in your browser to make sure it works');
  console.log('2. git add backend/tunes.db');
  console.log('3. git commit -m "Update audio URLs to Cloudinary"');
  console.log('4. git push');
}

// Validate configuration
if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
  console.error('❌ ERROR: Please update CLOUDINARY_CLOUD_NAME in this script first!');
  console.log('\nSteps:');
  console.log('1. Go to https://cloudinary.com/console');
  console.log('2. Find your "Cloud name" at the top of the dashboard');
  console.log('3. Update CLOUDINARY_CLOUD_NAME in this script');
  console.log('4. If you uploaded files to a folder, update FOLDER_PATH too');
  process.exit(1);
}

updateAudioUrls();
