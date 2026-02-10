import React from 'react';
import { Track } from '../types';
import { Icons } from '../constants';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  isBuffering: boolean;
  currentTime: number;
  totalDuration: number;
  isDarkMode: boolean;
}

const Player: React.FC<PlayerProps> = ({ currentTrack, isPlaying, onTogglePlay, onNext, isBuffering, currentTime, totalDuration, isDarkMode }) => {
  if (!currentTrack) return null;
  
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="fixed bottom-[80px] left-3 right-3 z-[55] animate-slideUp">
      <div className={`glass rounded-xl p-2 flex items-center justify-between border shadow-lg overflow-hidden relative active:scale-[0.99] transition-all duration-200 group ${isDarkMode ? 'border-white/10' : 'border-gray-200 bg-white/95'}`}>
        {isBuffering && (
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-[65]">
            <div className="h-full bg-violet-500 w-1/4 animate-[mini_loading_0.8s_infinite_linear] shadow-[0_0_5px_rgba(139,92,246,0.6)]" />
          </div>
        )}

        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <div className="relative flex-shrink-0">
            <img 
              src={currentTrack.cover} 
              className={`w-9 h-9 rounded-lg object-cover shadow-md transition-all duration-500 ${isPlaying && !isBuffering ? 'animate-[spin_20s_linear_infinite] opacity-100' : 'opacity-80 scale-95'}`}
              alt={currentTrack.title} 
            />
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg backdrop-blur-[0.5px]">
                <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className={`text-[10px] font-black truncate leading-tight mb-0.5 tracking-tight ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{currentTrack.title}</h3>
            <p className={`text-[8px] truncate leading-tight uppercase tracking-widest font-black ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button 
            onClick={onTogglePlay} 
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200 ${isDarkMode ? 'bg-white text-black hover:bg-violet-50' : 'bg-black text-white hover:bg-violet-900'}`}
          >
            {isBuffering ? (
               <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-black/10' : 'border-white/10'}`} />
            ) : isPlaying ? (
               <Icons.Pause className="w-4.5 h-4.5" />
            ) : (
               <Icons.Play className="w-4.5 h-4.5 ml-0.5" />
            )}
          </button>
          <button onClick={onNext} className={`transition-all duration-200 p-2 active:scale-75 ${isDarkMode ? 'text-white/30 hover:text-white' : 'text-gray-400 hover:text-violet-600'}`}>
            <Icons.SkipForward className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Minimal Progress */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className={`h-full bg-violet-500/80 transition-all duration-150 shadow-[0_0_5px_rgba(139,92,246,0.3)]`} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      
      <style>{`
        @keyframes mini_loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(450%); } }
        @keyframes slideUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Player;