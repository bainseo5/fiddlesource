/**
 * Script to split session: annagh_JH38-1
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_JH38-1.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_annagh_JH38-1.mp3`;
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
  location: "Casey&#",
  musicians: "",
  date: "8217",
  collection: "John Joe Healy Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_JH38-1.htm"
};

const tracks = [
  {
    "id": "annagh_JH38-1-1",
    "title": "Talk: &#8216;We&#8217;re all together here at Bobby&#8217;s [Casey]&#8217; 2. Reel: High Reel",
    "genre": "Reel",
    start: '.06',
    end: '3.17'
  },
  {
    "id": "annagh_JH38-1-3a",
    "title": "Toss the Feathers #1",
    "genre": "Reel",
    start: '3.18',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-3b",
    "title": "Toss the Feathers #2",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-3c",
    "title": "College Groves",
    "genre": "Reel",
    start: 'TBD',
    end: '7.34'
  },
  {
    "id": "annagh_JH38-1-4a",
    "title": "Jenny&#8217;s Welcome to Charlie",
    "genre": "Reel",
    start: '7.37',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-4b",
    "title": "Boy in the Gap",
    "genre": "Reel",
    start: 'TBD',
    end: '11.02'
  },
  {
    "id": "annagh_JH38-1-5a",
    "title": "Humours of Lissadell",
    "genre": "Reel",
    start: '11.07',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-5b",
    "title": "Queen of the Fair",
    "genre": "Reel",
    start: 'TBD',
    end: '13.20'
  },
  {
    "id": "annagh_JH38-1-6a",
    "title": "Chief O&#8217;Neill&#8217;s Favourite",
    "genre": "Hornpipe",
    start: '13.26',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-6b",
    "title": "Derry",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '16.28'
  },
  {
    "id": "annagh_JH38-1-7",
    "title": "Se&aacute;n &Oacute; Duibhir an Ghleanna",
    "genre": "Hornpipe",
    start: '16.30',
    end: '18.46'
  },
  {
    "id": "annagh_JH38-1-8a",
    "title": "Bobby&#8217;s",
    "genre": "Jig",
    start: '18.57',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-8b",
    "title": "Pipe on the Hob",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-8c",
    "title": "Frieze Britches",
    "genre": "Jig",
    start: 'TBD',
    end: '22.11'
  },
  {
    "id": "annagh_JH38-1-9",
    "title": "Cliffs of Moher",
    "genre": "Jig",
    start: '22.12',
    end: '22.48'
  },
  {
    "id": "annagh_JH38-1-10a",
    "title": "Martin Wynne&#8217;s No.2",
    "genre": "Reel",
    start: '23.50',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-10b",
    "title": "Green Fields of America",
    "genre": "Reel",
    start: 'TBD',
    end: '26.25'
  },
  {
    "id": "annagh_JH38-1-11",
    "title": "St. Anne&#8217;s",
    "genre": "Reel",
    start: '26.38',
    end: '28.25'
  },
  {
    "id": "annagh_JH38-1-12a",
    "title": "Paddy's Return",
    "genre": "Jig",
    start: '28.27',
    end: 'TBD'
  },
  {
    "id": "annagh_JH38-1-12b",
    "title": "Kilfenora",
    "genre": "Jig",
    start: 'TBD',
    end: '32.16'
  }
];

async function main() {
  console.log('Processing Session: annagh_JH38-1');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'annagh_JH38-1-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
