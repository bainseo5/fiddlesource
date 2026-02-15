/**
 * Script to split session: london_JH47
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/london_JH47.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_london_JH47.mp3`;
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
  location: "London John Joe Healy Collection Tape 47 Items 2 &#",
  musicians: "the Money/Sixpenny Money (25.17 - 28.51) 13. Reel: Last House in Connaught (28.59 - 31.34) 14. Jigs (2): Knights of St. Patrick/Bobby Casey&#8217;s (31.41 - 33.54) 15. Reels (3): Tarbolton/Longford Collector/Sailor&#8217;s Bonnet (33.59 - 37.25) 16. Reels (2): Youngest Daughter/Moving Bogs (37.28 - 39.50) Julia and Billy Clifford &nbsp; &lt;&lt; The John Joe Healy Collection",
  date: "8211",
  collection: "John Joe Healy Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/london_JH47.htm"
};

const tracks = [
  {
    "id": "london_JH47-1",
    "title": "Talk: Including: &#8216;Mrs. Clifford is going to play Kerry Reel again, please&#8217; 2. Reel: Paddy Kelly's",
    "genre": "Reel",
    start: '.11',
    end: '2.07'
  },
  {
    "id": "london_JH47-3",
    "title": "Never was Piping so Gay (unfinished)",
    "genre": "Reel",
    start: '2.10',
    end: '2.39'
  },
  {
    "id": "london_JH47-4a",
    "title": "Tom Billy&#8217;s",
    "genre": "Reel",
    start: '2.41',
    end: 'TBD'
  },
  {
    "id": "london_JH47-4b",
    "title": "Paddy Murphy's",
    "genre": "Reel",
    start: 'TBD',
    end: '4.56'
  },
  {
    "id": "london_JH47-5a",
    "title": "Rolling in the Barrel",
    "genre": "Reel",
    start: '5.21',
    end: 'TBD'
  },
  {
    "id": "london_JH47-5b",
    "title": "Queen of the May",
    "genre": "Reel",
    start: 'TBD',
    end: '7.53'
  },
  {
    "id": "london_JH47-6a",
    "title": "Down the Broom",
    "genre": "Reel",
    start: '7.55',
    end: 'TBD'
  },
  {
    "id": "london_JH47-6b",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: '10.28'
  },
  {
    "id": "london_JH47-7a",
    "title": "Billy O&#8217;Donnell&#8217;s",
    "genre": "Jig",
    start: '10.39',
    end: 'TBD'
  },
  {
    "id": "london_JH47-7b",
    "title": "Rakes of Clonmel",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "london_JH47-7c",
    "title": "Frieze Britches",
    "genre": "Jig",
    start: 'TBD',
    end: '14.24'
  },
  {
    "id": "london_JH47-8a",
    "title": "College Groves",
    "genre": "Reel",
    start: '14.28',
    end: 'TBD'
  },
  {
    "id": "london_JH47-8b",
    "title": "Colonel Fraser",
    "genre": "Reel",
    start: 'TBD',
    end: '18.08'
  },
  {
    "id": "london_JH47-9a",
    "title": "The Traditional",
    "genre": "Reel",
    start: '18.09',
    end: 'TBD'
  },
  {
    "id": "london_JH47-9b",
    "title": "I wish I never saw You",
    "genre": "Reel",
    start: 'TBD',
    end: '20.43'
  },
  {
    "id": "london_JH47-10",
    "title": "Trip to Durrow",
    "genre": "Reel",
    start: '20.45',
    end: '22.11'
  },
  {
    "id": "london_JH47-11",
    "title": "Lord Gordon&#8217;s",
    "genre": "Reel",
    start: '22.14',
    end: '25.08'
  },
  {
    "id": "london_JH47-12a",
    "title": "Hag with the Money",
    "genre": "Jig",
    start: '25.17',
    end: 'TBD'
  },
  {
    "id": "london_JH47-12b",
    "title": "Sixpenny Money",
    "genre": "Jig",
    start: 'TBD',
    end: '28.51'
  },
  {
    "id": "london_JH47-13",
    "title": "Last House in Connaught",
    "genre": "Reel",
    start: '28.59',
    end: '31.34'
  },
  {
    "id": "london_JH47-14a",
    "title": "Knights of St. Patrick",
    "genre": "Jig",
    start: '31.41',
    end: 'TBD'
  },
  {
    "id": "london_JH47-14b",
    "title": "Bobby Casey&#8217;s",
    "genre": "Jig",
    start: 'TBD',
    end: '33.54'
  },
  {
    "id": "london_JH47-15a",
    "title": "Tarbolton",
    "genre": "Reel",
    start: '33.59',
    end: 'TBD'
  },
  {
    "id": "london_JH47-15b",
    "title": "Longford Collector",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "london_JH47-15c",
    "title": "Sailor&#8217;s Bonnet",
    "genre": "Reel",
    start: 'TBD',
    end: '37.25'
  },
  {
    "id": "london_JH47-16a",
    "title": "Youngest Daughter",
    "genre": "Reel",
    start: '37.28',
    end: 'TBD'
  },
  {
    "id": "london_JH47-16b",
    "title": "Moving Bogs",
    "genre": "Reel",
    start: 'TBD',
    end: '39.50'
  }
];

async function main() {
  console.log('Processing Session: london_JH47');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'london_JH47-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
