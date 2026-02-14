import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TUNES_DB_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.json');
const BACKUP_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.before-bonavella-instruments.json');

// Instrument information for the Bonavella session
const sessionInstruments = {
  "O'Connor's Bar Session, 1962": "Tin whistle (Micho Russell), Fiddle (Peadar O'Loughlin, Willie Shannon), Accordion (Paddy Killourhy)",
  "BR Taylor Collection Tape 019-2": "Flute (Pat Crehan), Fiddle (Michael Downes, Jim McKee)",
  "John Joe Healy Collection Tape 12": "Uilleann pipes (Willie Clancy, Seamus Ennis), Fiddle (Martin 'Junior' Crehan), Whistle (Angela Crehan, Ita Crehan), Piano (Angela Crehan)"
};

async function main() {
  console.log('\n=== Adding Bonavella Session Instruments ===\n');
  
  // Read tunes
  const tunes = JSON.parse(await fs.readFile(TUNES_DB_PATH, 'utf-8'));
  
  // Create backup
  await fs.writeFile(BACKUP_PATH, JSON.stringify(tunes, null, 2));
  console.log(`✓ Backup created: ${BACKUP_PATH}`);
  
  // Update tunes with Bonavella instruments
  let updateCount = 0;
  
  for (const [tuneId, tune] of Object.entries(tunes)) {
    if (tune.sourceCollection === "John Joe Healy Collection Tape 12") {
      tune.instruments = sessionInstruments[tune.sourceCollection];
      tunes[tuneId] = tune;
      updateCount++;
      console.log(`✓ Updated: ${tune.title}`);
    }
  }
  
  // Save updated data
  await fs.writeFile(TUNES_DB_PATH, JSON.stringify(tunes, null, 2));
  
  console.log(`\n✓ Updated ${updateCount} tunes with instrument information`);
  console.log('\nInstruments by session:\n');
  Object.entries(sessionInstruments).forEach(([session, instruments]) => {
    console.log(`${session}:`);
    console.log(`  ${instruments}\n`);
  });
}

main().catch(console.error);
