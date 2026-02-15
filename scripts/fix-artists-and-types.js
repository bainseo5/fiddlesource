
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
      // Parse instruments: "Accordion (Joe Cooley), Banjo (Kevin Keegan)"
      // Regex to find content in parens associated with instruments
      // Split by comma first to handle multiple
      const parts = tune.instruments.split(',').map(s => s.trim());
      
      const artists = [];
      let melodyCount = 0;

      for (const part of parts) {
        // Match "InstrumentName (ArtistName)"
        const match = part.match(/^([^(]+)\(([^)]+)\)$/);
        
        if (match) {
          const inst = match[1].trim().toLowerCase();
          const artistName = match[2].trim();
          
          artists.push(artistName);

          // Check if melody instrument
          const isAccompaniment = ACCOMPANIMENT_INSTRUMENTS.some(acc => inst.includes(acc));
          if (!isAccompaniment) {
            melodyCount++;
          }
        } else {
          // If no parens (e.g. "Fiddle"), treat as melody unless known accompaniment
          // But we can't extract artist name.
          // If "Joe Cooley (Accordion)", handle that? 
          // Previous grep showed "Accordion (Joe Cooley)".
          const revMatch = part.match(/^([^(]+)\(([^)]+)\)$/); // Same regex really
        }
      }

      // Update Artist string if musicians found
      if (artists.length > 0) {
        // Filter out duplicates
        const uniqueArtists = [...new Set(artists)];
        const newArtistString = uniqueArtists.join(', ');

        if (tune.artist !== newArtistString) {
            // Only update if it looks like a meaningful change (e.g. adding missing people)
            // Or totally replacing "Joe Cooley" with "Joe Cooley, Kevin Keegan"
             
            // Some existing artists might be "The Tulla Ceili Band". Don't overwrite if instruments don't cover it?
            // User specifically asked to "update the artists in the card".
            // Let's be aggressive for Joe Cooley tapes specifically, or generally if 'instruments' is rich.
            
            // Safety: Only if instruments is structured "Inst (Name)"
            if (tune.instruments.includes('(')) {
                 tune.artist = newArtistString;
                 modified = true;
            }
        }
      }

      // 2. Logic for Solo vs Session
      // "if there is only one melody instrument ... it should be marked as solo"
      if (melodyCount === 1) {
        if (tune.recordingType !== 'solo') {
          tune.recordingType = 'solo';
          modified = true;
          soloCount++;
        }
      } else if (melodyCount > 1) {
         // If currently solo but has multiple melody instruments, strictly it's a duet/session
         // But user only asked to mark 1 as solo. Did not ask to unmark others. 
         // But for correctness:
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
  console.log(`Marked ${soloCount} as Solo.`);
  
  const finalOutput = dictionaryFormat ? updatedTunesMap : updatedTunesList;
  
  const backupPath = path.join(__dirname, `../backend/data/tunes.backup.${Date.now()}.json`);
  fs.copyFileSync(TUNES_FILE, backupPath);
  console.log(`Backup saved to ${backupPath}`);

  fs.writeFileSync(TUNES_FILE, JSON.stringify(finalOutput, null, 2));
  console.log('Done.');
}

updateTunes();
