import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KILTANNON_TUNES_PATH = path.join(__dirname, 'kiltannon-tunes.json');
const TUNES_DB_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.json');
const BACKUP_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.before-kiltannon.json');

async function main() {
  console.log('\n=== Merging Kiltannon Tunes into Database ===\n');
  
  try {
    // Read both files
    const newTunesRaw = await fs.readFile(KILTANNON_TUNES_PATH, 'utf-8');
    const existingTunesRaw = await fs.readFile(TUNES_DB_PATH, 'utf-8');
    
    const newTunes = JSON.parse(newTunesRaw);
    const existingTunes = JSON.parse(existingTunesRaw);
    
    // Create backup
    await fs.writeFile(BACKUP_PATH, existingTunesRaw);
    console.log(`✓ Backup created: ${BACKUP_PATH}`);
    
    // Merge tunes
    // Since both are objects keyed by ID, we can merge them
    const mergedTunes = { ...existingTunes };
    let addedCount = 0;
    let updatedCount = 0;
    
    // Convert newTunes object to array of values if it is an object
    // Or just iterate over keys
    const entries = Array.isArray(newTunes) ? newTunes : Object.values(newTunes);
    
    for (const tune of entries) {
      if (mergedTunes[tune.id]) {
        console.log(`  ! Updating existing tune: ${tune.id}`);
        updatedCount++;
      } else {
        addedCount++;
      }
      mergedTunes[tune.id] = tune;
    }
    
    // Write back to DB
    await fs.writeFile(TUNES_DB_PATH, JSON.stringify(mergedTunes, null, 4));
    
    console.log(`\n✓ Success!`);
    console.log(`  - Added: ${addedCount}`);
    console.log(`  - Updated: ${updatedCount}`);
    console.log(`  - Total tunes: ${Object.keys(mergedTunes).length}`);
    
  } catch (error) {
    console.error('Error merging tunes:', error);
  }
}

main();
