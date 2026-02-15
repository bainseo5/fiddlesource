/**
 * Script to split Bonavella session into individual tracks and tunes
 * John Joe Healy Collection Tape 12
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\JH12_Bonavella_1961_KLICKAUD.mp3`;
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse timestamp like "2.35" or ".02" to seconds
function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  const parts = timeStr.toString().trim().split('.');
  
  if (parts.length === 1) return parseInt(parts[0]); // Just seconds? Unlikely but safe
  
  const minutes = parts[0] === '' ? 0 : parseInt(parts[0]);
  const seconds = parseInt(parts[1]);
  return minutes * 60 + seconds;
}

// Session metadata
const sessionInfo = {
  location: "Crehan's Home, Bonavella",
  musicians: "Willie Clancy (pipes), Seamus Ennis (pipes), Martin 'Junior' Crehan (fiddle), Angela Crehan (whistle/piano), Ita Crehan (whistle)",
  artist: "Willie Clancy, Seamus Ennis, Martin 'Junior' Crehan & Family",
  date: "October 10, 1961",
  year: "1961",
  recordedBy: "Martin Talty",
  collection: "John Joe Healy Collection Tape 12",
  region: "Mullagh",
  recordingType: "session",
  description: "Recorded in Crehan's Home, Bonavella on October 10, 1961.\nMusicians: Willie Clancy (pipes), Seamus Ennis (pipes), Martin 'Junior' Crehan (fiddle), Angela Crehan (whistle/piano), Ita Crehan (whistle).\nRecorded by Martin Talty.\nPart of the John Joe Healy Collection (Tape 12)."
};

// Track list with timestamps
// Note: Fill in the "TBD" start/end times for the individual medley tunes.
const tracks = [
  // 1. Reels (2): Green Groves of Erin/Ivy Leaf
  {
    id: 'bonavella-01a',
    title: "Green Groves of Erin",
    genre: 'Reel',
    start: '0.02',
    end: 'TBD'
  },
  {
    id: 'bonavella-01b',
    title: "Ivy Leaf",
    genre: 'Reel',
    start: 'TBD',
    end: '2.25'
  },

  // 2. Jigs (2): Maid in the Meadow/Rambling Pitchfork
  {
    id: 'bonavella-02a',
    title: "Maid in the Meadow",
    genre: 'Jig',
    start: '2.28',
    end: 'TBD'
  },
  {
    id: 'bonavella-02b',
    title: "Rambling Pitchfork",
    genre: 'Jig',
    start: 'TBD',
    end: '4.27'
  },

  // 3
  {
    id: 'bonavella-03',
    title: "Rodney's Glory",
    genre: 'Set dance',
    start: '4.29',
    end: '6.18'
  },

  // 4
  {
    id: 'bonavella-04',
    title: "Flogging Reel",
    genre: 'Reel',
    start: '6.19',
    end: '7.39' 
  },

  // 5
  {
    id: 'bonavella-05',
    title: "Billy O'Donnell's",
    genre: 'Jig',
    start: '7.39',
    end: '8.43'
  },

  // 6
  {
    id: 'bonavella-06',
    title: "Sporting Paddy",
    genre: 'Reel',
    start: '8.44',
    end: '9.38'
  },

  // 7. Reels (2): Boys of Ballisodare/Hare's Paw?
  {
    id: 'bonavella-07a',
    title: "Boys of Ballisodare",
    genre: 'Reel',
    start: '9.54',
    end: 'TBD'
  },
  {
    id: 'bonavella-07b',
    title: "Hare's Paw",
    genre: 'Reel',
    start: 'TBD',
    end: '11.18'
  },

  // 8
  {
    id: 'bonavella-08',
    title: "Geese in the Bog",
    genre: 'Jig',
    start: '11.21',
    end: '13.52'
  },

  // 9
  {
    id: 'bonavella-09',
    title: "Lucy Campbell",
    genre: 'Reel',
    start: '13.57',
    end: '15.06'
  },

  // 10
  {
    id: 'bonavella-10',
    title: "Wheels of the World",
    genre: 'Reel',
    start: '15.08',
    end: '16.21'
  },

  // 11
  {
    id: 'bonavella-11',
    title: "Down the Broom",
    genre: 'Reel',
    start: '16.28',
    end: '18.15'
  },

  // 12
  {
    id: 'bonavella-12',
    title: "Frieze Britches",
    genre: 'Jig',
    start: '18.17',
    end: '20.52'
  },

  // 13
  {
    id: 'bonavella-13',
    title: "Long A-Growing",
    genre: 'Song',
    start: '20.58',
    end: '25.00'
  },

  // 14. Jigs (2): Monk's/Rambling Pitchfork
  {
    id: 'bonavella-14a',
    title: "Monk's",
    genre: 'Jig',
    start: '25.17',
    end: 'TBD'
  },
  {
    id: 'bonavella-14b',
    title: "Rambling Pitchfork",
    genre: 'Jig',
    start: 'TBD',
    end: '28.00'
  },

  // 15. Jigs (2): Ask my Father/Dusty Miller
  {
    id: 'bonavella-15a',
    title: "Ask my Father (single jig)",
    genre: 'Jig',
    start: '28.06',
    end: 'TBD'
  },
  {
    id: 'bonavella-15b',
    title: "Dusty Miller (slip jig)",
    genre: 'Jig',
    start: 'TBD',
    end: '30.52'
  },

  // 16. Reels (3): Hand Me Down the Tackle/Dublin/Silver Spear
  {
    id: 'bonavella-16a',
    title: "Hand Me Down the Tackle",
    genre: 'Reel',
    start: '31.02',
    end: 'TBD'
  },
  {
    id: 'bonavella-16b',
    title: "Dublin Reel",
    genre: 'Reel',
    start: 'TBD',
    end: 'TBD'
  },
  {
    id: 'bonavella-16c',
    title: "Silver Spear",
    genre: 'Reel',
    start: 'TBD',
    end: '35.46'
  },

  // 17
  {
    id: 'bonavella-17',
    title: "Ace and Deuce of Piping",
    genre: 'Set dance',
    start: '35.58',
    end: '38.07'
  },

  // 18
  {
    id: 'bonavella-18',
    title: "Jenny's Wedding",
    genre: 'Reel',
    start: '38.08',
    end: '39.17'
  },

  // 19. Jig: Mist Covered Mountain/Garrett Barry's?
  {
    id: 'bonavella-19a',
    title: "Mist Covered Mountain",
    genre: 'Jig',
    start: '39.19',
    end: 'TBD'
  },
  {
    id: 'bonavella-19b',
    title: "Garrett Barry's",
    genre: 'Jig',
    start: 'TBD',
    end: '41.26'
  },

  // 20. Reels (2): Dairy Maid/Flax in Bloom
  {
    id: 'bonavella-20a',
    title: "Dairy Maid",
    genre: 'Reel',
    start: '41.29',
    end: 'TBD'
  },
  {
    id: 'bonavella-20b',
    title: "Flax in Bloom",
    genre: 'Reel',
    start: 'TBD',
    end: '43.24'
  }
];

async function main() {
  console.log('Processing Bonavella Session...');
  
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
        genre: 'Irish Traditional',
        type: track.genre,
        url: `/audio/${track.id}.mp3`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        artist: sessionInfo.artist || sessionInfo.musicians,
        date: sessionInfo.date,
        year: sessionInfo.year,
        collection: sessionInfo.collection,
        sourceCollection: sessionInfo.collection,
        region: sessionInfo.region,
        recordingType: sessionInfo.recordingType,
        description: sessionInfo.description,
        isImported: true
      });
    } catch (err) {
      console.error(`Error processing ${track.title}:`, err.message);
    }
  }

  // Write tunes.json
  const jsonPath = path.join(__dirname, 'bonavella-tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(`wrote ${tunes.length} tunes to ${jsonPath}`);
}

main().catch(console.error);
