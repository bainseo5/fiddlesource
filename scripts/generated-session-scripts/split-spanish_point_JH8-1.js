/**
 * Script to split session: spanish_point_JH8-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH8-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_spanish_point_JH8-1.mp3`;
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
  musicians: "Unknown Musicians",
  date: "Unknown Date",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH8-1.htm"
};

const tracks = [
  {
    "id": "spanish_point_JH8-1-1",
    "title": "Gan ainm",
    "genre": "Jig",
    start: '.02',
    end: '2.04'
  },
  {
    "id": "spanish_point_JH8-1-2",
    "title": "Gan ainm (played slowly)",
    "genre": "Jig",
    start: '2.05',
    end: '3.16'
  },
  {
    "id": "spanish_point_JH8-1-3",
    "title": "High Part of the Road",
    "genre": "Jig",
    start: '3.17',
    end: '4.18'
  },
  {
    "id": "spanish_point_JH8-1-4",
    "title": "Wallop the Potlid",
    "genre": "Jig",
    start: '4.20',
    end: '5.00'
  },
  {
    "id": "spanish_point_JH8-1-5",
    "title": "Cuckoo&#8217;s Nest",
    "genre": "Hornpipe",
    start: '5.02',
    end: '7.02'
  },
  {
    "id": "spanish_point_JH8-1-6",
    "title": "Gan ainm",
    "genre": "Hornpipe",
    start: '7.03',
    end: '8.08'
  },
  {
    "id": "spanish_point_JH8-1-7",
    "title": "Gan ainm (played slowly)",
    "genre": "Jig",
    start: '8.09',
    end: '9.33'
  }
];

async function main() {
  console.log('Processing Session: spanish_point_JH8-1');
  
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
      
      tunes.push({
        id: track.id,
        title: track.title,
        genre: track.genre,
        url: `/audio/${track.id}.mp3`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        date: sessionInfo.date,
        collection: sessionInfo.collection,
        recordingType: sessionInfo.recordingType
      });
    } catch (err) {
      console.error(`Error processing ${track.title}:`, err.message);
    }
  }

  const jsonPath = path.join(OUTPUT_DIR, 'spanish_point_JH8-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
