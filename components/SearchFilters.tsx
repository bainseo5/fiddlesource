
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFilterProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onClear: () => void;
}

export const SearchFiltersBar: React.FC<SearchFilterProps> = ({ filters, setFilters, onClear }) => {
  const regions = ['Kentucky', 'Texas', 'North Carolina', 'Georgia', 'West Virginia', 'Tennessee'];
  const keys = ['A', 'D', 'G', 'C', 'F'];

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

            {(filters.query || filters.region || filters.key) && (
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
