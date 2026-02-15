/**
 * Script to split session: kilkishen_T76
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/kilkishen_T76.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_kilkishen_T76.mp3`;
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
  musicians: "Francie Donnellan &#8211; fiddle) (57.03 - 1.01.53) 15. Reels (3): George White&#8217;s Favourite/Ash Plant/Matt People's (1.01.54 - 1.10.58) 16. Reels (3): Farrell O&#8217;Gara/Mountain Road/Jenny&#8217;s Chickens (1.10.59 - 1.15.57) 17. Reels (2): Green Gowned Lass/Humours of Scarrif (1.15.55 - 1.21.20) 18. Tunes (2): Gan Ainm/Gan Ainm (1.21.25 - 1.25.43) 19. Reels (2): Killanan's Fancy/Killavel Fancy (1.25.44 - 1.29.36) Francie Donnellan &amp; P Joe Hayes, 1963. Photo Michael John Glynne &copy; Clare Local Studies Project &nbsp; &lt;&lt; The BR Taylor Collection",
  date: "Unknown Date",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/kilkishen_T76.htm"
};

const tracks = [
  {
    "id": "kilkishen_T76-1a",
    "title": "Master Crowley's",
    "genre": "Reel",
    start: '10.33',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-1b",
    "title": "Brendan McMahon's (.01 &#8211; 3.06) 2. Reel: Graf Spey (3.11 &#8211; 5.48) 3. Reels (2): Boys of Ballysodare (key F)",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-1c",
    "title": "Foxhunter&#8217;s Reel (5.50 &#8211; 10.31) 4. Reel: Paddy Lynn's Delight",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-1d",
    "title": "Maudebawn Chapel",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-1e",
    "title": "John McFadden's Favourite",
    "genre": "Reel",
    start: 'TBD',
    end: '16.44'
  },
  {
    "id": "kilkishen_T76-5",
    "title": "Barndance: Joe Bane's Scotische",
    "genre": "Tune",
    start: '16.48',
    end: '19.06'
  },
  {
    "id": "kilkishen_T76-6a",
    "title": "Castle Kelly",
    "genre": "Reel",
    start: '19.08',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-6b",
    "title": "Humours of Ballyconnell",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-6c",
    "title": "Duke of Leinster",
    "genre": "Reel",
    start: 'TBD',
    end: '26.31'
  },
  {
    "id": "kilkishen_T76-7a",
    "title": "Cooley's",
    "genre": "Reel",
    start: '26.32',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-7b",
    "title": "Drag Her Down the Road",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-7c",
    "title": "Come West along the Road",
    "genre": "Reel",
    start: 'TBD',
    end: '35.29'
  },
  {
    "id": "kilkishen_T76-8",
    "title": "Farewell to Eireann",
    "genre": "Reel",
    start: '35.31',
    end: '38.18'
  },
  {
    "id": "kilkishen_T76-9a",
    "title": "Paddy &quot;Go Easy&quot;",
    "genre": "Jig",
    start: '38.20',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-9b",
    "title": "Angry Peeler",
    "genre": "Jig",
    start: 'TBD',
    end: '42.24'
  },
  {
    "id": "kilkishen_T76-10",
    "title": "Cliffs of Moher",
    "genre": "Jig",
    start: '42.26',
    end: '43.48'
  },
  {
    "id": "kilkishen_T76-11",
    "title": "Mason's Apron",
    "genre": "Reel",
    start: '43.49',
    end: '46.19'
  },
  {
    "id": "kilkishen_T76-12a",
    "title": "Humours of Castlefinn",
    "genre": "Reel",
    start: '46.22',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-12b",
    "title": "Glen of Aherlow",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-12c",
    "title": "Killarney Boys of Pleasure",
    "genre": "Reel",
    start: 'TBD',
    end: '51.58'
  },
  {
    "id": "kilkishen_T76-14a",
    "title": "Paddy Fahey&#8217;s",
    "genre": "Jig",
    start: '57.03',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-14b",
    "title": "Connolly&#8217;s (with Francie Donnellan &#8211; fiddle)",
    "genre": "Jig",
    start: 'TBD',
    end: '1.01.53'
  },
  {
    "id": "kilkishen_T76-15a",
    "title": "George White&#8217;s Favourite",
    "genre": "Reel",
    start: '1.01.54',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-15b",
    "title": "Ash Plant",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-15c",
    "title": "Matt People's",
    "genre": "Reel",
    start: 'TBD',
    end: '1.10.58'
  },
  {
    "id": "kilkishen_T76-16a",
    "title": "Farrell O&#8217;Gara",
    "genre": "Reel",
    start: '1.10.59',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-16b",
    "title": "Mountain Road",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-16c",
    "title": "Jenny&#8217;s Chickens",
    "genre": "Reel",
    start: 'TBD',
    end: '1.15.57'
  },
  {
    "id": "kilkishen_T76-17a",
    "title": "Green Gowned Lass",
    "genre": "Reel",
    start: '1.15.55',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-17b",
    "title": "Humours of Scarrif",
    "genre": "Reel",
    start: 'TBD',
    end: '1.21.20'
  },
  {
    "id": "kilkishen_T76-18a",
    "title": "Tunes (2): Gan Ainm",
    "genre": "Tune",
    start: '1.21.25',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-18b",
    "title": "Gan Ainm",
    "genre": "Tune",
    start: 'TBD',
    end: '1.25.43'
  },
  {
    "id": "kilkishen_T76-19a",
    "title": "Killanan's Fancy",
    "genre": "Reel",
    start: '1.25.44',
    end: 'TBD'
  },
  {
    "id": "kilkishen_T76-19b",
    "title": "Killavel Fancy",
    "genre": "Reel",
    start: 'TBD',
    end: '1.29.36'
  }
];

async function main() {
  console.log('Processing Session: kilkishen_T76');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'kilkishen_T76-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
