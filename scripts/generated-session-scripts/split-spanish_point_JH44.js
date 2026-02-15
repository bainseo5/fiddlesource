/**
 * Script to split session: spanish_point_JH44
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH44.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_spanish_point_JH44.mp3`;
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
  location: "John Joe Healy&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/spanish_point_JH44.htm"
};

const tracks = [
  {
    "id": "spanish_point_JH44-1",
    "title": "Humours of Ballinlass",
    "genre": "Hornpipe",
    start: '.02',
    end: '2.14'
  },
  {
    "id": "spanish_point_JH44-2",
    "title": "Farewell to Miltown",
    "genre": "Reel",
    start: '2.19',
    end: '4.27'
  },
  {
    "id": "spanish_point_JH44-3",
    "title": "Lads of Laois",
    "genre": "Reel",
    start: '4.31',
    end: '5.55'
  },
  {
    "id": "spanish_point_JH44-4",
    "title": "Bobby Casey's",
    "genre": "Reel",
    start: '5.59',
    end: '8.14'
  },
  {
    "id": "spanish_point_JH44-5",
    "title": "New Mown Meadow",
    "genre": "Reel",
    start: '8.20',
    end: '9.59'
  },
  {
    "id": "spanish_point_JH44-6a",
    "title": "Maid in the Meadow",
    "genre": "Jig",
    start: '10.02',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-6b",
    "title": "Donnybrook Fair",
    "genre": "Jig",
    start: 'TBD',
    end: '12.43'
  },
  {
    "id": "spanish_point_JH44-7",
    "title": "Hare&#8217;s Paw",
    "genre": "Reel",
    start: '12.48',
    end: '14.28'
  },
  {
    "id": "spanish_point_JH44-8a",
    "title": "Bobby Casey's",
    "genre": "Hornpipe",
    start: '14.31',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-8b",
    "title": "Alexander's",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '17.35'
  },
  {
    "id": "spanish_point_JH44-9",
    "title": "Orange Rogue",
    "genre": "Jig",
    start: '17.37',
    end: '19.51'
  },
  {
    "id": "spanish_point_JH44-10",
    "title": "Rakish Paddy",
    "genre": "Reel",
    start: '19.54',
    end: '22.41'
  },
  {
    "id": "spanish_point_JH44-11",
    "title": "Anderson's",
    "genre": "Reel",
    start: '22.45',
    end: '24.17'
  },
  {
    "id": "spanish_point_JH44-12a",
    "title": "Wild Irishman",
    "genre": "Reel",
    start: '24.20',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-12b",
    "title": "O&#8217;Rourke&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: '26.23'
  },
  {
    "id": "spanish_point_JH44-13a",
    "title": "Boys of Ballysodare",
    "genre": "Reel",
    start: '26.25',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-13b",
    "title": "Hare&#8217;s Paw",
    "genre": "Reel",
    start: 'TBD',
    end: '28.57'
  },
  {
    "id": "spanish_point_JH44-14a",
    "title": "Miss Walsh's",
    "genre": "Jig",
    start: '29.01',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-14b",
    "title": "Humours of Ennistymon (unfinished)",
    "genre": "Jig",
    start: 'TBD',
    end: '33.14'
  },
  {
    "id": "spanish_point_JH44-15",
    "title": "Otter's Holt",
    "genre": "Reel",
    start: '33.16',
    end: '34.20'
  },
  {
    "id": "spanish_point_JH44-16",
    "title": "It's a Hard Road to Travel",
    "genre": "Reel",
    start: '34.23',
    end: '35.47'
  },
  {
    "id": "spanish_point_JH44-17",
    "title": "Gatehouse Maid",
    "genre": "Reel",
    start: '35.50',
    end: '37.13'
  },
  {
    "id": "spanish_point_JH44-18",
    "title": "Stack of Barley",
    "genre": "Hornpipe",
    start: '37.16',
    end: '38.15'
  },
  {
    "id": "spanish_point_JH44-19a",
    "title": "Reel of Bogie",
    "genre": "Reel",
    start: '38.18',
    end: 'TBD'
  },
  {
    "id": "spanish_point_JH44-19b",
    "title": "Green fields of Rossbeigh",
    "genre": "Reel",
    start: 'TBD',
    end: '40.58'
  },
  {
    "id": "spanish_point_JH44-20",
    "title": "Ivy Leaf",
    "genre": "Reel",
    start: '41.03',
    end: '42.24'
  }
];

async function main() {
  console.log('Processing Session: spanish_point_JH44');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'spanish_point_JH44-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
