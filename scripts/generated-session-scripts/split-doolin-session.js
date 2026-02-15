/**
 * Script to split O'Connor's Bar Doolin session into individual tracks
 * BR Taylor Collection Tape 085
 * 
 * Recorded in O'Connor's Bar, Fisherstreet, Doolin, 1962
 * Recorded by Joe Vaughan, Miltown Malbay
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
const SOURCE_FILE = path.join(__dirname, '../../archive/T85_Doolin_1962_KLICKAUD.mp3');
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse timestamp like ".01", "1.49", or "1.02.22" to seconds
function parseTime(timeStr) {
  timeStr = timeStr.trim();
  
  // Handle unknown timestamps
  if (timeStr === '?') {
    return null;
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
  }
  
  return 0;
}

// Session metadata
const sessionInfo = {
  location: "O'Connor's Bar, Doolin",
  musicians: "Micho Russell, Peadar O'Loughlin, Willie Shannon, Paddy Killourhy",
  defaultArtist: "Micho Russell, Peadar O'Loughlin, Willie Shannon, Paddy Killourhy",
  date: "1962",
  recordedBy: "Joe Vaughan",
  collection: "BR Taylor Collection - O'Connor's Bar Session, 1962",
  region: "Doolin"
};

// Get artist based on item number and markers
function getArtist(itemNum, title) {
  // Items 12 & 44: Micho Russell
  if (itemNum === 12 || itemNum === 44) {
    return "Micho Russell";
  }
  // Item 40: Paddy Killourhy, fiddle solo
  if (itemNum === 40) {
    return "Paddy Killourhy";
  }
  // Items marked (WC) include Willie Clancy
  if (title.includes('(WC)')) {
    return "Willie Clancy";
  }
  // Items marked (JC) include Joe Cuneen
  if (title.includes('(JC)')) {
    return "Joe Cuneen";
  }
  // Default
  return sessionInfo.defaultArtist;
}

// Get instruments based on item number and markers
function getInstruments(itemNum, title) {
  if (itemNum === 12 || itemNum === 44) {
    return "Tin whistle (Micho Russell)";
  }
  if (itemNum === 40) {
    return "Fiddle (Paddy Killourhy)";
  }
  if (title.includes('(WC)')) {
    return "Uilleann pipes (Willie Clancy)";
  }
  if (title.includes('(JC)')) {
    return "Whistle and bodhrán (Joe Cuneen)";
  }
  if (itemNum === 45) {
    return "Flute and lilting";
  }
  if (itemNum === 46) {
    return "Fiddle and flute";
  }
  return "Tin whistle (Micho Russell), Fiddle (Peadar O'Loughlin, Willie Shannon), Accordion (Paddy Killourhy)";
}

// Track list with timestamps from Clare County Library
const tracks = [
  // Item 1 - Split into individual tunes
  {
    itemNum: 1,
    id: 'doolin-01a',
    title: "Down the Broom",
    type: 'Reel',
    start: '.01',
    end: '1.09'
  },
  {
    itemNum: 1,
    id: 'doolin-01b',
    title: "Gatehouse Maid",
    type: 'Reel',
    start: '1.09',
    end: '1.49'
  },
  {
    itemNum: 2,
    id: 'doolin-02',
    title: "Coleman's Cross",
    type: 'Reel',
    start: '1.52',
    end: '3.20'
  },
  // Item 3 - Split into individual tunes (TODO: find exact split point)
  {
    itemNum: 3,
    id: 'doolin-03a',
    title: "Galway Rambler",
    type: 'Reel',
    start: '3.24',
    end: '4.11' // TODO: Listen to find where it ends
  },
  {
    itemNum: 3,
    id: 'doolin-03b',
    title: "Sheehan's (Wellington)",
    type: 'Reel',
    start: '4.11', // TODO: Listen to find where it starts
    end: '4.47'
  },
  {
    itemNum: 4,
    id: 'doolin-04',
    title: "McKenna's No.2",
    type: 'Reel',
    start: '4.49',
    end: '5.33'
  },
  // Item 5 - Split into individual tunes (TODO: find exact split point)
  {
    itemNum: 5,
    id: 'doolin-05a',
    title: "Old Bush",
    type: 'Reel',
    start: '5.34',
    end: '6.35' // TODO: Listen to find where it ends
  },
  {
    itemNum: 5,
    id: 'doolin-05b',
    title: "Galtee",
    type: 'Reel',
    start: '6.34', // TODO: Listen to find where it starts
    end: '7.44'
  },
  // Item 6 - Split into individual tunes (TODO: find exact split point)
  {
    itemNum: 6,
    id: 'doolin-06a',
    title: "Ladies Pantalettes",
    type: 'Reel',
    start: '7.45',
    end: '8.34' // TODO: Listen to find where it ends
  },
  {
    itemNum: 6,
    id: 'doolin-06b',
    title: "Collier's",
    type: 'Reel',
    start: '8.32', // TODO: Listen to find where it starts
    end: '9.17'
  },
  {
    itemNum: 7,
    id: 'doolin-07',
    title: "Micho Russell's",
    type: 'Reel',
    start: '9.20',
    end: '10.37'
  },
  {
    itemNum: 8,
    id: 'doolin-08',
    title: "Micho Russell's",
    type: 'Reel',
    start: '10.39',
    end: '11.33'
  },
  {
    itemNum: 9,
    id: 'doolin-09',
    title: "Lovely Erin",
    type: 'Waltz',
    start: '11.35',
    end: '13.14'
  },
  {
    itemNum: 10,
    id: 'doolin-10',
    title: "Four Poster Bed",
    type: 'Jig',
    start: '13.15',
    end: '14.43'
  },
  {
    itemNum: 11,
    id: 'doolin-11',
    title: "Spike Island Lasses",
    type: 'Reel',
    start: '14.46',
    end: '16.02'
  },
  {
    itemNum: 12,
    id: 'doolin-12',
    title: "Christmas Eve",
    type: 'Reel',
    start: '16.04',
    end: '17.14'
  },
  {
    itemNum: 13,
    id: 'doolin-13',
    title: "Christmas Eve (all)",
    type: 'Reel',
    start: '17.18',
    end: '19.16'
  },
  {
    itemNum: 14,
    id: 'doolin-14',
    title: "House on the Hill",
    type: 'Reel',
    start: '19.19',
    end: '21.02'
  },
  {
    itemNum: 15,
    id: 'doolin-15',
    title: "Trip to Durrow",
    type: 'Reel',
    start: '21.05',
    end: '21.41'
  },
  {
    itemNum: 16,
    id: 'doolin-16',
    title: "Rakish Paddy",
    type: 'Reel',
    start: '21.45',
    end: '23.08'
  },
  {
    itemNum: 17,
    id: 'doolin-17',
    title: "Sporting Nell",
    type: 'Reel',
    start: '23.10',
    end: '25.28'
  },
  {
    itemNum: 18,
    id: 'doolin-18',
    title: "Johnny Cronin's (WC)",
    type: 'Reel',
    start: '25.31',
    end: '27.03'
  },
  {
    itemNum: 19,
    id: 'doolin-19',
    title: "Wicklow (WC)",
    type: 'Hornpipe',
    start: '27.06',
    end: '29.45'
  },
  {
    itemNum: 20,
    id: 'doolin-20',
    title: "Rakish Paddy (WC)",
    type: 'Reel',
    start: '29.47',
    end: '31.29'
  },
  {
    itemNum: 21,
    id: 'doolin-21',
    title: "Green Fields of America",
    type: 'Reel',
    start: '31.30',
    end: '33.19'
  },
  {
    itemNum: 22,
    id: 'doolin-22',
    title: "Steampacket",
    type: 'Reel',
    start: '33.21',
    end: '34.53'
  },
  {
    itemNum: 23,
    id: 'doolin-23',
    title: "Rambling Pitchfork (WC)",
    type: 'Jig',
    start: '34.54',
    end: '36.24'
  },
  {
    itemNum: 24,
    id: 'doolin-24',
    title: "Flogging (WC)",
    type: 'Reel',
    start: '36.26',
    end: '38.10'
  },
  {
    itemNum: 25,
    id: 'doolin-25',
    title: "Morning Star (WC)",
    type: 'Reel',
    start: '38.13',
    end: '39.38'
  },
  {
    itemNum: 26,
    id: 'doolin-26',
    title: "Jenny Picking Cockles (WC)",
    type: 'Reel',
    start: '39.41',
    end: '41.15'
  },
  {
    itemNum: 27,
    id: 'doolin-27',
    title: "Piper's Chair (WC)",
    type: 'Jig',
    start: '41.18',
    end: '42.52'
  },
  {
    itemNum: 28,
    id: 'doolin-28',
    title: "Rolling in the Barrel (WC)",
    type: 'Reel',
    start: '42.54',
    end: '44.06'
  },
  {
    itemNum: 29,
    id: 'doolin-29',
    title: "Frieze Britches – fragment (WC)",
    type: 'Jig',
    start: '44.11',
    end: '44.40'
  },
  {
    itemNum: 30,
    id: 'doolin-30',
    title: "Heathery Breeze (WC)",
    type: 'Reel',
    start: '44.41',
    end: '45.12'
  },
  {
    itemNum: 31,
    id: 'doolin-31',
    title: "Fermoy Lasses",
    type: 'Reel',
    start: '45.13',
    end: '45.57'
  },
  {
    itemNum: 32,
    id: 'doolin-32',
    title: "Black Rogue",
    type: 'Jig',
    start: '46.00',
    end: '46.26'
  },
  {
    itemNum: 33,
    id: 'doolin-33',
    title: "Steampacket",
    type: 'Reel',
    start: '46.28',
    end: '47.55'
  },
  {
    itemNum: 34,
    id: 'doolin-34',
    title: "Humours of Lissadell",
    type: 'Reel',
    start: '47.56',
    end: '50.39'
  },
  {
    itemNum: 35,
    id: 'doolin-35',
    title: "Tim Maloney's",
    type: 'Reel',
    start: '50.40',
    end: '52.00'
  },
  {
    itemNum: 36,
    id: 'doolin-36',
    title: "Humours of Ballymote",
    type: 'Polka',
    start: '52.02',
    end: '52.53'
  },
  {
    itemNum: 37,
    id: 'doolin-37',
    title: "Bunch of Keys",
    type: 'Reel',
    start: '52.58',
    end: '53.56'
  },
  {
    itemNum: 38,
    id: 'doolin-38',
    title: "Flax in Bloom",
    type: 'Reel',
    start: '53.58',
    end: '55.22'
  },
  {
    itemNum: 39,
    id: 'doolin-39',
    title: "My Charming ?",
    type: 'Song',
    start: '55.24',
    end: '58.51'
  },
  // Item 40 - Split into individual tunes (TODO: find exact split point)
  {
    itemNum: 40,
    id: 'doolin-40a',
    title: "Miss McLeod's",
    type: 'Reel',
    start: '58.53',
    end: '1.00.53' // TODO: Listen to find where it ends
  },
  {
    itemNum: 40,
    id: 'doolin-40b',
    title: "Philip O'Beirne's Delight",
    type: 'Reel',
    start: '1.00.52', // TODO: Listen to find where it starts
    end: '1.02.19'
  },
  {
    itemNum: 41,
    id: 'doolin-41',
    title: "Gan ainm (JC)",
    type: 'Reel',
    start: '1.02.22',
    end: '1.03.53'
  },
  {
    itemNum: 42,
    id: 'doolin-42',
    title: "Sligo Maid (JC)",
    type: 'Reel',
    start: '1.04.07',
    end: '1.05.25'
  },
  {
    itemNum: 43,
    id: 'doolin-43',
    title: "Bonaparte's Retreat (JC)",
    type: 'Set Dance',
    start: '1.05.27',
    end: '1.06.53'
  },
  {
    itemNum: 44,
    id: 'doolin-44',
    title: "Little Fisher Boy",
    type: 'Song',
    start: '1.06.54',
    end: '1.08.58'
  },
  {
    itemNum: 45,
    id: 'doolin-45',
    title: "Touch Me if You Dare",
    type: 'Reel',
    start: '1.08.59',
    end: '1.09.56'
  },
  {
    itemNum: 46,
    id: 'doolin-46',
    title: "Colonel Frazier's",
    type: 'Reel',
    start: '1.09.58',
    end: '1.11.46'
  },
  {
    itemNum: 47,
    id: 'doolin-47',
    title: "Gan ainm",
    type: 'Hornpipe',
    start: '1.11.47',
    end: '1.14.25'
  },
  {
    itemNum: 48,
    id: 'doolin-48',
    title: "Liffey Banks",
    type: 'Reel',
    start: '1.14.28',
    end: '1.15.59'
  },
  {
    itemNum: 49,
    id: 'doolin-49',
    title: "College Groves",
    type: 'Reel',
    start: '1.16.01',
    end: '1.17.40'
  },
  {
    itemNum: 50,
    id: 'doolin-50',
    title: "Gan ainm",
    type: 'Reel',
    start: '1.17.42',
    end: '1.19.47'
  },
  // Item 51 - Split into individual tunes (TODO: find exact split point)
  {
    itemNum: 51,
    id: 'doolin-51a',
    title: "Wind that Shakes the Barley",
    type: 'Reel',
    start: '1.19.50',
    end: '1.20.56' // TODO: Listen to find where it ends
  },
  {
    itemNum: 51,
    id: 'doolin-51b',
    title: "Last Night's Fun",
    type: 'Reel',
    start: '1.20.55', // TODO: Listen to find where it starts
    end: '1.22.02'
  },
  {
    itemNum: 52,
    id: 'doolin-52',
    title: "Pigeon on the Gate (fragment)",
    type: 'Reel',
    start: '1.22.02',
    end: '1.22.22'
  },
  {
    itemNum: 53,
    id: 'doolin-53',
    title: "Christmas Eve",
    type: 'Reel',
    start: '1.22.24',
    end: '1.23.39'
  },
  {
    itemNum: 54,
    id: 'doolin-54',
    title: "Mountain Road",
    type: 'Reel',
    start: '1.23.42',
    end: '1.25.02'
  },
  // Item 55 - Split into individual tunes (TODO: find exact split points)
  {
    itemNum: 55,
    id: 'doolin-55a',
    title: "Tarbolton",
    type: 'Reel',
    start: '1.25.04',
    end: '1.26.16' // TODO: Listen to find where it ends
  },
  {
    itemNum: 55,
    id: 'doolin-55b',
    title: "Longford Collector",
    type: 'Reel',
    start: '1.26.15', // TODO: Listen to find where it starts
    end: '1.27.38' // TODO: Listen to find where it ends
  },
  {
    itemNum: 55,
    id: 'doolin-55c',
    title: "Sailor's Bonnet",
    type: 'Reel',
    start: '1.27.37', // TODO: Listen to find where it starts
    end: '1.28.09'
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
    const artist = getArtist(track.itemNum, track.title);
    const instruments = getInstruments(track.itemNum, track.title);
    // Determine source URL
    let sourceUrl = "https://www.clarelibrary.ie/eolas/coclare/music/live/index_live.htm";
    // If track or session is from Cooley tapes, use Cooley site
    // Example logic: if sessionInfo.collection or track.title includes 'Cooley', update sourceUrl
    if (
      (sessionInfo.collection && sessionInfo.collection.toLowerCase().includes('cooley')) ||
      (track.title && track.title.toLowerCase().includes('cooley'))
    ) {
      sourceUrl = "https://joecooleytapes.org/";
    }
    entries[track.id] = {
      id: track.id,
      title: track.title,
      artist: artist,
      source: `${sessionInfo.location} (Recorded by ${sessionInfo.recordedBy})`,
      region: sessionInfo.region,
      key: "?",
      tuning: "Standard",
      year: sessionInfo.date,
      audioUrl: `/audio/${track.id}.mp3`,
      description: `Individual cut from the ${sessionInfo.location} session, ${sessionInfo.date}. Features ${artist}.\nOriginal source: ${sourceUrl}`,
      genre: "Irish Traditional",
      type: track.type,
      startTime: 0,
      duration: duration,
      sourceCollection: sessionInfo.collection,
      isImported: false,
      fileCutSource: true,
      instruments: instruments,
      collection: "BR Taylor Collection"
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
  
  const outputFile = path.join(OUTPUT_DIR, `${track.id}.mp3`);
  
  console.log(`[${index + 1}/${total}] Cutting: ${track.title}`);
  console.log(`  Time: ${track.start} - ${track.end} (${duration}s)`);
  console.log(`  Artist: ${getArtist(track.itemNum, track.title)}`);
  
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
  console.log('\n=== Doolin Session Splitter ===\n');
  console.log(`Source: ${SOURCE_FILE}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Tracks: ${tracks.length}\n`);
  
  // Check if source file exists
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error('ERROR: Source file not found!');
    console.error(`Expected: ${SOURCE_FILE}`);
    console.error('\nPlease update SOURCE_FILE path in this script to match your download location.');
    process.exit(1);
  }
  
  // Split all tracks
  for (let i = 0; i < tracks.length; i++) {
    await splitTrack(tracks[i], i, tracks.length);
  }
  
  // Generate tune entries
  const tuneEntries = generateTuneEntries();
  const outputPath = path.join(__dirname, 'doolin-tunes.json');
  fs.writeFileSync(outputPath, JSON.stringify(tuneEntries, null, 2));
  
  console.log(`\n✓ Generated tune entries: ${outputPath}`);
  console.log(`\n✓ All done! ${tracks.length} tracks extracted.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated doolin-tunes.json');
  console.log('2. Merge it into backend/data/tunes.json');
  console.log('3. Run the key-finding script on the new tunes');
  console.log('4. Upload MP3s to Cloudinary');
  console.log('5. Update audioUrls in tunes.json with Cloudinary URLs');
}

main().catch(console.error);
