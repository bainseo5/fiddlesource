/**
 * Script to split session: talty_casey_whelan_JH38-2
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/talty_casey_whelan_JH38-2.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_talty_casey_whelan_JH38-2.mp3`;
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
  musicians: "",
  date: "Unknown Date",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/talty_casey_whelan_JH38-2.htm"
};

const tracks = [
  {
    "id": "talty_casey_whelan_JH38-2-1",
    "title": "Thrush in the Straw",
    "genre": "Jig",
    start: '.02',
    end: '1.00'
  },
  {
    "id": "talty_casey_whelan_JH38-2-2",
    "title": "Castle Kelly",
    "genre": "Reel",
    start: '1.03',
    end: '1.58'
  },
  {
    "id": "talty_casey_whelan_JH38-2-3a",
    "title": "Air",
    "genre": "Jig",
    start: '2.00',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-3b",
    "title": "jig: S&eacute; F&aacute;th mo Bhuartha",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-3c",
    "title": "Bride&#8217;s Favourite",
    "genre": "Jig",
    start: 'TBD',
    end: '4.05'
  },
  {
    "id": "talty_casey_whelan_JH38-2-4a",
    "title": "Galway Rambler",
    "genre": "Reel",
    start: '4.06',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-4b",
    "title": "Five Mile Chase",
    "genre": "Reel",
    start: 'TBD',
    end: '5.15'
  },
  {
    "id": "talty_casey_whelan_JH38-2-5a",
    "title": "Craig&#8217;s Pipes",
    "genre": "Reel",
    start: '5.16',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-5b",
    "title": "Dunmore Lasses",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-5c",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: '9.34'
  },
  {
    "id": "talty_casey_whelan_JH38-2-6a",
    "title": "Dedication and chat to Thady",
    "genre": "Tune",
    start: '9.34',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-6b",
    "title": "Tadhg [Casey]",
    "genre": "Tune",
    start: 'TBD',
    end: '10.32'
  },
  {
    "id": "talty_casey_whelan_JH38-2-7a",
    "title": "Roaring Mary",
    "genre": "Reel",
    start: '10.39',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-7b",
    "title": "Sligo Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '13.05'
  },
  {
    "id": "talty_casey_whelan_JH38-2-8",
    "title": "Boys of Bluehill",
    "genre": "Hornpipe",
    start: '13.08',
    end: '15.19'
  },
  {
    "id": "talty_casey_whelan_JH38-2-9a",
    "title": "Saddle the Pony",
    "genre": "Jig",
    start: '15.21',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-9b",
    "title": "Lark on the Strand",
    "genre": "Jig",
    start: 'TBD',
    end: '17.36'
  },
  {
    "id": "talty_casey_whelan_JH38-2-10a",
    "title": "Reel",
    "genre": "Reel",
    start: '17.38',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-10b",
    "title": "Hornpipes (2): The Contradiction Reel",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-10c",
    "title": "Cronin's Hornpipe",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "talty_casey_whelan_JH38-2-10d",
    "title": "Take your Churn (unfinished)",
    "genre": "Reel",
    start: 'TBD',
    end: '22.31'
  },
  {
    "id": "talty_casey_whelan_JH38-2-11",
    "title": "Market Town (tape runs out)",
    "genre": "Jig",
    start: '22.32',
    end: '23.25'
  }
];

async function main() {
  console.log('Processing Session: talty_casey_whelan_JH38-2');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'talty_casey_whelan_JH38-2-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
