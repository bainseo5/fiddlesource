/**
 * Script to split session: feakle_T80-1-2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/feakle_T80-1-2.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_feakle_T80-1-2.mp3`;
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
  location: "Pepper&#",
  musicians: "P Joe Hayes, Maghera, Caher, fiddle; Jack Broome, England, banjo; Barry Taylor, Cooraclare, fiddle &amp; concertina; Stephen Harrison, Ramsey, Isle of Man; flute",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/feakle_T80-1-2.htm"
};

const tracks = [
  {
    "id": "feakle_T80-1-2-1a",
    "title": "Dick Cosgrove&#8217;s",
    "genre": "Reel",
    start: '.01',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-1b",
    "title": "Rolling in the Barrel",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-1c",
    "title": "Tap Room",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-1d",
    "title": "Earl&#8217;s Chair",
    "genre": "Reel",
    start: 'TBD',
    end: '5.02'
  },
  {
    "id": "feakle_T80-1-2-2a",
    "title": "Farewell to Eireann",
    "genre": "Reel",
    start: '5.23',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-2b",
    "title": "Tap Room",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-2c",
    "title": "Dairy Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '9.38'
  },
  {
    "id": "feakle_T80-1-2-3",
    "title": "Caisle&aacute;n an &Oacute;ir",
    "genre": "Hornpipe",
    start: '9.42',
    end: '12.56'
  },
  {
    "id": "feakle_T80-1-2-4a",
    "title": "P. Joe&#8217;s",
    "genre": "Reel",
    start: '13.03',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-4b",
    "title": "Mountain Lark (PJH",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-4c",
    "title": "JB)",
    "genre": "Reel",
    start: 'TBD',
    end: '15.55'
  },
  {
    "id": "feakle_T80-1-2-5a",
    "title": "Green Gowned Lass (PJH",
    "genre": "Reel",
    start: '16.02',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-5b",
    "title": "JB)",
    "genre": "Reel",
    start: 'TBD',
    end: '18.00'
  },
  {
    "id": "feakle_T80-1-2-6a",
    "title": "Hp: Peacock&#8217;s Feather (PJH",
    "genre": "Tune",
    start: '18.03',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-6b",
    "title": "JB)",
    "genre": "Tune",
    start: 'TBD',
    end: '20.21'
  },
  {
    "id": "feakle_T80-1-2-7a",
    "title": "Windy Gap",
    "genre": "Reel",
    start: '20.41',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-7b",
    "title": "Sergeant Early&#8217;s Dream",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-7c",
    "title": "Tempest (PJH",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-7d",
    "title": "JB",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-7e",
    "title": "BT)",
    "genre": "Reel",
    start: 'TBD',
    end: '25.34'
  },
  {
    "id": "feakle_T80-1-2-8a",
    "title": "Hole in the Hedge",
    "genre": "Jig",
    start: '25.36',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-8b",
    "title": "S&eacute;amus Cooley&#8217;s (PJH",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T80-1-2-8c",
    "title": "JB)",
    "genre": "Jig",
    start: 'TBD',
    end: '28.35'
  }
];

async function main() {
  console.log('Processing Session: feakle_T80-1-2');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'feakle_T80-1-2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
