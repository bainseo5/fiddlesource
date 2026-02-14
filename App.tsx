
import React, { useState, useMemo, useEffect } from 'react';
import { SearchFiltersBar } from './components/SearchFilters';
import { TuneCard } from './components/TuneCard';
import { TuneDetailPage } from './components/TuneDetailPage';
import { AudioPlayer } from './components/AudioPlayer';
import { Tune, SearchFilters } from './types';
import { saveToDatabase, getFromDatabase, getAllSavedIds, removeFromDatabase } from './db';
import { extractSegment } from './audioUtils';
import * as api from './api';
import { History, X, Star, Headphones, AlertTriangle, Download, Trash2, CheckCircle2, FileJson, Loader2, Upload, Cloud, FileAudio, Link } from 'lucide-react';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    region: '',
    key: '',
    genre: ''
  });

  const [allTunes, setAllTunes] = useState<Tune[]>([]);
  const [isTunesLoading, setIsTunesLoading] = useState(true);
  const [currentTune, setCurrentTune] = useState<Tune | null>(null);
  const [selectedTune, setSelectedTune] = useState<Tune | null>(null);
  const [detailedTune, setDetailedTune] = useState<Tune | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set<string>());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);
  const [isProcessingDownload, setIsProcessingDownload] = useState<{ tuneId: string; type: 'download' | 'split' } | null>(null);
  
  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedTunes, setImportedTunes] = useState<Tune[]>([]);
  const [importTab, setImportTab] = useState<'file' | 'url'>('file');
  const [importUrl, setImportUrl] = useState('');

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

  const combinedTunes = useMemo(() => {
    return [...importedTunes, ...allTunes];
  }, [importedTunes, allTunes]);

  const filteredTunes = useMemo(() => {
    // Simple client-side filtering for now
    return combinedTunes.filter(tune => {
      const matchQuery = 
        tune.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        tune.artist.toLowerCase().includes(filters.query.toLowerCase()) ||
        tune.source.toLowerCase().includes(filters.query.toLowerCase());
      const matchRegion = filters.region ? tune.region === filters.region : true;
      const matchKey = filters.key ? tune.key === filters.key : true;
      return matchQuery && matchRegion && matchKey;
    });
  }, [filters, combinedTunes]);

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
        // Perform the physical split to WAV
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

  const handleRemoveImport = (tune: Tune) => {
    setImportedTunes(prev => prev.filter(t => t.id !== tune.id));
    if (currentTune?.id === tune.id) setCurrentTune(null);
  };

  const handlePlay = async (tune: Tune) => {
    setAudioError(null);
    // If imported, we likely already have the blob url as audioUrl, or we can use it directly
    if (tune.isImported) {
         setCurrentTune(tune);
         return;
    }
    
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

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newTune: Tune = {
      id: `import-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      artist: 'Unknown Artist',
      source: 'User Upload',
      region: 'Imported',
      key: '?',
      tuning: 'Standard',
      year: new Date().getFullYear().toString(),
      audioUrl: URL.createObjectURL(file),
      description: 'Audio imported from user device.',
      genre: 'Imported',
      isImported: true,
      startTime: 0
    };

    setImportedTunes(prev => [newTune, ...prev]);
    setIsImportModalOpen(false);
  };

  const handleUrlImport = () => {
    if (!importUrl) return;
    // Removed automatic CORS proxy as it was unreliable and for pre-cut files we assume direct access.
    // User imported URLs might still face CORS issues if the server doesn't permit cross-origin requests.
    const directUrl = importUrl; 
    
    const newTune: Tune = {
      id: `import-url-${Date.now()}`,
      title: 'Imported Stream',
      artist: 'Unknown Artist',
      source: importUrl,
      region: 'Web',
      key: '?',
      tuning: '?',
      year: '2024',
      audioUrl: directUrl,
      description: `Imported from: ${importUrl}`,
      genre: 'Stream',
      isImported: true,
      startTime: 0
    };

    setImportedTunes(prev => [newTune, ...prev]);
    setIsImportModalOpen(false);
    setImportUrl('');
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

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
             <div className="bg-stone-50 border-b border-stone-200 p-4 flex justify-between items-center">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-amber-600" />
                    Import Audio
                </h3>
                <button onClick={() => setIsImportModalOpen(false)} className="p-1 hover:bg-stone-200 rounded-full"><X className="w-5 h-5 text-stone-500" /></button>
             </div>
             
             <div className="p-2 grid grid-cols-2 gap-2 border-b border-stone-100">
                 <button 
                    onClick={() => setImportTab('file')}
                    className={`py-2 text-sm font-bold rounded-lg transition-colors ${importTab === 'file' ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:bg-stone-100'}`}
                 >
                    Upload File
                 </button>
                 <button 
                    onClick={() => setImportTab('url')}
                    className={`py-2 text-sm font-bold rounded-lg transition-colors ${importTab === 'url' ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:bg-stone-100'}`}
                 >
                    Direct URL
                 </button>
             </div>

             <div className="p-6">
                {importTab === 'file' ? (
                    <div className="flex flex-col gap-4 text-center">
                        <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-amber-400 hover:bg-amber-50 transition-colors relative cursor-pointer group">
                             <input type="file" accept="audio/*" onChange={handleFileImport} className="absolute inset-0 opacity-0 cursor-pointer" />
                             <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileAudio className="w-6 h-6 text-amber-600" />
                             </div>
                             <div className="text-sm">
                                <span className="font-bold text-amber-700">Click to upload</span> or drag and drop
                             </div>
                             <p className="text-xs text-stone-400">MP3, WAV, OGG supported</p>
                        </div>
                        <p className="text-xs text-stone-500 bg-stone-100 p-3 rounded-lg border border-stone-200">
                            <strong>Tip:</strong> If you want to use a SoundCloud track, use a downloader tool first, then upload the file here.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-stone-600">Enter a direct link to an audio file (mp3/wav) hosted on the web.</p>
                        <input 
                            type="text" 
                            placeholder="https://example.com/audio.mp3" 
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                        />
                         <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-2 items-start">
                             <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                             <p className="text-xs text-amber-800">
                                <strong>Note:</strong> Standard SoundCloud, Spotify, or YouTube links (e.g. soundcloud.com/song) will <u>not</u> work directly. You must provide a direct link to the actual audio stream.
                                 CORS policies may prevent direct streaming from some hosts.
                             </p>
                         </div>
                         <button 
                            onClick={handleUrlImport}
                            className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors"
                         >
                            Import Link
                         </button>
                    </div>
                )}
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
          <div className="flex items-center gap-4">
            <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded-full text-sm font-bold tracking-wide transition-all border border-stone-700 text-stone-300"
            >
                <Upload className="w-4 h-4" />
                IMPORT
            </button>
          </div>
        </div>
      </header>

      <SearchFiltersBar filters={filters} setFilters={setFilters} onClear={() => setFilters({ query: '', region: '', key: '', genre: '' })} />

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
              Source Recording Inventory
            </h2>
            <p className="text-xs text-stone-400 italic font-medium">Physical splitting enabled for historical study</p>
          </div>
          
          {filteredTunes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 text-lg">No tunes found matching your filters.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTunes.map(tune => (
              <div key={tune.id} className="relative">
                <TuneCard 
                  tune={tune} 
                  onPlay={handlePlay}
                  onShowDetails={handleShowDetails}
                  onDelete={tune.isImported ? handleRemoveImport : undefined}
                  isPlaying={currentTune?.id === tune.id}
                />
                
                {/* Database & Split Controls */}
                <div className="absolute top-2 left-2 flex gap-1.5 z-20">
                  {/* Fix: `savedIds` is now correctly a Set, so `.has()` is valid. */}
                  {savedIds.has(tune.id) ? (
                    <button onClick={() => handleDelete(tune.id)} className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-red-500 transition-all active:scale-90 group" title="Remove from Local DB">
                      <CheckCircle2 className="w-4 h-4 block group-hover:hidden" />
                      <Trash2 className="w-4 h-4 hidden group-hover:block" />
                    </button>
                  ) : (
                    !tune.isImported && (
                        <button onClick={() => handleArchive(tune)} disabled={isArchiving === tune.id} className={`p-2 rounded-full shadow-lg text-white transition-all active:scale-90 ${isArchiving === tune.id ? 'bg-stone-400 animate-pulse' : 'bg-stone-800 hover:bg-amber-600'}`} title="Save to Database">
                        <Download className="w-4 h-4" />
                        </button>
                    )
                  )}
                  
                  <button 
                    onClick={() => handleDownloadSegment(tune)} 
                    className="p-2 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-500 transition-all active:scale-90"
                    title={ (tune.fileCutSource && tune.startTime === 0) ? "Download Tune (.mp3)" : "Export Physical Split (.wav)"}
                  >
                    <FileJson className="w-4 h-4" />
                  </button>
                </div>
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