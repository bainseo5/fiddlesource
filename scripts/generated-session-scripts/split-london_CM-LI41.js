/**
 * Script to split session: london_CM-LI41
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI41.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI41.mp3`;
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
  musicians: "breaks) (13.26 - 15.26) 11. Reel: Graf Spee (15.27 - 17.02) 12 Reel: Farewell to Ireland (17.04 - 19.26) 13. Reel: Earl's Chair (19.29 - 20.41) 14. Jig: Humours of Ennistymon (20.46 - 22.21) 15. Reel: Humours of Lissadell (22.24 - 23.36) 16. Reel: Tom Ward's Downfall (23.38 - 24.50) 17. Jig: Rambling Pitchfork (24.52 - 25.55) Fergus McTeggart, Mikeen McCarthy &amp; Tommy McCarthy, 1980s. Photo &copy; Pat Mackenzie. &lt;&lt; The Carroll Mackenzie Music Collection",
  date: "1980",
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI41.htm"
};

const tracks = [
  {
    "id": "london_CM-LI41-1",
    "title": "John Brennan's",
    "genre": "Reel",
    start: '.02',
    end: '1.14'
  },
  {
    "id": "london_CM-LI41-2",
    "title": "Gan ainm",
    "genre": "Hornpipe",
    start: '1.17',
    end: '2.12'
  },
  {
    "id": "london_CM-LI41-3a",
    "title": "Enchanted Lady",
    "genre": "Reel",
    start: '2.14',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI41-3b",
    "title": "Holy Land",
    "genre": "Reel",
    start: 'TBD',
    end: '3.58'
  },
  {
    "id": "london_CM-LI41-4a",
    "title": "Maude Miller",
    "genre": "Reel",
    start: '4.00',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI41-4b",
    "title": "Molloy's",
    "genre": "Reel",
    start: 'TBD',
    end: '5.50'
  },
  {
    "id": "london_CM-LI41-5",
    "title": "Kinnegad Slashers",
    "genre": "Jig",
    start: '5.52',
    end: '6.55'
  },
  {
    "id": "london_CM-LI41-6",
    "title": "Blackbird",
    "genre": "Set Dance",
    start: '6.57',
    end: '9.02'
  },
  {
    "id": "london_CM-LI41-7a",
    "title": "Frank Kelly's",
    "genre": "Jig",
    start: '9.04',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI41-7b",
    "title": "A visit to Ireland",
    "genre": "Jig",
    start: 'TBD',
    end: '11.10'
  },
  {
    "id": "london_CM-LI41-8",
    "title": "Limestone Rock",
    "genre": "Reel",
    start: '11.12',
    end: '12.09'
  },
  {
    "id": "london_CM-LI41-9",
    "title": "Reel of Mullinavat",
    "genre": "Reel",
    start: '12.11',
    end: '13.24'
  },
  {
    "id": "london_CM-LI41-10",
    "title": "Rose in the Garden (with breaks)",
    "genre": "Reel",
    start: '13.26',
    end: '15.26'
  },
  {
    "id": "london_CM-LI41-11",
    "title": "Graf Spee",
    "genre": "Reel",
    start: '15.27',
    end: '17.02'
  },
  {
    "id": "london_CM-LI41-13",
    "title": "Earl's Chair",
    "genre": "Reel",
    start: '19.29',
    end: '20.41'
  },
  {
    "id": "london_CM-LI41-14",
    "title": "Humours of Ennistymon",
    "genre": "Jig",
    start: '20.46',
    end: '22.21'
  },
  {
    "id": "london_CM-LI41-15",
    "title": "Humours of Lissadell",
    "genre": "Reel",
    start: '22.24',
    end: '23.36'
  },
  {
    "id": "london_CM-LI41-16",
    "title": "Tom Ward's Downfall",
    "genre": "Reel",
    start: '23.38',
    end: '24.50'
  },
  {
    "id": "london_CM-LI41-17",
    "title": "Rambling Pitchfork",
    "genre": "Jig",
    start: '24.52',
    end: '25.55'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI41');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI41-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
