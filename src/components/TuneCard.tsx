import React, { useState, useEffect } from 'react';
import { Tune, SearchFilters } from '../types';
import { Play, MapPin, Music, Calendar, Info, Layers, Library, User, Download, HardDrive, Check } from 'lucide-react';
import { saveToDatabase, getFromDatabase, removeFromDatabase } from '../db';

interface TuneCardProps {
  tune: Tune;
  onPlay: (tune: Tune) => void;
  onShowDetails: (tune: Tune) => void;
  onFilterByTitle: (title: string) => void;
  onFilterByArtist: (artist: string) => void;
  onFilterByCollection: (collection: string) => void;
  onFilterBySession: (session: string) => void;
  isPlaying: boolean;
}

export const TuneCard: React.FC<TuneCardProps> = ({ tune, onPlay, onShowDetails, onFilterByTitle, onFilterByArtist, onFilterByCollection, onFilterBySession, isPlaying }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkOfflineStatus = async () => {
      try {
        const result = await getFromDatabase(tune.id);
        if (mounted) setIsOffline(!!result);
      } catch (error) {
        console.error('Error checking offline status:', error);
      }
    };
    checkOfflineStatus();
    return () => { mounted = false; };
  }, [tune.id]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(tune.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tune.title} - ${tune.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement save to collection functionality
    // For now, show the details modal
    onShowDetails(tune);
  };

  const handleSaveOffline = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isOffline) {
      // If already saved, unsave it
      try {
        await removeFromDatabase(tune.id);
        
        // Also try to clean up from cache if it was stored there by previous version
        try {
          const cache = await caches.open('tunes-offline-v1');
          await cache.delete(tune.audioUrl);
        } catch (err) {
          // Ignore cache errors
        }
        
        setIsOffline(false);
      } catch (error) {
        console.error('Failed to remove offline tune:', error);
        alert('Failed to remove from offline storage.');
      }
      return;
    }

    // Otherwise, save it
    try {
      // 1. Fetch the audio blob
      // Use cache: 'no-store' to ensure we get a fresh copy and avoid CORS/No-CORS cache conflicts
      // (e.g. if the audio was previously played via <audio> which uses no-cors)
      const response = await fetch(tune.audioUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('Network response was not ok');
      
      let blob = await response.blob();
      
      // Ensure the blob has a correct MIME type if missing
      if (!blob.type) {
        const contentType = response.headers.get('content-type') || 'audio/mpeg';
        console.log(`Blob missing type, forcing: ${contentType}`);
        blob = new Blob([blob], { type: contentType });
      }

      console.log(`Saving blob for ${tune.title}: size=${blob.size}, type=${blob.type}`);

      // 2. Save using our db utility
      await saveToDatabase(tune.id, blob, tune);
      
      // 3. Keep cache logic for redundancy/legacy support? Or remove it?
      // Let's keep it for now as it might be used by service worker fetch handler
      try {
        const cache = await caches.open('tunes-offline-v1');
        await cache.put(tune.audioUrl, new Response(blob));
      } catch (err) {
        console.warn('Cache storage failed, but IndexedDB succeeded', err);
      }
      
      setIsOffline(true);
    } catch (error) {
      console.error('Save offline failed:', error);
      alert('Failed to save offline. Please try again.');
    }
  };

  return (
    <div className={`group relative bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-amber-300 ${isPlaying ? 'ring-2 ring-amber-500 shadow-xl shadow-amber-100' : ''}`}>
      <div className="absolute top-0 right-0 p-2 flex gap-1 z-10">
        {(tune.recordingType === 'session' || tune.recordingType === 'Session') && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-amber-200">
            <Layers className="w-2.5 h-2.5" />
            SESSION
          </div>
        )}
        {(tune.recordingType === 'solo' || tune.recordingType === 'Solo') && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-blue-200">
            <User className="w-2.5 h-2.5" />
            SOLO
          </div>
        )}
        {tune.type && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-stone-200">
            <Music className="w-2.5 h-2.5" />
            {tune.type}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <button
              onClick={(e) => { e.stopPropagation(); onFilterByTitle(tune.title); }}
              className="text-left text-xl font-bold text-stone-900 mb-1 leading-tight hover:text-amber-600 hover:underline transition-colors"
              title="Filter by tune name"
            >
              {tune.title}
            </button>
            <div className="flex items-center flex-wrap">
              <User className="w-3 h-3 text-stone-600 flex-shrink-0 mr-1" />
              {tune.artist.split(',').map((artist, index, array) => (
                <React.Fragment key={index}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onFilterByArtist(artist.trim()); }}
                    className="text-left text-stone-600 font-medium text-sm hover:text-amber-600 hover:underline transition-colors"
                    title={`Filter by ${artist.trim()}`}
                  >
                    {artist.trim()}
                  </button>
                  {index < array.length - 1 && <span className="text-stone-400 mx-0.5">,</span>}
                </React.Fragment>
              ))}
              {tune.region && (
                <>
                  <span className="text-stone-400 mx-1">|</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onFilterBySession && onFilterBySession(''); onFilterByCollection && onFilterByCollection(''); onFilterByArtist && onFilterByArtist(''); onFilterByTitle && onFilterByTitle(''); onFilterByRegion && onFilterByRegion(tune.region); }}
                    className="text-left text-blue-700 font-medium text-sm hover:text-blue-900 hover:underline transition-colors"
                    title={`Filter by region: ${tune.region}`}
                  >
                    {tune.region}
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Traffic light button stack */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => onPlay(tune)}
              className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-amber-600 text-white shadow-inner' : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'}`}
              title="Play"
            >
              <Play className={`w-5 h-5 ${isPlaying ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-all"
              title="Download MP3"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-3 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-all"
              title="View archive data"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveOffline}
              className={`p-3 rounded-full transition-all ${isOffline ? 'bg-amber-100 text-amber-700 shadow-inner' : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'}`}
              title={isOffline ? "Remove from offline storage" : "Save for offline use"}
            >
              {isOffline ? <Check className="w-5 h-5 stroke-[3]" /> : <HardDrive className="w-5 h-5" />}
            </button>
          </div>
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
            <Music className="w-4 h-4 text-stone-400" />
            <span className="truncate">{tune.genre}</span>
          </div>
        </div>

        {/* Collection & Session Links */}
        {(tune.collection || tune.sourceCollection) && (
          <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
            {tune.collection && (
              <button
                onClick={(e) => { e.stopPropagation(); onFilterByCollection(tune.collection!); }}
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-600 hover:underline transition-colors"
                title="Filter by collection"
              >
                <Library className="w-3 h-3" />
                <span className="font-medium">{tune.collection}</span>
              </button>
            )}
            {tune.sourceCollection && (
              <button
                onClick={(e) => { e.stopPropagation(); onFilterBySession(tune.sourceCollection!); }}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-600 hover:underline transition-colors"
                title="Filter by session"
              >
                <Layers className="w-3 h-3" />
                <span>{tune.sourceCollection}</span>
              </button>
            )}
          </div>
        )}

        {/* Instruments */}
        {tune.instruments && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Musicians</p>
            <p className="text-xs text-stone-600 leading-relaxed">{tune.instruments}</p>
          </div>
        )}
      </div>
    </div>
  );
};