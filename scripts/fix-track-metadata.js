/**
 * Fix track metadata: change genre to type, remove type prefix from titles
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'split-doolin-session.js');
let content = fs.readFileSync(inputFile, 'utf8');

// Replace genre: with type: and remove type prefix from titles
const replacements = [
  // Change all genre: to type:
  { from: /    genre: /g, to: "    type: " },
  
  // Remove type prefixes from titles
  { from: /title: "Reel: /g, to: 'title: "' },
  { from: /title: "Jig: /g, to: 'title: "' },
  { from: /title: "Double Jig: /g, to: 'title: "' },
  { from: /title: "Hornpipe: /g, to: 'title: "' },
  { from: /title: "Hp: /g, to: 'title: "' },
  { from: /title: "Waltz: /g, to: 'title: "' },
  { from: /title: "Polka: /g, to: 'title: "' },
  { from: /title: "Song: /g, to: 'title: "' },
  { from: /title: "Set dance: /g, to: 'title: "' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(inputFile, content, 'utf8');
console.log('✓ Updated split-doolin-session.js');
console.log('  - Changed genre → type');
console.log('  - Removed type prefixes from titles');
