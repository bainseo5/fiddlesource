/**
 * Script to split session: martin_junior_crehan_JH6-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/martin_junior_crehan_JH6-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_martin_junior_crehan_JH6-1.mp3`;
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
  location: "Mullagh John Joe Healy Collection Tape 6-1 Items 1 - 20: Martin 'Junior' Crehan, fiddle Items 21 - 24 Martin 'Junior' Crehan, fiddle; unknown whistle 1. Air: Anach Cuain (.01 - 3.05) 2. Air: Anach Cuain (3.06 - 4.12) 3. Air: Casadh an tS&uacute;g&aacute;in (4.12 - 5.17) 4. Air: Gan ainm (5.20 - 7.51) 5. Air: Banks of Sullane (7.54 - 10.43) 6. Air: An Coulin (10.45 - 13.23) 7. Air: Boys of Barr na Sr&aacute;ide (13.26 - 15.36) 8. Air: Gan ainm (15.41 - 20.30) 9. Air: Flower of Finea (20.31 - 22.24) 10. Air: Valley of Knockanure (22.28 - 23.59) 11. Air: Will Ye Go, Lassie, Go (24.02 - 25.28) 12. Tune: Gan ainm (25.30 - 31.17) 13. Set dance: Humours of Bandon (31.18 - 34.20) 14. Set dance: Humours of Bandon (34.24 - 36.04) 15. Set dance: Job of Journeywork (36.07 - 38.26) 16. Set dance: Rodney&#",
  musicians: "Unknown Musicians",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/martin_junior_crehan_JH6-1.htm"
};

const tracks = [
  {
    "id": "martin_junior_crehan_JH6-1-1",
    "title": "Air: Anach Cuain",
    "genre": "Tune",
    start: '.01',
    end: '3.05'
  },
  {
    "id": "martin_junior_crehan_JH6-1-2",
    "title": "Air: Anach Cuain",
    "genre": "Tune",
    start: '3.06',
    end: '4.12'
  },
  {
    "id": "martin_junior_crehan_JH6-1-3",
    "title": "Air: Casadh an tS&uacute;g&aacute;in",
    "genre": "Tune",
    start: '4.12',
    end: '5.17'
  },
  {
    "id": "martin_junior_crehan_JH6-1-4",
    "title": "Air: Gan ainm",
    "genre": "Tune",
    start: '5.20',
    end: '7.51'
  },
  {
    "id": "martin_junior_crehan_JH6-1-5",
    "title": "Air: Banks of Sullane",
    "genre": "Tune",
    start: '7.54',
    end: '10.43'
  },
  {
    "id": "martin_junior_crehan_JH6-1-6",
    "title": "Air: An Coulin",
    "genre": "Tune",
    start: '10.45',
    end: '13.23'
  },
  {
    "id": "martin_junior_crehan_JH6-1-7",
    "title": "Air: Boys of Barr na Sr&aacute;ide",
    "genre": "Tune",
    start: '13.26',
    end: '15.36'
  },
  {
    "id": "martin_junior_crehan_JH6-1-8",
    "title": "Air: Gan ainm",
    "genre": "Tune",
    start: '15.41',
    end: '20.30'
  },
  {
    "id": "martin_junior_crehan_JH6-1-9",
    "title": "Air: Flower of Finea",
    "genre": "Tune",
    start: '20.31',
    end: '22.24'
  },
  {
    "id": "martin_junior_crehan_JH6-1-10",
    "title": "Air: Valley of Knockanure",
    "genre": "Tune",
    start: '22.28',
    end: '23.59'
  },
  {
    "id": "martin_junior_crehan_JH6-1-11",
    "title": "Air: Will Ye Go, Lassie, Go",
    "genre": "Tune",
    start: '24.02',
    end: '25.28'
  },
  {
    "id": "martin_junior_crehan_JH6-1-12",
    "title": "Tune: Gan ainm",
    "genre": "Tune",
    start: '25.30',
    end: '31.17'
  },
  {
    "id": "martin_junior_crehan_JH6-1-13",
    "title": "Humours of Bandon",
    "genre": "Set Dance",
    start: '31.18',
    end: '34.20'
  },
  {
    "id": "martin_junior_crehan_JH6-1-14",
    "title": "Humours of Bandon",
    "genre": "Set Dance",
    start: '34.24',
    end: '36.04'
  },
  {
    "id": "martin_junior_crehan_JH6-1-15",
    "title": "Job of Journeywork",
    "genre": "Set Dance",
    start: '36.07',
    end: '38.26'
  },
  {
    "id": "martin_junior_crehan_JH6-1-16",
    "title": "Rodney&#8217;s Glory",
    "genre": "Set Dance",
    start: '38.29',
    end: '40.35'
  },
  {
    "id": "martin_junior_crehan_JH6-1-17",
    "title": "An Suis&iacute;n B&aacute;n",
    "genre": "Set Dance",
    start: '40.38',
    end: '42.04'
  },
  {
    "id": "martin_junior_crehan_JH6-1-18a",
    "title": "Farewell to Miltown Malbay",
    "genre": "Reel",
    start: '42.06',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-18b",
    "title": "Mother's Delight",
    "genre": "Reel",
    start: 'TBD',
    end: '45.48'
  },
  {
    "id": "martin_junior_crehan_JH6-1-19a",
    "title": "Old Pidgeon on the Gate",
    "genre": "Reel",
    start: '45.50',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-19b",
    "title": "Kitty&#8217;s gone A-Milking",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-19c",
    "title": "Dogs among the Bushes",
    "genre": "Reel",
    start: 'TBD',
    end: '49.40'
  },
  {
    "id": "martin_junior_crehan_JH6-1-20",
    "title": "Gan ainm",
    "genre": "Reel",
    start: '49.41',
    end: '50.54'
  },
  {
    "id": "martin_junior_crehan_JH6-1-21a",
    "title": "Jackson's Favourite",
    "genre": "Reel",
    start: '50.55',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-21b",
    "title": "Jenny&#8217;s Wedding?",
    "genre": "Reel",
    start: 'TBD',
    end: '53.14'
  },
  {
    "id": "martin_junior_crehan_JH6-1-22a",
    "title": "Stone in the Field",
    "genre": "Reel",
    start: '53.18',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-22b",
    "title": "Gatehouse Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '55.54'
  },
  {
    "id": "martin_junior_crehan_JH6-1-23a",
    "title": "Killanan's Fancy",
    "genre": "Reel",
    start: '55.57',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-23b",
    "title": "The Ten Pound Float",
    "genre": "Reel",
    start: 'TBD',
    end: '57.55'
  },
  {
    "id": "martin_junior_crehan_JH6-1-24a",
    "title": "Gan ainm",
    "genre": "Reel",
    start: '57.58',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH6-1-24b",
    "title": "Bloom of Youth",
    "genre": "Reel",
    start: 'TBD',
    end: '1.00.18'
  }
];

async function main() {
  console.log('Processing Session: martin_junior_crehan_JH6-1');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'martin_junior_crehan_JH6-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
