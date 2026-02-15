/**
 * Script to split session: bonavella_JH4
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH4.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_bonavella_JH4.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/bonavella_JH4.htm"
};

const tracks = [
  {
    "id": "bonavella_JH4-1",
    "title": "Tune: O'Leary's Daughter &#8211; ensemble",
    "genre": "Tune",
    start: '.01',
    end: '.31'
  },
  {
    "id": "bonavella_JH4-2",
    "title": "Slide: Patsy Geary's",
    "genre": "Tune",
    start: '.34',
    end: '1.32'
  },
  {
    "id": "bonavella_JH4-3",
    "title": "Slide: Basket of Oysters",
    "genre": "Tune",
    start: '1.35',
    end: '2.33'
  },
  {
    "id": "bonavella_JH4-4",
    "title": "Thady&#8217;s",
    "genre": "Jig",
    start: '2.35',
    end: '4.34'
  },
  {
    "id": "bonavella_JH4-5",
    "title": "Anthony Frawley&#8217;s",
    "genre": "Jig",
    start: '4.37',
    end: '5.35'
  },
  {
    "id": "bonavella_JH4-6",
    "title": "Slides: Gan ainm",
    "genre": "Tune",
    start: '5.37',
    end: '7.50'
  },
  {
    "id": "bonavella_JH4-7",
    "title": "Slides: ? Fancy (fragment)",
    "genre": "Tune",
    start: '7.52',
    end: '8.03'
  },
  {
    "id": "bonavella_JH4-8",
    "title": "Slide: Lonesome Road to Dingle",
    "genre": "Tune",
    start: '8.04',
    end: '9.03'
  },
  {
    "id": "bonavella_JH4-9",
    "title": "High Part of the Road",
    "genre": "Jig",
    start: '9.04',
    end: '9.31'
  },
  {
    "id": "bonavella_JH4-10",
    "title": "The Kid",
    "genre": "Jig",
    start: '9.34',
    end: '10.42'
  },
  {
    "id": "bonavella_JH4-11",
    "title": "Clancy's",
    "genre": "Jig",
    start: '10.44',
    end: '11.50'
  },
  {
    "id": "bonavella_JH4-12",
    "title": "When Johnny comes Marching Home",
    "genre": "Jig",
    start: '11.54',
    end: '13.29'
  },
  {
    "id": "bonavella_JH4-13",
    "title": "Tidy Girleen",
    "genre": "Jig",
    start: '13.33',
    end: '14.35'
  },
  {
    "id": "bonavella_JH4-14",
    "title": "Drunken Piper",
    "genre": "Reel",
    start: '14.40',
    end: '15.58'
  },
  {
    "id": "bonavella_JH4-15",
    "title": "West the Hill",
    "genre": "Hornpipe",
    start: '15.59',
    end: '17.24'
  },
  {
    "id": "bonavella_JH4-16",
    "title": "Denis Murphy&#8217;s",
    "genre": "Hornpipe",
    start: '17.28',
    end: '18.56'
  },
  {
    "id": "bonavella_JH4-17",
    "title": "Gan ainm",
    "genre": "March",
    start: '18.57',
    end: '19.35'
  },
  {
    "id": "bonavella_JH4-18",
    "title": "Girl I Left Behind",
    "genre": "March",
    start: '19.36',
    end: '20.25'
  },
  {
    "id": "bonavella_JH4-19a",
    "title": "Humours of Tullycrine",
    "genre": "Hornpipe",
    start: '20.26',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH4-19b",
    "title": "Junior Crehan's No.1",
    "genre": "Hornpipe",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH4-19c",
    "title": "Junior&#8217;s?",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '24.32'
  },
  {
    "id": "bonavella_JH4-20",
    "title": "Murphy&#8217;s Greyhound (fragment)",
    "genre": "Reel",
    start: '24.37',
    end: '25.06'
  },
  {
    "id": "bonavella_JH4-21a",
    "title": "Intro: Junior: &#8216;This reel is dedicated to Danny Meehan, it&#8217;s called the Broken Jaw&#8217;, then plays tune",
    "genre": "Reel",
    start: '25.17',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH4-21b",
    "title": "Wheels of the World (reel)",
    "genre": "Reel",
    start: 'TBD',
    end: '27.55'
  },
  {
    "id": "bonavella_JH4-22",
    "title": "Slow air: Gan ainm",
    "genre": "Tune",
    start: '27.55',
    end: '29.04'
  },
  {
    "id": "bonavella_JH4-23a",
    "title": "Slow air: Gan ainm; into Reels (2): Tailor's Thimble",
    "genre": "Reel",
    start: '29.06',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH4-23b",
    "title": "Morning Dew",
    "genre": "Reel",
    start: 'TBD',
    end: '31.47'
  },
  {
    "id": "bonavella_JH4-24",
    "title": "Slow air: Lament For Staker Wallace",
    "genre": "Tune",
    start: '31.50',
    end: '33.22'
  },
  {
    "id": "bonavella_JH4-25",
    "title": "Slow air: Anach Cuain; into Jig: The Sheep in the Boat",
    "genre": "Jig",
    start: '33.25',
    end: '35.18'
  },
  {
    "id": "bonavella_JH4-26",
    "title": "Slide: O'Leary's Daughter",
    "genre": "Tune",
    start: '35.31',
    end: '36.07'
  },
  {
    "id": "bonavella_JH4-27",
    "title": "Tenpenny Bit",
    "genre": "Jig",
    start: '36.15',
    end: '36.41'
  },
  {
    "id": "bonavella_JH4-28",
    "title": "Slow air: Banks of Sullane",
    "genre": "Tune",
    start: '36.44',
    end: '37.28'
  },
  {
    "id": "bonavella_JH4-29",
    "title": "Slow air: Gan ainm",
    "genre": "Tune",
    start: '37.46',
    end: '40.36'
  },
  {
    "id": "bonavella_JH4-30",
    "title": "Rainy Day",
    "genre": "Reel",
    start: '40.43',
    end: '42.02'
  },
  {
    "id": "bonavella_JH4-31a",
    "title": "Humours of Bandon",
    "genre": "Jig",
    start: '42.03',
    end: 'TBD'
  },
  {
    "id": "bonavella_JH4-31b",
    "title": "Gan ainm",
    "genre": "Jig",
    start: 'TBD',
    end: '44.21'
  },
  {
    "id": "bonavella_JH4-32",
    "title": "Rodney&#8217;s Glory",
    "genre": "Set Dance",
    start: '44.23',
    end: '44.37'
  },
  {
    "id": "bonavella_JH4-33",
    "title": "Fuaireas a Cuireadh chun dul ar an bP&oacute;sadh",
    "genre": "Jig",
    start: '44.38',
    end: '45.07'
  }
];

async function main() {
  console.log('Processing Session: bonavella_JH4');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'bonavella_JH4-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
