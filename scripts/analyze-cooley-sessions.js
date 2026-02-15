
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');
const OUTPUT_FILE = path.join(__dirname, 'cooley-session-analysis.json');

// Configuration
const BASE_URL = 'https://joecooleytapes.org';
const SOURCE_COLLECTION = 'The Joe Cooley Tapes';

const TAPE_PAGES = [
    { path: '/joecooleytape_1-4/', title: 'Tapes 1-4', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_5/', title: 'Tape 5', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_6/', title: 'Tape 6', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_7/', title: 'Tape 7', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_8-10/', title: 'Tapes 8-10', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_11/', title: 'Tape 11', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleytape_12/', title: 'Tape 12', year: '1970-1973', location: 'San Francisco' },
    { path: '/joecooleyandmiliosalundy/', title: 'With Miliosa Lundy', year: '1970-1973', location: 'San Francisco' },
    { path: '/cooleykeeganchicago_1/', title: 'Chicago Tape 1', year: '1960s', location: 'Chicago' },
    { path: '/cooleykeeganchicago_2/', title: 'Chicago Tape 2', year: '1960s', location: 'Chicago' }
];

async function analyzeSessions() {
    console.log('Reading tunes database...');
    const tunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf8'));
    
    // Create a lookup map by source tape + index
    // We need to figure out how to map the tunes back to the page index.
    // The keys in tunes.json don't strictly follow a predictable index always if I renamed them, 
    // but the 'source' field contains the Tape Title.
    // We can group tunes by 'source' and rely on the order they appear (if keys are sorted) 
    // OR we can guess from the ID if it ends in a number.

    const tunesByTape = {};
    
    Object.values(tunes).forEach(tune => {
        if (tune.collection !== "The Joe Cooley Tapes") return;
        
        let tapeKey = null;
        for (const page of TAPE_PAGES) {
             // Match based on source description "The Joe Cooley Tapes - [Title]"
             if (tune.source.includes(page.title)) {
                 tapeKey = page.path;
                 break;
             }
        }
        
        if (tapeKey) {
            if (!tunesByTape[tapeKey]) tunesByTape[tapeKey] = [];
            tunesByTape[tapeKey].push(tune);
        }
    });

    // Sort tunes for each tape by ID or any numeric suffix to match page order
    for (const key in tunesByTape) {
        tunesByTape[key].sort((a, b) => {
            // Extract last number from ID e.g. ...-01, ...-34
            const numA = parseInt(a.id.match(/(\d+)$/)?.[1] || '0');
            const numB = parseInt(b.id.match(/(\d+)$/)?.[1] || '0');
            return numA - numB;
        });
    }

    const updates = [];

    for (const page of TAPE_PAGES) {
        const url = `${BASE_URL}${page.path}`;
        console.log(`Fetching ${url}...`);
        
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            
            // Find all links to mp3 files
            const links = $('a[href$=".mp3"]');
            
            // Get corresponding tunes from our DB
            const tapeTunes = tunesByTape[page.path] || [];
            
            console.log(`Found ${links.length} links and ${tapeTunes.length} DB entries for ${page.title}`);
            
            // Adjust limit if mismatch
            const count = Math.min(links.length, tapeTunes.length);

            for (let i = 0; i < count; i++) {
                const element = links[i];
                const linkText = $(element).text().trim();
                const tune = tapeTunes[i];
                
                const analysis = analyzeLinkText(linkText, page.title);
                
                updates.push({
                    id: tune.id,
                    title: tune.title,
                    originalText: linkText,
                    suggestedType: analysis.type,
                    suggestedInstruments: analysis.instruments,
                    currentType: tune.recordingType,
                    currentInstruments: tune.instruments
                });
            }

        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updates, null, 2));
    console.log(`Analysis complete. Saved to ${OUTPUT_FILE}`);
}

function analyzeLinkText(text, tapeTitle) {
    const lower = text.toLowerCase();
    
    let type = 'solo'; // Default
    const instruments = []; // Additions

    // Known musicians
    const musicians = [
        { name: 'Kevin Keegan', instrument: 'Banjo' },
        { name: 'Seamus Cooley', instrument: 'Flute' }, 
        { name: 'Miliosa Lundy', instrument: 'Piano' },
        { name: 'Sean O-Sullivan', instrument: 'Fiddle' },
        { name: 'John Brown', instrument: 'Flute' }, // Guess/Verify
        { name: 'Des Mulkere', instrument: 'Banjo' },
        { name: 'Jeremy', instrument: '?' },
        { name: 'Grouse', instrument: '?' },
        { name: 'Dermot', instrument: '?' },
        { name: 'Patricia Kennel', instrument: 'Fiddle' },
         { name: 'Patrica Kennel', instrument: 'Fiddle' }, // typo
        { name: 'Patricia Kennelly', instrument: 'Fiddle' }
    ];

    // Check for "w", "with", "and" names
    const hasWith = /\b(w\/|w\.|with|feat|featuring|and)\b/i.test(text);
    
    // Check for explicit names
    let foundMusician = false;
    for (const m of musicians) {
        if (text.includes(m.name)) {
            foundMusician = true;
            instruments.push(`${m.instrument} (${m.name})`);
        }
    }

    if (hasWith || foundMusician) {
        type = 'session'; 
    }

    // Special case for Chicago tapes - typically sessions/groups
    if (tapeTitle.includes('Chicago')) {
        // Chicago tapes defaults to session/group unless specified?
        // Actually, if it's "Cooley, Keegan, Cooley", it's a trio -> Session/Ensemble.
        if (!hasWith && !foundMusician) {
            type = 'session'; // Default for Chicago
        }
        if (instruments.length === 0) {
            // Implicit participants for Chicago
             instruments.push('Banjo (Kevin Keegan)'); // Likely?
             instruments.push('Flute (Seamus Cooley)'); // Likely?
        }
    } else if (tapeTitle.includes('Miliosa Lundy')) {
        type = 'duet'; 
        if (!foundMusician) instruments.push('Piano (Miliosa Lundy)');
    } else {
        // Tapes 1-12 (mostly San Francisco)
        // If no "w/", default to Solo
        if (!hasWith && !foundMusician) {
            type = 'solo';
        }
    }

    return { type, instruments: [...new Set(instruments)] };
}

analyzeSessions();
