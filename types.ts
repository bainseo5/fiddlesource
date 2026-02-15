
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
  instruments?: string; // Instruments played on this track
  startTime?: number; // In seconds
  duration?: number; // In seconds, for precise segment extraction
  collection?: string; // Parent collection (e.g., "BR Taylor Collection")
  sourceCollection?: string; // Specific session/tape (e.g., "BR Taylor Collection - O'Connor's Bar Session, 1962")
  isImported?: boolean;
  fileCutSource?: boolean; // Indicates if this tune's audioUrl points to a physically cut segment
}

export interface SearchFilters {
  query: string;
  artist: string;
  region: string;
  key: string;
  genre: string;
  collection: string;
  session: string;
  instrument: string;
  showNewOnly: boolean;
}

export type ViewMode = 'grid' | 'list' | 'sessions';