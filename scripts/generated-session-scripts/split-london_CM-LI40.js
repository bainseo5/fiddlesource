/**
 * Script to split session: london_CM-LI40
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI40.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_CM-LI40.mp3`;
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
  date: "1980",
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_CM-LI40.htm"
};

const tracks = [
  {
    "id": "london_CM-LI40-1a",
    "title": "March",
    "genre": "March",
    start: '.02',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-1b",
    "title": "Dance?: Gan ainm",
    "genre": "March",
    start: 'TBD',
    end: '2.28'
  },
  {
    "id": "london_CM-LI40-2",
    "title": "Tune: Gan ainm (Own composition)",
    "genre": "Tune",
    start: '2.30',
    end: '3.57'
  },
  {
    "id": "london_CM-LI40-3",
    "title": "Blackthorn Stick",
    "genre": "Jig",
    start: '4.03',
    end: '5.07'
  },
  {
    "id": "london_CM-LI40-4",
    "title": "Blackthorn Stick",
    "genre": "Set Dance",
    start: '5.10',
    end: '6.21'
  },
  {
    "id": "london_CM-LI40-5a",
    "title": "Flowing Tide",
    "genre": "Hornpipe",
    start: '6.22',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-5b",
    "title": "Kitty's Wedding",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '9.09'
  },
  {
    "id": "london_CM-LI40-6a",
    "title": "Knights of St Patrick",
    "genre": "Jig",
    start: '9.12',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-6b",
    "title": "Sixpenny Money",
    "genre": "Jig",
    start: 'TBD',
    end: '11.19'
  },
  {
    "id": "london_CM-LI40-7",
    "title": "Tune: Jig of Port Fleadh (Own composition)",
    "genre": "Jig",
    start: '11.23',
    end: '12.58'
  },
  {
    "id": "london_CM-LI40-8a",
    "title": "Christmas Eve",
    "genre": "Reel",
    start: '13.00',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-8b",
    "title": "Mountain Top",
    "genre": "Reel",
    start: 'TBD',
    end: '15.40'
  },
  {
    "id": "london_CM-LI40-9",
    "title": "Battering Ram",
    "genre": "Reel",
    start: '15.42',
    end: '17.18'
  },
  {
    "id": "london_CM-LI40-10",
    "title": "Lord Gordon's",
    "genre": "Reel",
    start: '17.19',
    end: '20.18'
  },
  {
    "id": "london_CM-LI40-11a",
    "title": "Mullingar Races",
    "genre": "Reel",
    start: '20.21',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-11b",
    "title": "Wind that Shakes the Barley",
    "genre": "Reel",
    start: 'TBD',
    end: '22.27'
  },
  {
    "id": "london_CM-LI40-12a",
    "title": "Gan ainm (Own composition)",
    "genre": "Jig",
    start: '22.29',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-12b",
    "title": "The Kerry",
    "genre": "Jig",
    start: 'TBD',
    end: '24.38'
  },
  {
    "id": "london_CM-LI40-13",
    "title": "Tune: Gan ainm",
    "genre": "Tune",
    start: '24.40',
    end: '25.45'
  },
  {
    "id": "london_CM-LI40-14a",
    "title": "Liffey Banks",
    "genre": "Reel",
    start: '25.47',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-14b",
    "title": "Shaskeen",
    "genre": "Reel",
    start: 'TBD',
    end: '28.10'
  },
  {
    "id": "london_CM-LI40-15a",
    "title": "Sault's Own",
    "genre": "Hornpipe",
    start: '28.12',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-15b",
    "title": "Harvest Home",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '31.03'
  },
  {
    "id": "london_CM-LI40-16",
    "title": "Jenny's Welcome to Charlie",
    "genre": "Reel",
    start: '31.05',
    end: '33.30'
  },
  {
    "id": "london_CM-LI40-17",
    "title": "Orange Rogue",
    "genre": "Set Dance",
    start: '33.33',
    end: '34.49'
  },
  {
    "id": "london_CM-LI40-18",
    "title": "Three Sea Captains",
    "genre": "Set Dance",
    start: '34.51',
    end: '35.45'
  },
  {
    "id": "london_CM-LI40-19a",
    "title": "Boys of Laois",
    "genre": "Reel",
    start: '36.00',
    end: 'TBD'
  },
  {
    "id": "london_CM-LI40-19b",
    "title": "Boys of the Lough",
    "genre": "Reel",
    start: 'TBD',
    end: '38.27'
  }
];

async function main() {
  console.log('Processing Session: london_CM-LI40');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_CM-LI40-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
