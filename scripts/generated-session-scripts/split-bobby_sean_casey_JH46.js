/**
 * Script to split session: bobby_sean_casey_JH46
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bobby_sean_casey_JH46.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bobby_sean_casey_JH46.mp3`;
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
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bobby_sean_casey_JH46.htm"
};

const tracks = [
  {
    "id": "bobby_sean_casey_JH46-1",
    "title": "McKenna&#8217;s #2 (Bloom of Youth)",
    "genre": "Reel",
    start: '.04',
    end: '1.22'
  },
  {
    "id": "bobby_sean_casey_JH46-2",
    "title": "Sweeney's Dream",
    "genre": "Reel",
    start: '1.24',
    end: '2.42'
  },
  {
    "id": "bobby_sean_casey_JH46-3",
    "title": "Jenny&#8217;s Wedding",
    "genre": "Reel",
    start: '2.43',
    end: '4.38'
  },
  {
    "id": "bobby_sean_casey_JH46-4",
    "title": "Crehan's Kitchen",
    "genre": "Reel",
    start: '4.39',
    end: '5.26'
  },
  {
    "id": "bobby_sean_casey_JH46-5",
    "title": "Golden Eagle",
    "genre": "Hornpipe",
    start: '5.28',
    end: '6.58'
  },
  {
    "id": "bobby_sean_casey_JH46-6a",
    "title": "Liffey Banks",
    "genre": "Reel",
    start: '7.00',
    end: 'TBD'
  },
  {
    "id": "bobby_sean_casey_JH46-6b",
    "title": "Shaskeen",
    "genre": "Reel",
    start: 'TBD',
    end: '8.36'
  },
  {
    "id": "bobby_sean_casey_JH46-7",
    "title": "Colonel Fraser",
    "genre": "Reel",
    start: '8.38',
    end: '10.04'
  },
  {
    "id": "bobby_sean_casey_JH46-8a",
    "title": "Green Fields of Rossbeigh",
    "genre": "Reel",
    start: '10.05',
    end: 'TBD'
  },
  {
    "id": "bobby_sean_casey_JH46-8b",
    "title": "Queen of the May",
    "genre": "Reel",
    start: 'TBD',
    end: '12.01'
  },
  {
    "id": "bobby_sean_casey_JH46-9a",
    "title": "Lucy Campbell",
    "genre": "Reel",
    start: '12.02',
    end: 'TBD'
  },
  {
    "id": "bobby_sean_casey_JH46-9b",
    "title": "Pigeon on the Gate",
    "genre": "Reel",
    start: 'TBD',
    end: '14.23'
  },
  {
    "id": "bobby_sean_casey_JH46-10",
    "title": "Dublin Reel sequence (unfinished &#8211; tape run out)",
    "genre": "Reel",
    start: '14.25',
    end: '14.58'
  },
  {
    "id": "bobby_sean_casey_JH46-11",
    "title": "Jenny Picking Cockles",
    "genre": "Reel",
    start: '14.49',
    end: '16.08'
  },
  {
    "id": "bobby_sean_casey_JH46-12",
    "title": "Humours of Ennistymon",
    "genre": "Jig",
    start: '16.10',
    end: '17.52'
  },
  {
    "id": "bobby_sean_casey_JH46-13",
    "title": "Bunch of Keys",
    "genre": "Reel",
    start: '17.55',
    end: '19.23'
  },
  {
    "id": "bobby_sean_casey_JH46-14",
    "title": "Farewell to Miltown",
    "genre": "Reel",
    start: '19.25',
    end: '21.17'
  },
  {
    "id": "bobby_sean_casey_JH46-15",
    "title": "Se&aacute;n Ryan&#8217;s",
    "genre": "Jig",
    start: '21.20',
    end: '22.36'
  },
  {
    "id": "bobby_sean_casey_JH46-16",
    "title": "Gan ainm",
    "genre": "Jig",
    start: '22.39',
    end: '24.20'
  },
  {
    "id": "bobby_sean_casey_JH46-17",
    "title": "Rolling in the Barrel",
    "genre": "Reel",
    start: '24.24',
    end: '25.50'
  },
  {
    "id": "bobby_sean_casey_JH46-18",
    "title": "Other High Reel ( 25.53 - 27.36) 19. Reel: Boy in the Gap",
    "genre": "Reel",
    start: '27.38',
    end: '28.40'
  },
  {
    "id": "bobby_sean_casey_JH46-20a",
    "title": "Sporting Nell",
    "genre": "Reel",
    start: '28.42',
    end: 'TBD'
  },
  {
    "id": "bobby_sean_casey_JH46-20b",
    "title": "Beauty Spot",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bobby_sean_casey_JH46-20c",
    "title": "Dunmore Lasses",
    "genre": "Reel",
    start: 'TBD',
    end: '31.47'
  }
];

async function main() {
  console.log('Processing Session: bobby_sean_casey_JH46');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'bobby_sean_casey_JH46-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
