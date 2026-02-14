
import React from 'react';
import { Tune } from '../types';
import { Play, MapPin, Music, Calendar, Info, Scissors, Layers, Upload, X } from 'lucide-react';

interface TuneCardProps {
  tune: Tune;
  onPlay: (tune: Tune) => void;
  onShowDetails: (tune: Tune) => void;
  onDelete?: (tune: Tune) => void;
  isPlaying: boolean;
}

export const TuneCard: React.FC<TuneCardProps> = ({ tune, onPlay, onShowDetails, onDelete, isPlaying }) => {
  return (
    <div className={`group relative bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-amber-300 ${isPlaying ? 'ring-2 ring-amber-500 shadow-xl shadow-amber-100' : ''}`}>
      <div className="absolute top-0 right-0 p-2 flex gap-1 z-10">
        {tune.isImported && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-blue-200">
            <Upload className="w-2.5 h-2.5" />
            IMPORTED
          </div>
        )}
        {tune.sourceCollection && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-amber-200">
            <Layers className="w-2.5 h-2.5" />
            COLLECTION
          </div>
        )}
      </div>
      
      {tune.isImported && onDelete && (
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(tune); }}
            className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-500 hover:text-white text-stone-400 rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100 z-20"
            title="Remove Import"
        >
            <X className="w-3.5 h-3.5" />
        </button>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="pr-12">
            <h3 className="text-xl font-bold text-stone-900 mb-1 leading-tight group-hover:text-amber-800 transition-colors line-clamp-2">
              {tune.title}
            </h3>
            <p className="text-stone-600 font-medium text-sm">{tune.artist}</p>
          </div>
          <button
            onClick={() => onPlay(tune)}
            className={`flex-shrink-0 p-3 rounded-full transition-all ${isPlaying ? 'bg-amber-600 text-white shadow-inner' : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'}`}
          >
            <Play className={`w-5 h-5 ${isPlaying ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-3 text-sm text-stone-500 mt-4 border-t border-stone-50 pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span className="truncate">{tune.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-stone-400" />
            <span>Key of {tune.key}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>{tune.year}</span>
          </div>
          <div className="flex items-center gap-2">
            {tune.fileCutSource && tune.startTime === 0 ? (
               <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-stone-400" />
                <span className="truncate">{tune.genre}</span>
              </div>
            ) : tune.startTime !== undefined && tune.startTime > 0 ? (
              <div className="flex items-center gap-1.5 text-amber-600 font-mono text-xs font-bold">
                <Scissors className="w-3 h-3" />
                {Math.floor(tune.startTime / 60)}:{(tune.startTime % 60).toString().padStart(2, '0')}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-[10px] font-bold border border-stone-300 rounded text-stone-400">T</div>
                <span className="truncate">{tune.tuning}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 flex gap-2">
        <button 
          onClick={() => onShowDetails(tune)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-stone-50 border border-stone-200 rounded-md text-[10px] font-bold text-stone-500 hover:bg-stone-100 hover:text-stone-800 tracking-widest transition-all"
        >
          <Info className="w-3 h-3" />
          {tune.isImported ? 'ANALYSIS' : 'ARCHIVE DATA'}
        </button>
      </div>
    </div>
  );
};