
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize environment variables
// Fix path to point to root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.join(__dirname, '../.env');

dotenv.config({ path: ENV_PATH });

const SOURCE_FILE = path.join(__dirname, 'john-kelly-tunes.json');
const TEMP_DIR = path.join(__dirname, '../temp_downloads_kelly');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary environment variables missing. check .env file.');
    process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function migrate() {
    console.log('Starting upload of John Kelly tunes to Cloudinary...');

    if (!fs.existsSync(SOURCE_FILE)) {
        console.error(`Source file not found: ${SOURCE_FILE}`);
        return;
    }

    // Load tunes
    let tunes = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));

    // If it's an array (which it is for the scraped file), handle array
    // Convert to object if needed? The main tunes.json is an object keyed by ID.
    // But let's work with the array and save back as array for now.
    
    // We should probably convert to object keyed by ID to match the main DB structure if we intend to merge.
    // But for this script, let's just iterate.

    let updatedCount = 0;
    let failedCount = 0;
    
    // Convert to array if it's an object (just in case)
    const tunesList = Array.isArray(tunes) ? tunes : Object.values(tunes);

    for (const tune of tunesList) {
        // Skip if already migrated
        if (tune.audioUrl && tune.audioUrl.includes('res.cloudinary.com')) {
            console.log(`Skipping ${tune.id} (already migrated)`);
            continue;
        }

        if (!tune.audioUrl) {
            console.log(`Skipping ${tune.id} (no audio URL)`);
            continue;
        }

        console.log(`Processing ${tune.id}: ${tune.title}`);
        
        try {
            const fileName = `${tune.id}.mp3`;
            const localPath = path.join(TEMP_DIR, fileName);

            // 1. Download file
            console.log(`  Downloading from ${tune.audioUrl}...`);
            await downloadFile(tune.audioUrl, localPath);

            // 2. Upload to Cloudinary
            console.log(`  Uploading to Cloudinary...`);
            const uploadResult = await cloudinary.uploader.upload(localPath, {
                resource_type: 'video', // 'video' handles audio in Cloudinary
                public_id: `tunes/${tune.id}`,
                overwrite: true
            });

            // 3. Update URL
            tune.audioUrl = uploadResult.secure_url;
            console.log(`  Success! New URL: ${tune.audioUrl}`);
            updatedCount++;

            // 4. Cleanup
            fs.unlinkSync(localPath);

            // Save progress every 5 tunes
            if (updatedCount % 5 === 0) {
                 fs.writeFileSync(SOURCE_FILE, JSON.stringify(tunes, null, 2));
            }

        } catch (error) {
            console.error(`  Failed to migrate ${tune.id}:`, error.message);
            failedCount++;
        }
    }

    // Final save
    fs.writeFileSync(SOURCE_FILE, JSON.stringify(tunes, null, 2));

    // Cleanup temp dir
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmdirSync(TEMP_DIR, { recursive: true });
    }

    console.log(`\nMigration complete!`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed: ${failedCount}`);
}

migrate();
