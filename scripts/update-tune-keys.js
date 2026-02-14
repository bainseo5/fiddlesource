/**
 * Script to update tunes.json with the found keys from TheSession.org
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the found keys
const keysPath = path.join(__dirname, 'tune-keys-found.json');
const foundKeys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));

// Read the tunes database
const tunesPath = path.join(__dirname, '../backend/data/tunes.json');
const tunes = JSON.parse(fs.readFileSync(tunesPath, 'utf8'));

// Clean up tune titles to extract just the tune name
function cleanTuneName(title) {
  // Remove prefixes like "Reel_", "Jig_", etc.
  let cleaned = title.replace(/^(Reel|Jig|Hornpipe|Waltz|Polka|Song|Set dance|Double Jig|Hp)[\s_:]*/i, '');
  
  // For multi-tune titles like "Reels (2)_ X_Y", split and return first tune
  if (cleaned.includes('_')) {
    cleaned = cleaned.split('_')[0].trim();
  }
  
  // Remove fragments and other notes in parentheses at the end
  cleaned = cleaned.replace(/\s*[–-]\s*fragment.*$/i, '');
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/g, '');
  
  return cleaned.trim();
}

// Fix the Gmixolydian issue
if (foundKeys['Jenny Picking Cockles'] === 'Gmixolydian') {
  foundKeys['Jenny Picking Cockles'] = 'G Mixolydian';
}

// Remove the spurious 's' entry
delete foundKeys['s'];

// Update the tunes with found keys
let updatedCount = 0;
let notFoundCount = 0;

for (const [id, tune] of Object.entries(tunes)) {
  const cleanName = cleanTuneName(tune.title);
  
  if (foundKeys[cleanName]) {
    tunes[id].key = foundKeys[cleanName];
    updatedCount++;
    console.log(`✓ Updated: ${tune.title} -> ${foundKeys[cleanName]}`);
  } else if (tune.key === '?') {
    // Keep as ? if we couldn't find it
    notFoundCount++;
    console.log(`✗ Not found: ${tune.title} (${cleanName})`);
  }
}

// Save the updated tunes
const tunesBackupPath = path.join(__dirname, '../backend/data/tunes.backup.json');
fs.writeFileSync(tunesBackupPath, JSON.stringify(JSON.parse(fs.readFileSync(tunesPath, 'utf8')), null, 2));
console.log(`\n✓ Backup saved to: ${tunesBackupPath}`);

fs.writeFileSync(tunesPath, JSON.stringify(tunes, null, 2));
console.log(`✓ Updated tunes saved to: ${tunesPath}`);

console.log(`\nSummary:`);
console.log(`  Total tunes: ${Object.keys(tunes).length}`);
console.log(`  Updated with keys: ${updatedCount}`);
console.log(`  Still unknown: ${notFoundCount}`);
