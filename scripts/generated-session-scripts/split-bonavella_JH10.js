/**
 * Script to split session: bonavella_JH10
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH10.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bonavella_JH10.mp3`;
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
  location: "Crehans&#",
  musicians: "Martin 'Junior' Crehan, fiddle; Angela Crehan Crotty, whistle?, Bonavella, Mullagh; Bobby Casey, fiddle, Annagh; John Joe Healy, fiddle, Spanish Point; PJ Crotty, flute/whistle? Moyasta; unidentified guitar/mandola/mandolin; unidentified accordion; unidentified piano.",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH10.htm"
};

const tracks = [
  {
    "id": "bonavella_JH10-1a",
    "title": "Five Mile Chase",
    "genre": "Reel",
    start: '.01',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-1b",
    "title": "Abbey",
    "genre": "Reel",
    start: 'TBD',
    end: '1.51'
  },
  {
    "id": "bonavella_JH10-2",
    "title": "The Orphan",
    "genre": "Jig",
    start: '1.54',
    end: '2.05'
  },
  {
    "id": "bonavella_JH10-3",
    "title": "Pothole in the Kelp",
    "genre": "Reel",
    start: '2.10',
    end: '4.00'
  },
  {
    "id": "bonavella_JH10-4",
    "title": "Se&aacute;n Reid's",
    "genre": "Reel",
    start: '4.01',
    end: '5.25'
  },
  {
    "id": "bonavella_JH10-5",
    "title": "Bunch of Green Rushes",
    "genre": "Reel",
    start: '5.30',
    end: '6.45'
  },
  {
    "id": "bonavella_JH10-6a",
    "title": "Dr Gilbert&#8217;s",
    "genre": "Reel",
    start: '6.49',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-6b",
    "title": "Queen of May",
    "genre": "Reel",
    start: 'TBD',
    end: '9.30'
  },
  {
    "id": "bonavella_JH10-7",
    "title": "Lads of Laois",
    "genre": "Reel",
    start: '9.32',
    end: '11.19'
  },
  {
    "id": "bonavella_JH10-8",
    "title": "Maudabawn Chapel",
    "genre": "Reel",
    start: '11.20',
    end: '12.29'
  },
  {
    "id": "bonavella_JH10-9",
    "title": "Graf Spey",
    "genre": "Reel",
    start: '12.31',
    end: '14.18'
  },
  {
    "id": "bonavella_JH10-10a",
    "title": "Bunch of Keys",
    "genre": "Reel",
    start: '14.20',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-10b",
    "title": "Gravel Walks",
    "genre": "Reel",
    start: 'TBD',
    end: '19.00'
  },
  {
    "id": "bonavella_JH10-11a",
    "title": "Tailor's Thimble",
    "genre": "Reel",
    start: '19.01',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-11b",
    "title": "Morning Dew",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-11c",
    "title": "Woman of the House",
    "genre": "Reel",
    start: 'TBD',
    end: '22.38'
  },
  {
    "id": "bonavella_JH10-12a",
    "title": "March",
    "genre": "Reel",
    start: '22.40',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-12b",
    "title": "Reels (2): Lord Mayo's March",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-12c",
    "title": "Down the Broom",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-12d",
    "title": "Gatehouse Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '27.02'
  },
  {
    "id": "bonavella_JH10-13",
    "title": "Tie the Ribbons",
    "genre": "Reel",
    start: '27.05',
    end: '28.16'
  },
  {
    "id": "bonavella_JH10-14",
    "title": "Flowing Bowl",
    "genre": "Reel",
    start: '28.18',
    end: '29.43'
  },
  {
    "id": "bonavella_JH10-15",
    "title": "Scully Casey's",
    "genre": "Reel",
    start: '29.45',
    end: '30.55'
  },
  {
    "id": "bonavella_JH10-16",
    "title": "Bunch of Green Rushes",
    "genre": "Reel",
    start: '30.57',
    end: '32.44'
  },
  {
    "id": "bonavella_JH10-17a",
    "title": "Lucy Campbell",
    "genre": "Reel",
    start: '32.46',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-17b",
    "title": "Jolly Tinker",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-17c",
    "title": "Lady Anne Montgomery",
    "genre": "Reel",
    start: 'TBD',
    end: '39.02'
  },
  {
    "id": "bonavella_JH10-18a",
    "title": "Dublin Reel",
    "genre": "Reel",
    start: '39.03',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-18b",
    "title": "Trim the Velvet",
    "genre": "Reel",
    start: 'TBD',
    end: '41.21'
  },
  {
    "id": "bonavella_JH10-19",
    "title": "Slip jig: Rocky Road to Dublin",
    "genre": "Jig",
    start: '41.24',
    end: '42.25'
  },
  {
    "id": "bonavella_JH10-20a",
    "title": "Happy Days of Youth",
    "genre": "Reel",
    start: '42.25',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-20b",
    "title": "Gan ainm",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH10-20c",
    "title": "Crosses of Annagh",
    "genre": "Reel",
    start: 'TBD',
    end: '46.02'
  },
  {
    "id": "bonavella_JH10-21",
    "title": "Drunken Gauger",
    "genre": "Set Dance",
    start: '46.02',
    end: '47.35'
  },
  {
    "id": "bonavella_JH10-22",
    "title": "Jenny Dang the Weaver",
    "genre": "Reel",
    start: '47.38',
    end: '49.47'
  },
  {
    "id": "bonavella_JH10-23",
    "title": "Caisle&aacute;n an &Oacute;ir",
    "genre": "Hornpipe",
    start: '49.47',
    end: '51.09'
  }
];

async function main() {
  console.log('Processing Session: bonavella_JH10');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'bonavella_JH10-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
