import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.johnkellycapelstreet.ie';
const OUT_DIR = 'output';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

async function inspectSite() {
  try {
    console.log(`Fetching ${BASE_URL}...`);
    const response = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.google.com/'
      },
      timeout: 10000
    });

    const html = response.data;
    const dumpPath = path.join(OUT_DIR, 'johnkelly_home.html');
    fs.writeFileSync(dumpPath, html);
    console.log(`Saved homepage HTML to ${dumpPath}`);

    const $ = cheerio.load(html);
    
    // 1. Identify main sections
    console.log('\n--- Navigation Links ---');
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && !href.startsWith('#') && !href.startsWith('mailto')) {
        links.push({ text, href });
      }
    });

    // Filter relevant links
    const repertoireLink = links.find(l => /John.s Repertoire/i.test(l.text) || /johns-repertoire/i.test(l.href));
    
    if (repertoireLink) {
        console.log(`\nFound Repertoire link: [${repertoireLink.text}](${repertoireLink.href})`);
        
        let targetUrl = repertoireLink.href;
        if (targetUrl.startsWith('https://johnkellycapelstreet.ie')) {
             targetUrl = targetUrl.replace('https://johnkellycapelstreet.ie', 'https://www.johnkellycapelstreet.ie');
        }

        console.log(`Inspecting Repertoire page: ${targetUrl}`);
        
        try {
            const subResponse = await axios.get(targetUrl, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': BASE_URL
                },
                timeout: 15000
            });
            const subHtml = subResponse.data;
            const subDumpPath = path.join(OUT_DIR, 'johnkelly_repertoire.html');
            fs.writeFileSync(subDumpPath, subHtml);
            console.log(`Saved repertoire HTML to ${subDumpPath}`);
            const $$ = cheerio.load(subHtml);

            console.log("Analyzing Repertoire page structure...");
            
            // Look for tune list
            // Extract all links to see if they follow a pattern like /tune/ or /track/
            const pageLinks = [];
            $$('a').each((i, el) => {
                const href = $$(el).attr('href');
                if (href && href.startsWith('http')) {
                    pageLinks.push(href);
                }
            });

            // Try to find individual tune URLs
            // Assume structure is something like /johns-repertoire/tune-name or similar
            // Or maybe they are just audio files directly linked?
            const mp3Links = pageLinks.filter(l => l.endsWith('.mp3'));
            console.log(`Found ${mp3Links.length} direct MP3 links on page.`);

            // Look for potential detail pages
            // Heuristic: links that are children of repertoire page or contain 'repertoire'
            const detailLinks = pageLinks.filter(l => l.includes('johnkellycapelstreet.ie') && l !== targetUrl && l.length > targetUrl.length);
            console.log(`Found ${detailLinks.length} potential detail links.`);
            if (detailLinks.length > 0) console.log("Sample:", detailLinks.slice(0, 3));

            if (detailLinks.length > 0) {
                // Pick one detail page to inspect
                const detailUrl = detailLinks[5] || detailLinks[0]; // pick a deeper one
                let safeDetailUrl = detailUrl.replace('https://johnkellycapelstreet.ie', 'https://www.johnkellycapelstreet.ie');
                
                console.log(`\nInspecting individual tune page: ${safeDetailUrl}`);
                const detailResponse = await axios.get(safeDetailUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                const detailHtml = detailResponse.data;
                const $$$ = cheerio.load(detailHtml);
                
                const title = $$$('h1.page-title, h1.entry-title').text().trim();
                const audio = $$$('audio').length;
                const iframe = $$$('iframe').length;
                const audioSrc = $$$('audio source').attr('src');
                const soundcloud = $$$('iframe[src*="soundcloud"]').attr('src');
                const youtube = $$$('iframe[src*="youtube"]').attr('src');
                const meta = $$$('.portfolio-attributes, .project-meta, .entry-content').text().replace(/\s+/g, ' ').substring(0, 200);

                console.log(`\n--- Tune Page Analysis ---`);
                console.log(`Title: ${title}`);
                console.log(`Audio tag count: ${audio}`);
                console.log(`Iframe count: ${iframe}`);
                if (audioSrc) console.log(`Audio Src: ${audioSrc}`);
                if (soundcloud) console.log(`Soundcloud: ${soundcloud}`);
                if (youtube) console.log(`Youtube: ${youtube}`);
                console.log(`Metadata Sample: ${meta}`);

                const detailDumpPath = path.join(OUT_DIR, 'johnkelly_tune_detail.html');
                fs.writeFileSync(detailDumpPath, detailHtml);
                console.log(`Saved tune detail HTML to ${detailDumpPath}`);
            }

        } catch (e) {
            console.error(`Failed to fetch repertoire: ${e.message}`);
        }
    } else {
        console.log("Could not find 'John's Repertoire' link.");
    }

  } catch (error) {
    console.error('Error fetching site:', error.message);
  }
}

inspectSite();
