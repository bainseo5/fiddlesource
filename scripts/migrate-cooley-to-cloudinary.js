
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const TEMP_DIR = path.join(__dirname, '../temp_downloads');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Cloudinary configuration
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
    console.log('Starting migration of Joe Cooley tunes to Cloudinary...');

    // Load tunes
    let tunes = {};
    try {
        const data = fs.readFileSync(TUNES_FILE, 'utf8');
        tunes = JSON.parse(data);
    } catch (err) {
        console.error('Error reading tunes.json:', err);
        process.exit(1);
    }

    // Filter for Cooley tunes that need migration
    // tunes is a dictionary { id: tuneObj }
    const allTunes = Object.values(tunes);
    const cooleyTunes = allTunes.filter(t => 
        (t.collection === 'The Joe Cooley Tapes' || (t.source && t.source.includes('Joe Cooley'))) &&
        t.audioUrl && 
        !t.audioUrl.includes('cloudinary.com')
    );

    console.log(`Found ${cooleyTunes.length} tunes to migrate.`);

    let processedCount = 0;
    let errorCount = 0;

    for (const tune of cooleyTunes) {
        const tempFilePath = path.join(TEMP_DIR, `${tune.id}.mp3`);
        
        console.log(`[${processedCount + 1}/${cooleyTunes.length}] Processing: ${tune.title} (${tune.id})`);
        
        try {
            // 1. Download
            console.log(`   Downloading from: ${tune.audioUrl}`);
            await downloadFile(tune.audioUrl, tempFilePath);
            
            // 2. Upload to Cloudinary
            console.log(`   Uploading to Cloudinary...`);
            const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                resource_type: 'video', // Cloudinary treats audio as video
                public_id: `tunes/${tune.id}`, // Organize in a 'tunes' folder
                overwrite: true
            });

            // 3. Update Tune Object
            tune.audioUrl = uploadResult.secure_url;
            console.log(`   Success! New URL: ${tune.audioUrl}`);

            // 4. Cleanup
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            processedCount++;

            // Save periodically every 5 tunes
            if (processedCount % 5 === 0) {
                fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));
                console.log('   (Progress saved to tunes.json)');
            }

        } catch (err) {
            console.error(`   FAILED to migrate ${tune.id}:`, err.message);
            errorCount++;
            // Try cleanup if failed
            if (fs.existsSync(tempFilePath)) {
                try { fs.unlinkSync(tempFilePath); } catch (e) {}
            }
        }
    }

    // Final Save
    fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));
    
    // Cleanup temp dir
    try {
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmdirSync(TEMP_DIR);
        }
    } catch (e) {
        console.warn('Could not remove temp dir:', e.message);
    }

    console.log('\nMigration Complete!');
    console.log(`Processed: ${processedCount}`);
    console.log(`Errors: ${errorCount}`);
}

migrate();
