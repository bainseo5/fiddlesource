export interface Tune {
  id: string;
  title: string;
  artist: string;
  source: string;
  region: string;
  key: string;
  tuning: string;
  year: string;
  audioUrl: string;
  description: string;
  genre: string;
  startTime?: number;
  duration?: number;
  sourceCollection?: string;
  isImported?: boolean;
  fileCutSource?: boolean;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: string;
  tunes?: Tune[];
}

export interface PlaybackHistoryEntry {
  id: string;
  userId: string;
  tuneId: string;
  playedAt: string;
  duration?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}
