
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Output to a new folder called 'generated-session-scripts' in the scripts folder
const OUTPUT_DIR = path.join(__dirname, '../generated-session-scripts');

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
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+\.htm)["'][^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.includes('index') && !href.includes('about') && !href.includes('musicians')) {
       // Convert relative to absolute
       try {
         const fullUrl = new URL(href, baseUrl).href;
         if (fullUrl.includes('/music/live/') && !fullUrl.endsWith('/live/')) {
           links.push(fullUrl);
         }
       } catch (e) {
           console.log(`Skipping invalid URL: ${href}`);
       }
    }
  }
  return [...new Set(links)]; // Dedupe
}

function parseSessionPage(html, url) {
    let location = "Unknown Location";
    let musicians = "Unknown Musicians";
    let date = "Unknown Date";
    const tracks = [];
    
    // NEW: Extract Collection & Recording Type logic
    let collection = "Unknown Collection";
    if (url.includes('_T')) collection = "Barry Taylor Collection";
    else if (url.includes('_JH')) collection = "John Joe Healy Collection";
    else if (url.includes('_CM-WC') || url.includes('_CM-LI')) collection = "Carroll-Mackenzie Collection";

    // Crude text extraction
    const cleanText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Try to extract Location & Date
    // Pattern: "Recorded in [Location], [Date]" 
    // Example: "Recorded in O’Connor’s Bar, Fisherstreet, Doolin, 1962"
    const locMatch = cleanText.match(/Recorded in (.*?)(\d{4})/i);
    if (locMatch) {
        location = locMatch[1].trim().replace(/,$/, '');
        date = locMatch[2];
    }

    // Try to extract Musicians
    // Pattern: "Musicians: [List]" or "with [List]"
    const musMatch = cleanText.match(/(?:Musicians:|with) (.*?)(?:Recorded|Singers|Items|$)/i);
    if (musMatch) {
        musicians = musMatch[1].trim();
    }

    // Determine Recording Type (Solo vs Session)
    // Heuristic: If musicians string contains commas or "and", assume Session. Else Solo.
    const isSession = (musicians.includes(',') || musicians.includes(' and ')) && !musicians.includes('Unknown');
    const recordingType = isSession ? "Session" : "Solo";

    // Extract Tracks
    // Pattern: 1. Title (Type) (Start - End)
    // Regex needs to be robust for "Reels (2):" and simple "Reel:"
    const trackRegex = /(\d+)\.\s+(.*?)\s*\(([\d\.]+)\s*[–-]\s*([\d\.]+)\)/g;
    let trackMatch;
    
    while ((trackMatch = trackRegex.exec(cleanText)) !== null) {
        const [full, num, titleAndType, start, end] = trackMatch;
        let title = titleAndType.trim();
        let genre = "Tune";

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
        
        // Handle Medleys
        const isMedley = title.includes('/');
        const subTitles = isMedley ? title.split('/').map(s => s.trim()) : [title];
        
        if (subTitles.length > 1) {
             subTitles.forEach((subTitle, idx) => {
                 tracks.push({
                     id: `${path.basename(url, '.htm')}-${num}${String.fromCharCode(97 + idx)}`,
                     title: subTitle,
                     genre: genre,
                     start: idx === 0 ? start : 'TBD',
                     end: idx === subTitles.length - 1 ? end : 'TBD'
                 });
             });
        } else {
            tracks.push({
                id: `${path.basename(url, '.htm')}-${num}`,
                title: title,
                genre: genre,
                start: start,
                end: end
            });
        }
    }

    return { params: { location, musicians, date, collection, recordingType, url }, tracks };
}

function generateScript(sessionData) {
    const { params, tracks } = sessionData;
    const sessionName = path.basename(params.url, '.htm');
    
    // Construct valid variable strings
    const safeLocation = params.location.replace(/"/g, '\\"');
    const safeMusicians = params.musicians.replace(/"/g, '\\"');
    const safeCollection = params.collection.replace(/"/g, '\\"');
    const safeRecordingType = params.recordingType.replace(/"/g, '\\"');

    // Pre-calculate the tracks string to avoid nested template literal hell
    let tracksString = JSON.stringify(tracks, null, 2);
    // Convert "start": "value" to start: 'value' (optional cosmetic change for readability)
    tracksString = tracksString.replace(/"start": "(.*?)"/g, "start: '$1'");
    tracksString = tracksString.replace(/"end": "(.*?)"/g, "end: '$1'");
    // Also remove quotes from keys for the "Doolin style" look if desired, but JSON is valid JS too.
    // Let's stick to valid JSON property names but single quoted values for start/end if we want.
    // Actually, simply using the JSON string is fine, JS accepts quoted keys.
    // But the user likes the "easy to read" style.
    
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
const OUTPUT_DIR = path.join(__dirname, '../output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseTime(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  // Format could be .02, 1.45, 1.05.33
  // Normalize to 0.02 if .02
  let cleanTime = timeStr.toString().trim();
  if (cleanTime.startsWith('.')) cleanTime = '0' + cleanTime;
  
  const parts = cleanTime.split('.');
  
  if (parts.length === 3) {
      // H.MM.SS
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseInt(parts[2]) || 0;
      return h * 3600 + m * 60 + s;
  }
  
  if (parts.length === 2) {
      // MM.SS
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      return m * 60 + s;
  }
  
  if (parts.length === 1) {
      return parseInt(cleanTime);
  }
  
  return 0;
}

const sessionInfo = {
  location: "${safeLocation}",
  musicians: "${safeMusicians}",
  date: "${params.date}",
  collection: "${safeCollection}",
  recordingType: "${safeRecordingType}",
  sourceUrl: "${params.url}"
};

const tracks = ${tracksString};

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

    if (startSec === null || endSec === null) {
         console.log(\`Skipping \${track.title} (invalid time format)\`);
         continue;
    }

    const duration = endSec - startSec;
    if (duration <= 0) {
        console.log(\`Skipping \${track.title} (negative/zero duration)\`);
        continue;
    }

    const outputFile = path.join(OUTPUT_DIR, \`\${track.id}.mp3\`);
    // ffmpeg command - using copy to keyframe might be inaccurate but fast. 
    // re-encoding is safer for precision but lossy. 
    // User requested "easy" style which uses copy.
    const cmd = \`ffmpeg -i "\${SOURCE_FILE}" -ss \${startSec} -t \${duration} -c copy -y "\${outputFile}"\`;
    
    try {
      console.log(\`Processing: \${track.title} (\${track.start} - \${track.end})\`);
      await execPromise(cmd);
      
      tunes.push({
        id: track.id,
        title: track.title,
        genre: track.genre,
        url: \`/audio/\${track.id}.mp3\`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        date: sessionInfo.date,
        collection: sessionInfo.collection,
        recordingType: sessionInfo.recordingType
      });
    } catch (err) {
      console.error(\`Error processing \${track.title}:\`, err.message);
    }
  }

  const jsonPath = path.join(OUTPUT_DIR, '${sessionName}-tunes.json');
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
            const scriptPath = path.join(OUTPUT_DIR, scriptName);
            fs.writeFileSync(scriptPath, scriptContent);
            console.log(`    Generated ${scriptName}`);
        }
    }
    console.log("Done!");
}

run();
