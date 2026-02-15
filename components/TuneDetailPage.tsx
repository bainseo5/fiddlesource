import React, { useState } from 'react';
import { Tune } from '../types';
import { X, ArrowLeft, Heart, Share2, Info } from 'lucide-react';
import joecooleyInfo from '../data/joecooley-info.json'; 

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
  const isCooleyTune = tune.collection === "The Joe Cooley Tapes" || tune.source.includes("Joe Cooley");

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
          
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mt-16 pr-16">{tune.title}</h1>
          <div className="mt-2 flex flex-wrap gap-x-2 text-amber-100">
            {tune.artist.split(',').map((artist, index, array) => (
              <React.Fragment key={index}>
                <span>{artist.trim()}</span>
                {index < array.length - 1 && <span className="text-amber-200/50">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Tune Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase">Type</p>
              <p className="text-stone-100 text-lg font-bold mt-1">{tune.type || tune.genre}</p>
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
            {tune.sourceCollection && tune.sourceCollection !== tune.source && (
              <>
                <p className="text-amber-400 text-sm mt-2 font-semibold">
                  {tune.recordingType === 'session' ? 'Session Source' : 'Collection Source'}
                </p>
                <p className="text-stone-300 text-sm mt-1">{tune.sourceCollection}</p>
                <p className="text-stone-500 text-xs mt-1">
                  {tune.sourceCollection.includes("John Joe Healy") 
                    ? "John Joe Healy Collection - Clare Library"
                    : tune.sourceCollection.includes("Joe Cooley")
                    ? "The Joe Cooley Tapes"
                    : "BR Taylor Collection - Clare Library"}
                </p>
              </>
            )}
            {tune.originalUrl && (
              <div className="mt-3">
                 <a 
                   href={tune.originalUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center text-amber-500 hover:text-amber-400 text-sm hover:underline"
                 >
                   View original source
                   <Share2 className="w-3 h-3 ml-1" />
                 </a>
              </div>
            )}
          </div>

          {/* Joe Cooley Collection Info */}
          {isCooleyTune && (
            <div className="bg-stone-800/50 border border-stone-700 rounded p-4 font-serif">
               <div className="flex items-start gap-3">
                 <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                 <div>
                   <h3 className="text-amber-100 font-bold mb-2">About The Joe Cooley Tapes</h3>
                   <p className="text-stone-300 text-sm leading-relaxed mb-3">
                     {joecooleyInfo.introduction}
                   </p>
                   <p className="text-stone-400 text-xs italic">
                     Recordings by {joecooleyInfo.recordingDetails.recorders.join(' & ')} ({joecooleyInfo.recordingDetails.years}). 
                     Curated by {joecooleyInfo.credits.curator}.
                   </p>
                 </div>
               </div>
            </div>
          )}

          {/* Instruments */}
          {tune.instruments && (
            <div className="bg-stone-800 rounded p-4">
              <p className="text-stone-400 text-xs font-semibold uppercase mb-2">Musicians & Instruments</p>
              <p className="text-stone-300 text-sm leading-relaxed">{tune.instruments}</p>
            </div>
          )}

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
