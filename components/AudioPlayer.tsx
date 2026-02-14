
import React, { useRef, useEffect, useState } from 'react';
import { Tune } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Scissors, AlertCircle, X } from 'lucide-react';

interface AudioPlayerProps {
  currentTune: Tune | null;
  onNext?: () => void;
  onPrev?: () => void;
  onStop?: () => void;
  onError?: (msg: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentTune, onNext, onPrev, onStop, onError }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('0:00');
  const [durationDisplay, setDurationDisplay] = useState('0:00');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (currentTune && audioRef.current) {
      setLoadError(null);
      const targetTime = currentTune.startTime || 0;
      
      // Ensure audio URL points to backend
      const audioUrl = currentTune.audioUrl.startsWith('http') 
        ? currentTune.audioUrl 
        : `http://localhost:3001${currentTune.audioUrl}`;
      
      const handleCanPlay = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = targetTime;
          audioRef.current.play().catch(e => {
            console.warn("Playback prevented:", e);
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      };

      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
      } else {
        audioRef.current.currentTime = targetTime;
        audioRef.current.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    }
  }, [currentTune]);

  const togglePlay = () => {
    if (!audioRef.current || loadError) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        setLoadError("Playback failed. Please try again.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTimeDisplay('0:00');
    }
    if (onStop) onStop();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    setCurrentTimeDisplay(formatTime(current));
    if (!isNaN(total)) setDurationDisplay(formatTime(total));
  };

  const handleMediaError = () => {
    const error = audioRef.current?.error;
    let message = "An unknown audio error occurred.";
    
    if (error) {
      switch (error.code) {
        case 1: message = "The fetching process was aborted."; break;
        case 2: message = "A network error occurred."; break;
        case 3: message = "Audio decoding failed."; break;
        case 4: 
          message = "The source is not supported or access is denied.";
          if (audioRef.current?.src.includes('corsproxy.io')) {
            message += " This could be a CORS issue with the proxy or original server. Try again, check your internet connection, or disable any content blockers.";
          } else {
            message += " Ensure the audio format is supported (e.g., MP3, WAV) and no content blockers are active.";
          }
          break;
      }
    }
    setLoadError(message);
    setIsPlaying(false);
    if (onError) onError(message);
  };

  if (!currentTune) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-stone-100 border-t border-stone-800 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500">
      {loadError && (
        <div className="bg-red-900/90 backdrop-blur-sm text-white text-[10px] py-1 px-4 text-center font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-3 h-3" />
          {loadError}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          <div className="flex items-center gap-4 min-w-[240px] w-full md:w-auto">
            <div className="w-12 h-12 bg-stone-800 rounded flex items-center justify-center flex-shrink-0 relative">
              {currentTune.startTime ? (
                <Scissors className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 bg-stone-900 rounded-full p-0.5" />
              ) : (
                <Music className="w-6 h-6 text-amber-500" />
              )}
              <Music className={`w-6 h-6 ${loadError ? 'text-red-500' : 'text-stone-600'}`} />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold truncate text-sm sm:text-base text-amber-50">{currentTune.title}</h4>
              <p className="text-stone-400 text-xs truncate flex items-center gap-2">
                {currentTune.artist}
                {currentTune.startTime !== undefined && (
                  <span className="px-1.5 py-0.5 bg-stone-800 text-[10px] rounded text-amber-500 font-mono">
                    Jump to {formatTime(currentTune.startTime)}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button onClick={onPrev} className="text-stone-400 hover:text-white transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlay}
                disabled={!!loadError}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg shadow-amber-900/20 ${loadError ? 'bg-stone-700 cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-500 active:scale-95'}`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button 
                onClick={handleStop}
                className="text-stone-400 hover:text-red-400 transition-colors"
                title="Stop"
              >
                <X className="w-5 h-5" />
              </button>
              <button onClick={onNext} className="text-stone-400 hover:text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono text-stone-500 w-10 text-right">{currentTimeDisplay}</span>
              <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden relative group cursor-pointer">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all ${loadError ? 'bg-red-900' : 'bg-amber-500 group-hover:bg-amber-400'}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-stone-500 w-10">{durationDisplay}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 w-[250px] justify-end">
            <div className="flex items-center gap-3 w-full">
              <label className="text-xs text-stone-400 whitespace-nowrap">Speed:</label>
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-xs text-stone-300 font-mono w-10 text-right">{playbackSpeed.toFixed(2)}x</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onError={handleMediaError}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};