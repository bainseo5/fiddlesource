/**
 * Merge Mullagh session tunes into main tunes.json database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mullaghPath = path.join(__dirname, 'mullagh-tunes.json');
const tunesPath = path.join(__dirname, '../backend/data/tunes.json');
const backupPath = path.join(__dirname, '../backend/data/tunes.before-mullagh.json');

// Read files
const mullaghTunes = JSON.parse(fs.readFileSync(mullaghPath, 'utf8'));
const existingTunes = JSON.parse(fs.readFileSync(tunesPath, 'utf8'));

// Backup existing
fs.writeFileSync(backupPath, JSON.stringify(existingTunes, null, 2));
console.log(`✓ Backup created: ${backupPath}`);

// Merge
const merged = { ...existingTunes, ...mullaghTunes };

// Save
fs.writeFileSync(tunesPath, JSON.stringify(merged, null, 2));

console.log(`✓ Merged ${Object.keys(mullaghTunes).length} Mullagh tunes into database`);
console.log(`✓ Total tunes: ${Object.keys(merged).length}`);
console.log(`\nCollections now in database:`);
const collections = new Set(Object.values(merged).map(t => t.sourceCollection));
collections.forEach(c => console.log(`  - ${c}`));
