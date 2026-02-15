
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const ANALYSIS_FILE = path.join(__dirname, 'cooley-session-analysis.json');

const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf8'));
const analysis = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf8'));

let updatedCount = 0;

analysis.forEach(item => {
    const tune = tunes[item.id];
    if (!tune) {
        console.warn(`Tune not found: ${item.id}`);
        return;
    }

    let changed = false;

    // Update recording type
    // If we suggest 'solo' and it is currently 'session', change it?
    // The current 'session' was a default. So yes.
    if (tune.recordingType !== item.suggestedType) {
        // Only override if suggested is 'solo' (more specific than default session)
        // or 'duet'
        // or if suggested is 'session' and we have specific instruments
        tune.recordingType = item.suggestedType;
        changed = true;
    }

    // Update instruments
    // Current instruments string: "Accordion (Joe Cooley)"
    // Suggested: ["Banjo (Kevin Keegan)", ...]
    
    if (item.suggestedInstruments.length > 0) {
        let currentInsts = tune.instruments ? tune.instruments.split(', ').map(s => s.trim()) : [];
        
        item.suggestedInstruments.forEach(inst => {
            // Check if instrument/person already listed (fuzzy check)
            // e.g. "Banjo (Kevin Keegan)" vs "Banjo" or "Kevin Keegan"
            const alreadyExists = currentInsts.some(existing => existing.includes(inst) || inst.includes(existing)); // weak check
            
            // Better check: exact match
            if (!currentInsts.includes(inst)) {
                currentInsts.push(inst);
                changed = true;
            }
        });

        tune.instruments = currentInsts.join(', ');
    }
    
    // Add original text to description if not present?
    // "Original listing: [text]"
    if (item.originalText && (!tune.description || !tune.description.includes('Original listing:'))) {
         // Maybe cleaner not to clutter description unless it adds value?
         // The original text often has "w/ Kevin Keegan". 
         // If we parsed that into instruments, we don't strictly need it in description,
         // but it's good for provenance.
         if (item.originalText !== tune.title) {
             // Only if text differs from title (e.g. notes included)
             const note = `Original listing: "${item.originalText}"`;
             if (tune.description) {
                 tune.description = `${tune.description} ${note}`;
             } else {
                 tune.description = note;
             }
             changed = true;
         }
    }

    if (changed) {
        updatedCount++;
    }
});

fs.writeFileSync(TUNES_FILE, JSON.stringify(tunes, null, 2));
console.log(`Updated ${updatedCount} tunes.`);
