
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_AUDIO = String.raw`C:\Users\andre\Documents\tunes\tunes\scripts\archive\JH15_Doyle_Casey_KLICKAUD.mp3`;
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Track listing with timestamps (minutes.seconds format)
const tracks = [
  { title: "The Concert", artists: "U", start: "0.01", end: "0.35", genre: "Reel" },
  { title: "Catherine McEvoy's", artists: "MD", start: "0.36", end: "3.14", genre: "Reel" },
  { title: "Fermoy Lasses (unusual version)", artists: "MD", start: "3.16", end: "5.56", genre: "Reel" },
  { title: "Copperplate", artists: "MD & U", start: "5.59", end: "8.21", genre: "Reel" },
  { title: "The Ewe", artists: "MD & U", start: "8.23", end: "9.24", genre: "Reel" },
  { title: "Mount Famous Hunt", artists: "MD", start: "9.25", end: "12.27", genre: "Set Dance" },
  { title: "Gan ainm", artists: "MD", start: "12.30", end: "14.38", genre: "Hornpipe" },
  { title: "Mason's Apron", artists: "MD", start: "14.39", end: "18.51", genre: "Reel" },
  { title: "Heathery Breeze", artists: "MD & U", start: "18.52", end: "21.07", genre: "Reel" },
  { title: "Boys of Bluehill", artists: "MD", start: "21.08", end: "23.25", genre: "Hornpipe" },
  { title: "Heathery Breeze", artists: "TC", start: "23.27", end: "24.14", genre: "Reel" },
  { title: "Grey Goose (fragment only)", artists: "TC", start: "24.15", end: "24.42", genre: "Jig" },
  { title: "Humours of Bandon", artists: "TC", start: "24.43", end: "25.32", genre: "Jig" },
  { title: "Sporting Nell", artists: "TC", start: "25.34", end: "26.36", genre: "Reel" },
  { title: "Mount Famous Hunt", artists: "TC", start: "26.37", end: "27.58", genre: "Set Dance" },
  { title: "Spike Island Lasses", artists: "TC", start: "28.00", end: "28.45", genre: "Reel" },
  { title: "Maid of Mount Kisko (fragment)", artists: "TC", start: "28.47", end: "28.58", genre: "Reel" }
];

// Parse time in format "minutes.seconds" to total seconds
function parseTime(timeStr) {
  const [minutes, seconds] = timeStr.split('.').map(Number);
  return minutes * 60 + seconds;
}

// Expand artist abbreviations to full names with instruments
function expandArtists(abbrev) {
  const musicians = {
    'MD': 'Miko Doyle (concertina)',
    'TC': 'Thady Casey (fiddle)',
    'U': 'Unknown (whistle)'
  };
  
  let result = abbrev;
  Object.entries(musicians).forEach(([key, val]) => {
     // careful replacement to avoid double replacing if keys overlap, though here they don't
     result = result.replace(new RegExp(`\\b${key}\\b`, 'g'), val);
  });
  return result;
}

async function splitAudio() {
  try {
    console.log(`Checking source: ${SOURCE_AUDIO}`);
    await fs.access(SOURCE_AUDIO);
    
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const metadata = {};
    const collectionName = "John Joe Healy Collection - JH15";

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const trackNum = String(i + 1).padStart(2, '0');
      const safeTitle = track.title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
      const outputFilename = `jh15-${trackNum}-${safeTitle}.mp3`;
      const outputPath = path.join(OUTPUT_DIR, outputFilename);
      
      const startTime = parseTime(track.start);
      // If end time is missing or smaller than start (wrap around?), use duration
      // But here we have end times.
      const endTime = parseTime(track.end);
      const duration = endTime - startTime;

      if (duration <= 0) {
          console.warn(`Skipping ${track.title} due to invalid duration`);
          continue;
      }

      console.log(`Extracting Track ${trackNum}: ${track.title} (${duration}s)...`);
      
      // ffmpeg command to cut audio
      // -ss start_time -t duration -i input -c copy output
      // Note: placing -ss before -i is faster/more accurate for seek
      const cmd = `ffmpeg -y -ss ${startTime} -t ${duration} -i "${SOURCE_AUDIO}" -c copy "${outputPath}"`;
      
      await execAsync(cmd);
      
      // Add to metadata
      const id = `jh15-${trackNum}`;
      metadata[id] = {
        id,
        title: track.title,
        artist: expandArtists(track.artists),
        source: collectionName,
        region: "Spanish Point, Clare",
        key: "?",
        tuning: "Standard",
        year: "Unknown", // "Date and venue unknown" per source
        audioUrl: "", // To be filled after upload
        description: `Track ${trackNum} from ${collectionName}.`,
        genre: "Irish Traditional",
        type: track.genre,
        startTime: 0,
        duration: Math.round(duration),
        sourceCollection: collectionName,
        isImported: false, // Local cut
        fileCutSource: true,
        instruments: expandArtists(track.artists), // Store instruments here too
        collection: "John Joe Healy Collection",
        recordingType: "field-recording" 
      };
    }

    // Save metadata to JSON
    const jsonPath = path.join(__dirname, 'jh15-tunes.json');
    await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));
    console.log(`Splitting complete! Metadata saved to ${jsonPath}`);

  } catch (error) {
    console.error('Error splitting audio:', error);
  }
}

splitAudio();
