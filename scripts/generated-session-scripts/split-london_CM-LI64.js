/**
 * Script to split session: london_CM-LI64
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI64.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI64.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI64.htm"
};

const tracks = [
  {
    "id": "london_CM-LI64-1a",
    "title": "Introduction 2. Jigs (2): Rose in the Heather",
    "genre": "Jig",
    start: '.10',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-1b",
    "title": "Paid&iacute;n O'Raftaire",
    "genre": "Jig",
    start: 'TBD',
    end: '4.17'
  },
  {
    "id": "london_CM-LI64-3",
    "title": "Tommy McCarthy talks about his family, Seamus Ennis and Willie Clancy",
    "genre": "Tune",
    start: '4.28',
    end: '10.07'
  },
  {
    "id": "london_CM-LI64-4a",
    "title": "Reels (2) Salamanca",
    "genre": "Reel",
    start: '10.40',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-4b",
    "title": "Over the Moor to Maggie",
    "genre": "Reel",
    start: 'TBD',
    end: '14.12'
  },
  {
    "id": "london_CM-LI64-5",
    "title": "Talk about house dances, Paddy Breen, etc.",
    "genre": "Tune",
    start: '14.17',
    end: '19.00'
  },
  {
    "id": "london_CM-LI64-6a",
    "title": "Plains of Boyle",
    "genre": "Hornpipe",
    start: '19.03',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-6b",
    "title": "Rights of Man",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '22.29'
  },
  {
    "id": "london_CM-LI64-7a",
    "title": "Willie Clancy's",
    "genre": "Reel",
    start: '22.38',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-7b",
    "title": "Miss McLeod's",
    "genre": "Reel",
    start: 'TBD',
    end: '26.32'
  },
  {
    "id": "london_CM-LI64-8",
    "title": "Slip Jig: Na Ceannabh&aacute;in Bh&aacute;na",
    "genre": "Jig",
    start: '28.10',
    end: '29.58'
  },
  {
    "id": "london_CM-LI64-9a",
    "title": "Fasten the Leg in Her",
    "genre": "Jig",
    start: '31.05',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-9b",
    "title": "Lark in the Morning",
    "genre": "Jig",
    start: 'TBD',
    end: '34.10'
  },
  {
    "id": "london_CM-LI64-10",
    "title": "Alexander's",
    "genre": "March",
    start: '34.14',
    end: '36.02'
  },
  {
    "id": "london_CM-LI64-11",
    "title": "Jolly Tinker",
    "genre": "Reel",
    start: '36.11',
    end: '38.20'
  },
  {
    "id": "london_CM-LI64-12a",
    "title": "Jimmy Mulqueen's",
    "genre": "Jig",
    start: '39.37',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-12b",
    "title": "Scully Casey's",
    "genre": "Jig",
    start: 'TBD',
    end: '42.44'
  },
  {
    "id": "london_CM-LI64-13",
    "title": "Air: Trip over the Mountain",
    "genre": "Tune",
    start: '42.54',
    end: '45.12'
  },
  {
    "id": "london_CM-LI64-14",
    "title": "Sporting Nell",
    "genre": "Reel",
    start: '45.20',
    end: '46.34'
  },
  {
    "id": "london_CM-LI64-15a",
    "title": "Frehan's No.2",
    "genre": "Jig",
    start: '46.40',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-15b",
    "title": "Humours of Ennistymon",
    "genre": "Jig",
    start: 'TBD',
    end: '49.36'
  },
  {
    "id": "london_CM-LI64-16a",
    "title": "John Kelly's",
    "genre": "Polka",
    start: '49.41',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-16b",
    "title": "Ballyvourney",
    "genre": "Polka",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-16c",
    "title": "Bill Sullivan's",
    "genre": "Polka",
    start: 'TBD',
    end: '53.10'
  },
  {
    "id": "london_CM-LI64-17a",
    "title": "Swallow's Nest",
    "genre": "Reel",
    start: '53.26',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-17b",
    "title": "Dublin Lasses",
    "genre": "Reel",
    start: 'TBD',
    end: '57.04'
  },
  {
    "id": "london_CM-LI64-18a",
    "title": "Hand Me down the Tackle",
    "genre": "Reel",
    start: '57.18',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI64-18b",
    "title": "Shaskeen",
    "genre": "Reel",
    start: 'TBD',
    end: '1.00.41'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI64');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI64-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
