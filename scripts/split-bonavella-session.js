import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_AUDIO = String.raw`C:\Users\andre\Downloads\JH12_Bonavella_1961_KLICKAUD.mp3`;
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Track listing with timestamps (minutes.seconds format)
const tracks = [
  { title: "Reels (2): Green Groves of Erin/Ivy Leaf", artists: "WC (& SE?)", start: "0.02", end: "2.25", genre: "Reel" },
  { title: "Jigs (2): Maid in the Meadow/Rambling Pitchfork", artists: "WC (& SE?)", start: "2.28", end: "4.27", genre: "Jig" },
  { title: "Set dance: Rodney's Glory", artists: "WC (& SE?)", start: "4.29", end: "6.18", genre: "Set dance" },
  { title: "Reel: Flogging Reel", artists: "WC (& SE?)", start: "6.19", end: "7.73", genre: "Reel" },
  { title: "Jig: Billy O'Donnell's", artists: "JC, AC & IC", start: "7.39", end: "8.43", genre: "Jig" },
  { title: "Reel: Sporting Paddy", artists: "JC, AC & IC", start: "8.44", end: "9.38", genre: "Reel" },
  { title: "Reels (2): Boys of Ballisodare/Hare's Paw?", artists: "JC, AC & IC", start: "9.54", end: "11.18", genre: "Reel" },
  { title: "Jig: Geese in the Bog", artists: "JC & AC", start: "11.21", end: "13.52", genre: "Jig" },
  { title: "Reel: Lucy Campbell", artists: "JC & AC", start: "13.57", end: "15.06", genre: "Reel" },
  { title: "Reel: Wheels of the World", artists: "WC & JC", start: "15.08", end: "16.21", genre: "Reel" },
  { title: "Reel: Down the Broom", artists: "WC & JC", start: "16.28", end: "18.15", genre: "Reel" },
  { title: "Jig: Frieze Britches", artists: "WC & JC", start: "18.17", end: "20.52", genre: "Jig" },
  { title: "Song: Long A-Growing", artists: "SE", start: "20.58", end: "25.00", genre: "Song" },
  { title: "Jigs (2): Monk's/Rambling Pitchfork", artists: "SE", start: "25.17", end: "28.00", genre: "Jig" },
  { title: "Jigs (2): Ask my Father (single jig)/Dusty Miller (slip jig)", artists: "SE", start: "28.06", end: "30.52", genre: "Jig" },
  { title: "Reels (3): Hand Me Down the Tackle/Dublin/Silver Spear", artists: "SE", start: "31.02", end: "35.46", genre: "Reel" },
  { title: "Set Dance: Ace and Deuce of Piping", artists: "SE", start: "35.58", end: "38.07", genre: "Set dance" },
  { title: "Reel: Jenny's Wedding (accompaniment to set dancing)", artists: "WC & JC", start: "38.08", end: "39.17", genre: "Reel" },
  { title: "Jig: Mist Covered Mountain/Garrett Barry's?", artists: "WC & JC", start: "39.19", end: "41.26", genre: "Jig" },
  { title: "Reels (2): Dairy Maid/Flax in Bloom", artists: "WC & JC", start: "41.29", end: "43.24", genre: "Reel" }
];

// Parse time in format "minutes.seconds" to total seconds
function parseTime(timeStr) {
  const [minutes, seconds] = timeStr.split('.').map(Number);
  return minutes * 60 + seconds;
}

// Expand artist abbreviations to full names with instruments
function expandArtists(abbrev) {
  const musicians = {
    'WC': 'Willie Clancy (uilleann pipes)',
    'SE': 'Seamus Ennis (uilleann pipes)',
    'JC': 'Martin \'Junior\' Crehan (fiddle)',
    'AC': 'Angela Crehan (whistle, piano)',
    'IC': 'Ita Crehan (whistle)'
  };
  
  // Handle patterns like "WC (& SE?)" or "JC, AC & IC"
  let result = abbrev;
  Object.entries(musicians).forEach(([code, name]) => {
    result = result.replace(new RegExp(`\\b${code}\\b`, 'g'), name);
  });
  
  // Clean up formatting
  result = result.replace(/\(\s*&\s*/g, '& ');
  result = result.replace(/\?\)/g, '');
  result = result.replace(/\s+/g, ' ');
  
  return result;
}

async function main() {
  console.log('\n=== Bonavella Session Splitter ===\n');
  console.log('Source:', SOURCE_AUDIO);
  console.log('Output:', OUTPUT_DIR);
  console.log(`Tracks: ${tracks.length}\n`);

  const tuneEntries = [];

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const trackNum = String(i + 1).padStart(2, '0');
    const outputFile = path.join(OUTPUT_DIR, `bonavella-${trackNum}.mp3`);
    
    const startSeconds = parseTime(track.start);
    const endSeconds = parseTime(track.end);
    const duration = endSeconds - startSeconds;
    
    console.log(`[${i + 1}/${tracks.length}] Cutting: ${track.title}`);
    console.log(`  Start: ${track.start} (${startSeconds}s) Duration: ${duration.toFixed(2)}s`);
    
    // Use ffmpeg to extract the segment
    const ffmpegCmd = `ffmpeg -i "${SOURCE_AUDIO}" -ss ${startSeconds} -t ${duration} -acodec libmp3lame -q:a 2 -y "${outputFile}"`;
    
    try {
      await execAsync(ffmpegCmd);
      console.log(`  ✓ Saved: bonavella-${trackNum}.mp3\n`);
      
      // Create tune entry
      const tuneId = `bonavella-${trackNum}`;
      const artists = expandArtists(track.artists);
      
      tuneEntries.push({
        id: tuneId,
        title: track.title,
        artist: artists,
        source: "Crehans' Home, Bonavella Session (Recorded by Martin Talty for Timmy Casey)",
        region: "Mullagh",
        key: "?",
        tuning: "Standard",
        year: "1961",
        audioUrl: `/audio/${tuneId}.mp3`,
        description: `Individual cut from the Crehans' Home session in Bonavella, Mullagh, 10th October 1961. Features ${artists}.`,
        genre: track.genre,
        startTime: startSeconds,
        duration: duration,
        sourceCollection: "John Joe Healy Collection Tape 12",
        isImported: false,
        fileCutSource: true
      });
      
    } catch (error) {
      console.error(`  ✗ Error cutting track ${i + 1}:`, error.message);
    }
  }
  
  // Save tune entries to JSON
  const tunesJsonPath = path.join(__dirname, 'bonavella-tunes.json');
  await fs.writeFile(tunesJsonPath, JSON.stringify(tuneEntries, null, 2));
  console.log(`\n✓ Generated ${tuneEntries.length} tune entries`);
  console.log(`✓ Saved to: ${tunesJsonPath}`);
}

main().catch(console.error);
