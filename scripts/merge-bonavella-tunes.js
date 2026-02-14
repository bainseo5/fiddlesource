import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BONAVELLA_TUNES_PATH = path.join(__dirname, 'bonavella-tunes.json');
const TUNES_DB_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.json');
const BACKUP_PATH = path.join(__dirname, '..', 'backend', 'data', 'tunes.before-bonavella.json');

async function main() {
  console.log('\n=== Merging Bonavella Tunes into Database ===\n');
  
  // Read both files
  const bonavellaTunes = JSON.parse(await fs.readFile(BONAVELLA_TUNES_PATH, 'utf-8'));
  const existingTunes = JSON.parse(await fs.readFile(TUNES_DB_PATH, 'utf-8'));
  
  // Create backup
  await fs.writeFile(BACKUP_PATH, JSON.stringify(existingTunes, null, 2));
  console.log(`✓ Backup created: ${BACKUP_PATH}`);
  
  // Merge tunes
  const mergedTunes = { ...existingTunes };
  let addedCount = 0;
  
  for (const tune of bonavellaTunes) {
    if (!mergedTunes[tune.id]) {
      mergedTunes[tune.id] = tune;
      addedCount++;
      console.log(`✓ Added: ${tune.title}`);
    } else {
      console.log(`⊘ Skipped (already exists): ${tune.title}`);
    }
  }
  
  // Save merged data
  await fs.writeFile(TUNES_DB_PATH, JSON.stringify(mergedTunes, null, 2));
  
  console.log(`\n✓ Merged ${addedCount} Bonavella tunes into database`);
  console.log(`Total tunes: ${Object.keys(mergedTunes).length}`);
  
  // Count by collection
  const collections = {};
  Object.values(mergedTunes).forEach(tune => {
    const col = tune.sourceCollection || 'Unknown';
    collections[col] = (collections[col] || 0) + 1;
  });
  
  console.log('\nTunes by session:');
  Object.entries(collections).forEach(([name, count]) => {
    console.log(`  ${name}: ${count}`);
  });
}

main().catch(console.error);
