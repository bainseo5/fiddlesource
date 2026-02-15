/**
 * Script to split session: bonavella_JH24-3
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH24-3.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bonavella_JH24-3.mp3`;
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
  location: "'Junior' Crehan&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH24-3.htm"
};

const tracks = [
  {
    "id": "bonavella_JH24-3-1a",
    "title": "Clare (Paddy in London)",
    "genre": "Jig",
    start: '01.',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH24-3-1b",
    "title": "Tenpenny Bit",
    "genre": "Jig",
    start: 'TBD',
    end: '3.22'
  },
  {
    "id": "bonavella_JH24-3-2",
    "title": "The Rookery",
    "genre": "Jig",
    start: '3.24',
    end: '4.52'
  },
  {
    "id": "bonavella_JH24-3-3",
    "title": "Geese in the Bog",
    "genre": "Jig",
    start: '4.59',
    end: '7.28'
  },
  {
    "id": "bonavella_JH24-3-4a",
    "title": "Story",
    "genre": "Jig",
    start: '7.31',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH24-3-4b",
    "title": "Jig: The Luachrach&aacute;n*",
    "genre": "Jig",
    start: 'TBD',
    end: '11.00'
  },
  {
    "id": "bonavella_JH24-3-5",
    "title": "Story: Of being able to see fairies",
    "genre": "Tune",
    start: '11.04',
    end: '11.48'
  },
  {
    "id": "bonavella_JH24-3-6",
    "title": "Connachtman&#8217;s Rambles",
    "genre": "Jig",
    start: '11.51',
    end: '13.33'
  },
  {
    "id": "bonavella_JH24-3-7a",
    "title": "Tatter Jack Walsh",
    "genre": "Jig",
    start: '13.35',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH24-3-7b",
    "title": "Banish Misfortune",
    "genre": "Jig",
    start: 'TBD',
    end: '15.50'
  },
  {
    "id": "bonavella_JH24-3-8",
    "title": "Ship in Full Sail",
    "genre": "Jig",
    start: '15.53',
    end: '17.00'
  },
  {
    "id": "bonavella_JH24-3-9",
    "title": "Lonesome",
    "genre": "Jig",
    start: '17.04',
    end: '18.16'
  },
  {
    "id": "bonavella_JH24-3-10",
    "title": "Mist Covered Mountain*",
    "genre": "Jig",
    start: '18.19',
    end: '19.32'
  },
  {
    "id": "bonavella_JH24-3-11a",
    "title": "Pigeon on the Gate",
    "genre": "Reel",
    start: '19.34',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH24-3-11b",
    "title": "Toss the Feathers",
    "genre": "Reel",
    start: 'TBD',
    end: '21.53'
  },
  {
    "id": "bonavella_JH24-3-12",
    "title": "Toss the Feathers (Clare version)",
    "genre": "Reel",
    start: '21.56',
    end: '23.18'
  },
  {
    "id": "bonavella_JH24-3-13",
    "title": "Stack of Oats*",
    "genre": "Hornpipe",
    start: '23.24',
    end: '26.09'
  },
  {
    "id": "bonavella_JH24-3-14a",
    "title": "Stream of the Cats",
    "genre": "Hornpipe",
    start: '26.12',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH24-3-14b",
    "title": "Stack of Wheat",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '28.15'
  }
];

async function main() {
  console.log('Processing Session: bonavella_JH24-3');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'bonavella_JH24-3-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
