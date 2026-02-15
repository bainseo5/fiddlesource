import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const REPERTOIRE_FILE = path.join('output', 'johnkelly_repertoire.html');
const OUT_DIR = 'output';

async function analyzeRepertoire() {
    if (!fs.existsSync(REPERTOIRE_FILE)) {
        console.error("Repertoire file not found. Run inspect-johnkelly-site.js first.");
        return;
    }

    const html = fs.readFileSync(REPERTOIRE_FILE, 'utf-8');
    const $ = cheerio.load(html);
    const tunes = [];

    $('.portfolio-item').each((i, el) => {
        const titleEl = $(el).find('.title');
        const linkEl = $(el).find('a');
        const categoryEl = $(el).find('.category');

        if (titleEl.length && linkEl.length) {
            const title = titleEl.text().trim();
            const link = linkEl.attr('href');
            const type = categoryEl.text().trim();
            tunes.push({ title, link, type });
        }
    });

    console.log(`Found ${tunes.length} tunes.`);
    fs.writeFileSync(path.join(OUT_DIR, 'johnkelly_tune_list.json'), JSON.stringify(tunes, null, 2));

    if (tunes.length > 0) {
        // Pick one to inspect
        // Ideally one that looks simple
        const sample = tunes[3]; // "Hughie Travers"
        let targetUrl = sample.link;
        
        // Ensure www
        if (targetUrl.startsWith('https://johnkellycapelstreet.ie')) {
             targetUrl = targetUrl.replace('https://johnkellycapelstreet.ie', 'https://www.johnkellycapelstreet.ie');
        }
        
        console.log(`\nDeep diving into: ${sample.title} (${targetUrl})`);

        try {
            const response = await axios.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.johnkellycapelstreet.ie/johns-repertoire/'
                },
                timeout: 20000
            });
            
            const detailHtml = response.data;
            const $$ = cheerio.load(detailHtml);

            const audioSrc = $$('audio source').attr('src');
            const audioTag = $$('audio').parent().html(); // Get full audio tag context
            const iframes = [];
            $$('iframe').each((i, el) => iframes.push($$(el).attr('src')));

            console.log("\n--- Audio Details ---");
            if (audioSrc) {
                console.log(`Found direct Audio Source: ${audioSrc}`);
                console.log(`Audio Tag HTML: ${audioTag ? audioTag.substring(0, 200) : 'N/A'}`);
            } else {
                console.log("No <audio> tag found.");
            }

            if (iframes.length > 0) {
                console.log("Found iframes (SoundCloud/YouTube):");
                iframes.forEach(src => console.log(`- ${src}`));
            }
            
            // Metadata
            const content = $$('.entry-content').text().trim();
            console.log("\n--- Content Snippet ---");
            console.log(content.substring(0, 300));
            
            fs.writeFileSync(path.join(OUT_DIR, 'johnkelly_sample_tune.html'), detailHtml);

        } catch (e) {
            console.error(`Failed to fetch detail page: ${e.message}`);
        }
    }
}

analyzeRepertoire();
