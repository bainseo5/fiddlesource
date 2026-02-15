/**
 * Script to split session: lahinch_CM-WC120
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/lahinch_CM-WC120.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_lahinch_CM-WC120.mp3`;
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
  location: "Crotty&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/lahinch_CM-WC120.htm"
};

const tracks = [
  {
    "id": "lahinch_CM-WC120-1",
    "title": "The Killimer",
    "genre": "Jig",
    start: '.01',
    end: '1.00'
  },
  {
    "id": "lahinch_CM-WC120-2",
    "title": "The Doonagore",
    "genre": "Reel",
    start: '1.02',
    end: '2.12'
  },
  {
    "id": "lahinch_CM-WC120-3",
    "title": "The Roscommon",
    "genre": "Reel",
    start: '2.14',
    end: '3.34'
  },
  {
    "id": "lahinch_CM-WC120-4a",
    "title": "Sailor&#8217;s Cravat",
    "genre": "Reel",
    start: '3.37',
    end: 'TBD'
  },
  {
    "id": "lahinch_CM-WC120-4b",
    "title": "Mrs Crehan&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: '5.38'
  },
  {
    "id": "lahinch_CM-WC120-5",
    "title": "Murphy&#8217;s",
    "genre": "Hornpipe",
    start: '5.41',
    end: '7.07'
  },
  {
    "id": "lahinch_CM-WC120-6",
    "title": "Murphy&#8217;s (another)",
    "genre": "Hornpipe",
    start: '7.14',
    end: '8.38'
  },
  {
    "id": "lahinch_CM-WC120-7a",
    "title": "Lad O&#8217;Beirne&#8217;s",
    "genre": "Reel",
    start: '8.43',
    end: 'TBD'
  },
  {
    "id": "lahinch_CM-WC120-7b",
    "title": "Bag of Spuds",
    "genre": "Reel",
    start: 'TBD',
    end: '11.08'
  },
  {
    "id": "lahinch_CM-WC120-8a",
    "title": "Trim The Velvet",
    "genre": "Reel",
    start: '11.11',
    end: 'TBD'
  },
  {
    "id": "lahinch_CM-WC120-8b",
    "title": "The Banshee",
    "genre": "Reel",
    start: 'TBD',
    end: '13.29'
  },
  {
    "id": "lahinch_CM-WC120-9a",
    "title": "The New Policeman",
    "genre": "Reel",
    start: '13.33',
    end: 'TBD'
  },
  {
    "id": "lahinch_CM-WC120-9b",
    "title": "Maloney&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: '15.34'
  }
];

async function main() {
  console.log('Processing Session: lahinch_CM-WC120');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'lahinch_CM-WC120-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
