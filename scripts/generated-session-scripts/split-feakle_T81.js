/**
 * Script to split session: feakle_T81
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/feakle_T81.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_feakle_T81.mp3`;
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
  location: "Pepper&#",
  musicians: "P Joe Hayes, Maghera, Caher, fiddle; Jack Broome, England, banjo; Barry Taylor, Cooraclare, fiddle &amp; concertina; Stephen Harrison, Ramsey, Isle of Man; flute; Dave Preston, Powys, Wales, banjo; Unidentified guitar &amp; fiddle.",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/feakle_T81.htm"
};

const tracks = [
  {
    "id": "feakle_T81-1a",
    "title": "Cup of Tea",
    "genre": "Reel",
    start: '.01',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-1b",
    "title": "Wise Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '4.38'
  },
  {
    "id": "feakle_T81-2a",
    "title": "Kilmaley",
    "genre": "Reel",
    start: '4.44',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-2b",
    "title": "Old Copperplate",
    "genre": "Reel",
    start: 'TBD',
    end: '7.33'
  },
  {
    "id": "feakle_T81-3a",
    "title": "Cooley&#8217;s",
    "genre": "Reel",
    start: '7.38',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-3b",
    "title": "Drag Her Round the Road",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-3c",
    "title": "Galway Rambler",
    "genre": "Reel",
    start: 'TBD',
    end: '12.14'
  },
  {
    "id": "feakle_T81-4a",
    "title": "Castle Kelly",
    "genre": "Reel",
    start: '12.20',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-4b",
    "title": "Humours of Ballyconnell",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-4c",
    "title": "Duke of Leinster",
    "genre": "Reel",
    start: 'TBD',
    end: '16.22'
  },
  {
    "id": "feakle_T81-5a",
    "title": "Castle (P. Joe&#8217;s)",
    "genre": "Jig",
    start: '16.29',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-5b",
    "title": "Hag at the Churn",
    "genre": "Jig",
    start: 'TBD',
    end: '20.14'
  },
  {
    "id": "feakle_T81-6a",
    "title": "Hare&#8217;s Paw",
    "genre": "Reel",
    start: '20.18',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-6b",
    "title": "Dairy Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '22.32'
  },
  {
    "id": "feakle_T81-7a",
    "title": "Concertina",
    "genre": "Reel",
    start: '22.39',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-7b",
    "title": "Mick Coffey&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: '26.31'
  },
  {
    "id": "feakle_T81-8a",
    "title": "P. Joe&#8217;s",
    "genre": "Reel",
    start: '26.36',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-8b",
    "title": "Mountain Lark",
    "genre": "Reel",
    start: 'TBD',
    end: '29.45'
  },
  {
    "id": "feakle_T81-9",
    "title": "Seamus Cooley's",
    "genre": "Jig",
    start: '29.49',
    end: '31.39'
  },
  {
    "id": "feakle_T81-10a",
    "title": "Sailor on the Rock",
    "genre": "Reel",
    start: '31.46',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-10b",
    "title": "Last Night&#8217;s Fun",
    "genre": "Reel",
    start: 'TBD',
    end: '34.38'
  },
  {
    "id": "feakle_T81-11a",
    "title": "Devanny's Goat",
    "genre": "Reel",
    start: '34.47',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-11b",
    "title": "Mountain Road",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-11c",
    "title": "Skylark",
    "genre": "Reel",
    start: 'TBD',
    end: '40.49'
  },
  {
    "id": "feakle_T81-12a",
    "title": "Michael Hynes'",
    "genre": "Jig",
    start: '40.54',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-12b",
    "title": "The Butcher's March",
    "genre": "Jig",
    start: 'TBD',
    end: '43.30'
  },
  {
    "id": "feakle_T81-13",
    "title": "My Love is in America",
    "genre": "Reel",
    start: '43.31',
    end: '45.18'
  },
  {
    "id": "feakle_T81-14",
    "title": "Little Town in the Old County Down (Unidentified male singer: Dermot?)",
    "genre": "Song",
    start: '45.25',
    end: '47.14'
  },
  {
    "id": "feakle_T81-15a",
    "title": "Dick Cosgrave&#8217;s",
    "genre": "Reel",
    start: '47.21',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-15b",
    "title": "Rolling in the Barrel",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-15c",
    "title": "Tap Room",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-15d",
    "title": "Earl&#8217;s Chair",
    "genre": "Reel",
    start: 'TBD',
    end: '52.25'
  },
  {
    "id": "feakle_T81-16a",
    "title": "Anything for John Joe",
    "genre": "Reel",
    start: '52.28',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-16b",
    "title": "Miss Johnson's",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-16c",
    "title": "Lucy Campbell's",
    "genre": "Reel",
    start: 'TBD',
    end: '58.48'
  },
  {
    "id": "feakle_T81-17",
    "title": "Peacock&#8217;s Feather",
    "genre": "Hornpipe",
    start: '58.53',
    end: '1.01.17'
  },
  {
    "id": "feakle_T81-18a",
    "title": "Sporting Nell",
    "genre": "Reel",
    start: '1.01.25',
    end: 'TBD'
  },
  {
    "id": "feakle_T81-18b",
    "title": "Toss the Feathers",
    "genre": "Reel",
    start: 'TBD',
    end: '1.04.20'
  }
];

async function main() {
  console.log('Processing Session: feakle_T81');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'feakle_T81-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
