/**
 * Script to split session: aughrim_JH24-2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/aughrim_JH24-2.htm
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Update to point to the actual downloaded MP3 file
const SOURCE_FILE = path.join(__dirname, '../../../archive/JH24-2_Aughrim_21-08-1972_KLICKAUD.mp3');
const OUTPUT_DIR = path.join(__dirname, '../output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  // Format could be .02, 1.45, 1.05.33
  // Normalize to 0.02 if .02
  let cleanTime = timeStr.toString().trim();
  if (cleanTime.startsWith('.')) cleanTime = '0' + cleanTime;
  
  const parts = cleanTime.split('.');
  
  if (parts.length === 3) {
      // H.MM.SS
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseInt(parts[2]) || 0;
      return h * 3600 + m * 60 + s;
  }
  
  if (parts.length === 2) {
      // MM.SS
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      return m * 60 + s;
  }
  
  if (parts.length === 1) {
      return parseInt(cleanTime);
  }
  
  return 0;
}

const sessionInfo = {
  location: "Paddy Fahy's Home, Aughrim, Co. Galway",
  musicians: "Paddy Fahy (fiddle)",
  date: "21 August 1972",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/aughrim_JH24-2.htm"
};

const tracks = [
  {
    "id": "aughrim_JH24-2-1",
    "title": "Paddy Fahy's",
    "genre": "Jig",
    start: '.02',
    end: '1.02'
  },
  {
    "id": "aughrim_JH24-2-2",
    "title": "Irish Washerwoman",
    "genre": "Jig",
    start: '1.04',
    end: '2.12'
  },
  {
    "id": "aughrim_JH24-2-3",
    "title": "Paddy Fahy's No. 4",
    "genre": "Reel",
    start: '2.14',
    end: '4.44'
  },
  {
    "id": "aughrim_JH24-2-4",
    "title": "The Ewe",
    "genre": "Reel",
    start: '4.47',
    end: '6.10'
  },
  {
    "id": "aughrim_JH24-2-5",
    "title": "New Road",
    "genre": "Reel",
    start: '6.12',
    end: '7.15'
  },
  {
    "id": "aughrim_JH24-2-6",
    "title": "Aggie Whyte's",
    "genre": "Reel",
    start: '7.17',
    end: '8.24'
  },
  {
    "id": "aughrim_JH24-2-7",
    "title": "Paddy Fahy's No. 1",
    "genre": "Reel",
    start: '8.26',
    end: '9.52'
  },
  {
    "id": "aughrim_JH24-2-8",
    "title": "Rambles of Kitty",
    "genre": "Jig",
    start: '9.53',
    end: '11.20'
  },
  {
    "id": "aughrim_JH24-2-9",
    "title": "Rakes of Kildare",
    "genre": "Jig",
    start: '11.23',
    end: '12.24'
  },
  {
    "id": "aughrim_JH24-2-10",
    "title": "Paddy Fahy's No.3",
    "genre": "Reel",
    start: '12.30',
    end: '13.35'
  }
];

async function main() {
  console.log('Processing Session: aughrim_JH24-2');
  
  const tunes = [];

  for (const track of tracks) {
    if (track.start === 'TBD' || track.end === 'TBD') {
      console.log(`Skipping ${track.title} (timestamps TBD)`);
      continue;
    }

    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);

    if (startSec === null || endSec === null) {
         console.log(`Skipping ${track.title} (invalid time format)`);
         continue;
    }

    const duration = endSec - startSec;
    if (duration <= 0) {
        console.log(`Skipping ${track.title} (negative/zero duration)`);
        continue;
    }

    const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
    // ffmpeg command - using copy to keyframe might be inaccurate but fast. 
    // re-encoding is safer for precision but lossy. 
    // User requested "easy" style which uses copy.
    const cmd = `ffmpeg -i "${SOURCE_FILE}" -ss ${startSec} -t ${duration} -c copy -y "${outputFile}"`;
    
    try {
      console.log(`Processing: ${track.title} (${track.start} - ${track.end})`);
      await execPromise(cmd);
      
      
      // ENHANCED METADATA SCHEMA
      tunes.push({
        id: track.id,
        title: track.title,
        genre: 'Irish Traditional',
        type: track.genre, // Maps 'Reel'/'Jig' to type
        url: `/audio/${track.id}.mp3`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        artist: sessionInfo.artist || sessionInfo.musicians,
        date: sessionInfo.date,
        year: sessionInfo.date ? sessionInfo.date.slice(-4) : "Unknown", // Attempt to extract year
        collection: sessionInfo.collection,
        sourceCollection: sessionInfo.collection, 
        region: sessionInfo.region || "County Clare", // Default if missing
        recordingType: sessionInfo.recordingType || 'session',
        description: `Recorded at ${sessionInfo.location} on ${sessionInfo.date}.
Musicians: ${sessionInfo.musicians}.
Part of ${sessionInfo.collection}.`,
        isImported: true
      });
    } catch (err) {
      console.error(`Error processing ${track.title}:`, err.message);
    }
  }

  const jsonPath = path.join(OUTPUT_DIR, 'aughrim_JH24-2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
