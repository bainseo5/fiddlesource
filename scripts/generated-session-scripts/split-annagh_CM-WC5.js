/**
 * Script to split session: annagh_CM-WC5
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_CM-WC5.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_annagh_CM-WC5.mp3`;
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
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/annagh_CM-WC5.htm"
};

const tracks = [
  {
    "id": "annagh_CM-WC5-1",
    "title": "Billy O&#8217;Donnell&#8217;s",
    "genre": "Jig",
    start: '.02',
    end: '1.40'
  },
  {
    "id": "annagh_CM-WC5-2",
    "title": "Tune: Planxty Davis",
    "genre": "Tune",
    start: '1.45',
    end: '3.27'
  },
  {
    "id": "annagh_CM-WC5-3a",
    "title": "Crosses of Annagh",
    "genre": "Reel",
    start: '3.29',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC5-3b",
    "title": "Maids of Mount Cisco",
    "genre": "Reel",
    start: 'TBD',
    end: '6.19'
  },
  {
    "id": "annagh_CM-WC5-4",
    "title": "Air: C&aacute; raibh t&uacute; ar Maidin? (Irish version of Lord Randall)",
    "genre": "Tune",
    start: '6.22',
    end: '7.46'
  },
  {
    "id": "annagh_CM-WC5-5",
    "title": "Story: about above song",
    "genre": "Song",
    start: '7.46',
    end: '9.13'
  },
  {
    "id": "annagh_CM-WC5-6",
    "title": "Air: P&aacute;ist&iacute;n Fionn",
    "genre": "Tune",
    start: '9.19',
    end: '11.16'
  },
  {
    "id": "annagh_CM-WC5-7a",
    "title": "West Wind",
    "genre": "Jig",
    start: '11.17',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC5-7b",
    "title": "You Are My Love",
    "genre": "Jig",
    start: 'TBD',
    end: '13.26'
  },
  {
    "id": "annagh_CM-WC5-8a",
    "title": "Air",
    "genre": "Jig",
    start: '13.27',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC5-8b",
    "title": "Jig: Anach Cuain",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC5-8c",
    "title": "Sheep in the Boat",
    "genre": "Jig",
    start: 'TBD',
    end: '15.50'
  },
  {
    "id": "annagh_CM-WC5-9",
    "title": "Story &amp; Song: about above air",
    "genre": "Song",
    start: '15.51',
    end: '17.16'
  },
  {
    "id": "annagh_CM-WC5-10a",
    "title": "Priest&#8217;s Lament",
    "genre": "Hornpipe",
    start: '17.20',
    end: 'TBD'
  },
  {
    "id": "annagh_CM-WC5-10b",
    "title": "hornpipe",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '20.52'
  },
  {
    "id": "annagh_CM-WC5-11",
    "title": "Humours of Quilty",
    "genre": "Reel",
    start: '20.54',
    end: '22.28'
  },
  {
    "id": "annagh_CM-WC5-12",
    "title": "Long Strand",
    "genre": "Reel",
    start: '22.37',
    end: '23.44'
  },
  {
    "id": "annagh_CM-WC5-13",
    "title": "The Tempest",
    "genre": "Reel",
    start: '23.50',
    end: '25.08'
  },
  {
    "id": "annagh_CM-WC5-14",
    "title": "Junior&#8217;s",
    "genre": "Reel",
    start: '25.11',
    end: '27.17'
  },
  {
    "id": "annagh_CM-WC5-15",
    "title": "Recitation: The Quilty Fishermen (unfinished)",
    "genre": "Tune",
    start: '26.39',
    end: '27.14'
  },
  {
    "id": "annagh_CM-WC5-16",
    "title": "Farewell to Miltown Malbay",
    "genre": "Reel",
    start: '27.16',
    end: '28.31'
  },
  {
    "id": "annagh_CM-WC5-17",
    "title": "Mowing Machine",
    "genre": "Reel",
    start: '28.33',
    end: '29.48'
  },
  {
    "id": "annagh_CM-WC5-18",
    "title": "Air: An raibh t&uacute; ar an gCarraig?",
    "genre": "Tune",
    start: '30.00',
    end: '31.43'
  },
  {
    "id": "annagh_CM-WC5-20",
    "title": "Rodney&#8217;s Glory",
    "genre": "Hornpipe",
    start: '38.11',
    end: '40.12'
  },
  {
    "id": "annagh_CM-WC5-21",
    "title": "The Hunt",
    "genre": "Set Dance",
    start: '40.17',
    end: '42.12'
  }
];

async function main() {
  console.log('Processing Session: annagh_CM-WC5');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'annagh_CM-WC5-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
