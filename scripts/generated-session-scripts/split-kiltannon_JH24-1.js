/**
 * Script to split session: kiltannon_JH24-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/kiltannon_JH24-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_kiltannon_JH24-1.mp3`;
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
  location: "Paddy Canny&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/kiltannon_JH24-1.htm"
};

const tracks = [
  {
    "id": "kiltannon_JH24-1-1",
    "title": "Paddy Fahy&#8217;s",
    "genre": "Jig",
    start: '01.',
    end: '1.19'
  },
  {
    "id": "kiltannon_JH24-1-2",
    "title": "&#8216;G-minor jig&#8217; (familiar in major)",
    "genre": "Jig",
    start: '1.52',
    end: '3.19'
  },
  {
    "id": "kiltannon_JH24-1-3",
    "title": "Cliffs of Moher",
    "genre": "Jig",
    start: '3.22',
    end: '4.40'
  },
  {
    "id": "kiltannon_JH24-1-4",
    "title": "Apples in Winter",
    "genre": "Jig",
    start: '4.45',
    end: '6.01'
  },
  {
    "id": "kiltannon_JH24-1-5",
    "title": "Repeal of the Union",
    "genre": "Reel",
    start: '6.05',
    end: '7.26'
  },
  {
    "id": "kiltannon_JH24-1-6",
    "title": "Bunch of Green Rushes",
    "genre": "Reel",
    start: '7.29',
    end: '8.51'
  },
  {
    "id": "kiltannon_JH24-1-7",
    "title": "Garrett Barry&#8217;s",
    "genre": "Jig",
    start: '8.52',
    end: '10.14'
  },
  {
    "id": "kiltannon_JH24-1-8",
    "title": "Silver Spear",
    "genre": "Reel",
    start: '10.15',
    end: '11.19'
  },
  {
    "id": "kiltannon_JH24-1-9",
    "title": "The Tulla",
    "genre": "Reel",
    start: '11.21',
    end: '12.15'
  }
];

async function main() {
  console.log('Processing Session: kiltannon_JH24-1');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'kiltannon_JH24-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
