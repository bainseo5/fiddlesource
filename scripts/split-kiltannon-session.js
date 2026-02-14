/**
 * Script to split Paddy Canny's Kiltannon / Tulla session into individual tracks
 * John Joe Healy Collection Tape 24-1
 * 
 * Recorded in Paddy Canny's home, 15 August 1972
 * Recorded by Chris Delaney (a US research student, during a field trip to Ireland)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPDATE THIS PATH to your actual source file location
// Please download the file from https://www.clarelibrary.ie/eolas/coclare/music/live/kiltannon_JH24-1.htm
// and save it as "JH24-1_Kiltannon_1972.mp3" in the archive folder
const SOURCE_FILE = path.join(__dirname, '../../archive/JH24-1_Kiltannon_15-08-1972_KLICKAUD.mp3');
const OUTPUT_DIR = path.join(__dirname, '../output');

const sessionInfo = {
  id: "kiltannon-1972",
  recordedBy: "Chris Delaney",
  location: "Kiltannon, Tulla",
  date: "1972",
  region: "Tulla",
  collection: "John Joe Healy Collection"
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse timestamp like "01.", "1.19" to seconds
// Note: Input format from website is like "01." (start) or "1.19" (end)
function parseTime(timeStr) {
  if (!timeStr) return null;
  timeStr = timeStr.trim();
  
  // Handle unknown timestamps
  if (timeStr === '?') {
    return null;
  }
  
  // Remove trailing dot if present (e.g., "01.")
  if (timeStr.endsWith('.')) {
      timeStr = timeStr.slice(0, -1);
  }

  const parts = timeStr.split('.');
  
  if (parts.length === 3) {
    // Format: H.MM.SS
    const hours = parts[0] === '' ? 0 : parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // Format: M.SS or MM.SS
    const minutes = parts[0] === '' ? 0 : parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes * 60 + seconds;
  } else if (parts.length === 1) {
    // Format: SS or just a number? assuming seconds if just number? 
    // Or maybe it's just minutes if "01." meant 1 minute?
    // Looking at "01. - 1.19", 01. probably means 0:01.
    // "1.19" means 1:19.
    // If input is "01", let's treat as seconds if small, or minute?
    // Actually the website uses M.SS mostly. "01." is likely 0 minutes 1 second or just marker 1.
    // Let's assume standard parsing:
    // If it was "01", parseInt is 1. We'll verify context.
    return parseInt(timeStr); 
  }
  return 0;
}

// Helper to get artist (mostly Paddy Canny here)
function getArtist(itemNum) {
  return "Paddy Canny";
}

// Helper to get instruments
function getInstruments(itemNum) {
  return "Fiddle";
}

// Track list with timestamps from Clare County Library
// 1. Jig: Paddy Fahy’s (01. - 1.19)
// 2. Jig: ‘G-minor jig’ (familiar in major) (1.52 - 3.19)
// 3. Jig: Cliffs of Moher (3.22 - 4.40)
// 4. Jig: Apples in Winter (4.45 - 6.01)
// 5. Reel: Repeal of the Union (6.05 - 7.26)
// 6. Reel: Bunch of Green Rushes (7.29 - 8.51)
// 7. Jig: Garrett Barry’s (8.52 - 10.14)
// 8. Reel: Silver Spear (10.15 - 11.19)
// 9. Reel: The Tulla (11.21 - 12.15)
const tracks = [
  {
    itemNum: 1,
    id: 'kiltannon-01',
    title: "Paddy Fahy's",
    type: 'Jig',
    start: '0.01', 
    end: '1.19'
  },
  {
    itemNum: 2,
    id: 'kiltannon-02',
    title: "G-minor Jig",
    type: 'Jig',
    start: '1.52',
    end: '3.19'
  },
  {
    itemNum: 3,
    id: 'kiltannon-03',
    title: "Cliffs of Moher",
    type: 'Jig',
    start: '3.22',
    end: '4.40'
  },
  {
    itemNum: 4,
    id: 'kiltannon-04',
    title: "Apples in Winter",
    type: 'Jig',
    start: '4.45',
    end: '6.01'
  },
  {
    itemNum: 5,
    id: 'kiltannon-05',
    title: "Repeal of the Union",
    type: 'Reel',
    start: '6.05',
    end: '7.26'
  },
  {
    itemNum: 6,
    id: 'kiltannon-06',
    title: "Bunch of Green Rushes",
    type: 'Reel',
    start: '7.29',
    end: '8.51'
  },
  {
    itemNum: 7,
    id: 'kiltannon-07',
    title: "Garrett Barry's",
    type: 'Jig',
    start: '8.52',
    end: '10.14'
  },
  {
    itemNum: 8,
    id: 'kiltannon-08',
    title: "Silver Spear",
    type: 'Reel',
    start: '10.15',
    end: '11.19'
  },
  {
    itemNum: 9,
    id: 'kiltannon-09',
    title: "The Tulla",
    type: 'Reel',
    start: '11.21',
    end: '12.15'
  }
];

// Generate tunes.json entries
function generateTuneEntries() {
  const entries = {};
  
  tracks.forEach(track => {
    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);
    
    // Skip tracks with unknown timestamps
    if (startSec === null || endSec === null) {
      return;
    }
    
    const duration = endSec - startSec;
    const artist = getArtist(track.itemNum);
    const instruments = getInstruments(track.itemNum);
    
    entries[track.id] = {
      id: track.id,
      title: track.title,
      artist: artist,
      source: `${sessionInfo.location} (Recorded by ${sessionInfo.recordedBy})`,
      region: sessionInfo.region,
      key: "?",
      tuning: "Standard",
      year: sessionInfo.date,
      // Placeholder URL - will be updated after upload
      audioUrl: `https://res.cloudinary.com/ddtyxauci/video/upload/v1/fiddlesource/${track.id}.mp3`,
      description: `Individual cut from the ${sessionInfo.location} session, ${sessionInfo.date}. Features ${artist}.`,
      genre: "Irish Traditional",
      type: track.type,
      startTime: 0,
      duration: duration,
      sourceCollection: `${sessionInfo.collection} - ${sessionInfo.location}, ${sessionInfo.date}`,
      isImported: false,
      fileCutSource: true,
      instruments: instruments,
      collection: sessionInfo.collection
    };
  });
  
  return entries;
}

// Split audio file
async function splitTrack(track, index, total) {
  const startSec = parseTime(track.start);
  const endSec = parseTime(track.end);
  
  // Skip tracks with unknown timestamps
  if (startSec === null || endSec === null) {
    console.log(`[${index + 1}/${total}] SKIPPED: ${track.title}`);
    console.log(`  ⚠️  Missing timestamp (start: ${track.start}, end: ${track.end})`);
    console.log(`  TODO: Listen to audio and add exact timestamps\n`);
    return;
  }
  
  const duration = endSec - startSec;
  
  // Clean title for filename
  const safeTitle = track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
  
  console.log(`[${index + 1}/${total}] Cutting: ${track.id} - ${track.title}`);
  console.log(`  Time: ${track.start} - ${track.end} (${duration}s)`);
  console.log(`  File: ${outputFile}`);
  
  // Use ffmpeg to extract the segment
  // -ss: start time
  // -t: duration
  // -acodec copy: copy audio stream without re-encoding (faster, no quality loss)
  const command = `ffmpeg -i "${SOURCE_FILE}" -ss ${startSec} -t ${duration} -acodec copy "${outputFile}" -y`;
  
  try {
    await execPromise(command);
    console.log(`  ✓ Saved`);
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
  }
}

// Main execution
async function main() {
  console.log('\n=== Kiltannon / Tulla Session Splitter ===\n');
  console.log(`Source: ${SOURCE_FILE}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Tracks: ${tracks.length}\n`);
  
  // Check if source file exists
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error('ERROR: Source file not found!');
    console.error(`Expected: ${SOURCE_FILE}`);
    console.error('\nPlease download the audio file from the Clare Library website');
    console.error('and save it to the "archive" folder with the name: JH24-1_Kiltannon_1972.mp3');
    process.exit(1);
  }
  
  // Split all tracks
  for (let i = 0; i < tracks.length; i++) {
    await splitTrack(tracks[i], i, tracks.length);
  }
  
  // Generate tune entries
  const tuneEntries = generateTuneEntries();
  const outputPath = path.join(__dirname, 'kiltannon-tunes.json');
  fs.writeFileSync(outputPath, JSON.stringify(tuneEntries, null, 2));
  
  console.log(`\n✓ Generated tune entries: ${outputPath}`);
  console.log(`\n✓ All done! ${tracks.length} tracks extracted.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated kiltannon-tunes.json');
  console.log('2. Merge it into backend/data/tunes.json');
  console.log('3. Upload generated MP3s to Cloudinary (or output folder)');
}

main().catch(console.error);

