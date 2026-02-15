/**
 * Script to split session: maghera_T80-1-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T80-1-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_maghera_T80-1-1.mp3`;
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
  location: "Hayes&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/maghera_T80-1-1.htm"
};

const tracks = [
  {
    "id": "maghera_T80-1-1-1a",
    "title": "Tempest (PJH",
    "genre": "Reel",
    start: '.03',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-1b",
    "title": "BT)",
    "genre": "Reel",
    start: 'TBD',
    end: '2.01'
  },
  {
    "id": "maghera_T80-1-1-2",
    "title": "Green Gowned Lass (all)",
    "genre": "Reel",
    start: '2.05',
    end: '4.19'
  },
  {
    "id": "maghera_T80-1-1-3",
    "title": "Rooms of Dooagh (PJH)",
    "genre": "Jig",
    start: '4.20',
    end: '5.20'
  },
  {
    "id": "maghera_T80-1-1-4",
    "title": "Kerfunten (PJH)",
    "genre": "Jig",
    start: '5.28',
    end: '6.43'
  },
  {
    "id": "maghera_T80-1-1-5a",
    "title": "Maids of Feakle (PJH",
    "genre": "Reel",
    start: '6.58',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-5b",
    "title": "BT)",
    "genre": "Reel",
    start: 'TBD',
    end: '7.33'
  },
  {
    "id": "maghera_T80-1-1-6a",
    "title": "Four Courts",
    "genre": "Reel",
    start: '7.52',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-6b",
    "title": "Rip the Calico (PJH)",
    "genre": "Reel",
    start: 'TBD',
    end: '10.44'
  },
  {
    "id": "maghera_T80-1-1-7a",
    "title": "Rip the Calico (PJH",
    "genre": "Reel",
    start: '11.00',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-7b",
    "title": "SH)",
    "genre": "Reel",
    start: 'TBD',
    end: '12.02'
  },
  {
    "id": "maghera_T80-1-1-8a",
    "title": "Windy",
    "genre": "Reel",
    start: '12.07',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-8b",
    "title": "Sargent Early's Dream (PJH)",
    "genre": "Reel",
    start: 'TBD',
    end: '15.20'
  },
  {
    "id": "maghera_T80-1-1-9a",
    "title": "Gan Ainm",
    "genre": "Reel",
    start: '16.03',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-9b",
    "title": "Gan Ainm (PJH)",
    "genre": "Reel",
    start: 'TBD',
    end: '18.33'
  },
  {
    "id": "maghera_T80-1-1-10a",
    "title": "Hole in the Hedge",
    "genre": "Jig",
    start: '19.05',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-10b",
    "title": "S&eacute;amus Cooley&#8217;s (PJH) )",
    "genre": "Jig",
    start: 'TBD',
    end: '22.28'
  },
  {
    "id": "maghera_T80-1-1-11a",
    "title": "P. Joe&#8217;s",
    "genre": "Reel",
    start: '22.53',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-11b",
    "title": "Brendan McMahon's (PJH)",
    "genre": "Reel",
    start: 'TBD',
    end: '25.16'
  },
  {
    "id": "maghera_T80-1-1-12",
    "title": "Scully Casey's (PJH)",
    "genre": "Jig",
    start: '25.17',
    end: '27.04'
  },
  {
    "id": "maghera_T80-1-1-13",
    "title": "Windy Gap (all)",
    "genre": "Reel",
    start: '27.04',
    end: '28.36'
  },
  {
    "id": "maghera_T80-1-1-14a",
    "title": "McGreevy&#8217;s",
    "genre": "Reel",
    start: '29.29',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-14b",
    "title": "Miss McGuinness",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "maghera_T80-1-1-14c",
    "title": "Sweetheart (PJH)",
    "genre": "Reel",
    start: 'TBD',
    end: '32.19'
  }
];

async function main() {
  console.log('Processing Session: maghera_T80-1-1');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'maghera_T80-1-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
