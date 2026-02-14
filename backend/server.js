import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const TUNES_FILE = path.join(DATA_DIR, 'tunes.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
const AUDIO_DIR = path.join(__dirname, '..', '..', 'output');
const FRONTEND_DIR = path.join(__dirname, '..', 'dist');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Read JSON file
const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
};

// Write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static audio files (if they exist)
if (fs.existsSync(AUDIO_DIR)) {
  app.use('/audio', express.static(AUDIO_DIR));
} else {
  console.log('Warning: Audio directory not found at', AUDIO_DIR);
  console.log('Audio files will not be served.');
}

// Serve frontend build (if it exists)
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
}

// Load data
let tunes = readJsonFile(TUNES_FILE);
let stats = readJsonFile(STATS_FILE);

// ============ TUNES ENDPOINTS ============

// Get all tunes
app.get('/api/tunes', (req, res) => {
  const tunesList = Object.values(tunes);
  res.json(tunesList);
});

// Get single tune by ID
app.get('/api/tunes/:id', (req, res) => {
  const tune = tunes[req.params.id];
  if (!tune) {
    return res.status(404).json({ error: 'Tune not found' });
  }
  res.json(tune);
});

// Search tunes
app.get('/api/search', (req, res) => {
  const { query, region, key, genre } = req.query;
  let results = Object.values(tunes);

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(tune =>
      tune.title.toLowerCase().includes(q) ||
      tune.artist.toLowerCase().includes(q) ||
      tune.source.toLowerCase().includes(q)
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

  res.json(results);
});

// ============ PLAYBACK STATS ENDPOINTS ============

// Log playback (anonymous)
app.post('/api/stats/playback', (req, res) => {
  const { tuneId } = req.body;
  if (!tuneId) {
    return res.status(400).json({ error: 'tuneId required' });
  }

  stats[tuneId] = (stats[tuneId] || 0) + 1;
  writeJsonFile(STATS_FILE, stats);
  res.json({ tuneId, playCount: stats[tuneId] });
});

// Get top played tunes
app.get('/api/stats/top-played', (req, res) => {
  const { limit = 10 } = req.query;
  const topPlayed = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, parseInt(limit))
    .map(([tuneId, count]) => ({ tuneId, playCount: count, tune: tunes[tuneId] }))
    .filter(item => item.tune);

  res.json(topPlayed);
});

// Get play count for a specific tune
app.get('/api/stats/tune/:tuneId', (req, res) => {
  const count = stats[req.params.tuneId] || 0;
  res.json({ tuneId: req.params.tuneId, playCount: count });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', tuneCount: Object.keys(tunes).length });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(FRONTEND_DIR, 'index.html'))) {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  } else {
    res.status(404).send('Frontend not found. Deploy completed but frontend build missing.');
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎵 Tunes API started successfully on port ${PORT}`);
  console.log(`📊 Loaded: ${Object.keys(tunes).length} tunes`);
  console.log(`Available:`);
  if (fs.existsSync(AUDIO_DIR)) {
    console.log(`  ✓ Audio files`);
  } else {
    console.log(`  ✗ Audio files not found`);
  }
  if (fs.existsSync(FRONTEND_DIR)) {
    console.log(`  ✓ Frontend build`);
  } else {
    console.log(`  ✗ Frontend build not found (API only)`);
  }
  console.log('');
});
