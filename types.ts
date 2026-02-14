
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
  startTime?: number; // In seconds
  duration?: number; // In seconds, for precise segment extraction
  sourceCollection?: string;
  isImported?: boolean;
  fileCutSource?: boolean; // Indicates if this tune's audioUrl points to a physically cut segment
}

export interface SearchFilters {
  query: string;
  region: string;
  key: string;
  genre: string;
}