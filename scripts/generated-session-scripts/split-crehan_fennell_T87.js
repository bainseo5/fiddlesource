/**
 * Script to split session: crehan_fennell_T87
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/crehan_fennell_T87.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_crehan_fennell_T87.mp3`;
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
  musicians: "Martin &#8216;Junior&#8217; Crehan, Bonavilla, Mullagh, fiddle; John Fennel, Quilty, tin whistle; unknown fiddler: John Joe Healy - Paddy Galvin - Michael Downes? Venue Unknown",
  date: "Unknown Date",
  collection: "Barry Taylor Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/crehan_fennell_T87.htm"
};

const tracks = [
  {
    "id": "crehan_fennell_T87-1",
    "title": "Bucks of Oranmore",
    "genre": "Reel",
    start: '.01',
    end: '2.21'
  },
  {
    "id": "crehan_fennell_T87-2",
    "title": "Trim the Velvet",
    "genre": "Reel",
    start: '2.27',
    end: '3.25'
  },
  {
    "id": "crehan_fennell_T87-3a",
    "title": "Jig",
    "genre": "Jig",
    start: '3.30',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-3b",
    "title": "Hornpipes (2): Gan ainm",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-3c",
    "title": "Harvest Home",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-3d",
    "title": "The Derry",
    "genre": "Jig",
    start: 'TBD',
    end: '7.43'
  },
  {
    "id": "crehan_fennell_T87-4a",
    "title": "John Naughton's",
    "genre": "Reel",
    start: '7.48',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-4b",
    "title": "Reel with the Birl",
    "genre": "Reel",
    start: 'TBD',
    end: '10.40'
  },
  {
    "id": "crehan_fennell_T87-5a",
    "title": "Boys of Ballysodare",
    "genre": "Reel",
    start: '10.42',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-5b",
    "title": "Hare&#8217;s Paw",
    "genre": "Reel",
    start: 'TBD',
    end: '13.01'
  },
  {
    "id": "crehan_fennell_T87-6a",
    "title": "Stack of Oats",
    "genre": "Hornpipe",
    start: '13.03',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-6b",
    "title": "Humours of Tullycrine",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '15.53'
  },
  {
    "id": "crehan_fennell_T87-7",
    "title": "Christmas Eve",
    "genre": "Reel",
    start: '15.55',
    end: '17.49'
  },
  {
    "id": "crehan_fennell_T87-8a",
    "title": "Steam Packet",
    "genre": "Reel",
    start: '17.50',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-8b",
    "title": "Kilmaley",
    "genre": "Reel",
    start: 'TBD',
    end: '19.25'
  },
  {
    "id": "crehan_fennell_T87-9",
    "title": "Air: Gan ainm",
    "genre": "Tune",
    start: '19.31',
    end: '21.25'
  },
  {
    "id": "crehan_fennell_T87-10",
    "title": "Gan ainm",
    "genre": "Reel",
    start: '21.28',
    end: '22.27'
  },
  {
    "id": "crehan_fennell_T87-11a",
    "title": "Pull the Knife and Stick it again",
    "genre": "Jig",
    start: '22.28',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-11b",
    "title": "Morrison's",
    "genre": "Jig",
    start: 'TBD',
    end: '25.28'
  },
  {
    "id": "crehan_fennell_T87-12a",
    "title": "Glen of Aherlow",
    "genre": "Reel",
    start: '25.30',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-12b",
    "title": "Tap Room",
    "genre": "Reel",
    start: 'TBD',
    end: '28.05'
  },
  {
    "id": "crehan_fennell_T87-13",
    "title": "Humours of Lissadell",
    "genre": "Reel",
    start: '28.07',
    end: '29.40'
  },
  {
    "id": "crehan_fennell_T87-14",
    "title": "Bonaparte's Retreat",
    "genre": "Hornpipe",
    start: '29.42',
    end: '32.38'
  },
  {
    "id": "crehan_fennell_T87-15",
    "title": "Sporting Nell",
    "genre": "Reel",
    start: '32.40',
    end: '34.36'
  },
  {
    "id": "crehan_fennell_T87-16",
    "title": "Blackbird",
    "genre": "Set Dance",
    start: '34.38',
    end: '36.15'
  },
  {
    "id": "crehan_fennell_T87-17a",
    "title": "Old Torn Petticoat",
    "genre": "Reel",
    start: '36.20',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-17b",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-17c",
    "title": "Rakish Paddy",
    "genre": "Reel",
    start: 'TBD',
    end: '40.38'
  },
  {
    "id": "crehan_fennell_T87-18",
    "title": "The Killavil",
    "genre": "Reel",
    start: '40.40',
    end: '41.55'
  },
  {
    "id": "crehan_fennell_T87-19a",
    "title": "Gatehouse Maid",
    "genre": "Reel",
    start: '41.57',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-19b",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-19c",
    "title": "Ivy Leaf (fragment)",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-19d",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-19e",
    "title": "Ivy Leaf",
    "genre": "Reel",
    start: 'TBD',
    end: '46.27'
  },
  {
    "id": "crehan_fennell_T87-20a",
    "title": "Billy O&#8217;Donnell&#8217;s",
    "genre": "Jig",
    start: '46.30',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-20b",
    "title": "Maid in the Meadow",
    "genre": "Jig",
    start: 'TBD',
    end: '49.18'
  },
  {
    "id": "crehan_fennell_T87-21a",
    "title": "Paddy in London",
    "genre": "Jig",
    start: '49.19',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-21b",
    "title": "Happy to Meet and Sorry to Part",
    "genre": "Jig",
    start: 'TBD',
    end: '52.32'
  },
  {
    "id": "crehan_fennell_T87-22",
    "title": "Maid Behind the Bar",
    "genre": "Reel",
    start: '52.35',
    end: '54.29'
  },
  {
    "id": "crehan_fennell_T87-23",
    "title": "Bunch of Keys",
    "genre": "Reel",
    start: '54.36',
    end: '57.22'
  },
  {
    "id": "crehan_fennell_T87-24a",
    "title": "Templehouse",
    "genre": "Reel",
    start: '57.24',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-24b",
    "title": "Over the Moor to Maggie",
    "genre": "Reel",
    start: 'TBD',
    end: '1.00.21'
  },
  {
    "id": "crehan_fennell_T87-25",
    "title": "Lucy Campbell",
    "genre": "Reel",
    start: '1.00.22',
    end: '1.02.42'
  },
  {
    "id": "crehan_fennell_T87-26",
    "title": "Trim the Velvet (as per item 2)",
    "genre": "Reel",
    start: '1.02.50',
    end: '1.03.48'
  },
  {
    "id": "crehan_fennell_T87-27a",
    "title": "Jig",
    "genre": "Jig",
    start: '1.03.52',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-27b",
    "title": "Hornpipes (2): Gan ainm",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-27c",
    "title": "Harvest Home",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "crehan_fennell_T87-27d",
    "title": "The Derry (as per item 3)",
    "genre": "Jig",
    start: 'TBD',
    end: '1.08.07'
  }
];

async function main() {
  console.log('Processing Session: crehan_fennell_T87');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'crehan_fennell_T87-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
