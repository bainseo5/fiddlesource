import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'tunes.db');

export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export const initializeDatabase = () => {
  // Create tunes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tunes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      source TEXT NOT NULL,
      region TEXT NOT NULL,
      key TEXT,
      tuning TEXT,
      year TEXT,
      audioUrl TEXT NOT NULL,
      description TEXT,
      genre TEXT,
      startTime INTEGER,
      duration INTEGER,
      sourceCollection TEXT,
      isImported BOOLEAN DEFAULT 0,
      fileCutSource BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create playlists table
  db.exec(`
    CREATE TABLE IF NOT EXISTS playlists (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create playlist_tunes table (order matters)
  db.exec(`
    CREATE TABLE IF NOT EXISTS playlist_tunes (
      id TEXT PRIMARY KEY,
      playlistId TEXT NOT NULL,
      tuneId TEXT NOT NULL,
      position INTEGER NOT NULL,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (playlistId) REFERENCES playlists(id) ON DELETE CASCADE,
      FOREIGN KEY (tuneId) REFERENCES tunes(id) ON DELETE CASCADE,
      UNIQUE(playlistId, tuneId)
    )
  `);

  // Create playback_history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS playback_history (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      tuneId TEXT NOT NULL,
      playedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tuneId) REFERENCES tunes(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
};

export default db;
