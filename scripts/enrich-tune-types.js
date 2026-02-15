
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const SESSION_API_URL = 'https://thesession.org/tunes/search';

// Helper for delays to be polite to the API
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTuneType(title) {
    // Clean title for better search results
    // Remove "The", parentheticals, etc. if needed, but thesession search is usually decent.
    // We'll strip things strictly inside parens like (Jig) if they exist, but keep the main title.
    const cleanTitle = title.replace(/\(.*\)/, '').trim();
    
    try {
        const query = encodeURIComponent(cleanTitle);
        const url = `${SESSION_API_URL}?q=${query}&format=json`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.tunes && data.tunes.length > 0) {
            // Return the type of the first match
            // The Session returns lowercase 'reel', 'jig', etc.
            // We'll capitalize it.
            const type = data.tunes[0].type;
            return type.charAt(0).toUpperCase() + type.slice(1);
        }
    } catch (error) {
        console.warn(`   Failed to search for "${cleanTitle}": ${error.message}`);
    }
    return null;
}

async function enrichTunes() {
    console.log('Starting enrichment from TheSession.org...');

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
    let processed = 0;

    for (const tune of tunes) {
        processed++;
        
        // Skip if we already have a strong type? 
        // Actually, let's defer to TheSession if our current type is just "Tune" or generic.
        // Or if we just guessed it.
        // Let's trying to improve everything that isn't hardcoded manually.
        
        // Use a progress indicator
        process.stdout.write(`[${processed}/${tunes.length}] Checking "${tune.title}"... `);

        // Don't hammer the API - verify we actually need to check.
        // If the title is "Unknown", skip.
        if (tune.title.includes("Unknown")) {
            console.log("Skipping (Unknown).");
            continue;
        }

        const newType = await fetchTuneType(tune.title);

        if (newType) {
            if (tune.type !== newType) {
                console.log(`UPDATED: ${tune.type || '?'} -> ${newType}`);
                tune.type = newType;
                updatedCount++;
            } else {
                console.log(`Matched (${newType}).`);
            }
        } else {
            console.log("No match found.");
        }

        // Be polite: wait 1 second between requests
        await sleep(1000);

        // Save progress every 10 tunes
        if (processed % 10 === 0) {
             fs.writeFileSync(TUNES_FILE, JSON.stringify(tunesData, null, 2));
        }
    }

    // Final save
    fs.writeFileSync(TUNES_FILE, JSON.stringify(tunesData, null, 2));
    console.log(`\nEnrichment complete! Updated ${updatedCount} tunes.`);
}

enrichTunes();
