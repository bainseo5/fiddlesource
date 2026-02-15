/**
 * Script to split session: spanish_point_JH31
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH31.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_spanish_point_JH31.mp3`;
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
  location: "Unknown Location",
  musicians: "a Birl (11.20 - 12.27) 12. Reel: Tarbolton (12.28 - 13.45) 13. Jig: Rose in the Heather (13.47 - 14.55) John Joe Healy, photo &copy; Pat Mackenzie &nbsp; &lt;&lt; The John Joe Healy Collection",
  date: "Unknown Date",
  collection: "John Joe Healy Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH31.htm"
};

const tracks = [
  {
    "id": "spanish_point_JH31-1",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: '02',
    end: '1.46'
  },
  {
    "id": "spanish_point_JH31-2",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: '1.49',
    end: '2.56'
  },
  {
    "id": "spanish_point_JH31-3",
    "title": "Drowsy Maggie",
    "genre": "Reel",
    start: '2.58',
    end: '3.36'
  },
  {
    "id": "spanish_point_JH31-4",
    "title": "George White&#8217;s Favourite (3.37 4.15) 5. Jig: Cliffs of Moher (Gm)",
    "genre": "Reel",
    start: '4.17',
    end: '5.11'
  },
  {
    "id": "spanish_point_JH31-6",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: '5.13',
    end: '6.29'
  },
  {
    "id": "spanish_point_JH31-7",
    "title": "Pigeon on the Gate",
    "genre": "Reel",
    start: '6.33',
    end: '8.09'
  },
  {
    "id": "spanish_point_JH31-8",
    "title": "Stack of Barley",
    "genre": "Hornpipe",
    start: '8.12',
    end: '9.34'
  },
  {
    "id": "spanish_point_JH31-9",
    "title": "Heathery Breeze",
    "genre": "Reel",
    start: '9.38',
    end: '10.18'
  },
  {
    "id": "spanish_point_JH31-10",
    "title": "Flogging Reel",
    "genre": "Reel",
    start: '10.21',
    end: '11.19'
  },
  {
    "id": "spanish_point_JH31-11",
    "title": "Reel with a Birl",
    "genre": "Reel",
    start: '11.20',
    end: '12.27'
  },
  {
    "id": "spanish_point_JH31-12",
    "title": "Tarbolton",
    "genre": "Reel",
    start: '12.28',
    end: '13.45'
  },
  {
    "id": "spanish_point_JH31-13",
    "title": "Rose in the Heather",
    "genre": "Jig",
    start: '13.47',
    end: '14.55'
  }
];

async function main() {
  console.log('Processing Session: spanish_point_JH31');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'spanish_point_JH31-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
