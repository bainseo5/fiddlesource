/**
 * Script to split session: sergeant_kelly_peadar_oloughlin_JH37
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/sergeant_kelly_peadar_oloughlin_JH37.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_sergeant_kelly_peadar_oloughlin_JH37.mp3`;
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
  location: "the",
  musicians: "Unknown Musicians",
  date: "1970",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/sergeant_kelly_peadar_oloughlin_JH37.htm"
};

const tracks = [
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-1a",
    "title": "Finnerty&#8217;s Frolics",
    "genre": "Jig",
    start: '.05',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-1b",
    "title": "Se&aacute;n Ryan&#8217;s",
    "genre": "Jig",
    start: 'TBD',
    end: '2.14'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-2a",
    "title": "I&#8217;m Waiting for You",
    "genre": "Reel",
    start: '2.16',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-2b",
    "title": "Gusty&#8217;s Fancy (says name at 2.30 &#8211; Buckley&#8217;s?)",
    "genre": "Reel",
    start: 'TBD',
    end: '4.38'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-3",
    "title": "The Groves",
    "genre": "Hornpipe",
    start: '4.40',
    end: '8.16'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-4",
    "title": "Colonel Frazer",
    "genre": "Reel",
    start: '8.19',
    end: '9.34'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-5a",
    "title": "Hop",
    "genre": "Jig",
    start: '9.37',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-5b",
    "title": "slip Jig: Will you come down to Limerick?",
    "genre": "Jig",
    start: 'TBD',
    end: '10.56'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-6",
    "title": "Dr. O&#8217;Neill&#8217;s",
    "genre": "Jig",
    start: '10.59',
    end: '13.34'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-7a",
    "title": "Murphy&#8217;s",
    "genre": "Hornpipe",
    start: '13.35',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-7b",
    "title": "Fairy",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '16.34'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-8a",
    "title": "Salamanca",
    "genre": "Reel",
    start: '16.36',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-8b",
    "title": "Rakish Paddy",
    "genre": "Reel",
    start: 'TBD',
    end: '18.58'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-9",
    "title": "Ace and Deuce of Piping",
    "genre": "Set Dance",
    start: '19.01',
    end: '21.28'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-10a",
    "title": "Cronin&#8217;s Favourite",
    "genre": "Jig",
    start: '21.30',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-10b",
    "title": "Moloney&#8217;s Wife",
    "genre": "Jig",
    start: 'TBD',
    end: '24.11'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-11",
    "title": "Bantry",
    "genre": "Hornpipe",
    start: '24.12',
    end: '27.23'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-12a",
    "title": "Rainy Day",
    "genre": "Reel",
    start: '27.25',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-12b",
    "title": "Cup of Tea (unfinished)",
    "genre": "Reel",
    start: 'TBD',
    end: '30.15'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-13",
    "title": "Jockey at the Fair (unfinished)",
    "genre": "Set Dance",
    start: '30.16',
    end: '31.39'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-14a",
    "title": "New Yorker",
    "genre": "Jig",
    start: '31.41',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-14b",
    "title": "Lilting Fisherman",
    "genre": "Jig",
    start: 'TBD',
    end: '33.53'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-15a",
    "title": "Donegal",
    "genre": "Reel",
    start: '33.55',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-15b",
    "title": "Skylark",
    "genre": "Reel",
    start: 'TBD',
    end: '36.22'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-16",
    "title": "Slievenamon",
    "genre": "Hornpipe",
    start: '36.25',
    end: '38.00'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-17",
    "title": "Katie&#8217;s Fancy ( 38.01 - 39.44) 18. Reel: College Groves",
    "genre": "Reel",
    start: '39.46',
    end: '41.36'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-19a",
    "title": "Apples in Winter",
    "genre": "Jig",
    start: '41.39',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-19b",
    "title": "Lark in the Morning?",
    "genre": "Jig",
    start: 'TBD',
    end: '43.51'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-20a",
    "title": "Maud Miller&#8217;s",
    "genre": "Reel",
    start: '43.54',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-20b",
    "title": "My Love is in America",
    "genre": "Reel",
    start: 'TBD',
    end: '46.24'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-21a",
    "title": "Shaskeen",
    "genre": "Reel",
    start: '46.26',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-21b",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: '48.54'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-22a",
    "title": "Queen of the Fair",
    "genre": "Jig",
    start: '48.56',
    end: 'TBD'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-22b",
    "title": "Bride&#8217;s Favourite",
    "genre": "Jig",
    start: 'TBD',
    end: '52.13'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-23",
    "title": "Paddy Kelly&#8217;s",
    "genre": "Reel",
    start: '52.15',
    end: '54.48'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-24",
    "title": "Cuckoo&#8217;s Nest",
    "genre": "Hornpipe",
    start: '54.51',
    end: '57.10'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-25",
    "title": "Bonny Kate",
    "genre": "Reel",
    start: '57.12',
    end: '59.38'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-26",
    "title": "Lord Gordon&#8217;s",
    "genre": "Reel",
    start: '59.41',
    end: '1.01.51'
  },
  {
    "id": "sergeant_kelly_peadar_oloughlin_JH37-27",
    "title": "The Traveller (unfinished)",
    "genre": "Reel",
    start: '1.01.52',
    end: '1.03.10'
  }
];

async function main() {
  console.log('Processing Session: sergeant_kelly_peadar_oloughlin_JH37');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'sergeant_kelly_peadar_oloughlin_JH37-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
