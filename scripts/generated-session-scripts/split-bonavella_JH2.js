/**
 * Script to split session: bonavella_JH2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH2.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bonavella_JH2.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH2.htm"
};

const tracks = [
  {
    "id": "bonavella_JH2-1",
    "title": "Andy Kerrin's",
    "genre": "Hornpipe",
    start: '.02',
    end: '1.04'
  },
  {
    "id": "bonavella_JH2-2",
    "title": "Fuaireas a Cuireadh chun dul ar an bP&oacute;sadh",
    "genre": "Jig",
    start: '1.10',
    end: '1.44'
  },
  {
    "id": "bonavella_JH2-3",
    "title": "Bunch of Green Rushes*",
    "genre": "Reel",
    start: '1.45',
    end: '2.20'
  },
  {
    "id": "bonavella_JH2-4",
    "title": "Mowing Machine",
    "genre": "Reel",
    start: '2.21',
    end: '3.39'
  },
  {
    "id": "bonavella_JH2-5",
    "title": "Caislean an O&iacute;r*",
    "genre": "Hornpipe",
    start: '3.41',
    end: '4.28'
  },
  {
    "id": "bonavella_JH2-6",
    "title": "Waltz (&#8216;Tramps &amp; Hawkers&#8217; tune) (fiddle)",
    "genre": "Song",
    start: '4.30',
    end: '5.38'
  },
  {
    "id": "bonavella_JH2-7a",
    "title": "Rocks of Bawn",
    "genre": "Waltz",
    start: '5.42',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH2-7b",
    "title": "Buachaill &oacute;n Eirne",
    "genre": "Waltz",
    start: 'TBD',
    end: '7.36'
  },
  {
    "id": "bonavella_JH2-8",
    "title": "&#8216;Knocklong&#8217;",
    "genre": "Waltz",
    start: '7.38',
    end: '9.21'
  },
  {
    "id": "bonavella_JH2-9",
    "title": "Loch Lomond",
    "genre": "Waltz",
    start: '9.24',
    end: '10.28'
  },
  {
    "id": "bonavella_JH2-10a",
    "title": "Spancil Hill",
    "genre": "Waltz",
    start: '10.31',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH2-10b",
    "title": "Thady Quill",
    "genre": "Waltz",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH2-10c",
    "title": "Tailor Bawn (fiddle)",
    "genre": "Waltz",
    start: 'TBD',
    end: '13.32'
  },
  {
    "id": "bonavella_JH2-11",
    "title": "Valley of Knockanure",
    "genre": "Waltz",
    start: '13.35',
    end: '14.36'
  },
  {
    "id": "bonavella_JH2-12",
    "title": "Moonlight in Mayo",
    "genre": "Waltz",
    start: '14.39',
    end: '16.12'
  },
  {
    "id": "bonavella_JH2-13",
    "title": "Goodbye Johnny Dear",
    "genre": "Waltz",
    start: '16.18',
    end: '17.14'
  },
  {
    "id": "bonavella_JH2-14a",
    "title": "Green Glens of Antrim",
    "genre": "Waltz",
    start: '17.15',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH2-14b",
    "title": "Trasna na dTonnta",
    "genre": "Waltz",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH2-14c",
    "title": "Gan ainm",
    "genre": "Waltz",
    start: 'TBD',
    end: '21.20'
  },
  {
    "id": "bonavella_JH2-15",
    "title": "Irish National Anthem: Amhr&aacute;n na bhFhiann (Soldier&#8217;s Song)",
    "genre": "Song",
    start: '21.22',
    end: '21.55'
  },
  {
    "id": "bonavella_JH2-16",
    "title": "Banks of Newfoundland",
    "genre": "Jig",
    start: '21.58',
    end: '23.09'
  },
  {
    "id": "bonavella_JH2-17",
    "title": "Gan ainm",
    "genre": "Jig",
    start: '23.12',
    end: '24.44'
  },
  {
    "id": "bonavella_JH2-18",
    "title": "Blackberry Blossom",
    "genre": "Reel",
    start: '24.45',
    end: '26.10'
  },
  {
    "id": "bonavella_JH2-19",
    "title": "Gan ainm (played slowly)",
    "genre": "Reel",
    start: '26.14',
    end: '27.00'
  },
  {
    "id": "bonavella_JH2-20",
    "title": "Connachtman&#8217;s Rambles",
    "genre": "Jig",
    start: '27.02',
    end: '28.07'
  },
  {
    "id": "bonavella_JH2-21",
    "title": "Fairhaired Boy",
    "genre": "Jig",
    start: '28.11',
    end: '29.51'
  },
  {
    "id": "bonavella_JH2-22",
    "title": "The Drunken Gauger",
    "genre": "Set Dance",
    start: '29.53',
    end: '33.20'
  },
  {
    "id": "bonavella_JH2-23",
    "title": "New mown Meadows",
    "genre": "Reel",
    start: '33.22',
    end: '34.50'
  },
  {
    "id": "bonavella_JH2-24",
    "title": "Green Groves of Erin",
    "genre": "Reel",
    start: '34.54',
    end: '36.10'
  },
  {
    "id": "bonavella_JH2-25",
    "title": "Staic&iacute;n Eorna",
    "genre": "Hornpipe",
    start: '36.12',
    end: '37.45'
  },
  {
    "id": "bonavella_JH2-26",
    "title": "Gan ainm",
    "genre": "Jig",
    start: '37.46',
    end: '39.21'
  }
];

async function main() {
  console.log('Processing Session: bonavella_JH2');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'bonavella_JH2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
