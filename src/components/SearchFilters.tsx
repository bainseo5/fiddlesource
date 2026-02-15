
import React, { useMemo } from 'react';
import { Search, Filter, X, Grid3x3, Library, Music2, List, Star, User } from 'lucide-react';
import { SearchFilters, ViewMode } from '../types';

interface SearchFilterProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onClear: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  collections: string[];
  sessions: string[];
  artists: string[];
}

export const SearchFiltersBar: React.FC<SearchFilterProps> = ({ filters, setFilters, onClear, viewMode, setViewMode, collections, sessions, artists }) => {
  const regions = ['Doolin', 'Mullagh', 'Tulla'];
  const keys = ['G', 'D', 'A', 'Em', 'A Dorian', 'D Mixolydian', 'A Mixolydian', 'E Dorian', 'G Mixolydian'];
  const instruments = ['Tin whistle', 'Fiddle', 'Accordion', 'Flute', 'Uilleann pipes', 'Piano', 'Bodhrán'];

  // Flatten and normalize artist list for the dropdown
  const uniqueArtists = useMemo(() => {
    // We already receive a flattened list of artists from App.tsx, but let's double check unique and sort
    const normalized = new Set(artists.map(a => a.trim()).filter(Boolean));
    return Array.from(normalized).sort();
  }, [artists]);

  return (
    <div className="bg-white border-b border-stone-200 sticky top-0 z-30 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search tunes, artists, or sources..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-amber-500 text-white rounded-lg' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-amber-500 text-white rounded-lg' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('sessions')}
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'sessions' 
                    ? 'bg-amber-500 text-white rounded-lg' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <Library className="w-4 h-4" />
                Sessions
              </button>
            </div>

            {/* Show New Only Toggle */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, showNewOnly: !prev.showNewOnly }))}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                filters.showNewOnly 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title={filters.showNewOnly ? 'Showing newly added tunes only' : 'Showing all tunes'}
            >
              <Star className={`w-4 h-4 ${filters.showNewOnly ? 'fill-current' : ''}`} />
              {filters.showNewOnly ? 'New Only' : 'All Tunes'}
            </button>

            {/* Artist Filter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <User className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none max-w-xs"
                value={filters.artist}
                onChange={(e) => setFilters(prev => ({ ...prev, artist: e.target.value }))}
              >
                <option value="">All Artists</option>
                {uniqueArtists.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <Library className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none max-w-xs"
                value={filters.collection}
                onChange={(e) => setFilters(prev => ({ ...prev, collection: e.target.value }))}
              >
                <option value="">All Collections</option>
                {collections.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <Library className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none max-w-xs"
                value={filters.session}
                onChange={(e) => setFilters(prev => ({ ...prev, session: e.target.value }))}
              >
                <option value="">All Sessions</option>
                {sessions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <Filter className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none"
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              >
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <Music className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none"
                value={filters.key}
                onChange={(e) => setFilters(prev => ({ ...prev, key: e.target.value }))}
              >
                <option value="">All Keys</option>
                {keys.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600">
              <Music2 className="w-4 h-4" />
              <select 
                className="bg-transparent focus:outline-none"
                value={filters.instrument}
                onChange={(e) => setFilters(prev => ({ ...prev, instrument: e.target.value }))}
              >
                <option value="">All Instruments</option>
                {instruments.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {(filters.query || filters.region || filters.key || filters.collection || filters.session || filters.instrument || !filters.showNewOnly) && (
              <button 
                onClick={onClear}
                className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 p-2"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const Music: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
