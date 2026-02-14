/**
 * Update audio URLs to Firebase Storage URLs
 * 
 * Usage:
 * 1. Upload all MP3s from output/ to Firebase Storage under 'audio/' folder
 * 2. Get your Firebase Storage base URL from Firebase Console
 * 3. Update FIREBASE_BASE_URL below
 * 4. Run: node scripts/update-firebase-urls.js
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// UPDATE THIS with your Firebase Storage base URL
const FIREBASE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT.appspot.com/o/audio%2F';
const URL_SUFFIX = '?alt=media';

// Path to your database
const DB_PATH = join(__dirname, '..', 'backend', 'tunes.db');

function updateAudioUrls() {
  console.log('🔥 Updating audio URLs to Firebase Storage...\n');
  
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
    
    // Create Firebase URL (encode filename for URL)
    const encodedFilename = encodeURIComponent(filename);
    const firebaseUrl = `${FIREBASE_BASE_URL}${encodedFilename}${URL_SUFFIX}`;
    
    // Update database
    updateStmt.run(firebaseUrl, tune.id);
    updatedCount++;
    
    console.log(`✓ ${tune.title}`);
    console.log(`  Old: ${tune.audioUrl}`);
    console.log(`  New: ${firebaseUrl}\n`);
  }
  
  db.close();
  
  console.log(`\n✅ Successfully updated ${updatedCount} audio URLs!`);
  console.log('🚀 Your app will now stream audio from Firebase Storage');
}

// Validate Firebase URL is configured
if (FIREBASE_BASE_URL.includes('YOUR-PROJECT')) {
  console.error('❌ ERROR: Please update FIREBASE_BASE_URL in this script first!');
  console.log('\nSteps:');
  console.log('1. Go to Firebase Console → Storage');
  console.log('2. Upload a test file and click it');
  console.log('3. Copy the URL and extract the base URL pattern');
  console.log('4. Update FIREBASE_BASE_URL in this script');
  process.exit(1);
}

updateAudioUrls();
