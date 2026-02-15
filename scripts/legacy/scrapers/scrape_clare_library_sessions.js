
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '../../generated-split-scripts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = 'https://www.clarelibrary.ie/eolas/coclare/music/live/';
const COLLECTIONS = [
  'index_taylor.htm',
  'index_healy.htm',
  'index_carroll.htm'
];

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

function extractLinks(html, baseUrl) {
  const links = [];
  // Regex to find links to htm files in the music/live section that are NOT index pages
  // Looking for <a href="filename.htm">...</a>
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+\.htm)["'][^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.includes('index') && !href.includes('about') && !href.includes('musicians')) {
       // Convert relative to absolute
       const fullUrl = new URL(href, baseUrl).href;
       if (fullUrl.includes('/music/live/')) {
         links.push(fullUrl);
       }
    }
  }
  return [...new Set(links)]; // Dedupe
}

function parseSessionPage(html, url) {
    // 1. Extract Title/Location
    // Look for "Recorded in..." or similar
    // Simple regex for now - extracting text content is tricky without DOM parser
    
    let location = "Unknown Location";
    let musicians = "Unknown Musicians";
    let date = "Unknown Date";
    const tracks = [];

    // Crude text extraction - remove tags
    const cleanText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Try to extract Location
    const locMatch = cleanText.match(/Recorded in (.*?)(\d{4})/i);
    if (locMatch) {
        location = locMatch[1].trim().replace(/,$/, '');
        date = locMatch[2];
    }

    // Try to extract Musicians
    const musMatch = cleanText.match(/Musicians: (.*?)(Recorded|Singers|Items)/i);
    if (musMatch) {
        musicians = musMatch[1].trim();
    }

    // Extract Tracks
    // Pattern: 1. Title (Type) (Start - End)
    // Example: 1. Reels (2): Down the Broom/Gatehouse Maid (.01 – 1.49)
    const trackRegex = /(\d+)\.\s+(.*?)\s*\(([\d\.]+)\s*[–-]\s*([\d\.]+)\)/g;
    let trackMatch;
    
    // We run regex on the CLEAN text to avoid HTML tag interference
    while ((trackMatch = trackRegex.exec(cleanText)) !== null) {
        const [full, num, titleAndType, start, end] = trackMatch;
        let title = titleAndType.trim();
        let genre = "Tune";

        // Try to guess genre from title (e.g., "Reel: ...")
        if (title.toLowerCase().includes('reel')) genre = 'Reel';
        else if (title.toLowerCase().includes('jig')) genre = 'Jig';
        else if (title.toLowerCase().includes('hornpipe')) genre = 'Hornpipe';
        else if (title.toLowerCase().includes('march')) genre = 'March';
        else if (title.toLowerCase().includes('polka')) genre = 'Polka';
        else if (title.toLowerCase().includes('song')) genre = 'Song';
        else if (title.toLowerCase().includes('waltz')) genre = 'Waltz';
        else if (title.toLowerCase().includes('set dance')) genre = 'Set Dance';

        // Clean title
        title = title.replace(/^(Reel|Jigs?|Hornpipe|Set Dance|Song|Waltz|Polka|March)s?(\s*\(\d+\))?\s*:\s*/i, '');
        
        // Handle Medleys directly here? Or let the script generator handle it?
        // The user wants "Doolin style" where medleys are pre-expanded with TBD
        // If title has "/", it's likely a medley
        const isMedley = title.includes('/');
        const subTitles = isMedley ? title.split('/').map(s => s.trim()) : [title];
        
        if (subTitles.length > 1) {
             // It's a medley
             subTitles.forEach((subTitle, idx) => {
                 tracks.push({
                     id: `${path.basename(url, '.htm')}-${num}${String.fromCharCode(97 + idx)}`,
                     title: subTitle,
                     genre: genre, // Assume same genre for all
                     start: idx === 0 ? start : 'TBD',
                     end: idx === subTitles.length - 1 ? end : 'TBD'
                 });
             });
        } else {
            // Single tune
            tracks.push({
                id: `${path.basename(url, '.htm')}-${num}`,
                title: title,
                genre: genre,
                start: start,
                end: end
            });
        }
    }

    return { params: { location, musicians, date, url }, tracks };
}

function generateScript(sessionData) {
    const { params, tracks } = sessionData;
    const sessionName = path.basename(params.url, '.htm');
    const scriptContent = `/**
 * Script to split session: ${sessionName}
 * Source: ${params.url}
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Update to point to the actual downloaded MP3 file
const SOURCE_FILE = String.raw\`C:\\Users\\andre\\Documents\\tunes\\tunes\\scripts\\archive\\MISSING_FILE_${sessionName}.mp3\`;
const OUTPUT_DIR = path.join(__dirname, '../output/${sessionName}');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  if (timeStr.startsWith('.')) timeStr = '0' + timeStr;
  const parts = timeStr.toString().trim().split('.');
  
  if (parts.length === 1) return parseInt(parts[0]);
  
  const minutes = parts[0] === '' ? 0 : parseInt(parts[0]);
  const seconds = parseInt(parts[1]);
  return minutes * 60 + seconds;
}

const sessionInfo = {
  location: "${params.location.replace(/"/g, '\\"')}",
  musicians: "${params.musicians.replace(/"/g, '\\"')}",
  date: "${params.date}",
  sourceUrl: "${params.url}"
};

const tracks = ${JSON.stringify(tracks, null, 2).replace(/"start": "(.*?)"/g, (match, p1) => \`start: '\${p1}'\`).replace(/"end": "(.*?)"/g, (match, p1) => \`end: '\${p1}'\`)};

async function main() {
  console.log('Processing Session: ${sessionName}');
  
  const tunes = [];

  for (const track of tracks) {
    if (track.start === 'TBD' || track.end === 'TBD') {
      console.log(\`Skipping \${track.title} (timestamps TBD)\`);
      continue;
    }

    const startSec = parseTime(track.start);
    const endSec = parseTime(track.end);

    if (startSec === null || endSec === null) continue;
    
    const duration = endSec - startSec;
    if (duration <= 0) continue;

    const outputFile = path.join(OUTPUT_DIR, \`\${track.id}.mp3\`);
    // ffmpeg command
    const cmd = \`ffmpeg -i "\${SOURCE_FILE}" -ss \${startSec} -t \${duration} -c copy -y "\${outputFile}"\`;
    
    try {
      console.log(\`Processing: \${track.title}\`);
      await execPromise(cmd);
      
      tunes.push({
        id: track.id,
        title: track.title,
        genre: track.genre,
        url: \`/audio/\${track.id}.mp3\`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        date: sessionInfo.date
      });
    } catch (err) {
      console.error(\`Error processing \${track.title}:\`, err.message);
    }
  }

  const jsonPath = path.join(OUTPUT_DIR, 'tunes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tunes, null, 2));
  console.log(\`Wrote metadata to \${jsonPath}\`);
}

main().catch(console.error);
`;
    return scriptContent;
}

async function run() {
    console.log("Starting scrape...");
    
    for (const collectionPage of COLLECTIONS) {
        const url = BASE_URL + collectionPage;
        console.log(`Fetching collection: ${url}`);
        const html = await fetchPage(url);
        if (!html) continue;

        const sessionLinks = extractLinks(html, BASE_URL);
        console.log(`Found ${sessionLinks.length} sessions in ${collectionPage}`);

        for (const sessionUrl of sessionLinks) {
            console.log(`  Scraping session: ${sessionUrl}`);
            const sessionHtml = await fetchPage(sessionUrl);
            if (!sessionHtml) continue;

            const sessionData = parseSessionPage(sessionHtml, sessionUrl);
            if (sessionData.tracks.length === 0) {
                console.log("    No tracks found (regex mismatch?)");
                continue;
            }

            const scriptContent = generateScript(sessionData);
            const scriptName = `split-${path.basename(sessionUrl, '.htm')}.js`;
            fs.writeFileSync(path.join(OUTPUT_DIR, scriptName), scriptContent);
            console.log(`    Generated ${scriptName}`);
        }
    }
    console.log("Done!");
}

run();
