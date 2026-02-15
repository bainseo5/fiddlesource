
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS_DIR = path.join(__dirname, 'generated-session-scripts');

// The new tunes.push schema we want to inject
const NEW_PUSH_BLOCK = `
      // ENHANCED METADATA SCHEMA
      tunes.push({
        id: track.id,
        title: track.title,
        genre: 'Irish Traditional',
        type: track.genre, // Maps 'Reel'/'Jig' to type
        url: \`/audio/\${track.id}.mp3\`,
        source: sessionInfo.location,
        musicians: sessionInfo.musicians,
        artist: sessionInfo.artist || sessionInfo.musicians,
        date: sessionInfo.date,
        year: sessionInfo.date ? sessionInfo.date.slice(-4) : "Unknown", // Attempt to extract year
        collection: sessionInfo.collection,
        sourceCollection: sessionInfo.collection, 
        region: sessionInfo.region || "County Clare", // Default if missing
        recordingType: sessionInfo.recordingType || 'session',
        description: \`Recorded at \${sessionInfo.location} on \${sessionInfo.date}.\nMusicians: \${sessionInfo.musicians}.\nPart of \${sessionInfo.collection}.\`,
        isImported: true
      });`;

async function updateScripts() {
    const files = fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.js'));
    let count = 0;

    for (const file of files) {
        if (file === 'split-mullagh-session.js' || file === 'split-bonavella-session.js') {
            continue; // Skip the ones we already manually fixed
        }

        const filePath = path.join(SCRIPTS_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // check if already updated
        if (content.includes('ENHANCED METADATA SCHEMA')) {
            console.log(`Skipping ${file} (already updated)`);
            continue;
        }

        // 1. Replace the tunes.push({...}) block
        // Regex looks for tunes.push({ ... }); handling multiline
        const pushRegex = /tunes\.push\(\{(?:[^{}]|{[^{}]*})*\}\);/g;
        
        if (!pushRegex.test(content)) {
            console.warn(`⚠️ Could not find tunes.push block in ${file}`);
            continue;
        }

        content = content.replace(pushRegex, NEW_PUSH_BLOCK);

        // 2. Ensure sessionInfo has 'region' if missing
        if (!content.includes('region:')) {
             content = content.replace(/const sessionInfo = {/, `const sessionInfo = {\n  region: "County Clare",`);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated schema in ${file}`);
        count++;
    }

    console.log(`\n🎉 Updated ${count} scripts to the new schema!`);
}

updateScripts();
