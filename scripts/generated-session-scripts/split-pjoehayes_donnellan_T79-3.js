/**
 * Script to split session: pjoehayes_donnellan_T79-3
 * Source: https://www.clarelibrary.ie/eolas/coclare/music/live/pjoehayes_donnellan_T79-3.htm
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
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\MISSING_FILE_pjoehayes_donnellan_T79-3.mp3`;
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
  musicians: "Me/Blarney Pilgrim/Munster Buttermilk (32.00 - 36.38) 10. Hornpipe: Mrs Dywer's (36.40 - 38.11) 11. March: Princess Royal (38.12 - 39.41) 12. Reels (2): P. Joe&#8217;s/Mountain Lark (39.42 - 42.20) Francie Donnellan &amp; P Joe Hayes, 1963. Photo: Michael John Glynne &copy; Clare Local Studies Project &nbsp; &lt;&lt; The BR Taylor Collection",
  date: "Unknown Date",
  collection: "Barry Taylor Collection",
  recordingType: "Session",
  sourceUrl: "https://www.clarelibrary.ie/eolas/coclare/music/live/pjoehayes_donnellan_T79-3.htm"
};

const tracks = [
  {
    "id": "pjoehayes_donnellan_T79-3-1a",
    "title": "McGreevy&#8217;s",
    "genre": "Reel",
    start: '01',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-1b",
    "title": "Miss McGuinness",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-1c",
    "title": "Sweetheart",
    "genre": "Reel",
    start: 'TBD',
    end: '3.23'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-2a",
    "title": "P. Joe&#8217;s",
    "genre": "Reel",
    start: '3.25',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-2b",
    "title": "Mountain Lark",
    "genre": "Reel",
    start: 'TBD',
    end: '5.56'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-3a",
    "title": "Windy Gap",
    "genre": "Reel",
    start: '5.57',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-3b",
    "title": "Sergeant Early&#8217;s Dream",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-3c",
    "title": "Tempest",
    "genre": "Reel",
    start: 'TBD',
    end: '11.44'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-4a",
    "title": "McGreevy&#8217;s",
    "genre": "Reel",
    start: '11.46',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-4b",
    "title": "Miss McGuinness",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-4c",
    "title": "Sweetheart",
    "genre": "Reel",
    start: 'TBD',
    end: '15.39'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-5a",
    "title": "Kerfunken",
    "genre": "Jig",
    start: '15.41',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-5b",
    "title": "Hole in the Hedge",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-5c",
    "title": "Seamus Cooley's",
    "genre": "Jig",
    start: 'TBD',
    end: '20.31'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-6a",
    "title": "Austin Tierney&#8217;s",
    "genre": "Reel",
    start: '20.33',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-6b",
    "title": "Hare&#8217;s Paw",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-6c",
    "title": "Dairy Maid",
    "genre": "Reel",
    start: 'TBD',
    end: '24.41'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-7a",
    "title": "Caisle&aacute;n an &Oacute;ir",
    "genre": "Hornpipe",
    start: '24.44',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-7b",
    "title": "Micky Callaghan's Fancy",
    "genre": "Hornpipe",
    start: 'TBD',
    end: '28.23'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-8a",
    "title": "Humours of Castlefin",
    "genre": "Reel",
    start: '28.24',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-8b",
    "title": "Glen of Aherlow",
    "genre": "Reel",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-8c",
    "title": "Killarney Boys of Pleasure",
    "genre": "Reel",
    start: 'TBD',
    end: '31.59'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-9a",
    "title": "Have a Drink with Me",
    "genre": "Jig",
    start: '32.00',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-9b",
    "title": "Blarney Pilgrim",
    "genre": "Jig",
    start: 'TBD',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-9c",
    "title": "Munster Buttermilk",
    "genre": "Jig",
    start: 'TBD',
    end: '36.38'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-10",
    "title": "Mrs Dywer's",
    "genre": "Hornpipe",
    start: '36.40',
    end: '38.11'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-11",
    "title": "Princess Royal",
    "genre": "March",
    start: '38.12',
    end: '39.41'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-12a",
    "title": "P. Joe&#8217;s",
    "genre": "Reel",
    start: '39.42',
    end: 'TBD'
  },
  {
    "id": "pjoehayes_donnellan_T79-3-12b",
    "title": "Mountain Lark",
    "genre": "Reel",
    start: 'TBD',
    end: '42.20'
  }
];

async function main() {
  console.log('Processing Session: pjoehayes_donnellan_T79-3');
  
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

  const jsonPath = path.join(OUTPUT_DIR, 'pjoehayes_donnellan_T79-3-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`Wrote metadata to ${jsonPath}`);
}

main().catch(console.error);
