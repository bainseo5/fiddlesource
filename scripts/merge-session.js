import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial configuration
const TUNES_DB_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.json');

async function main() {
  // 1. Get input file from command line args
  const inputFileArg = process.argv[2];
  
  if (!inputFileArg) {
    console.error('Error: Please provide the path to the new tunes JSON file.');
    console.error('Usage: node scripts/merge-session.js <path-to-new-tunes.json>');
    process.exit(1);
  }

  const INPUT_PATH = path.resolve(process.cwd(), inputFileArg);
  
  try {
    await fs.access(INPUT_PATH);
  } catch {
    console.error(`Error: File not found at ${INPUT_PATH}`);
    process.exit(1);
  }

  console.log(`\n=== Merging ${path.basename(INPUT_PATH)} into Database ===\n`);

  try {
    // 2. Read files
    const newTunes = JSON.parse(await fs.readFile(INPUT_PATH, 'utf-8'));
    
    // Handle if the input is an array or object (tunes.json is usually an array of tune objects or object with keys?)
    // Let's check how tunes.json is structured.
    // Based on previous reads, tunes.json seems to be an Object where keys are IDs relative to the read logic in merge-bonavella-tunes.js:
    // "for (const [tuneId, tune] of Object.entries(tunes))" in one script, but
    // "for (const tune of bonavellaTunes)" in merge-bonavella-tunes.js implies the input is an array
    // and "mergedTunes[tune.id] = tune" implies the DB is an object map or array? 
    
    // Let's double check merge-bonavella-tunes.js logic:
    // const existingTunes = JSON.parse(await fs.readFile(TUNES_DB_PATH, 'utf-8'));
    // const mergedTunes = { ...existingTunes };
    // This strongly suggests existingTunes is an OBJECT (map of id -> tune).
    
    // bonavellaTunes was iterated as "for (const tune of bonavellaTunes)".
    // So input is an Array, DB is an Object.
    
    let existingTunes;
    try {
        existingTunes = JSON.parse(await fs.readFile(TUNES_DB_PATH, 'utf-8'));
    } catch (e) {
        console.log("Could not read existing DB, starting fresh object.");
        existingTunes = {};
    }

    // 3. Create Backup
    const backupName = `tunes.backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const BACKUP_PATH = path.join(path.dirname(TUNES_DB_PATH), backupName);
    
    await fs.writeFile(BACKUP_PATH, JSON.stringify(existingTunes, null, 2));
    console.log(`✓ Backup created: ${BACKUP_PATH}`);

    // 4. Merge
    // Ensure newTunes is an array. If it's an object, convert values.
    const tunesToMerge = Array.isArray(newTunes) ? newTunes : Object.values(newTunes);
    
    let addedCount = 0;
    let skippedCount = 0;

    // We assume existingTunes is an object keyed by ID. 
    // If it's an array, we should probably convert it to object first or check differently, 
    // but based on previous context, it seems to be an object in reading scripts.
    
    // Correction: In merge-bonavella-tunes.js:
    // const mergedTunes = { ...existingTunes };
    // if (!mergedTunes[tune.id]) ...
    // This confirms DB is an ID-keyed object.

    for (const tune of tunesToMerge) {
      if (!tune.id) {
        console.warn(`⚠ Skipping tune without ID: ${tune.title}`);
        continue;
      }

      if (!existingTunes[tune.id]) {
        existingTunes[tune.id] = tune;
        addedCount++;
        // console.log(`✓ Added: ${tune.title}`); // Optional: noisy if many
      } else {
        skippedCount++;
        // console.log(`⊘ Skipped (exists): ${tune.title}`);
      }
    }

    // 5. Save
    await fs.writeFile(TUNES_DB_PATH, JSON.stringify(existingTunes, null, 2));

    console.log(`\nSummary:`);
    console.log(`- Added: ${addedCount}`);
    console.log(`- Skipped (Duplicates): ${skippedCount}`);
    console.log(`- Total in DB: ${Object.keys(existingTunes).length}`);
    console.log(`\n✓ Database updated successfully.`);

  } catch (error) {
    console.error('Error during merge:', error);
    process.exit(1);
  }
}

main().catch(console.error);
