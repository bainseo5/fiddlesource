// Script to scrape and import tunes from joecooleytapes.org
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TUNES_FILE = path.join(__dirname, '../backend/data/tunes.json');

// Configuration
const BASE_URL = 'https://joecooleytapes.org';
const SOURCE_COLLECTION = 'The Joe Cooley Tapes';

// Known tape directories
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

// Helper to determine tune type based on title keywords
function guessTuneType(title) {
    const t = title.toLowerCase();
    if (t.includes('jig')) return 'Jig';
    if (t.includes('reel')) return 'Reel';
    if (t.includes('hornpipe')) return 'Hornpipe';
    if (t.includes('polka')) return 'Polka';
    if (t.includes('march')) return 'March';
    if (t.includes('waltz')) return 'Waltz';
    if (t.includes('set dance') || t.includes('setdance')) return 'Set Dance';
    if (t.includes('air') || t.includes('lament')) return 'Air';
    if (t.includes('song') || t.includes('sings')) return 'Song';
    return 'Tune'; // Default
}

// Helper to sanitize ID
function generateId(tapeTitle, trackIndex) {
    const tapeSlug = tapeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `joecooley-${tapeSlug}-${String(trackIndex).padStart(2, '0')}`;
}

async function scrapePage(tapeInfo) {
    const url = `${BASE_URL}${tapeInfo.path}`;
    console.log(`Scraping: ${url}`);
    
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const tunes = [];

        // Select all links ending in .mp3
        $('a').each((i, el) => {
            const link = $(el);
            const href = link.attr('href');
            if (!href || !href.endsWith('.mp3')) return;

            // Ensure full URL
            let audioUrl = href;
            if (!href.startsWith('http')) {
                // Remove leading slash if any to avoid double slash issues when joining
                const cleanHref = href.startsWith('/') ? href.substring(1) : href; // href is usually relative like "01%20Mulvihill-s.mp3"
                // Construct absolute URL based on current page path
                // Note: The website structure implies links are relative to the directory listing
                // e.g. /joecooleytape_1-4/ + 01...mp3
                // remove trailing slash from url if needed
                const baseUrl = url.endsWith('/') ? url : url + '/';
                audioUrl = `${baseUrl}${cleanHref}`;
            }

            // Extract title directly from link text
            let rawTitle = link.text().trim();
            // Remove numbering if present (e.g. "1. Mulvihill's" or just "Mulvihill's")
            // The website text usually doesn't have the number inside the <a> tag based on fetch output,
            // but the list <li> might. The fetch output showed: "1. [Mulvihill's](...)"
            // So link.text() should process just "Mulvihill's".
            
            // Cleanup title
            // Remove file extension if accidentally included
            let title = rawTitle.replace(/\.mp3$/i, '');
            
            // Extract artist info from title if present (e.g. "w/ Kevin Keegan")
            let artist = "Joe Cooley";
            let notes = "";
            let description = `Original recording from ${SOURCE_COLLECTION} (${tapeInfo.title}).`;
            
            // Heuristic for notes in parens
            if (title.includes('(')) {
                const match = title.match(/\((.*?)\)/);
                if (match) {
                    const content = match[1];
                    if (content.toLowerCase().includes('w/') || content.toLowerCase().includes('with')) {
                        // It's likely an artist addition
                        const extraArtist = content.replace(/w\/|with/i, '').trim();
                        artist += `, ${extraArtist}`;
                         description += ` Features ${extraArtist}.`;
                    } else {
                        notes = content;
                        description += ` Note: ${notes}`;
                    }
                    // Clean title for display
                    title = title.replace(/\s*\(.*?\)\s*/g, '').trim();
                }
            }
            
            // Determine recording type
            let recordingType = 'solo';
            // Specific tape overrides
            if (tapeInfo.title.includes('Chicago') || tapeInfo.title.includes('Miliosa')) {
                 recordingType = 'session';
            } else if (artist.includes(',')) {
                 recordingType = 'session';
            }

            const id = generateId(`cooley-${tapeInfo.path.replace(/\//g,'')}`, i + 1);

            tunes.push({
                id,
                title: title || "Unknown Tune",
                artist,
                source: `${SOURCE_COLLECTION} - ${tapeInfo.title}`,
                region: tapeInfo.location,
                key: '?', // Unknown without analysis
                tuning: 'Standard',
                year: tapeInfo.year,
                audioUrl: audioUrl, // Pointing directly to source site
                description: description,
                genre: 'Irish Traditional',
                type: guessTuneType(title),
                startTime: 0,
                duration: 0, // Unknown without checking file
                sourceCollection: `${SOURCE_COLLECTION} - ${tapeInfo.title}`,
                isImported: true,
                collection: SOURCE_COLLECTION,
                recordingType: recordingType,
                originalUrl: url // Link back to the specific page
            });
        });

        console.log(`Found ${tunes.length} tunes on ${tapeInfo.title}`);
        return tunes;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return [];
    }
}

async function run() {
    let allNewTunes = {};
    
    // Load existing tunes to check for duplicates? 
    // For now, let's just create a separate file or merge carefully.
    // We'll merge into the main tunes object.
    
    let existingTunes = {};
    if (fs.existsSync(TUNES_FILE)) {
         existingTunes = JSON.parse(fs.readFileSync(TUNES_FILE, 'utf-8'));
    }

    for (const tape of TAPE_PAGES) {
        const tapeTunes = await scrapePage(tape);
        for (const tune of tapeTunes) {
            allNewTunes[tune.id] = tune;
        }
    }

    // Merge
    const merged = { ...existingTunes, ...allNewTunes };
    
    // Safety check
    console.log(`Total tunes before: ${Object.keys(existingTunes).length}`);
    console.log(`Total tunes after: ${Object.keys(merged).length}`);
    console.log(`Added: ${Object.keys(merged).length - Object.keys(existingTunes).length}`);

    // Confirm write
    if (Object.keys(merged).length > Object.keys(existingTunes).length) {
        fs.writeFileSync(TUNES_FILE, JSON.stringify(merged, null, 4));
        console.log(`✅ Successfully updated tunes.json`);
    } else {
        console.log('No new tunes added.');
    }
}

run();
