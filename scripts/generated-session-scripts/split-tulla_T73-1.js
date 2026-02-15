/**
 * Script to split session: tulla_T73-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/tulla_T73-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_tulla_T73-1.mp3`;
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
  location: "Tulla",
  musicians: "Paddy Canny, Kiltannon &amp; Peadar O&#8217;Loughlin, Kilmaley, fiddles",
  date: "1995",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/tulla_T73-1.htm"
};

const tracks = [
  {
    "id": "tulla_T73-1-1a",
    "title": "Rolling in the Barrel (PC",
    "genre": "Reel",
    start: '35.43',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1b",
    "title": "PO) (.08 &#8211; 1.04) 2. Reel: Graf Spey (PO) (1.06 &#8211; 2.51) 3. Reel: Paddy Ryan&#8217;s Dream (PO) (2.55 &#8211; 4.16) 4. Reel: Paddy Ryan&#8217;s Dream (PO) (4.18 &#8211; 4.48) 5. Reel: An Bins&iacute;n Luachra (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1c",
    "title": "PO) (5.00 &#8211; 7.03) 6. Reels (2): John Henry",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1d",
    "title": "Mrs Crotty's Christening (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1e",
    "title": "PO) (7.11 &#8211; 9.37) 7. Jig: Connie O'Connell's (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1f",
    "title": "PO) (9.40 &#8211; 11.30) 8. Jig: Jim Ward&#8217;s (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1g",
    "title": "PO) (11.34 &#8211; 13.20) 9. Reel: Sergeant Early&#8217;s Dream (PC) (13.21 &#8211; 14.49) 10. Reel: Sporting Nell (PO) (14.51 &#8211; 16.12) 11. Reel: Sporting Nell (PC) (16.13 &#8211; 17.28) 12. Reels (2): Bunker Hill",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1h",
    "title": "Bush Reel (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1i",
    "title": "PO) (17.32 &#8211; 20.58) 13. Reels (3): Maid of Feakle",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1j",
    "title": "Humours of Scariff",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1k",
    "title": "Morning Star (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1l",
    "title": "PO) (20.59 &#8211; 25.16) 14. Reel: Star of Munster (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1m",
    "title": "PO) (25.17 &#8211; 27.17) 15. Reels (2): Kitty&#8217;s Gone A-Milking",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1n",
    "title": "Music in the Glen (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1o",
    "title": "PO) (27.19 &#8211; 29.59) 16. Reels (2): Grogan&#8217;s Favourite",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1p",
    "title": "Galway Rambler (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1q",
    "title": "PO) (30.01 &#8211; 33.00) 17. Reels (2): Lucy Campbell",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1r",
    "title": "Boys of Ballysodare (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1s",
    "title": "PO) (33.03 &#8211; 35.42) 18. Jig: Dr. O&#8217;Neill&#8217;s (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-1t",
    "title": "PO)",
    "genre": "Reel",
    start: 'TBD',
    end: '38.12'
  },
  {
    "id": "tulla_T73-1-19a",
    "title": "O&#8217;Neill&#8217;s Favourite",
    "genre": "Reel",
    start: '51.08',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19b",
    "title": "Dunphy&#8217;s (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19c",
    "title": "PO) (38.15 &#8211; 41.07) 20. Reel: Green fields of Rosbeigh (PO) (41.11 &#8211; 41.52) 21. Reels (2): Eagan&#8217;s",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19d",
    "title": "Lafferty&#8217;s (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19e",
    "title": "PO) (41.54 &#8211; 44.04) 22. Jigs (2): Trip to Athlone (fragment)",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19f",
    "title": "Pipe on the Hob (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19g",
    "title": "PO) (44.05 &#8211; 45.25) 23. Jig: Se&aacute;n Ryan&#8217;s (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19h",
    "title": "PO) (45.26 &#8211; 46.31) 24. Reel: Dan Dowd's (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19i",
    "title": "PO) (46.34 &#8211; 47.38) 25. Reel: Morning Dew (unknown fiddle player) (47.38 &#8211; 48.52) 26. Reel: Bobby Casey's (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19j",
    "title": "PO) (49.05 &#8211; 49.55) 27. Reel: Bobby Casey's (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19k",
    "title": "PO) (49.57 &#8211; 51.07) 28. Jig: Poll Halfpenny (PC",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "tulla_T73-1-19l",
    "title": "PO)",
    "genre": "Reel",
    start: 'TBD',
    end: '52.38'
  },
  {
    "id": "tulla_T73-1-29",
    "title": "Paddy Fahy's",
    "genre": "Reel",
    start: '51.08',
    end: '52.28'
  }
];

async function main() {
  console.log('Processing Session: tulla_T73-1');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'tulla_T73-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
