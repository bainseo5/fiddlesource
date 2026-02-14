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

const SOURCE_FILE = 'C:\\Users\\andre\\Downloads\\T19-2_Session_Kattys_Bar_Mullagh_11-07-76_KLICKAUD.mp3';
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse timestamp like "2.35" or ".02" to seconds
function parseTime(timeStr) {
  const parts = timeStr.trim().split('.');
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
const tracks = [
  {
    id: 'mullagh-01',
    title: "Reels (2): Boys of Ballisodare/Hare's Paw",
    genre: 'Reel',
    start: '.02',
    end: '2.15'
  },
  {
    id: 'mullagh-02',
    title: "Reels (3): Mamma's Pet/Bloom of Youth/Heathery Breeze",
    genre: 'Reel',
    start: '2.35',
    end: '5.45'
  },
  {
    id: 'mullagh-03',
    title: "Reels (3): Down the Broom/Gatehouse Maid/Ivy Leaf",
    genre: 'Reel',
    start: '5.58',
    end: '9.26'
  },
  {
    id: 'mullagh-04',
    title: "Reels (2): Old Torn Petticoat/Green Fields of America",
    genre: 'Reel',
    start: '9.29',
    end: '12.16'
  },
  {
    id: 'mullagh-05',
    title: "Reels (3): Kerry Reel/Morning Dew/Woman of the House",
    genre: 'Reel',
    start: '13.02',
    end: '16.18'
  },
  {
    id: 'mullagh-06',
    title: "Jigs (2): Apples in Winter/Trip to Sligo",
    genre: 'Jig',
    start: '16.54',
    end: '19.22'
  },
  {
    id: 'mullagh-07',
    title: "Reels (2): Five Mile Chase/Abbey Reel",
    genre: 'Reel',
    start: '19.25',
    end: '21.22'
  },
  {
    id: 'mullagh-08',
    title: "Reels (2): Jackie Coleman's/Bucks of Oranmore",
    genre: 'Reel',
    start: '21.29',
    end: '24.36'
  },
  {
    id: 'mullagh-09',
    title: "Reel: John Dwyer's",
    genre: 'Reel',
    start: '24.47',
    end: '25.57'
  },
  {
    id: 'mullagh-10',
    title: "Reel: Salamanca",
    genre: 'Reel',
    start: '26.35',
    end: '28.54'
  },
  {
    id: 'mullagh-11',
    title: "Reels (2): Shaskeen/Molloy's Favourite",
    genre: 'Reel',
    start: '29.02',
    end: '31.46'
  },
  {
    id: 'mullagh-12',
    title: "Reels (2): Paddy Murphy's Wife/Stony Steps",
    genre: 'Reel',
    start: '31.50',
    end: '33.49'
  },
  {
    id: 'mullagh-13',
    title: "Hornpipe: Blackbird",
    genre: 'Hornpipe',
    start: '33.53',
    end: '34.49'
  },
  {
    id: 'mullagh-14',
    title: "Reel: Rakish Paddy",
    genre: 'Reel',
    start: '35.11',
    end: '36.47'
  },
  {
    id: 'mullagh-15',
    title: "Reels (3): Tarbolton/Longford Collector/Sailor's Bonnet",
    genre: 'Reel',
    start: '37.09',
    end: '40.50'
  },
  {
    id: 'mullagh-16',
    title: "Reels (2): O'Rourke's/Wild Irishman",
    genre: 'Reel',
    start: '41.08',
    end: '42.07'
  },
  {
    id: 'mullagh-17',
    title: "Set dance: Job of Journeywork",
    genre: 'Set Dance',
    start: '42.27',
    end: '44.23'
  },
  {
    id: 'mullagh-18',
    title: "Set dances (2): Rodney's Glory/Mount Famous Hunt",
    genre: 'Set Dance',
    start: '44.28',
    end: '47.28'
  }
];

// Generate tunes.json entries
function generateTuneEntries() {
  const entries = {};
  
  tracks.forEach(track => {
    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);
    const duration = endSec - startSec;
    
    entries[track.id] = {
      id: track.id,
      title: track.title,
      artist: sessionInfo.musicians,
      source: `${sessionInfo.location} (Recorded by ${sessionInfo.recordedBy})`,
      region: sessionInfo.region,
      key: "?",
      tuning: "Standard",
      year: "1976",
      audioUrl: `/audio/${track.id}.mp3`,
      description: `Individual cut from the ${sessionInfo.location} session, ${sessionInfo.date}. Features ${sessionInfo.musicians}.`,
      genre: track.genre,
      startTime: 0,
      duration: duration,
      sourceCollection: sessionInfo.collection,
      isImported: false,
      fileCutSource: true
    };
  });
  
  return entries;
}

// Split audio file
async function splitTrack(track, index, total) {
  const startSec = parseTime(track.start);
  const endSec = parseTime(track.end);
  const duration = endSec - startSec;
  
  const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
  
  console.log(`[${index + 1}/${total}] Cutting: ${track.title}`);
  console.log(`  Time: ${track.start} - ${track.end} (${duration}s)`);
  
  // Use ffmpeg to extract the segment
  const command = `ffmpeg -i "${SOURCE_FILE}" -ss ${startSec} -t ${duration} -acodec copy "${outputFile}" -y`;
  
  try {
    await execPromise(command);
    console.log(`  ✓ Saved: ${track.id}.mp3`);
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
  }
}

// Main execution
async function main() {
  console.log('\n=== Mullagh Session Splitter ===\n');
  console.log(`Source: ${SOURCE_FILE}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Tracks: ${tracks.length}\n`);
  
  // Check if source file exists
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error('ERROR: Source file not found!');
    console.error(`Expected: ${SOURCE_FILE}`);
    process.exit(1);
  }
  
  // Split all tracks
  for (let i = 0; i < tracks.length; i++) {
    await splitTrack(tracks[i], i, tracks.length);
  }
  
  // Generate tune entries
  const tuneEntries = generateTuneEntries();
  const outputPath = path.join(__dirname, 'mullagh-tunes.json');
  fs.writeFileSync(outputPath, JSON.stringify(tuneEntries, null, 2));
  
  console.log(`\n✓ Generated tune entries: ${outputPath}`);
  console.log(`\n✓ All done! ${tracks.length} tracks extracted.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated mullagh-tunes.json');
  console.log('2. Merge it into backend/data/tunes.json');
  console.log('3. Run the key-finding script on the new tunes');
}

main().catch(console.error);
