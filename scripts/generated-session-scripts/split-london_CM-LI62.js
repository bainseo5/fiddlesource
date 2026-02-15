/**
 * Script to split session: london_CM-LI62
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI62.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI62.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI62.htm"
};

const tracks = [
  {
    "id": "london_CM-LI62-1",
    "title": "Introductions",
    "genre": "Tune",
    start: '.01',
    end: '.43'
  },
  {
    "id": "london_CM-LI62-2",
    "title": "Poll Halfpenny",
    "genre": "Hornpipe",
    start: '.44',
    end: '3.01'
  },
  {
    "id": "london_CM-LI62-3",
    "title": "Alexander's",
    "genre": "March",
    start: '4.04',
    end: '6.58'
  },
  {
    "id": "london_CM-LI62-4",
    "title": "Sliabh na mBan",
    "genre": "Song",
    start: '7.39',
    end: '9.45'
  },
  {
    "id": "london_CM-LI62-5",
    "title": "Daniel O'Connell and his Steam Engine",
    "genre": "Song",
    start: '10.56',
    end: '13.04'
  },
  {
    "id": "london_CM-LI62-6",
    "title": "Air: Se&aacute;n &Oacute; Duibhir a&#8217; Ghleanna",
    "genre": "Tune",
    start: '13.23',
    end: '15.05'
  },
  {
    "id": "london_CM-LI62-7",
    "title": "Air: Gol na nBan",
    "genre": "Tune",
    start: '15.49',
    end: '18.44'
  },
  {
    "id": "london_CM-LI62-8a",
    "title": "Wallop the Spot",
    "genre": "Jig",
    start: '19.19',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI62-8b",
    "title": "Rose in the Heather",
    "genre": "Jig",
    start: 'TBD',
    end: '23.15'
  },
  {
    "id": "london_CM-LI62-9",
    "title": "Bonny Bunch of Roses",
    "genre": "Song",
    start: '23.40',
    end: '27.03'
  },
  {
    "id": "london_CM-LI62-10a",
    "title": "Jenny picking Cockles",
    "genre": "Reel",
    start: '27.12',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI62-10b",
    "title": "The Steam packet",
    "genre": "Reel",
    start: 'TBD',
    end: '30.11'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI62');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI62-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
