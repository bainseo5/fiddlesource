/**
 * Script to split session: london_CM_LI53
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM_LI53.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM_LI53.mp3`;
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
  location: "London, c.",
  musicians: "Unknown Musicians",
  date: "1972",
  collection: "Unknown Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM_LI53.htm"
};

const tracks = [
  {
    "id": "london_CM_LI53-1a",
    "title": "Announcement 2. Reels (2): George White&#8217;s Favourite",
    "genre": "Reel",
    start: '.15',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-1b",
    "title": "The Sligo Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '2.30'
  },
  {
    "id": "london_CM_LI53-3",
    "title": "Liffey Banks",
    "genre": "Reel",
    start: '2.34',
    end: '3.44'
  },
  {
    "id": "london_CM_LI53-4",
    "title": "Boys of Blue Hill",
    "genre": "Hornpipe",
    start: '3.57',
    end: '5.18'
  },
  {
    "id": "london_CM_LI53-5",
    "title": "Carraroe",
    "genre": "Jig",
    start: '5.21',
    end: '6.25'
  },
  {
    "id": "london_CM_LI53-6a",
    "title": "Drowsy Maggie",
    "genre": "Reel",
    start: '6.32',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-6b",
    "title": "Toss the Feathers",
    "genre": "Reel",
    start: 'TBD',
    end: '8.15'
  },
  {
    "id": "london_CM_LI53-7a",
    "title": "Johnny's Gone to France",
    "genre": "Reel",
    start: '8.17',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-7b",
    "title": "Glass of Beer",
    "genre": "Reel",
    start: 'TBD',
    end: '10.36'
  },
  {
    "id": "london_CM_LI53-8a",
    "title": "Trip to Athlone",
    "genre": "Jig",
    start: '10.44',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-8b",
    "title": "Pipe on the Hob",
    "genre": "Jig",
    start: 'TBD',
    end: '12.45'
  },
  {
    "id": "london_CM_LI53-9",
    "title": "King of the Fairies",
    "genre": "Set Dance",
    start: '12.48',
    end: '15.08'
  },
  {
    "id": "london_CM_LI53-10",
    "title": "Miss McLeod's",
    "genre": "Reel",
    start: '15.11',
    end: '16.55'
  },
  {
    "id": "london_CM_LI53-11a",
    "title": "Hare in the Corn",
    "genre": "Jig",
    start: '17.02',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-11b",
    "title": "Fair Haired Boy",
    "genre": "Jig",
    start: 'TBD',
    end: '19.04'
  },
  {
    "id": "london_CM_LI53-12a",
    "title": "Castle Kelly",
    "genre": "Reel",
    start: '19.09',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-12b",
    "title": "Old Torn Petticoat",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-12c",
    "title": "Crosses of Annagh",
    "genre": "Reel",
    start: 'TBD',
    end: '22.05'
  },
  {
    "id": "london_CM_LI53-13a",
    "title": "Happy to Meet and Sorry to Part",
    "genre": "Jig",
    start: '22.07',
    end: 'TBD'
  },
  {
    "id": "london_CM_LI53-13b",
    "title": "Dan Dowd",
    "genre": "Jig",
    start: 'TBD',
    end: '24.10'
  }
];

async function main() {
  console.log('Processing Session: london_CM_LI53');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM_LI53-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
