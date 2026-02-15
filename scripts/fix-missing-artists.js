
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');

const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));
let fixedCount = 0;

for (const id in tunes) {
    const tune = tunes[id];
    if (!tune.artist && tune.musicians) {
        tune.artist = tune.musicians;
        fixedCount++;
        console.log(`Fixed ${id}: Set artist to "${tune.musicians}"`);
    } else if (!tune.artist) {
        tune.artist = "Unknown Artist"; // Fallback to avoid crash
        fixedCount++;
        console.log(`Fixed ${id}: Set artist to "Unknown Artist" (no musicians found)`);
    }
}

if (fixedCount > 0) {
    fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));
    console.log(`\n🎉 Successfully fixed ${fixedCount} tunes missing 'artist' field.`);
} else {
    console.log('\n✅ No tunes needed fixing.');
}
