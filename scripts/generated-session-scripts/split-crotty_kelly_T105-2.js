/**
 * Script to split session: crotty_kelly_T105-2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/crotty_kelly_T105-2.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_crotty_kelly_T105-2.mp3`;
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
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/crotty_kelly_T105-2.htm"
};

const tracks = [
  {
    "id": "crotty_kelly_T105-2-1a",
    "title": "Silver Spear",
    "genre": "Reel",
    start: '.01',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-1b",
    "title": "Tim Maloney's",
    "genre": "Reel",
    start: 'TBD',
    end: '2.14'
  },
  {
    "id": "crotty_kelly_T105-2-2a",
    "title": "Humours of Ennistymon",
    "genre": "Jig",
    start: '2.17',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-2b",
    "title": "Maid in the Meadow",
    "genre": "Jig",
    start: 'TBD',
    end: '4.46'
  },
  {
    "id": "crotty_kelly_T105-2-3a",
    "title": "Miss McLeod&#8217;s",
    "genre": "Reel",
    start: '4.50',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-3b",
    "title": "Sally Gardens",
    "genre": "Reel",
    start: 'TBD',
    end: '7.02'
  },
  {
    "id": "crotty_kelly_T105-2-4",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: '7.03',
    end: '8.42'
  },
  {
    "id": "crotty_kelly_T105-2-5a",
    "title": "Ballyoran",
    "genre": "Polka",
    start: '8.43',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-5b",
    "title": "Girl I Left Behind Me",
    "genre": "Polka",
    start: 'TBD',
    end: '10.49'
  },
  {
    "id": "crotty_kelly_T105-2-6",
    "title": "Five Mile Chase",
    "genre": "Reel",
    start: '10.50',
    end: '11.57'
  },
  {
    "id": "crotty_kelly_T105-2-7",
    "title": "Introduction to item 8",
    "genre": "Tune",
    start: '11.58',
    end: '12.36'
  },
  {
    "id": "crotty_kelly_T105-2-8",
    "title": "Fleadh Down at Ennis",
    "genre": "Song",
    start: '12.37',
    end: '16.12'
  },
  {
    "id": "crotty_kelly_T105-2-9a",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: '16.13',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-9b",
    "title": "Sporting Nell",
    "genre": "Reel",
    start: 'TBD',
    end: '17.51'
  },
  {
    "id": "crotty_kelly_T105-2-10a",
    "title": "Battering Ram",
    "genre": "Jig",
    start: '17.52',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-10b",
    "title": "Munster Buttermilk",
    "genre": "Jig",
    start: 'TBD',
    end: '21.00'
  },
  {
    "id": "crotty_kelly_T105-2-11",
    "title": "Boys of Bluehill",
    "genre": "Hornpipe",
    start: '21.01',
    end: '23.10'
  },
  {
    "id": "crotty_kelly_T105-2-12",
    "title": "Hunter's Purse",
    "genre": "Reel",
    start: '23.12',
    end: '24.47'
  },
  {
    "id": "crotty_kelly_T105-2-13",
    "title": "Fermoy Lasses",
    "genre": "Reel",
    start: '24.48',
    end: '25.53'
  },
  {
    "id": "crotty_kelly_T105-2-14",
    "title": "Blackbird (fragment)",
    "genre": "Set Dance",
    start: '25.55',
    end: '26.45'
  },
  {
    "id": "crotty_kelly_T105-2-15a",
    "title": "Woman of the House",
    "genre": "Reel",
    start: '26.46',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-15b",
    "title": "Limerick Lasses",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crotty_kelly_T105-2-15c",
    "title": "Come West Along the Road",
    "genre": "Reel",
    start: 'TBD',
    end: '29.36'
  },
  {
    "id": "crotty_kelly_T105-2-16",
    "title": "Maid Behind the Bar",
    "genre": "Reel",
    start: '29.37',
    end: '30.43'
  },
  {
    "id": "crotty_kelly_T105-2-17",
    "title": "Galway Rambler",
    "genre": "Reel",
    start: '30.45',
    end: '31.34'
  },
  {
    "id": "crotty_kelly_T105-2-18",
    "title": "Copperplate",
    "genre": "Reel",
    start: '31.36',
    end: '33.03'
  },
  {
    "id": "crotty_kelly_T105-2-19",
    "title": "Upstairs in a Tent",
    "genre": "Reel",
    start: '33.05',
    end: '33.50'
  }
];

async function main() {
  console.log('Processing Session: crotty_kelly_T105-2');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'crotty_kelly_T105-2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
