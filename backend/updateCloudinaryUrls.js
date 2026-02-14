/**
 * Update audio URLs to Cloudinary CDN URLs
 * Updates the tunes.json file with Cloudinary URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TUNES_FILE = path.join(__dirname, 'data', 'tunes.json');

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'ddtyxauci';
const FOLDER_PATH = 'audio/';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${FOLDER_PATH}`;

console.log('☁️  Updating audio URLs to Cloudinary CDN...\n');

// Read tunes.json
const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));

let updatedCount = 0;
const tuneIds = Object.keys(tunes);

console.log(`Found ${tuneIds.length} tunes to update\n`);

// Update each tune's audioUrl
tuneIds.forEach(tuneId => {
  const tune = tunes[tuneId];
  const oldUrl = tune.audioUrl;
  
  // Extract filename from current URL (e.g., /audio/file.mp3 -> file.mp3)
  const filename = oldUrl.split('/').pop();
  
  // Encode spaces and special characters for Cloudinary
  const encodedFilename = filename.replace(/ /g, '%20');
  
  // Create new Cloudinary URL
  const newUrl = `${CLOUDINARY_BASE_URL}${encodedFilename}`;
  
  // Update the tune
  tune.audioUrl = newUrl;
  updatedCount++;
  
  console.log(`✓ ${tune.title}`);
  console.log(`  Old: ${oldUrl}`);
  console.log(`  New: ${newUrl}\n`);
});

// Create backup
const backupFile = TUNES_FILE.replace('.json', '.before-cloudinary.json');
fs.writeFileSync(backupFile, fs.readFileSync(TUNES_FILE));
console.log(`📦 Backup created: ${path.basename(backupFile)}\n`);

// Write updated tunes.json
fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 4));

console.log(`✅ Successfully updated ${updatedCount} audio URLs!`);
console.log('🚀 Your app will now stream audio from Cloudinary CDN\n');
console.log('Next steps:');
console.log('1. Test one URL in your browser to make sure it works');
console.log('2. git add backend/data/tunes.json');
console.log('3. git commit -m "Update audio URLs to Cloudinary CDN"');
console.log('4. git push');
