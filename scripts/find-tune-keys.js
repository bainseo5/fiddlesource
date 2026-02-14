/**
 * Script to find tune keys from TheSession.org API
 * Queries the API for each tune in the database and extracts the most common key
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the tunes database
const tunesPath = path.join(__dirname, '../backend/data/tunes.json');
const tunes = JSON.parse(fs.readFileSync(tunesPath, 'utf8'));

// Clean up tune titles to extract just the tune name
function cleanTuneName(title) {
  // Remove prefixes like "Reel_", "Jig_", etc.
  let cleaned = title.replace(/^(Reel|Jig|Hornpipe|Waltz|Polka|Song|Set dance|Double Jig|Hp)[\s_:]*/i, '');
  
  // For multi-tune titles like "Reels (2)_ X_Y", split and return first tune
  if (cleaned.includes('_')) {
    cleaned = cleaned.split('_')[0].trim();
  }
  
  // Remove fragments and other notes in parentheses at the end
  cleaned = cleaned.replace(/\s*[–-]\s*fragment.*$/i, '');
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/g, '');
  
  return cleaned.trim();
}

// Normalize key names from TheSession.org format to simple format
function normalizeKey(sessionKey) {
  const keyMap = {
    'Adorian': 'A Dorian',
    'Amixolydian': 'A Mixolydian',
    'Amajor': 'A',
    'Aminor': 'Am',
    'Bmajor': 'B',
    'Bminor': 'Bm',
    'Cmajor': 'C',
    'Cminor': 'Cm',
    'Dmajor': 'D',
    'Dminor': 'Dm',
    'Dmixolydian': 'D Mixolydian',
    'Ddorian': 'D Dorian',
    'Emajor': 'E',
    'Eminor': 'Em',
    'Edorian': 'E Dorian',
    'Fmajor': 'F',
    'Fminor': 'Fm',
    'Gmajor': 'G',
    'Gminor': 'Gm',
    'Gdorian': 'G Dorian'
  };
  
  return keyMap[sessionKey] || sessionKey;
}

// Manual mapping for tunes we've already looked up
const knownKeys = {
  'Down the Broom': 'A Dorian',
  'Gatehouse Maid': 'G',
  "Coleman's Cross": 'G',
  'Christmas Eve': 'G',
  'Rakish Paddy': 'A Dorian',
};

// Function to query TheSession.org API
async function findTuneKey(tuneName) {
  // Check if we already know this key
  if (knownKeys[tuneName]) {
    return knownKeys[tuneName];
  }
  
  try {
    const searchUrl = `https://thesession.org/tunes/search?q=${encodeURIComponent(tuneName)}&format=json`;
    console.log(`Searching for: ${tuneName}`);
    
    // Using fetch (Node 18+) or you can use node-fetch
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.tunes && data.tunes.length > 0) {
      const tuneId = data.tunes[0].id;
      
      // Get detailed info for this tune
      const detailUrl = `https://thesession.org/tunes/${tuneId}?format=json`;
      const detailResponse = await fetch(detailUrl);
      const tuneDetail = await detailResponse.json();
      
      if (tuneDetail.settings && tuneDetail.settings.length > 0) {
        // Find the most common key
        const keyCounts = {};
        tuneDetail.settings.forEach(setting => {
          const key = setting.key;
          keyCounts[key] = (keyCounts[key] || 0) + 1;
        });
        
        // Get the most common key
        const mostCommonKey = Object.entries(keyCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        const normalizedKey = normalizeKey(mostCommonKey);
        console.log(`  ✓ Found: ${tuneName} -> ${normalizedKey} (${data.tunes[0].type})`);
        return normalizedKey;
      }
    }
    
    console.log(`  ✗ Not found: ${tuneName}`);
    return '?';
  } catch (error) {
    console.error(`  ✗ Error querying ${tuneName}:`, error.message);
    return '?';
  }
}

// Process all tunes
async function processAllTunes() {
  const results = {};
  const uniqueTunes = new Set();
  
  // Extract unique tune names
  for (const [id, tune] of Object.entries(tunes)) {
    const cleanName = cleanTuneName(tune.title);
    if (cleanName && cleanName !== 'Gan ainm' && !cleanName.includes('?')) {
      uniqueTunes.add(cleanName);
    }
  }
  
  console.log(`\nFound ${uniqueTunes.size} unique tunes to look up\n`);
  
  // Query each tune (with delay to be respectful to the API)
  for (const tuneName of Array.from(uniqueTunes).sort()) {
    const key = await findTuneKey(tuneName);
    results[tuneName] = key;
    
    // Wait 500ms between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'tune-keys-found.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✓ Results saved to: ${outputPath}`);
  console.log(`\nSummary:`);
  console.log(`  Total tunes: ${Object.keys(results).length}`);
  console.log(`  Found: ${Object.values(results).filter(k => k !== '?').length}`);
  console.log(`  Not found: ${Object.values(results).filter(k => k === '?').length}`);
  
  return results;
}

// Run the script
processAllTunes().catch(console.error);
