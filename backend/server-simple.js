import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load tunes from JSON file
const TUNES_FILE = path.join(__dirname, 'data', 'tunes.json');
let tunesData = {};
try {
  const tunesJson = fs.readFileSync(TUNES_FILE, 'utf-8');
  tunesData = JSON.parse(tunesJson);
  console.log(`✓ Loaded ${Object.keys(tunesData).length} tunes from JSON`);
} catch (error) {
  console.error('Error loading tunes.json:', error);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set permissive CSP for development
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:; connect-src *;");
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('<h1>🎵 Tunes API (Simple)</h1><p>Backend is running on port 3000. Access frontend at <a href="http://localhost:5173">http://localhost:5173</a>.</p>');
});

// Serve audio files from the output directory
app.use('/audio', express.static(path.join(__dirname, '..', 'output')));

// Serve static frontend build files (for production)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// ============ TUNES ENDPOINTS ============

// Get all tunes
app.get('/api/tunes', (req, res) => {
  try {
    const tunes = Object.values(tunesData);
    res.json(tunes);
  } catch (error) {
    console.error('Error fetching tunes:', error);
    res.status(500).json({ error: 'Failed to fetch tunes' });
  }
});

// Get single tune by ID
app.get('/api/tunes/:id', (req, res) => {
  try {
    const tune = tunesData[req.params.id];
    if (!tune) {
      res.status(404).json({ error: 'Tune not found' });
      return;
    }
    res.json(tune);
  } catch (error) {
    console.error('Error fetching tune:', error);
    res.status(500).json({ error: 'Failed to fetch tune' });
  }
});

// Search endpoint (basic implementation)
app.get('/api/search', (req, res) => {
  try {
    const { q, region, key, genre, type } = req.query;
    let results = Object.values(tunesData);
    
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(tune => 
        tune.title.toLowerCase().includes(query) ||
        tune.artist.toLowerCase().includes(query)
      );
    }
    
    if (region) {
      results = results.filter(tune => tune.region === region);
    }
    
    if (key) {
      results = results.filter(tune => tune.key === key);
    }
    
    if (genre) {
      results = results.filter(tune => tune.genre === genre);
    }
    
    if (type) {
      results = results.filter(tune => tune.type === type);
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error searching tunes:', error);
    res.status(500).json({ error: 'Failed to search tunes' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Tunes API server running on http://localhost:${PORT}`);
  console.log(`   API available at http://localhost:${PORT}/api/tunes`);
});
