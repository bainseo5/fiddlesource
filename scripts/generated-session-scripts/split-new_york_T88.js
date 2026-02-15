/**
 * Script to split session: new_york_T88
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/new_york_T88.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_new_york_T88.mp3`;
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
  location: "the Eagle Tavern, New York",
  musicians: "Unknown Musicians",
  date: "1993",
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/new_york_T88.htm"
};

const tracks = [
  {
    "id": "new_york_T88-1a",
    "title": "Crooked Road",
    "genre": "Reel",
    start: '.01',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-1b",
    "title": "Lady&#8217;s Pantalets",
    "genre": "Reel",
    start: 'TBD',
    end: '2.06'
  },
  {
    "id": "new_york_T88-2a",
    "title": "Paddy Cronin&#8217;s",
    "genre": "Reel",
    start: '2.10',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-2b",
    "title": "Five Mile Chase",
    "genre": "Reel",
    start: 'TBD',
    end: '4.57'
  },
  {
    "id": "new_york_T88-3a",
    "title": "Air",
    "genre": "Reel",
    start: '5.40',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-3b",
    "title": "Reel: Lament for Staker Wallace",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-3c",
    "title": "Old High Reel",
    "genre": "Reel",
    start: 'TBD',
    end: '10.21'
  },
  {
    "id": "new_york_T88-4a",
    "title": "Little Stack of Wheat",
    "genre": "Hornpipe",
    start: '10.23',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-4b",
    "title": "Rodney's Glory",
    "genre": "Hornpipe",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-4c",
    "title": "Little Stack of Oats",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '14.40'
  },
  {
    "id": "new_york_T88-5a",
    "title": "Jolly Tinker",
    "genre": "Reel",
    start: '15.27',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-5b",
    "title": "Sally Gardens",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-5c",
    "title": "Green Gates",
    "genre": "Reel",
    start: 'TBD',
    end: '19.09'
  },
  {
    "id": "new_york_T88-6a",
    "title": "Come West Along the Road",
    "genre": "Reel",
    start: '19.09',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-6b",
    "title": "London Lasses",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-6c",
    "title": "Redhaired Lass",
    "genre": "Reel",
    start: 'TBD',
    end: '20.52'
  },
  {
    "id": "new_york_T88-7a",
    "title": "Story",
    "genre": "Tune",
    start: '21.18',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-7b",
    "title": "Air: Anach Cuain",
    "genre": "Tune",
    start: 'TBD',
    end: '25.11'
  },
  {
    "id": "new_york_T88-8a",
    "title": "Honeymoon",
    "genre": "Reel",
    start: '25.13',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-8b",
    "title": "Copperplate",
    "genre": "Reel",
    start: 'TBD',
    end: '27.21'
  },
  {
    "id": "new_york_T88-9a",
    "title": "Air",
    "genre": "Jig",
    start: '27.22',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-9b",
    "title": "Jigs (3): Boolavogue",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-9c",
    "title": "Saddle the Pony",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-9d",
    "title": "Maid in the Meadow",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-9e",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: 'TBD',
    end: '31.15'
  },
  {
    "id": "new_york_T88-10a",
    "title": "Hornpipe",
    "genre": "Hornpipe",
    start: '31.18',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-10b",
    "title": "Fling: Mikey Callaghan&#8217;s",
    "genre": "Hornpipe",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-10c",
    "title": "Keel Row",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '33.44'
  },
  {
    "id": "new_york_T88-11a",
    "title": "Rakes of Clonmel",
    "genre": "Jig",
    start: '33.48',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-11b",
    "title": "Sporting Pitchfork",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-11c",
    "title": "Rambling Pitchfork",
    "genre": "Jig",
    start: 'TBD',
    end: '36.48'
  },
  {
    "id": "new_york_T88-12a",
    "title": "Hairy Chested Frog",
    "genre": "Reel",
    start: '37.19',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-12b",
    "title": "Music in the Glen",
    "genre": "Reel",
    start: 'TBD',
    end: '39.50'
  },
  {
    "id": "new_york_T88-13a",
    "title": "Mount Famous",
    "genre": "Set Dance",
    start: '39.52',
    end: 'TBD'
  },
  {
    "id": "new_york_T88-13b",
    "title": "Rodney&#8217;s Glory",
    "genre": "Set Dance",
    start: 'TBD',
    end: '42.35'
  }
];

async function main() {
  console.log('Processing Session: new_york_T88');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'new_york_T88-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
