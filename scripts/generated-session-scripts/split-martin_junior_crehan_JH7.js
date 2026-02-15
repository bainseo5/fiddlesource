/**
 * Script to split session: martin_junior_crehan_JH7
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/martin_junior_crehan_JH7.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_martin_junior_crehan_JH7.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/martin_junior_crehan_JH7.htm"
};

const tracks = [
  {
    "id": "martin_junior_crehan_JH7-1",
    "title": "Otter's Holt",
    "genre": "Reel",
    start: '.01',
    end: '1.38'
  },
  {
    "id": "martin_junior_crehan_JH7-2",
    "title": "Southwest Wind",
    "genre": "Jig",
    start: '1.40',
    end: '3.49'
  },
  {
    "id": "martin_junior_crehan_JH7-3",
    "title": "Farewell to Miltown",
    "genre": "Reel",
    start: '3.51',
    end: '5.13'
  },
  {
    "id": "martin_junior_crehan_JH7-4",
    "title": "Otter's Holt",
    "genre": "Reel",
    start: '5.14',
    end: '6.14'
  },
  {
    "id": "martin_junior_crehan_JH7-5",
    "title": "West Clare Railway*",
    "genre": "Reel",
    start: '6.17',
    end: '7.18'
  },
  {
    "id": "martin_junior_crehan_JH7-6a",
    "title": "Air",
    "genre": "Jig",
    start: '7.27',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-6b",
    "title": "Jig: Anach Cuain",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-6c",
    "title": "Sheep in the Boat*",
    "genre": "Jig",
    start: 'TBD',
    end: '10.33'
  },
  {
    "id": "martin_junior_crehan_JH7-7",
    "title": "Mowing Machine",
    "genre": "Reel",
    start: '10.48',
    end: '11.58'
  },
  {
    "id": "martin_junior_crehan_JH7-8",
    "title": "Mist Covered Mountain*",
    "genre": "Jig",
    start: '12.00',
    end: '13.13'
  },
  {
    "id": "martin_junior_crehan_JH7-9",
    "title": "Hills of Coore*",
    "genre": "Hornpipe",
    start: '13.15',
    end: '14.45'
  },
  {
    "id": "martin_junior_crehan_JH7-10",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: '14.48',
    end: '15.33'
  },
  {
    "id": "martin_junior_crehan_JH7-11a",
    "title": "Air",
    "genre": "Hornpipe",
    start: '15.39',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-11b",
    "title": "Hornpipe: Gan ainm",
    "genre": "Hornpipe",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-11c",
    "title": "Caislean an &Oacute;&iacute;r*",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '19.09'
  },
  {
    "id": "martin_junior_crehan_JH7-12",
    "title": "Air: Gan ainm",
    "genre": "Tune",
    start: '19.11',
    end: '20.43'
  },
  {
    "id": "martin_junior_crehan_JH7-13",
    "title": "Air: St&oacute;r mo Chro&iacute;",
    "genre": "Tune",
    start: '20.46',
    end: '22.29'
  },
  {
    "id": "martin_junior_crehan_JH7-14",
    "title": "Connie the Soldier",
    "genre": "Jig",
    start: '22.31',
    end: '24.42'
  },
  {
    "id": "martin_junior_crehan_JH7-15",
    "title": "Tribute to Scully Casey* (unfinished)",
    "genre": "Song",
    start: '24.45',
    end: '25.53'
  },
  {
    "id": "martin_junior_crehan_JH7-16",
    "title": "Air: Gan ainm",
    "genre": "Tune",
    start: '25.45',
    end: '27.39'
  },
  {
    "id": "martin_junior_crehan_JH7-17",
    "title": "Hills of Coore*",
    "genre": "Hornpipe",
    start: '27.42',
    end: '29.16'
  },
  {
    "id": "martin_junior_crehan_JH7-18a",
    "title": "The Concert*",
    "genre": "Reel",
    start: '29.19',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-18b",
    "title": "Gatehouse Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '31.38'
  },
  {
    "id": "martin_junior_crehan_JH7-19a",
    "title": "Wind That Shakes the Barley",
    "genre": "Reel",
    start: '31.40',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-19b",
    "title": "Last Night&#8217;s Fun",
    "genre": "Reel",
    start: 'TBD',
    end: '33.19'
  },
  {
    "id": "martin_junior_crehan_JH7-20a",
    "title": "Mother's Delight",
    "genre": "Reel",
    start: '33.21',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-20b",
    "title": "Eileen Curran's",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-20c",
    "title": "Star of Munster",
    "genre": "Reel",
    start: 'TBD',
    end: '36.54'
  },
  {
    "id": "martin_junior_crehan_JH7-21a",
    "title": "Pigeon on the Gate (Gm version)",
    "genre": "Reel",
    start: '36.56',
    end: 'TBD'
  },
  {
    "id": "martin_junior_crehan_JH7-21b",
    "title": "Dogs among the Bushes",
    "genre": "Reel",
    start: 'TBD',
    end: '38.54'
  },
  {
    "id": "martin_junior_crehan_JH7-22",
    "title": "Se&aacute;n &Oacute; Duibhir an Ghleanna",
    "genre": "Set Dance",
    start: '38.56',
    end: '40.55'
  },
  {
    "id": "martin_junior_crehan_JH7-23",
    "title": "Drunken Gauger",
    "genre": "Set Dance",
    start: '40.57',
    end: '42.47'
  },
  {
    "id": "martin_junior_crehan_JH7-24",
    "title": "Billy O&#8217;Donnell&#8217;s",
    "genre": "Jig",
    start: '42.49',
    end: '44.36'
  },
  {
    "id": "martin_junior_crehan_JH7-25",
    "title": "Tom&iacute;n O&#8217;Dea&#8217;s",
    "genre": "Reel",
    start: '44.38',
    end: '45.39'
  }
];

async function main() {
  console.log('Processing Session: martin_junior_crehan_JH7');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'martin_junior_crehan_JH7-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
