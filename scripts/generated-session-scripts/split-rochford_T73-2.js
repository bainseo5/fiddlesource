/**
 * Script to split session: rochford_T73-2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/rochford_T73-2.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_rochford_T73-2.mp3`;
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
  location: "Tulla",
  musicians: "Unknown Musicians",
  date: "1995",
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/rochford_T73-2.htm"
};

const tracks = [
  {
    "id": "rochford_T73-2-1",
    "title": "Introduction by Micho Russell 2. Reel: Knotted Cord",
    "genre": "Reel",
    start: '.18',
    end: '1.21'
  },
  {
    "id": "rochford_T73-2-3",
    "title": "Down the Broom",
    "genre": "Reel",
    start: '1.23',
    end: '3.06'
  },
  {
    "id": "rochford_T73-2-4",
    "title": "Cliffs of Moher",
    "genre": "Jig",
    start: '3.07',
    end: '4.25'
  },
  {
    "id": "rochford_T73-2-5",
    "title": "Hp: Boys of Bluehill",
    "genre": "Tune",
    start: '5.08',
    end: '6.54'
  },
  {
    "id": "rochford_T73-2-6",
    "title": "Blackberry Blossom",
    "genre": "Reel",
    start: '7.04',
    end: '8.21'
  },
  {
    "id": "rochford_T73-2-7",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: '8.24',
    end: '10.19'
  },
  {
    "id": "rochford_T73-2-8",
    "title": "Hp: Caisle&aacute;n an &Oacute;ir",
    "genre": "Tune",
    start: '10.24',
    end: '11.46'
  },
  {
    "id": "rochford_T73-2-9",
    "title": "Mist Covered Mountain",
    "genre": "Jig",
    start: '11.49',
    end: '13.11'
  },
  {
    "id": "rochford_T73-2-10",
    "title": "Paddy Fahey&#8217;s",
    "genre": "Jig",
    start: '13.12',
    end: '14.31'
  },
  {
    "id": "rochford_T73-2-11a",
    "title": "Splendid Isolation",
    "genre": "Reel",
    start: '14.42',
    end: 'TBD'
  },
  {
    "id": "rochford_T73-2-11b",
    "title": "McGlinchey&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: '16.57'
  },
  {
    "id": "rochford_T73-2-12",
    "title": "Humours of Scarriff (fragment)",
    "genre": "Tune",
    start: '17.08',
    end: '17.22'
  },
  {
    "id": "rochford_T73-2-13",
    "title": "Talk: Micho Russell about Martin Rochford; Willie Clancy Summer School; making BBC programme; future plans",
    "genre": "Tune",
    start: '17.22',
    end: '18.55'
  }
];

async function main() {
  console.log('Processing Session: rochford_T73-2');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'rochford_T73-2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
