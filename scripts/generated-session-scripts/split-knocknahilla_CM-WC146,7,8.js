/**
 * Script to split session: knocknahilla_CM-WC146,7,8
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/knocknahilla_CM-WC146,7,8.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_knocknahilla_CM-WC146,7,8.mp3`;
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
  location: "O&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/knocknahilla_CM-WC146,7,8.htm"
};

const tracks = [
  {
    "id": "knocknahilla_CM-WC146,7,8-1",
    "title": "New Copperplate",
    "genre": "Reel",
    start: '.09',
    end: '2.05'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-2",
    "title": "Michael Hynes'",
    "genre": "Jig",
    start: '2.15',
    end: '3.54'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-3",
    "title": "The Scholar (crackling at start of tune)",
    "genre": "Reel",
    start: '3.57',
    end: '5.44'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-4a",
    "title": "Londonderry",
    "genre": "Hornpipe",
    start: '5.49',
    end: 'TBD'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-4b",
    "title": "Harvest Home",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '9.49'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-5a",
    "title": "Roaring Mary",
    "genre": "Reel",
    start: '9.51',
    end: 'TBD'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-5b",
    "title": "Miss McLeod's",
    "genre": "Reel",
    start: 'TBD',
    end: '12.13'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-6",
    "title": "Bonaparte's Retreat",
    "genre": "Reel",
    start: '12.14',
    end: '14.11'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-7",
    "title": "The Flogging",
    "genre": "Reel",
    start: '14.13',
    end: '15.32'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-8",
    "title": "The Quilty Fishermen",
    "genre": "Song",
    start: '15.37',
    end: '18.38'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-9",
    "title": "Dogs Among the Bushes",
    "genre": "Reel",
    start: '18.41',
    end: '19.55'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-10",
    "title": "The Kilfenora",
    "genre": "Jig",
    start: '19.57',
    end: '21.56'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-11",
    "title": "Molloy's",
    "genre": "Reel",
    start: '22.10',
    end: '23.25'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-12",
    "title": "The Teetotaller",
    "genre": "Reel",
    start: '23.27',
    end: '24.41'
  },
  {
    "id": "knocknahilla_CM-WC146,7,8-13",
    "title": "Connemara Stocking",
    "genre": "Reel",
    start: '24.44',
    end: '25.55'
  }
];

async function main() {
  console.log('Processing Session: knocknahilla_CM-WC146,7,8');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'knocknahilla_CM-WC146,7,8-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
