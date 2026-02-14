import React, { useState } from 'react';
import { Tune } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { X, ArrowLeft, Download, Heart, Share2 } from 'lucide-react';

interface TuneDetailPageProps {
  tune: Tune;
  onClose: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
}

export const TuneDetailPage: React.FC<TuneDetailPageProps> = ({ 
  tune, 
  onClose, 
  isSaved = false,
  onSave,
  onRemove
}) => {
  const [currentTune] = useState<Tune>(tune);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 overflow-y-auto pt-20 pb-40">
      <div className="max-w-4xl mx-auto bg-stone-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-stone-900 px-6 py-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-stone-400 hover:text-white transition-colors p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mt-8 pr-16">{tune.title}</h1>
          <p className="text-amber-100 mt-2">{tune.artist}</p>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Tune Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase">Genre</p>
              <p className="text-stone-100 text-lg font-bold mt-1">{tune.genre}</p>
            </div>
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase">Key</p>
              <p className="text-stone-100 text-lg font-bold mt-1">{tune.key}</p>
            </div>
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase">Region</p>
              <p className="text-stone-100 text-lg font-bold mt-1">{tune.region}</p>
            </div>
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase">Year</p>
              <p className="text-stone-100 text-lg font-bold mt-1">{tune.year}</p>
            </div>
          </div>

          {/* Description */}
          {tune.description && (
            <div>
              <h2 className="text-xl font-bold text-amber-50 mb-2">About</h2>
              <p className="text-stone-300 leading-relaxed">{tune.description}</p>
            </div>
          )}

          {/* Source Information */}
          <div className="border-l-4 border-amber-600 pl-4 py-2 bg-stone-800 rounded">
            <p className="text-stone-400 text-sm font-semibold uppercase">Source</p>
            <p className="text-stone-200 mt-1">{tune.source}</p>
            {tune.sourceCollection && (
              <p className="text-stone-400 text-sm mt-1">{tune.sourceCollection}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isSaved ? (
              <button
                onClick={onRemove}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-500 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-current" />
                Remove Offline Copy
              </button>
            ) : (
              <button
                onClick={onSave}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded hover:bg-amber-500 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Save Offline
              </button>
            )}
            <button
              className="flex-1 px-4 py-3 bg-stone-700 text-white rounded hover:bg-stone-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer 
        currentTune={currentTune}
        onStop={onClose}
        autoPlay={false}
      />
    </div>
  );
};
