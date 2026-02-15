
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, 'john-kelly-tunes.json');

const BASE_URL = 'https://johnkellycapelstreet.ie/johns-repertoire/';

async function scrapeJohnKelly() {
    console.log('Starting scrape of John Kelly Capel Street Archive...');

    try {
        // Step 1: Get the main list of tunes
        console.log(`Fetching main list from ${BASE_URL}...`);
        const { data: mainPageHtml } = await axios.get(BASE_URL);
        const $ = cheerio.load(mainPageHtml);

        // Find all portfolio items/links
        // Based on typical WordPress portfolio themes, look for links in a grid
        // The subagent analysis mentioned "portfolio-item a" or similar structure
        // Let's look for links that look like /project/tune-name/
        const tuneLinks = [];
        $('a[href*="/project/"]').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('johnkellycapelstreet.ie/project/') && !tuneLinks.includes(link)) {
                tuneLinks.push(link);
            }
        });

        console.log(`Found ${tuneLinks.length} tune pages.`);

        const tunes = [];

        // Step 2: Scrape each page
        for (const [index, link] of tuneLinks.entries()) {
            console.log(`[${index + 1}/${tuneLinks.length}] Scraping ${link}...`);
            try {
                const { data: pageHtml } = await axios.get(link);
                const $page = cheerio.load(pageHtml);

                const title = $page('h1.page-title').text().trim() || 
                              $page('.project-title').text().trim() ||
                              link.split('/').filter(Boolean).pop().replace(/-/g, ' ');

                // Description often contains the text body
                // Look for the main content div
                const description = $page('.entry-content').text().trim() || '';

                // Categories usually listed in meta
                const categories = [];
                $page('.portfolio-categories a').each((i, el) => {
                    categories.push($page(el).text().trim());
                });

                // Find Audio
                // Look for <audio> tags or links to .mp3
                const audioSources = [];
                $page('audio source').each((i, el) => {
                    const src = $page(el).attr('src');
                    if (src && src.endsWith('.mp3')) audioSources.push(src);
                });
                
                // Also check typical obscure WP audio shortcode structures or direct links
                if (audioSources.length === 0) {
                     $page('a[href$=".mp3"]').each((i, el) => {
                        audioSources.push($page(el).attr('href'));
                     });
                }

                // Determine Instrument
                let instrument = 'Fiddle (John Kelly)'; // Default
                const lowerDesc = description.toLowerCase();
                const lowerTitle = title.toLowerCase();
                
                if (lowerDesc.includes('concertina') || lowerTitle.includes('concertina')) {
                    // Check if strictly concertina or if he talks about a concertina player?
                    // "John plays this on the concertina"
                    if (lowerDesc.includes('played on the concertina') || lowerDesc.includes('plays this on the concertina')) {
                        instrument = 'Concertina (John Kelly)';
                    } else if (categories.some(c => c.toLowerCase().includes('concertina'))) {
                         instrument = 'Concertina (John Kelly)';
                    }
                }
                
                // Create entries for each audio file found
                audioSources.forEach((url, i) => {
                    // Clean ID
                    const slug = link.split('/').filter(Boolean).pop();
                    const id = `johnkelly-${slug}${audioSources.length > 1 ? `-${i+1}` : ''}`;
                    
                    tunes.push({
                        id,
                        title: title + (audioSources.length > 1 ? ` (Part ${i+1})` : ''),
                        artist: 'John Kelly',
                        source: 'John Kelly Capel St Archive',
                        sourceUrl: link,
                        audioUrl: url,
                        description: description,
                        type: categories[0] || 'Tune',
                        instruments: instrument,
                        collection: 'John Kelly Capel St Archive',
                        region: 'Clare / Dublin',
                        isImported: true
                    });
                });

                // Polite delay
                await new Promise(r => setTimeout(r, 500));

            } catch (err) {
                console.error(`Failed to scrape ${link}: ${err.message}`);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tunes, null, 2));
        console.log(`Scrape complete. Saved ${tunes.length} tunes to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Fatal error:', error.message);
    }
}

scrapeJohnKelly();
