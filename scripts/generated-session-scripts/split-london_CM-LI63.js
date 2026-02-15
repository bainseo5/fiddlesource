/**
 * Script to split session: london_CM-LI63
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI63.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI63.mp3`;
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
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI63.htm"
};

const tracks = [
  {
    "id": "london_CM-LI63-1a",
    "title": "Announcement 2. Reels (2): Mountain Top",
    "genre": "Reel",
    start: '.05',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI63-1b",
    "title": "Chicago",
    "genre": "Reel",
    start: 'TBD',
    end: '2.28'
  },
  {
    "id": "london_CM-LI63-3",
    "title": "Boys of Ballisodare",
    "genre": "Reel",
    start: '2.34',
    end: '5.03'
  },
  {
    "id": "london_CM-LI63-4",
    "title": "Bonny Bann Banks",
    "genre": "Song",
    start: '5.09',
    end: '8.55'
  },
  {
    "id": "london_CM-LI63-5",
    "title": "Salonika",
    "genre": "Song",
    start: '8.59',
    end: '10.40'
  },
  {
    "id": "london_CM-LI63-6",
    "title": "Air: Dear Irish Boy",
    "genre": "Tune",
    start: '10.59',
    end: '13.28'
  },
  {
    "id": "london_CM-LI63-7",
    "title": "Gan ainm",
    "genre": "Reel",
    start: '13.38',
    end: '15.24'
  },
  {
    "id": "london_CM-LI63-8a",
    "title": "Hairy-chested Frog",
    "genre": "Reel",
    start: '15.52',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI63-8b",
    "title": "Jenny's Chickens",
    "genre": "Reel",
    start: 'TBD',
    end: '17.48'
  },
  {
    "id": "london_CM-LI63-9",
    "title": "Tune: Gan ainm",
    "genre": "Tune",
    start: '18.06',
    end: '19.51'
  },
  {
    "id": "london_CM-LI63-10",
    "title": "The Morning Thrush",
    "genre": "Reel",
    start: '19.58',
    end: '22.49'
  },
  {
    "id": "london_CM-LI63-11",
    "title": "Air: Trip over the Mountain",
    "genre": "Tune",
    start: '23.18',
    end: '25.18'
  },
  {
    "id": "london_CM-LI63-12",
    "title": "Easter Snow",
    "genre": "Song",
    start: '25.33',
    end: '28.02'
  },
  {
    "id": "london_CM-LI63-13",
    "title": "Gan ainm (Macaronic song)",
    "genre": "Song",
    start: '28.17',
    end: '30.31'
  },
  {
    "id": "london_CM-LI63-14",
    "title": "Ace and deuce of piping",
    "genre": "Reel",
    start: '30.56',
    end: '33.06'
  },
  {
    "id": "london_CM-LI63-15",
    "title": "Gan ainm",
    "genre": "Reel",
    start: '33.18',
    end: '36.16'
  },
  {
    "id": "london_CM-LI63-16",
    "title": "On yonder Hill",
    "genre": "Song",
    start: '36.42',
    end: '38.55'
  },
  {
    "id": "london_CM-LI63-17",
    "title": "Tell Her I am",
    "genre": "Jig",
    start: '39.39',
    end: '43.11'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI63');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI63-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
