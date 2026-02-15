/**
 * Script to split session: maghera_T65
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T65.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_maghera_T65.mp3`;
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
  location: "Hayes&#",
  musicians: "Barry Taylor, fiddle) (.15- 3.01) 2. Reels (2): Johnny McGreevey&#8217;s/Miss McGuinness (3.13-5.19) 3. Talk: about item 2 (5.20-5.52) 4. Reels (2): P. J. Hernon&#8217;s/Famous Ballymote (5.57-8.26) 5. Talk: about item 4 (8.28-8.29) P Joe Hayes 1998, photo &copy; Peter Laban &nbsp; &lt;&lt; The BR Taylor Collection",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T65.htm"
};

const tracks = [
  {
    "id": "maghera_T65-1991a",
    "title": "Recorded by Barry Taylor BR Taylor Collection Tape 065 Recording quality not good 1. Jigs (2): Basket of Turf",
    "genre": "Jig",
    start: '.15',
    end: 'TBD'
  },
  {
    "id": "maghera_T65-1991b",
    "title": "Hag at the Churn (with Barry Taylor, fiddle)",
    "genre": "Jig",
    start: 'TBD',
    end: '3.01'
  },
  {
    "id": "maghera_T65-2a",
    "title": "Johnny McGreevey&#8217;s",
    "genre": "Reel",
    start: '3.13',
    end: 'TBD'
  },
  {
    "id": "maghera_T65-2b",
    "title": "Miss McGuinness",
    "genre": "Reel",
    start: 'TBD',
    end: '5.19'
  },
  {
    "id": "maghera_T65-3",
    "title": "Talk: about item 2",
    "genre": "Tune",
    start: '5.20',
    end: '5.52'
  },
  {
    "id": "maghera_T65-4a",
    "title": "P. J. Hernon&#8217;s",
    "genre": "Reel",
    start: '5.57',
    end: 'TBD'
  },
  {
    "id": "maghera_T65-4b",
    "title": "Famous Ballymote",
    "genre": "Reel",
    start: 'TBD',
    end: '8.26'
  },
  {
    "id": "maghera_T65-5",
    "title": "Talk: about item 4",
    "genre": "Tune",
    start: '8.28',
    end: '8.29'
  }
];

async function main() {
  console.log('Processing Session: maghera_T65');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'maghera_T65-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
