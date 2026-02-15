
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path based on where this script lives (scripts/) relative to backend/data/tunes.json
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const ACCOMPANIMENT_INSTRUMENTS = [
  'piano', 
  'guitar', 
  'bouzouki', 
  'bodhran', 
  'bodhrán', 
  'keyboard', 
  'organ', 
  'bones', 
  'spoons', 
  'drum',
  'drums'
];

const KNOWN_INSTRUMENTS = [
  'accordion', 'button accordion', 'piano accordion', 'melodeon',
  'fiddle', 'violin',
  'flute', 'concert flute', 'wooden flute',
  'whistle', 'tin whistle', 'penny whistle', 'low whistle',
  'uilleann pipes', 'pipes', 'bagpipes',
  'concertina', 'anglo concertina',
  'banjo', 'tenor banjo',
  'mandolin',
  'harmonica', 'mouth organ',
  'piano', 'keyboards',
  'guitar',
  'bouzouki',
  'bodhran', 'bodhrán',
  'drums', 'snare drum',
  'bones', 'spoons'
];

function isInstrument(str) {
    return KNOWN_INSTRUMENTS.includes(str.toLowerCase());
}

async function updateTunes() {
  console.log(`Reading ${TUNES_FILE}...`);
  if (!fs.existsSync(TUNES_FILE)) {
    console.error('File not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(TUNES_FILE, 'utf-8');
  let tunes;
  
  // Handle both array and dictionary format
  try {
    const json = JSON.parse(rawData);
    if (Array.isArray(json)) {
      tunes = json;
    } else {
      // If dictionary id -> tune
      tunes = Object.values(json);
    }
  } catch (e) {
    console.error("Failed to parse JSON", e);
    process.exit(1);
  }

  let updateCount = 0;
  let soloCount = 0;
  let dictionaryFormat = !Array.isArray(JSON.parse(rawData));

  const updatedTunesMap = dictionaryFormat ? JSON.parse(rawData) : {};
  const updatedTunesList = [];

  for (const tune of tunes) {
    let modified = false;

    // 1. Update Artist from Instruments
    if (tune.instruments) {
      // Parse instruments: "Accordion (Joe Cooley)", "Paddy Fahy (fiddle)"
      const parts = tune.instruments.split(',').map(s => s.trim());
      
      const artists = [];
      let melodyCount = 0;

      for (const part of parts) {
        const match = part.match(/^([^(]+)\(([^)]+)\)$/);
        
        if (match) {
          const partA = match[1].trim();
          const partB = match[2].trim();
          
          let instrument = "";
          let artistName = "";

          // Determine which part is the instrument
          if (isInstrument(partA)) {
            // Case: Accordion (Joe Cooley)
            instrument = partA;
            artistName = partB;
          } else if (isInstrument(partB)) {
             // Case: Paddy Fahy (fiddle)
             instrument = partB;
             artistName = partA;
          } else {
             // Fallback: Default to Instrument (Artist) if ambiguous
             // but if part B is definitely NOT an instrument (e.g. a name), and part A IS NOT an instrument
             // we are in trouble. But usually one IS an instrument.
             
             // If neither is in our known list, rely on heuristics or keep existing "Instrument (Artist)" assumption
             instrument = partA;
             artistName = partB;
          }
          
          artists.push(artistName);

          // Check if melody instrument
          const isAccompaniment = ACCOMPANIMENT_INSTRUMENTS.some(acc => instrument.toLowerCase().includes(acc));
          if (!isAccompaniment) {
            melodyCount++;
          }
        } 
      }

      // Update Artist string if musicians found
      if (artists.length > 0) {
        // Filter out duplicates and "unknown" or "?" placeholders
        const uniqueArtists = [...new Set(artists)].filter(a => a !== '?' && a.toLowerCase() !== 'unknown');
        
        if (uniqueArtists.length > 0) {
            const newArtistString = uniqueArtists.join(', ');

            if (tune.artist !== newArtistString) {
                // Only update if instruments structure implies we have valid data
                if (tune.instruments.includes('(')) {
                     // console.log(`Updating ${tune.id}: "${tune.artist}" -> "${newArtistString}"`);
                     tune.artist = newArtistString;
                     modified = true;
                }
            }
        }
      }

      // 2. Logic for Solo vs Session
      if (melodyCount === 1) {
        if (tune.recordingType !== 'solo') {
          tune.recordingType = 'solo';
          modified = true;
          soloCount++;
        }
      } else if (melodyCount > 1) {
         if (tune.recordingType === 'solo') {
             tune.recordingType = 'session';
             modified = true;
         }
      }
    }

    if (modified) updateCount++;
    
    if (dictionaryFormat) {
        updatedTunesMap[tune.id] = tune;
    } else {
        updatedTunesList.push(tune);
    }
  }

  console.log(`Updated ${updateCount} tunes.`);
  
  const finalOutput = dictionaryFormat ? updatedTunesMap : updatedTunesList;
  
  const backupPath = path.join(__dirname, `../backend/data/tunes.backup.${Date.now()}.json`);
  fs.copyFileSync(TUNES_FILE, backupPath);
  console.log(`Backup saved to ${backupPath}`);

  fs.writeFileSync(TUNES_FILE, JSON.stringify(finalOutput, null, 2));
  console.log('Done.');
}

updateTunes();
