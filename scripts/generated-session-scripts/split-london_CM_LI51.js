/**
 * Script to split session: london_CM_LI51
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM_LI51.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM_LI51.mp3`;
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
  location: "London",
  musicians: "Unknown Musicians",
  date: "1970",
  collection: "Unknown Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM_LI51.htm"
};

const tracks = [
  {
    "id": "london_CM_LI51-1",
    "title": "Introduction 2. Reel: Anderson's",
    "genre": "Reel",
    start: '.28',
    end: '3.11'
  },
  {
    "id": "london_CM_LI51-3",
    "title": "Dr O'Neill's",
    "genre": "Jig",
    start: '3.34',
    end: '6.11'
  },
  {
    "id": "london_CM_LI51-4",
    "title": "A Trip over the Mountain",
    "genre": "Waltz",
    start: '6.15',
    end: '8.40'
  },
  {
    "id": "london_CM_LI51-5",
    "title": "I Buried my Wife and I Danced on her Grave",
    "genre": "Jig",
    start: '8.44',
    end: '11.53'
  },
  {
    "id": "london_CM_LI51-6a",
    "title": "Bonny Kate",
    "genre": "Reel",
    start: '12.10',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI51-6b",
    "title": "Jenny's Chickens",
    "genre": "Reel",
    start: 'TBD',
    end: '14.34'
  },
  {
    "id": "london_CM_LI51-7",
    "title": "Bim&iacute;s ag &Oacute;l",
    "genre": "Jig",
    start: '15.25',
    end: '17.31'
  },
  {
    "id": "london_CM_LI51-8",
    "title": "Ravelled Hank of Yarn",
    "genre": "Reel",
    start: '17.42',
    end: '20.45'
  },
  {
    "id": "london_CM_LI51-9",
    "title": "Castle Kelly",
    "genre": "Reel",
    start: '21.06',
    end: '22.18'
  },
  {
    "id": "london_CM_LI51-10",
    "title": "Connaughtman's Ramble",
    "genre": "Jig",
    start: '22.36',
    end: '24.06'
  },
  {
    "id": "london_CM_LI51-11",
    "title": "Galtee Hunt",
    "genre": "Hornpipe",
    start: '24.18',
    end: '26.10'
  },
  {
    "id": "london_CM_LI51-12",
    "title": "Christmas Eve",
    "genre": "Reel",
    start: '26.13',
    end: '28.03'
  },
  {
    "id": "london_CM_LI51-13",
    "title": "Slip jig: Choice Wife",
    "genre": "Jig",
    start: '28.13',
    end: '31.22'
  },
  {
    "id": "london_CM_LI51-14",
    "title": "Drunken Gauger",
    "genre": "Set Dance",
    start: '31.29',
    end: '33.19'
  },
  {
    "id": "london_CM_LI51-15",
    "title": "The Connaught Heifers",
    "genre": "Reel",
    start: '33.34',
    end: '37.41'
  },
  {
    "id": "london_CM_LI51-16",
    "title": "Story: about next tune",
    "genre": "Tune",
    start: '37.42',
    end: '39.23'
  },
  {
    "id": "london_CM_LI51-17",
    "title": "Bank of turf",
    "genre": "Hornpipe",
    start: '39.24',
    end: '42.59'
  },
  {
    "id": "london_CM_LI51-18a",
    "title": "Pinch of Snuff (fragment)",
    "genre": "Reel",
    start: '43.02',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI51-18b",
    "title": "Yellow Tinker",
    "genre": "Reel",
    start: 'TBD',
    end: '44.13'
  },
  {
    "id": "london_CM_LI51-19",
    "title": "S&iacute; Beag, S&iacute; M&oacute;r",
    "genre": "Waltz",
    start: '44.33',
    end: '46.51'
  },
  {
    "id": "london_CM_LI51-20",
    "title": "Flax in Bloom",
    "genre": "Reel",
    start: '46.55',
    end: '50.31'
  },
  {
    "id": "london_CM_LI51-21",
    "title": "Garrett Barry's",
    "genre": "Jig",
    start: '50.45',
    end: '54.25'
  },
  {
    "id": "london_CM_LI51-22",
    "title": "Air: Ag Casadh an tSug&aacute;in",
    "genre": "Tune",
    start: '54.28',
    end: '56.38'
  }
];

async function main() {
  console.log('Processing Session: london_CM_LI51');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM_LI51-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
