
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');

async function updateInstruments() {
    console.log('Updating instruments for Joe Cooley collection...');

    let tunesData = {};
    try {
        const raw = fs.readFileSync(TUNES_FILE, 'utf-8');
        tunesData = JSON.parse(raw);
    } catch (err) {
        console.error('Could not read tunes.json:', err);
        process.exit(1);
    }

    const tunes = Object.values(tunesData);
    let updatedCount = 0;

    for (const tune of tunes) {
        // Only target Joe Cooley tunes
        if (tune.collection !== 'The Joe Cooley Tapes' && !tune.source.includes('Joe Cooley')) {
            continue;
        }

        let instruments = [];

        // Joe Cooley is always playing Accordion (C#/D)
        // Check if he is actually in the artist list (he should be base)
        if (tune.artist.includes('Joe Cooley')) {
            instruments.push("Accordion (Joe Cooley)"); 
        }

        // Kevin Keegan
        if (tune.artist.includes('Kevin Keegan')) {
            instruments.push("Accordion (Kevin Keegan)");
        }

        // Miliosa Lundy
        if (tune.artist.includes('Miliosa') || tune.artist.includes('Lundy')) {
            instruments.push("Banjo (Miliosa Lundy)");
        }
        
         // Seamus Cooley (Flute) - from text "Seamus Cooley (flute)"
        if (tune.artist.includes('Seamus') || tune.title.includes('Seamus')) {
             // He might be listed in artist?
             if (tune.artist.includes('Seamus')) {
                 instruments.push("Flute (Seamus Cooley)");
             }
        }
        
        // Miliosa
        // Jeremy Kammerer? (If listed)
        
        // If we found instruments, update the field
        if (instruments.length > 0) {
            tune.instruments = instruments.join(', ');
            updatedCount++;
        }
    }

    // Save
    fs.writeFileSync(TUNES_FILE, JSON.stringify(tunesData, null, 2));
    console.log(`\nUpdated instruments for ${updatedCount} tunes.`);
}

updateInstruments();
