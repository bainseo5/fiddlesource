/**
 * Script to split Katty's Bar Mullagh session into individual tracks
 * BR Taylor Collection Tape 019-2
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verify this path points to the correct audio file
const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\T19-2_Session_Kattys_Bar_Mullagh_11-07-76_KLICKAUD.mp3`;
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse timestamp like "2.35" or ".02" to seconds
function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  // Handle case with no leading zero like ".02"
  if (timeStr.startsWith('.')) timeStr = '0' + timeStr;
  
  const parts = timeStr.toString().trim().split('.');
  const minutes = parts[0] === '' ? 0 : parseInt(parts[0]);
  const seconds = parseInt(parts[1]);
  return minutes * 60 + seconds;
}

// Session metadata
const sessionInfo = {
  location: "Katty's Bar, Mullagh",
  musicians: "Pat Crehan (flute), Michael Downes (fiddle), Jim McKee (fiddle)",
  date: "July 11, 1976",
  recordedBy: "Barry Taylor",
  collection: "BR Taylor Collection Tape 019-2",
  region: "Mullagh"
};

// Track list with timestamps
// Note: Fill in the "TBD" start/end times for the individual medley tunes.
const tracks = [
  // 1. Reels (2): Boys of Ballisodare/Hare's Paw
  {
    id: 'mullagh-01a',
    title: "Boys of Ballisodare",
    genre: 'Reel',
    start: '0.02',
    end: 'TBD'
  },
  {
    id: 'mullagh-01b',
    title: "Hare's Paw",
    genre: 'Reel',
    start: 'TBD',
    end: '2.15'
  },

  // 2. Reels (3): Mamma's Pet/Bloom of Youth/Heathery Breeze
  {
    id: 'mullagh-02a',
    title: "Mamma's Pet",
    genre: 'Reel',
    start: '2.35',
    end: 'TBD'
  },
  {
    id: 'mullagh-02b',
    title: "Bloom of Youth",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-02c',
    title: "Heathery Breeze",
    genre: 'Reel',
    start: 'TBD',
    end: '5.45'
  },

  // 3. Reels (3): Down the Broom/Gatehouse Maid/Ivy Leaf
  {
    id: 'mullagh-03a',
    title: "Down the Broom",
    genre: 'Reel',
    start: '5.58',
    end: 'TBD'
  },
  {
    id: 'mullagh-03b',
    title: "Gatehouse Maid",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-03c',
    title: "Ivy Leaf",
    genre: 'Reel',
    start: 'TBD',
    end: '9.26'
  },

  // 4. Reels (2): Old Torn Petticoat/Green Fields of America
  {
    id: 'mullagh-04a',
    title: "Old Torn Petticoat",
    genre: 'Reel',
    start: '9.29',
    end: 'TBD'
  },
  {
    id: 'mullagh-04b',
    title: "Green Fields of America",
    genre: 'Reel',
    start: 'TBD',
    end: '12.16'
  },

  // 5. Reels (3): Kerry Reel/Morning Dew/Woman of the House
  {
    id: 'mullagh-05a',
    title: "Kerry Reel",
    genre: 'Reel',
    start: '13.02',
    end: 'TBD'
  },
  {
    id: 'mullagh-05b',
    title: "Morning Dew",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-05c',
    title: "Woman of the House",
    genre: 'Reel',
    start: 'TBD',
    end: '16.18'
  },

  // 6. Jigs (2): Apples in Winter/Trip to Sligo
  {
    id: 'mullagh-06a',
    title: "Apples in Winter",
    genre: 'Jig',
    start: '16.54',
    end: 'TBD'
  },
  {
    id: 'mullagh-06b',
    title: "Trip to Sligo",
    genre: 'Jig',
    start: 'TBD',
    end: '19.22'
  },

  // 7. Reels (2): Five Mile Chase/Abbey Reel
  {
    id: 'mullagh-07a',
    title: "Five Mile Chase",
    genre: 'Reel',
    start: '19.25',
    end: 'TBD'
  },
  {
    id: 'mullagh-07b',
    title: "Abbey Reel",
    genre: 'Reel',
    start: 'TBD',
    end: '21.22'
  },

  // 8. Reels (2): Jackie Coleman's/Bucks of Oranmore
  {
    id: 'mullagh-08a',
    title: "Jackie Coleman's",
    genre: 'Reel',
    start: '21.29',
    end: 'TBD'
  },
  {
    id: 'mullagh-08b',
    title: "Bucks of Oranmore",
    genre: 'Reel',
    start: 'TBD',
    end: '24.36'
  },

  // 9. Reel: John Dwyer's
  {
    id: 'mullagh-09',
    title: "John Dwyer's",
    genre: 'Reel',
    start: '24.47',
    end: '25.57'
  },

  // 10. Reel: Salamanca
  {
    id: 'mullagh-10',
    title: "Salamanca",
    genre: 'Reel',
    start: '26.04',
    end: '27.42'
  },

  // 11. Reels (2): Green Groves of Erin/Killourhy's
  {
    id: 'mullagh-11a',
    title: "Green Groves of Erin",
    genre: 'Reel',
    start: '27.47',
    end: 'TBD'
  },
  {
    id: 'mullagh-11b',
    title: "Killourhy's",
    genre: 'Reel',
    start: 'TBD',
    end: '31.39'
  },

  // 12. Reels (2): Paddy Murphy's Wife/Stony Steps
  {
    id: 'mullagh-12a',
    title: "Paddy Murphy's Wife",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-12b',
    title: "Stony Steps",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },

  // 13. Hornpipe: Blackbird
  {
    id: 'mullagh-13',
    title: "Blackbird",
    genre: 'Hornpipe',
    start: 'TBD',
    end: 'TBD'
  },

  // 14. Reel: Rakish Paddy
  {
    id: 'mullagh-14',
    title: "Rakish Paddy",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },

  // 15. Reels (3): Tarbolton/Longford Collector/Sailor's Bonnet
  {
    id: 'mullagh-15a',
    title: "Tarbolton",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-15b',
    title: "Longford Collector",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-15c',
    title: "Sailor's Bonnet",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },

  // 16. Reels (2): O'Rourke's/Wild Irishman
  {
    id: 'mullagh-16a',
    title: "O'Rourke's",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-16b',
    title: "Wild Irishman",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },

  // 17. Set dance: Job of Journeywork
  {
    id: 'mullagh-17',
    title: "Job of Journeywork",
    genre: 'Set Dance',
    start: 'TBD',
    end: 'TBD'
  },

  // 18. Set dances (2): Rodney's Glory/Mount Famous Hunt
  {
    id: 'mullagh-18a',
    title: "Rodney's Glory",
    genre: 'Set Dance',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'mullagh-18b',
    title: "Mount Famous Hunt",
    genre: 'Set Dance',
    start: 'TBD',
    end: 'TBD'
  }
];

async function main() {
  console.log('Processing Mullagh Session...');
  
  const tunes = [];

  for (const track of tracks) {
    if (track.start === 'TBD' || track.end === 'TBD') {
      console.log(`Skipping ${track.title} (timestamps TBD)`);
      continue;
    }

    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);

    if (startSec === null || endSec === null) {
        console.log(`Skipping ${track.title} (invalid timestamps)`);
        continue;
    }

    // Calculate duration
    const duration = endSec - startSec;
    if (duration <= 0) {
      console.log(`Skipping ${track.title} (invalid duration: ${duration})`);
      continue;
    }

    const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
    
    // ffmpeg command
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
        collection: sessionInfo.collection
      });
    } catch (err) {
      console.error(`Error processing ${track.title}:`, err.message);
    }
  }

  // Update existing tunes.json logic to merge instead of overwrite if needed
  // For now, simpler to read existing, update matching IDs, write back.
  // But per 'Doolin style' requested, we might just be logging or creating a new json array.
  // The Doolin script didn't show the full write logic but seemed to just log.
  // We'll write to a new file 'mullagh-split-tunes.json' to avoid clobbering the main one recklessly,
  // or just log it. The user asked for "Doolin style" structure.
  
  // Doolin script snippet ended with getInstruments...
  // Let's assume standard behavior is to write to a JSON file.
  
  // We'll output to console as JSON array at the end if we want, or write to file.
  // Let's write to a separate file to be safe.
  const jsonPath = path.join(__dirname, 'mullagh-split-output.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`wrote ${tunes.length} processed tunes to ${jsonPath}`);
}

main().catch(console.error);
