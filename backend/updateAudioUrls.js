import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TUNES_FILE = path.join(__dirname, 'data', 'tunes.json');
const AUDIO_DIR = path.join(__dirname, '..', '..', 'output');

// Read audio files from output directory
const audioFiles = fs.readdirSync(AUDIO_DIR)
  .filter(f => f.endsWith('.mp3'))
  .sort();

console.log(`Found ${audioFiles.length} MP3 files`);

// Create a map of tune numbers to filenames
const tuneNumberToFile = {};
audioFiles.forEach(file => {
  const match = file.match(/^(\d+)_/);
  if (match) {
    tuneNumberToFile[match[1]] = file;
  }
});

// Read tunes.json
const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));

// Update audioUrl for each tune by extracting number from ID
let updated = 0;
Object.keys(tunes).forEach(tuneId => {
  const tune = tunes[tuneId];
  
  // Extract number from ID (e.g., "doolin-01" => "01", "doolin-01a" => "01")
  const match = tuneId.match(/doolin-(\d+)/);
  if (match) {
    const num = match[1];
    const audioFile = tuneNumberToFile[num];
    
    if (audioFile) {
      tune.audioUrl = `/audio/${audioFile}`;
      updated++;
    } else {
      console.warn(`⚠️  No audio file found for tune number ${num} (ID: ${tuneId})`);
    }
  }
});

// Write updated tunes.json
fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));

console.log(`✅ Updated ${updated}/${Object.keys(tunes).length} tunes with correct audio URLs`);

