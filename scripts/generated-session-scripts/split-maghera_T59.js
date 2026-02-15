/**
 * Script to split session: maghera_T59
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T59.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_maghera_T59.mp3`;
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
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T59.htm"
};

const tracks = [
  {
    "id": "maghera_T59-1987",
    "title": "Recorded by Barry Taylor (Cassette tape TDK AD &#8211; C90) BR Taylor Collection Tape 059 All tracks played on middle row of concertina (C and F#) Items 1 &#8211; 11 John Naughton &amp; P Joe Hayes Items 12 &amp; 13 John Naughton 1. Reel: Within a Mile of Dublin",
    "genre": "Reel",
    start: '.08',
    end: '1.20'
  },
  {
    "id": "maghera_T59-2a",
    "title": "John Naughton's",
    "genre": "Reel",
    start: '1.24',
    end: 'TBD'
  },
  {
    "id": "maghera_T59-2b",
    "title": "Gan ainm",
    "genre": "Reel",
    start: 'TBD',
    end: '4.21'
  },
  {
    "id": "maghera_T59-3",
    "title": "New Copperplate (fragment)",
    "genre": "Reel",
    start: '4.26',
    end: '4.43'
  },
  {
    "id": "maghera_T59-4",
    "title": "New Copperplate",
    "genre": "Reel",
    start: '4.54',
    end: '5.20'
  },
  {
    "id": "maghera_T59-5",
    "title": "Copperplate (unfinished)",
    "genre": "Reel",
    start: '5.30',
    end: '5.58'
  },
  {
    "id": "maghera_T59-6",
    "title": "Copperplate",
    "genre": "Reel",
    start: '6.02',
    end: '7.12'
  },
  {
    "id": "maghera_T59-7",
    "title": "The Beauty Spot",
    "genre": "Reel",
    start: '7.18',
    end: '8.32'
  },
  {
    "id": "maghera_T59-8",
    "title": "Talk: About tune, key, etc.",
    "genre": "Tune",
    start: '8.32',
    end: '9.08'
  },
  {
    "id": "maghera_T59-9",
    "title": "The Mason&#8217;s Apron",
    "genre": "Reel",
    start: '9.17',
    end: '10.28'
  },
  {
    "id": "maghera_T59-10a",
    "title": "Duke of Leinster",
    "genre": "Reel",
    start: '10.32',
    end: 'TBD'
  },
  {
    "id": "maghera_T59-10b",
    "title": "Sligo Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '12.52'
  },
  {
    "id": "maghera_T59-11",
    "title": "Sporting Paddy",
    "genre": "Reel",
    start: '13.10',
    end: '14.55'
  },
  {
    "id": "maghera_T59-12a",
    "title": "Mountain Top (own version)",
    "genre": "Reel",
    start: '17.54',
    end: 'TBD'
  },
  {
    "id": "maghera_T59-12b",
    "title": "Maid Behind the Bar (15.16-17-42) 13. Jigs (2): John Naughton&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "maghera_T59-12c",
    "title": "(Mug of Brown Ale or Old Man Dillon&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "maghera_T59-12d",
    "title": "Ship in Full Sail)",
    "genre": "Reel",
    start: 'TBD',
    end: '20.00'
  }
];

async function main() {
  console.log('Processing Session: maghera_T59');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'maghera_T59-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
