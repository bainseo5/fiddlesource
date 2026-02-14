/**
 * Add instruments information to tunes based on session data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tunesPath = path.join(__dirname, '../backend/data/tunes.json');
const backupPath = path.join(__dirname, '../backend/data/tunes.before-instruments.json');

// Read existing tunes
const tunes = JSON.parse(fs.readFileSync(tunesPath, 'utf8'));

// Backup
fs.writeFileSync(backupPath, JSON.stringify(tunes, null, 2));
console.log(`✓ Backup created: ${backupPath}`);

// Session instrument information
const sessionInstruments = {
  // Doolin Session 1962
  "O'Connor's Bar Session, 1962": "Tin whistle (Micho Russell), Fiddle (Peadar O'Loughlin, Willie Shannon), Accordion (Paddy Killourhy)",
  
  // Mullagh Session 1976
  "BR Taylor Collection Tape 019-2": "Flute (Pat Crehan), Fiddle (Michael Downes, Jim McKee)"
};

// Update tunes with instruments
let updatedCount = 0;

for (const [id, tune] of Object.entries(tunes)) {
  const collection = tune.sourceCollection;
  
  if (collection && sessionInstruments[collection]) {
    tunes[id].instruments = sessionInstruments[collection];
    updatedCount++;
    console.log(`✓ Updated: ${tune.title}`);
  }
}

// Save updated tunes
fs.writeFileSync(tunesPath, JSON.stringify(tunes, null, 2));

console.log(`\n✓ Updated ${updatedCount} tunes with instrument information`);
console.log(`\nInstruments by collection:`);
for (const [collection, instruments] of Object.entries(sessionInstruments)) {
  console.log(`\n${collection}:`);
  console.log(`  ${instruments}`);
}
