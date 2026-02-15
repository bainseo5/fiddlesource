/**
 * Script to split session: annagh_CM-WC6
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_CM-WC6.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_annagh_CM-WC6.mp3`;
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
  location: "the Crosses of Annagh Bar, Annagh, Mullagh, September",
  musicians: "Unknown Musicians",
  date: "1973",
  collection: "Carroll-Mackenzie Collection",
  recordingType: "Solo",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_CM-WC6.htm"
};

const tracks = [
  {
    "id": "annagh_CM-WC6-1a",
    "title": "Windy Gap",
    "genre": "Reel",
    start: '.02',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC6-1b",
    "title": "Wheels of The World",
    "genre": "Reel",
    start: 'TBD',
    end: '2.36'
  },
  {
    "id": "annagh_CM-WC6-2",
    "title": "Toss the Feathers",
    "genre": "Reel",
    start: '2.39',
    end: '3.54'
  },
  {
    "id": "annagh_CM-WC6-3",
    "title": "Talk: about learning to play fiddle &amp; a storm",
    "genre": "Tune",
    start: '3.58',
    end: '10.00'
  },
  {
    "id": "annagh_CM-WC6-4",
    "title": "Story: About Junior&#8217;s tune &#8216;The Luachrach&aacute;n&#8217;",
    "genre": "Tune",
    start: '10.03',
    end: '11.38'
  },
  {
    "id": "annagh_CM-WC6-5",
    "title": "The Luachrach&aacute;n",
    "genre": "Jig",
    start: '11.38',
    end: '12.47'
  },
  {
    "id": "annagh_CM-WC6-6",
    "title": "Air: Air for Willie Clancy",
    "genre": "Tune",
    start: '13.06',
    end: '17.38'
  },
  {
    "id": "annagh_CM-WC6-7",
    "title": "Song for Wi1lie Clancy",
    "genre": "Song",
    start: '17.40',
    end: '20.07'
  },
  {
    "id": "annagh_CM-WC6-8",
    "title": "Peg in the Settle Bed",
    "genre": "Reel",
    start: '20.13',
    end: '22.20'
  },
  {
    "id": "annagh_CM-WC6-9",
    "title": "Minister down to Hell",
    "genre": "Jig",
    start: '22.23',
    end: '23.09'
  }
];

async function main() {
  console.log('Processing Session: annagh_CM-WC6');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'annagh_CM-WC6-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
