const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface Tune {
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

// TUNES
export const fetchAllTunes = async (): Promise<Tune[]> => {
  const response = await fetch(`${API_BASE_URL}/tunes`);
  if (!response.ok) throw new Error('Failed to fetch tunes');
  return response.json();
};

export const fetchTuneById = async (id: string): Promise<Tune> => {
  const response = await fetch(`${API_BASE_URL}/tunes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch tune');
  return response.json();
};

export const searchTunes = async (query: string, region?: string, key?: string, genre?: string): Promise<Tune[]> => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (region) params.append('region', region);
  if (key) params.append('key', key);
  if (genre) params.append('genre', genre);

  const response = await fetch(`${API_BASE_URL}/search?${params}`);
  if (!response.ok) throw new Error('Failed to search tunes');
  return response.json();
};

// SIMPLE STATS (anonymous playback tracking)
export const logPlayback = async (tuneId: string): Promise<{ tuneId: string; playCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/stats/playback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tuneId })
  });
  if (!response.ok) throw new Error('Failed to log playback');
  return response.json();
};

export const getTopPlayedTunes = async (limit: number = 10): Promise<Array<{ tuneId: string; playCount: number; tune: Tune }>> => {
  const response = await fetch(`${API_BASE_URL}/stats/top-played?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch top played tunes');
  return response.json();
};

export const getPlayCount = async (tuneId: string): Promise<{ tuneId: string; playCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/stats/tune/${tuneId}`);
  if (!response.ok) throw new Error('Failed to fetch play count');
  return response.json();
};
