/**
 * Fetch actual Cloudinary URLs and update tunes.json
 * This uses the Cloudinary Admin API to get the real URLs of uploaded files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TUNES_FILE = path.join(__dirname, 'data', 'tunes.json');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddtyxauci',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('☁️  Fetching uploaded files from Cloudinary...\n');

// Get all uploaded resources
const resources = await cloudinary.api.resources({
  type: 'upload',
  resource_type: 'video',  // MP3s are stored as video type
  max_results: 500
});

console.log(`Found ${resources.resources.length} files in Cloudinary\n`);

// Create a mapping of original filename patterns to Cloudinary URLs
const filenameMap = new Map();

resources.resources.forEach(resource => {
  const url = resource.secure_url;
  const publicId = resource.public_id;
  
  // For doolin files, the public_id IS the key (e.g., "doolin-01a", "doolin-02")
  // Store the full public_id as the key
  filenameMap.set(publicId, url);
  console.log(`Mapped: ${publicId} -> ${url}`);
});

// Read tunes.json
const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));

console.log('\n📝 Updating tunes...\n');

let updatedCount = 0;
Object.keys(tunes).forEach(tuneId => {
  const tune = tunes[tuneId];
  const oldUrl = tune.audioUrl;
  
  // The tuneId is the key we uploaded (e.g., "doolin-01a", "doolin-02")
  const key = tuneId;
  
  const cloudinaryUrl = filenameMap.get(key);
  
  if (cloudinaryUrl) {
    tune.audioUrl = cloudinaryUrl;
    updatedCount++;
    console.log(`✓ ${tune.title} -> ${key}`);
  } else {
    console.warn(`⚠️  No Cloudinary file found for: ${key}`);
  }
});

// Create backup
const backupFile = TUNES_FILE.replace('.json', '.before-cloudinary-api.json');
fs.writeFileSync(backupFile, fs.readFileSync(TUNES_FILE));

// Write updated tunes.json
fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 4));

console.log(`\n✅ Updated ${updatedCount} tunes with Cloudinary URLs!`);
console.log('🚀 Ready to deploy!');
