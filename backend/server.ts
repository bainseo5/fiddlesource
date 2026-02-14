import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'crypto';
import { initializeDatabase, db } from './db.js';
import { Tune, Playlist, PlaybackHistoryEntry, User } from './types.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load tunes from JSON file
const TUNES_FILE = path.join(__dirname, 'data', 'tunes.json');
let tunesData: Record<string, Tune> = {};
try {
  const tunesJson = fs.readFileSync(TUNES_FILE, 'utf-8');
  tunesData = JSON.parse(tunesJson);
  console.log(`✓ Loaded ${Object.keys(tunesData).length} tunes from JSON`);
} catch (error) {
  console.error('Error loading tunes.json:', error);
}

// Initialize database (for playlists and playback history)
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set permissive CSP for development to avoid browser/devtools issues
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:; connect-src *;");
  next();
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

// Search tunes
app.get('/api/tunes/search', (req, res) => {
  try {
    const { query, region, key, genre } = req.query;
    let sql = 'SELECT * FROM tunes WHERE 1=1';
    const params: unknown[] = [];

    if (query) {
      sql += ' AND (title LIKE ? OR artist LIKE ? OR source LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (region) {
      sql += ' AND region = ?';
      params.push(region);
    }
    if (key) {
      sql += ' AND key = ?';
      params.push(key);
    }
    if (genre) {
      sql += ' AND genre = ?';
      params.push(genre);
    }

    const tunes = db.prepare(sql).all(...params) as Tune[];
    res.json(tunes);
  } catch (error) {
    console.error('Error searching tunes:', error);
    res.status(500).json({ error: 'Failed to search tunes' });
  }
});

// ============ USERS ENDPOINTS ============

// Create user
app.post('/api/users', (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      res.status(400).json({ error: 'Username and email required' });
      return;
    }

    const id = `user_${uuidv4()}`;
    const stmt = db.prepare(
      'INSERT INTO users (id, username, email) VALUES (?, ?, ?)'
    );
    stmt.run(id, username, email);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User;
    res.json(user);
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User | undefined;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============ PLAYLISTS ENDPOINTS ============

// Create playlist
app.post('/api/playlists', (req, res) => {
  try {
    const { userId, name, description } = req.body;
    if (!userId || !name) {
      res.status(400).json({ error: 'UserId and name required' });
      return;
    }

    const id = `playlist_${uuidv4()}`;
    const stmt = db.prepare(
      'INSERT INTO playlists (id, userId, name, description) VALUES (?, ?, ?, ?)'
    );
    stmt.run(id, userId, name, description || null);

    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(id) as Playlist;
    res.json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Get user's playlists
app.get('/api/users/:userId/playlists', (req, res) => {
  try {
    const playlists = db.prepare(
      'SELECT * FROM playlists WHERE userId = ? ORDER BY createdAt DESC'
    ).all(req.params.userId) as Playlist[];
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get playlist with tunes
app.get('/api/playlists/:id', (req, res) => {
  try {
    const playlist = db.prepare(
      'SELECT * FROM playlists WHERE id = ?'
    ).get(req.params.id) as Playlist | undefined;

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    const tunes = db.prepare(
      `SELECT t.* FROM tunes t
       JOIN playlist_tunes pt ON t.id = pt.tuneId
       WHERE pt.playlistId = ?
       ORDER BY pt.position`
    ).all(req.params.id) as Tune[];

    res.json({ ...playlist, tunes });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// Add tune to playlist
app.post('/api/playlists/:playlistId/tunes/:tuneId', (req, res) => {
  try {
    const { playlistId, tuneId } = req.params;

    // Get max position
    const maxPosition = db.prepare(
      'SELECT MAX(position) as maxPos FROM playlist_tunes WHERE playlistId = ?'
    ).get(playlistId) as { maxPos: number | null };

    const position = (maxPosition.maxPos || 0) + 1;
    const id = `pt_${uuidv4()}`;

    const stmt = db.prepare(
      'INSERT INTO playlist_tunes (id, playlistId, tuneId, position) VALUES (?, ?, ?, ?)'
    );
    stmt.run(id, playlistId, tuneId, position);

    res.json({ id, playlistId, tuneId, position });
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Tune already in playlist' });
    } else {
      console.error('Error adding tune to playlist:', error);
      res.status(500).json({ error: 'Failed to add tune to playlist' });
    }
  }
});

// Remove tune from playlist
app.delete('/api/playlists/:playlistId/tunes/:tuneId', (req, res) => {
  try {
    const { playlistId, tuneId } = req.params;
    db.prepare(
      'DELETE FROM playlist_tunes WHERE playlistId = ? AND tuneId = ?'
    ).run(playlistId, tuneId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing tune from playlist:', error);
    res.status(500).json({ error: 'Failed to remove tune from playlist' });
  }
});

// ============ PLAYBACK HISTORY ENDPOINTS ============

// Log playback
app.post('/api/playback-history', (req, res) => {
  try {
    const { userId, tuneId, duration } = req.body;
    if (!userId || !tuneId) {
      res.status(400).json({ error: 'UserId and tuneId required' });
      return;
    }

    const id = `history_${uuidv4()}`;
    const stmt = db.prepare(
      'INSERT INTO playback_history (id, userId, tuneId, duration) VALUES (?, ?, ?, ?)'
    );
    stmt.run(id, userId, tuneId, duration || null);

    const entry = db.prepare('SELECT * FROM playback_history WHERE id = ?').get(id) as PlaybackHistoryEntry;
    res.json(entry);
  } catch (error) {
    console.error('Error logging playback:', error);
    res.status(500).json({ error: 'Failed to log playback' });
  }
});

// Get user's playback history
app.get('/api/users/:userId/playback-history', (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const history = db.prepare(
      `SELECT * FROM playback_history WHERE userId = ?
       ORDER BY playedAt DESC LIMIT ?`
    ).all(req.params.userId, limit) as PlaybackHistoryEntry[];

    res.json(history);
  } catch (error) {
    console.error('Error fetching playback history:', error);
    res.status(500).json({ error: 'Failed to fetch playback history' });
  }
});

// Get user's top played tunes
app.get('/api/users/:userId/top-played', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const topPlayed = db.prepare(
      `SELECT tuneId, COUNT(*) as playCount FROM playback_history
       WHERE userId = ?
       GROUP BY tuneId
       ORDER BY playCount DESC
       LIMIT ?`
    ).all(req.params.userId, limit) as Array<{ tuneId: string; playCount: number }>;

    // Fetch tune details
    const tunes = topPlayed.map(tp => {
      const tune = db.prepare('SELECT * FROM tunes WHERE id = ?').get(tp.tuneId) as Tune;
      return { ...tune, playCount: tp.playCount };
    });

    res.json(tunes);
  } catch (error) {
    console.error('Error fetching top played:', error);
    res.status(500).json({ error: 'Failed to fetch top played tunes' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <body style="font-family: sans-serif; padding: 2rem; line-height: 1.5;">
      <h1>🎵 Tunes API Server (TypeScript)</h1>
      <p>The backend is running successfully on port ${PORT}.</p>
      <p><strong>Frontend:</strong> To view the app, run <code>npm run dev</code> and go to <a href="http://localhost:5173">http://localhost:5173</a>.</p>
    </body>
  `);
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If we're not at the root and not in API, it's a real 404
    res.status(404).json({ error: 'Not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Tunes API server running on http://localhost:${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/api/tunes`);
});
