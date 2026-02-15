/**
 * Script to split session: london_CM-LI46
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI46.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI46.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI46.htm"
};

const tracks = [
  {
    "id": "london_CM-LI46-1",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: '.03',
    end: '1.28'
  },
  {
    "id": "london_CM-LI46-2",
    "title": "Beauty Spot",
    "genre": "Reel",
    start: '1.30',
    end: '3.02'
  },
  {
    "id": "london_CM-LI46-3",
    "title": "Little Stack of Wheat",
    "genre": "Hornpipe",
    start: '3.05',
    end: '4.47'
  },
  {
    "id": "london_CM-LI46-4",
    "title": "Cruach an Choirce",
    "genre": "Hornpipe",
    start: '4.49',
    end: '6.26'
  },
  {
    "id": "london_CM-LI46-5",
    "title": "Christmas Eve",
    "genre": "Reel",
    start: '6.30',
    end: '8.38'
  },
  {
    "id": "london_CM-LI46-6",
    "title": "Mountian Road",
    "genre": "Reel",
    start: '8.40',
    end: '9.53'
  },
  {
    "id": "london_CM-LI46-7",
    "title": "Blackthorn Stick",
    "genre": "Jig",
    start: '9.57',
    end: '11.11'
  },
  {
    "id": "london_CM-LI46-8",
    "title": "Humours of Lissadell",
    "genre": "Reel",
    start: '11.13',
    end: '13.54'
  },
  {
    "id": "london_CM-LI46-9",
    "title": "Talk: John Joe &amp; Peggy Healy talk about playing &#8220;follow up&#8221; tunes; Peggy&#8217;s father, Thady Casey and Willie Clancy",
    "genre": "Tune",
    start: '13.56',
    end: '19.59'
  },
  {
    "id": "london_CM-LI46-10",
    "title": "The New Mown Meadow",
    "genre": "Reel",
    start: '20.01',
    end: '22.06'
  },
  {
    "id": "london_CM-LI46-11",
    "title": "Talk: Peggy Healy talks about &#8220;cogarnach pilli&uacute;r&#8221; (pillow talk) and bolsters",
    "genre": "Tune",
    start: '22.08',
    end: '24.22'
  },
  {
    "id": "london_CM-LI46-12",
    "title": "Dance Tune: Gan ainm",
    "genre": "Tune",
    start: '24.24',
    end: '25.07'
  },
  {
    "id": "london_CM-LI46-13",
    "title": "Talk: about above tune",
    "genre": "Tune",
    start: '25.07',
    end: '26.17'
  },
  {
    "id": "london_CM-LI46-14",
    "title": "Maggie in the Woods",
    "genre": "Polka",
    start: '26.19',
    end: '27.40'
  },
  {
    "id": "london_CM-LI46-15",
    "title": "Talk: about above tune",
    "genre": "Tune",
    start: '27.41',
    end: '29.38'
  },
  {
    "id": "london_CM-LI46-16",
    "title": "Chase me Charlie",
    "genre": "Tune",
    start: '29.39',
    end: '30.12'
  },
  {
    "id": "london_CM-LI46-17",
    "title": "King of the Clans",
    "genre": "Reel",
    start: '30.20',
    end: '31.47'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI46');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI46-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
