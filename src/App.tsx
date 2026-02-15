
import React, { useState, useMemo, useEffect } from 'react';
import { SearchFiltersBar } from './components/SearchFilters';
import { TuneCard } from './components/TuneCard';
import { TuneDetailPage } from './components/TuneDetailPage';
import { AudioPlayer } from './components/AudioPlayer';
import { Tune, SearchFilters, ViewMode } from './types';
import { saveToDatabase, getFromDatabase, getAllSavedIds, removeFromDatabase } from './db';
import { extractSegment } from './audioUtils';
import * as api from './api';
import { History, X, Star, Headphones, AlertTriangle, Download, Trash2, CheckCircle2, FileJson, Loader2, Info, Play } from 'lucide-react';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    artist: '',
    region: '',
    key: '',
    genre: '',
    collection: '',
    session: '',
    instrument: '',
    showNewOnly: true
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [allTunes, setAllTunes] = useState<Tune[]>([]);
  const [isTunesLoading, setIsTunesLoading] = useState(true);
  const [currentTune, setCurrentTune] = useState<Tune | null>(null);
  const [selectedTune, setSelectedTune] = useState<Tune | null>(null);
  const [detailedTune, setDetailedTune] = useState<Tune | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set<string>());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);
  const [isProcessingDownload, setIsProcessingDownload] = useState<{ tuneId: string; type: 'download' | 'split' } | null>(null);

  // Load tunes from API on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const tunes = await api.fetchAllTunes();
        setAllTunes(tunes);

        // Load saved IDs from local DB
        const ids = await getAllSavedIds();
        setSavedIds(new Set(ids));
      } catch (error) {
        console.error('Failed to initialize:', error);
        setAudioError('Failed to load tunes from server. Make sure the backend is running.');
      } finally {
        setIsTunesLoading(false);
      }
    };
    initialize();
  }, []);

  const getRecordingLabel = (tune: Tune) => {
    if (tune.recordingType) {
      return tune.recordingType.charAt(0).toUpperCase() + tune.recordingType.slice(1);
    }
    // Fallback logic
    if (tune.sourceCollection?.toLowerCase().includes('session')) return 'Session';
    // Check for multiple artists (comma separated)
    if (tune.artist.includes(',')) return 'Session';
    return 'Solo';
  };

  const filteredTunes = useMemo(() => {
    // 1. Filter by search criteria (excluding "New Only" logic)
    const result = allTunes.filter(tune => {
      const matchQuery = 
        tune.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        tune.artist.toLowerCase().includes(filters.query.toLowerCase()) ||
        tune.source.toLowerCase().includes(filters.query.toLowerCase());
      const matchRegion = filters.region ? tune.region === filters.region : true;
      const matchKey = filters.key ? tune.key === filters.key : true;
      const matchGenre = filters.genre ? tune.genre === filters.genre : true;
      const matchCollection = filters.collection ? tune.collection === filters.collection : true;
      const matchSession = filters.session ? tune.sourceCollection === filters.session : true;
      const matchArtist = filters.artist ? tune.artist.toLowerCase().includes(filters.artist.toLowerCase()) : true;
      const matchInstrument = filters.instrument ? (tune.instruments?.toLowerCase().includes(filters.instrument.toLowerCase()) ?? false) : true;
      
      return matchQuery && matchRegion && matchKey && matchGenre && matchCollection && matchSession && matchArtist && matchInstrument;
    });

    // 2. Apply "New Only" logic: Either specific new collections OR last 20
    if (filters.showNewOnly) {
       const specificNew = result.filter(t => t.id.startsWith('bonavella-') || t.id.startsWith('mullagh-'));
       if (specificNew.length > 0) {
          return specificNew;
       }
       // Fallback: Show last 20 added (approximate "Newest"), reversed so newest (end of list) comes first
       return result.slice(-20).reverse();
    }
    
    return result;
  }, [filters, allTunes]);

  // Group tunes by session
  const tunesBySession = useMemo(() => {
    const grouped = new Map<string, Tune[]>();
    filteredTunes.forEach(tune => {
      const session = tune.sourceCollection || 'Unknown Session';
      if (!grouped.has(session)) {
        grouped.set(session, []);
      }
      grouped.get(session)!.push(tune);
    });
    return grouped;
  }, [filteredTunes]);

  const handleArchive = async (tune: Tune) => {
    try {
      setIsArchiving(tune.id);
      const response = await fetch(tune.audioUrl);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const blob = await response.blob();
      await saveToDatabase(tune.id, blob, tune);
      // Fix: Ensure setSavedIds updates the state with a new Set instance
      setSavedIds(prev => new Set(prev).add(tune.id));
      setIsArchiving(null);
    } catch (err) {
      console.error(err);
      setAudioError("Archive failed. The source file could not be downloaded.");
      setIsArchiving(null);
    }
  };

  const handleDownloadSegment = async (tune: Tune) => {
    try {
      const isDirectMp3Download = tune.fileCutSource && tune.startTime === 0;
      setIsProcessingDownload({ tuneId: tune.id, type: isDirectMp3Download ? 'download' : 'split' });
      
      let audioBlob: Blob | null = null;
      if (!isDirectMp3Download) { // For WAV splits, check local DB first
        audioBlob = await getFromDatabase(tune.id);
      }
      
      if (!audioBlob) {
        // If not saved locally, or it's a direct MP3 download, fetch from source
        const response = await fetch(tune.audioUrl);
        if (!response.ok) throw new Error("Could not reach source.");
        audioBlob = await response.blob();
      }

      let finalBlob: Blob;
      let filename: string;
      let mimeType: string;

      if (isDirectMp3Download) {
        finalBlob = audioBlob;
        filename = `${tune.title.replace(/\s+/g, '_')}.mp3`;
        mimeType = 'audio/mpeg';
      } else {
        // Perform the segment extraction to WAV
        finalBlob = await extractSegment(audioBlob, tune.startTime || 0);
        filename = `${tune.title.replace(/\s+/g, '_')}_Segment.wav`;
        mimeType = 'audio/wav';
      }
      
      // Trigger browser download
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsProcessingDownload(null);
    } catch (err) {
      console.error(err);
      setAudioError((err instanceof Error ? err.message : "Unknown error. Ensure the source is a valid audio file."));
      setIsProcessingDownload(null);
    }
  };

  const handleDelete = async (id: string) => {
    await removeFromDatabase(id);
    // Fix: Ensure setSavedIds updates the state with a new Set instance
    setSavedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      artist: '',
      region: '',
      key: '',
      genre: '',
      collection: '',
      session: '',
      instrument: '',
      showNewOnly: true
    });
  };

  const handleFilterByArtist = (artist: string) => {
    setFilters(prev => ({ ...prev, query: artist }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByTitle = (title: string) => {
    setFilters(prev => ({ ...prev, query: title }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByCollection = (collection: string) => {
    setFilters(prev => ({ ...prev, collection, session: '' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterBySession = (session: string) => {
    setFilters(prev => ({ ...prev, session }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlay = async (tune: Tune) => {
    setAudioError(null);
    
    const localBlob = await getFromDatabase(tune.id);
    if (localBlob) {
      const localUrl = URL.createObjectURL(localBlob);
      setCurrentTune({ ...tune, audioUrl: localUrl });
    } else {
      setCurrentTune(tune);
    }
  };

  const handleShowDetails = (tune: Tune) => {
    setDetailedTune(tune);
  };

  return (
    <div className="min-h-screen pb-40 bg-[#fafaf9]">
      {audioError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in slide-in-from-top duration-300">
          <div className="mx-4 bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 border border-red-500">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Operation Failed</h4>
              <p className="text-xs opacity-90">{audioError}</p>
              <button onClick={() => setAudioError(null)} className="mt-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {isProcessingDownload && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
            <div>
              <h4 className="font-bold text-lg text-stone-900">
                {isProcessingDownload.type === 'download' ? 'Downloading Tune' : 'Extracting Segment'}
              </h4>
              <p className="text-sm text-stone-500">
                {isProcessingDownload.type === 'download' ? 'Fetching audio data and preparing file...' : 'Decoding audio data and creating separate file...'}
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="bg-stone-900 text-stone-100 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">FiddleSource</h1>
            <p className="text-stone-400 font-medium italic serif text-xl">Traditional Music Archive</p>
          </div>
        </div>
      </header>

      <SearchFiltersBar 
        filters={filters} 
        setFilters={setFilters} 
        onClear={handleClearFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        collections={Array.from(new Set(allTunes.map(t => t.collection).filter(Boolean))).sort()}
        sessions={Array.from(new Set(allTunes.map(t => t.sourceCollection).filter(Boolean))).sort()}
        artists={Array.from(new Set(allTunes.flatMap(t => t.artist ? t.artist.split(',').map(a => a.trim()) : []))).sort()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {isTunesLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-stone-600">Loading traditional music archive...</p>
            </div>
          </div>
        )}
        
        {!isTunesLoading && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
              <History className="w-6 h-6 text-amber-700" />
              {viewMode === 'sessions' ? 'Recording Sessions' : 'Traditional Music Archive'}
            </h2>
          </div>
          
          {filteredTunes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 text-lg">No tunes found matching your filters.</p>
            </div>
          ) : viewMode === 'sessions' ? (
            /* Sessions View */
            <div className="space-y-8">
              {Array.from(tunesBySession.entries()).map(([session, tunes]) => {
                // Determine parent collection
                const parentCollection = session.includes("John Joe Healy") 
                  ? "John Joe Healy Collection - Clare Library"
                  : "BR Taylor Collection - Clare Library";
                
                return (
                <div key={session} className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200">
                  <div className="bg-gradient-to-r from-amber-800 to-amber-950 px-6 py-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{session}</h3>
                    <p className="text-amber-100 text-sm">
                      {tunes.length} tune{tunes.length !== 1 ? 's' : ''} • {tunes[0]?.source || 'Unknown Source'}
                    </p>
                    {tunes[0]?.year && (
                      <p className="text-amber-100 text-xs mt-1">Recorded: {tunes[0].year}</p>
                    )}
                    <p className="text-amber-200 text-xs mt-2 italic">Part of the {parentCollection}</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tunes.map(tune => (
                        <div key={tune.id} className="relative">
                          <TuneCard 
                            tune={tune} 
                            onPlay={handlePlay}
                            onShowDetails={handleShowDetails}
                            onFilterByTitle={handleFilterByTitle}
                            onFilterByArtist={handleFilterByArtist}
                            onFilterByCollection={handleFilterByCollection}
                            onFilterBySession={handleFilterBySession}
                            isPlaying={currentTune?.id === tune.id}
                          />
                          
                          {/* Database & Split Controls */}
                          <div className="absolute top-2 left-2 flex gap-1.5 z-20">
                            {savedIds.has(tune.id) ? (
                              <button onClick={() => handleDelete(tune.id)} className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-red-500 transition-all active:scale-90 group" title="Remove Offline Copy">
                                <CheckCircle2 className="w-4 h-4 block group-hover:hidden" />
                                <Trash2 className="w-4 h-4 hidden group-hover:block" />
                              </button>
                            ) : (
                              <button onClick={() => handleArchive(tune)} disabled={isArchiving === tune.id} className={`p-2 rounded-full shadow-lg text-white transition-all active:scale-90 ${isArchiving === tune.id ? 'bg-stone-400 animate-pulse' : 'bg-stone-800 hover:bg-amber-600'}`} title="Save Offline">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleDownloadSegment(tune)} 
                              className="p-2 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-500 transition-all active:scale-90"
                              title={ (tune.fileCutSource && tune.startTime === 0) ? "Download Tune (.mp3)" : "Download Segment (.wav)"}
                            >
                              <FileJson className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-2">
            {filteredTunes.map(tune => (
              <div key={tune.id} className={`bg-white border border-stone-200 rounded-lg hover:shadow-md transition-all ${currentTune?.id === tune.id ? 'ring-2 ring-amber-500 shadow-lg' : ''}`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlay(tune)}
                    className={`flex-shrink-0 p-3 rounded-full transition-all ${currentTune?.id === tune.id ? 'bg-amber-600 text-white shadow-inner' : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'}`}
                  >
                    <Play className={`w-5 h-5 ${currentTune?.id === tune.id ? 'fill-current' : ''}`} />
                  </button>

                  {/* Tune Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <button
                        onClick={() => handleFilterByTitle(tune.title)}
                        className="text-lg font-bold text-stone-900 hover:text-amber-600 hover:underline transition-colors truncate"
                        title="Filter by tune name"
                      >
                        {tune.title}
                      </button>
                      {tune.sourceCollection && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-tight">
                          {getRecordingLabel(tune)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone-600">
                      <button
                        onClick={() => handleFilterByArtist(tune.artist)}
                        className="hover:text-amber-600 hover:underline transition-colors truncate"
                        title="Filter by artist"
                      >
                        {tune.artist}
                      </button>
                      <span className="text-stone-400">•</span>
                      <span className="truncate">{tune.region}</span>
                      <span className="text-stone-400">•</span>
                      <span>Key of {tune.key}</span>
                      <span className="text-stone-400">•</span>
                      <span>{tune.year}</span>
                    </div>
                    {tune.collection && (
                      <button
                        onClick={() => handleFilterByCollection(tune.collection!)}
                        className="text-xs text-stone-500 hover:text-amber-600 hover:underline transition-colors mt-1"
                        title="Filter by collection"
                      >
                        {tune.collection}
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {savedIds.has(tune.id) ? (
                      <button onClick={() => handleDelete(tune.id)} className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-red-500 transition-all active:scale-90 group" title="Remove Offline Copy">
                        <CheckCircle2 className="w-4 h-4 block group-hover:hidden" />
                        <Trash2 className="w-4 h-4 hidden group-hover:block" />
                      </button>
                    ) : (
                      <button onClick={() => handleArchive(tune)} disabled={isArchiving === tune.id} className={`p-2 rounded-full shadow-lg text-white transition-all active:scale-90 ${isArchiving === tune.id ? 'bg-stone-400 animate-pulse' : 'bg-stone-800 hover:bg-amber-600'}`} title="Save Offline">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownloadSegment(tune)} 
                      className="p-2 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-500 transition-all active:scale-90"
                      title={(tune.fileCutSource && tune.startTime === 0) ? "Download Tune (.mp3)" : "Download Segment (.wav)"}
                    >
                      <FileJson className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleShowDetails(tune)}
                      className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-all active:scale-90"
                      title="Show details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTunes.map(tune => (
              <div key={tune.id} className="relative">
                <TuneCard 
                  tune={tune} 
                  onPlay={handlePlay}
                  onShowDetails={handleShowDetails}
                  onFilterByTitle={handleFilterByTitle}
                  onFilterByArtist={handleFilterByArtist}
                  onFilterByCollection={handleFilterByCollection}
                  onFilterBySession={handleFilterBySession}
                  isPlaying={currentTune?.id === tune.id}
                />
                

                {/* Database & Split Controls removed - replaced by TuneCard internal controls */}
              </div>
            ))}
          </div>
          )}
        </section>
        )}
      </main>

      {/* Detail Modal */}
      {selectedTune && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-stone-100 flex justify-between items-start bg-stone-50">
              <div>
                <h3 className="text-3xl font-bold text-stone-900 mb-1">{selectedTune.title}</h3>
                <p className="text-amber-700 font-bold text-lg tracking-tight uppercase">{selectedTune.artist}</p>
              </div>
              <button onClick={() => setSelectedTune(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-400"><X className="w-8 h-8" /></button>
            </div>
            <div className="p-8 bg-stone-900 flex gap-4">
               <button onClick={() => { handlePlay(selectedTune!); setSelectedTune(null); }} className="flex-1 bg-amber-600 text-white py-4 rounded-xl font-black text-sm tracking-[0.15em] hover:bg-amber-500 transition-all uppercase shadow-xl active:scale-95">PLAY RECORDING</button>
               <button onClick={() => handleDownloadSegment(selectedTune!)} className="px-6 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-all flex items-center justify-center">
                 <Download className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      )}

      <AudioPlayer 
        currentTune={currentTune} 
        onError={(msg) => setAudioError(msg)} 
        onStop={() => setCurrentTune(null)}
        onNext={() => {
          const idx = filteredTunes.findIndex(t => t.id === currentTune?.id);
          if (idx < filteredTunes.length - 1) handlePlay(filteredTunes[idx + 1]);
        }}
        onPrev={() => {
          const idx = filteredTunes.findIndex(t => t.id === currentTune?.id);
          if (idx > 0) handlePlay(filteredTunes[idx - 1]);
        }}
      />

      {detailedTune && (
        <TuneDetailPage 
          tune={detailedTune}
          onClose={() => setDetailedTune(null)}
          isSaved={savedIds.has(detailedTune.id)}
          onSave={() => handleArchive(detailedTune)}
          onRemove={() => handleDelete(detailedTune.id)}
        />
      )}
    </div>
  );
};

export default App;