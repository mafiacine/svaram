
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
}

const Player: React.FC<PlayerProps> = ({ currentTrack, isPlaying, onTogglePlay, onNext, isBuffering, currentTime, totalDuration }) => {
  if (!currentTrack) return null;
  
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="fixed bottom-[88px] left-3 right-3 z-[55] animate-slideUp">
      <div className="glass rounded-2xl p-2.5 flex items-center justify-between border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden relative active:scale-[0.99] transition-transform">
        {isBuffering && (
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-[65]">
            <div className="h-full bg-violet-400 w-1/4 animate-[mini_loading_1.2s_infinite_linear]" />
          </div>
        )}

        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="relative flex-shrink-0 group">
            <img 
              src={currentTrack.cover} 
              className={`w-11 h-11 rounded-xl object-cover shadow-lg transition-all duration-1000 ${isPlaying && !isBuffering ? 'animate-[spin_20s_linear_infinite] ring-1 ring-white/20' : 'opacity-80'}`}
              alt={currentTrack.title} 
            />
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-[11px] font-black truncate leading-tight mb-0.5 text-white/90 tracking-tight">{currentTrack.title}</h3>
            <p className="text-[9px] text-white/40 truncate leading-tight uppercase tracking-widest font-black">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-1 ml-2">
          <button 
            onClick={onTogglePlay} 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black active:scale-90 transition-all shadow-xl"
          >
            {isBuffering ? (
               <div className="w-5 h-5 border-[3px] border-black/10 border-t-black rounded-full animate-spin" />
            ) : isPlaying ? (
               <Icons.Pause className="w-5 h-5" />
            ) : (
               <Icons.Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <button onClick={onNext} className="text-white/30 hover:text-white transition-all p-2 active:scale-75">
            <Icons.SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div className="h-full bg-violet-500/60 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      
      <style>{`
        @keyframes mini_loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(450%); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Player;
