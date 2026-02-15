
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tunesPath = path.join(__dirname, '../backend/data/tunes.json');
const tunes = JSON.parse(fs.readFileSync(tunesPath, 'utf8'));

// The text the user requested
// "Recorded in Paddy Fahy’s home, 21 August 1972"
// "Recorded by Chris Delaney (a US research student, during a field trip to Ireland)"
// "John Joe Healy Collection Tape 24-2"
const DESCRIPTION = `Recorded in Paddy Fahy’s home, 21 August 1972.
Recorded by Chris Delaney (a US research student, during a field trip to Ireland).
John Joe Healy Collection Tape 24-2.`;

let count = 0;

Object.keys(tunes).forEach(key => {
    // Check if it's the Aughrim session (aughrim_JH24-2-*)
    if (key.startsWith('aughrim_JH24-2-')) {
        tunes[key].description = DESCRIPTION;
        // Ensure accurate collection attribution if it was missing or generic
        if (!tunes[key].sourceCollection || tunes[key].sourceCollection === "John Joe Healy Collection") {
             tunes[key].sourceCollection = "John Joe Healy Collection - Tape 24-2 (Aughrim)";
        }
        count++;
    }
});

fs.writeFileSync(tunesPath, JSON.stringify(tunes, null, 2));

console.log(`Updated description for ${count} tunes.`);
