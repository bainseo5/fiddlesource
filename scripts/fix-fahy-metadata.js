
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');

const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));
let fixedCount = 0;

for (const id in tunes) {
    if (id.startsWith('aughrim_JH24-2')) {
        const tune = tunes[id];
        
        // 1. Fix Region
        tune.region = "Aughrim, Co. Galway";

        // 2. Fix Year from Date
        if (tune.date && tune.date.includes('1972')) {
            tune.year = "1972";
        } else {
             tune.year = "1970s";
        }

        // 3. Fix Type & Genre
        // Currently genre has "Jig" or "Reel". 
        // We want: type="Jig", genre="Irish Traditional"
        if (tune.genre && tune.genre !== "Irish Traditional") {
            tune.type = tune.genre; // Move "Jig" to type
            tune.genre = "Irish Traditional"; // Set generic genre
        } else if (!tune.type) {
             // Fallback if genre was already changed or empty
             tune.type = "Tune";
             tune.genre = "Irish Traditional";
        }

        // 4. Fix Instruments (rename musicians -> instruments)
        if (tune.musicians && !tune.instruments) {
            tune.instruments = tune.musicians;
            // delete tune.musicians; // Optional: keep for reference or delete to clean up?
            // Let's keep it for now as strict cleanup isn't requested, but UI uses instruments
        }

        // 5. Fix Key
        if (!tune.key) {
            tune.key = "?";
        }

        // 6. Fix Source Collection
        // Cooley example: "The Joe Cooley Tapes - Chicago Tape 2"
        if (!tune.sourceCollection) {
            tune.sourceCollection = "John Joe Healy Collection - Tape 24-2 (Aughrim)";
        }
        
        // 7. Fix Recording Type case (optional compliance)
        if (tune.recordingType === "Solo") {
            tune.recordingType = "solo"; // standardized lowercase?
        }


        fixedCount++;
        console.log(`Updated layout metadata for ${id}`);
    }
}

if (fixedCount > 0) {
    fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));
    console.log(`\n🎉 Successfully updated metadata for ${fixedCount} Aughrim tunes.`);
} else {
    console.log('\n✅ No tunes found matching criteria.');
}
