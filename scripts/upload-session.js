
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const OUTPUT_DIR = path.join(__dirname, 'output');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadSession(sessionPrefix) {
  console.log(`\n🔍 Searching for files matching prefix: ${sessionPrefix}`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
      console.error(`Output directory not found: ${OUTPUT_DIR}`);
      return;
  }

  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith(sessionPrefix) && f.endsWith('.mp3'));

  if (files.length === 0) {
      console.log('No matching files found to upload.');
      return;
  }

  console.log(`Found ${files.length} files to upload.`);

  // Load tunes.json
  const tunesData = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));
  let updates = 0;

  for (const filename of files) {
      const filePath = path.join(OUTPUT_DIR, filename);
      // ID is filename without extension? Not necessarily, but usually match.
      // Let's rely on finding the tune entry by ID matching the filename base.
      const id = filename.replace('.mp3', '');
      
      console.log(`Uploading ${filename}...`);

      try {
          const result = await cloudinary.uploader.upload(filePath, {
              resource_type: 'video',
              public_id: `tunes/${id}`, // Organize in 'tunes' folder
              overwrite: true
          });
          
          const newUrl = result.secure_url;
          console.log(`  ✓ Uploaded: ${newUrl}`);

          // Update tunes.json
          if (tunesData[id]) {
              tunesData[id].audioUrl = newUrl;
              updates++;
              console.log(`  ✓ Updated tunes.json entry for ${id}`);
          } else {
              console.warn(`  ⚠️  Warning: No entry found in tunes.json for ID ${id}`);
          }

      } catch (error) {
          console.error(`  ❌ Error uploading ${filename}:`, error.message);
      }
  }

  if (updates > 0) {
      fs.writeFileSync(TUNES_FILE, JSON.stringify(tunesData, null, 2));
      console.log(`\n💾 Saved ${updates} updates to tunes.json`);
  } else {
      console.log('\nNo updates made to tunes.json');
  }
}

// Get prefix from command line arg
const prefix = process.argv[2];
if (!prefix) {
    console.error('Please provide a session prefix (e.g., aughrim_JH24-2)');
    process.exit(1);
}

uploadSession(prefix);
