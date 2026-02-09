
import React, { useState, useMemo } from 'react';
import { Track, Tab, RepeatMode } from '../types';
import { MOCK_TRACKS, Icons } from '../constants';
import { GeminiMusicService } from '../services/geminiService';

interface ViewProps {
  isOnline: boolean;
  onPlayTrack: (track: Track) => void;
  currentTrackId?: string;
  downloadedIds: string[];
  onToggleDownload: (trackId: string) => void;
  isDownloadingMap: Record<string, number>;
  isLoading?: boolean;
  isDarkMode: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SkeletonTrack: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="flex items-center gap-3 p-2 animate-pulse transition-all duration-500">
    <div className={`w-12 h-12 rounded-lg backdrop-blur-3xl shadow-inner border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className="flex-1 space-y-2">
      <div className={`h-3 rounded w-3/4 blur-[2px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
      <div className={`h-2 rounded w-1/2 blur-[4px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
    </div>
  </div>
);

const SkeletonCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="flex-shrink-0 w-32 animate-pulse">
    <div className={`aspect-square rounded-2xl mb-2 backdrop-blur-3xl shadow-xl border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className={`h-3 rounded w-full mb-1 blur-[2px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
    <div className={`h-2 rounded w-2/3 blur-[4px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
  </div>
);

const TrackItem: React.FC<{
  track: Track;
  isActive: boolean;
  isDownloaded: boolean;
  isOnline: boolean;
  downloadProgress?: number;
  onPlay: () => void;
  onDownload: () => void;
  isDarkMode: boolean;
}> = ({ track, isActive, isDownloaded, isOnline, downloadProgress, onPlay, onDownload, isDarkMode }) => {
  const isDownloading = downloadProgress !== undefined && downloadProgress < 100;
  const isDisabled = !isOnline && !isDownloaded;

  return (
    <div className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100'}`}>
      <div className={`flex items-center gap-3 p-2 transition-colors cursor-pointer active:scale-95 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
        <div className="relative w-12 h-12 flex-shrink-0" onClick={() => !isDisabled && onPlay()}>
          <img src={track.cover} className="w-full h-full rounded-lg object-cover shadow-lg" alt={track.title} />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
            <Icons.Play className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden" onClick={() => !isDisabled && onPlay()}>
          <h3 className={`font-semibold truncate text-sm leading-tight ${isActive ? 'text-violet-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>{track.title}</h3>
          <p className={`text-[11px] truncate leading-tight mt-0.5 font-medium ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>{track.artist}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isDownloading && (
            <span className="text-[9px] font-bold text-violet-500 tabular-nums">
              {downloadProgress}%
            </span>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); if (!isDownloading && isOnline) onDownload(); }}
            className={`p-2 rounded-full transition-all ${isDownloaded ? 'text-violet-500' : (isDarkMode ? 'text-white/20 hover:bg-white/10' : 'text-gray-300 hover:bg-black/5')}`}
            disabled={isDownloading || !isOnline}
          >
            {isDownloaded ? <Icons.DownloadDone className="w-4 h-4" /> : 
             isDownloading ? <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> :
             <Icons.Download className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {isDownloading && (
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
        </div>
      )}
    </div>
  );
};

export const HomeView: React.FC<ViewProps> = ({ isOnline, onPlayTrack, currentTrackId, downloadedIds, onToggleDownload, isDownloadingMap, isLoading, isDarkMode }) => {
  const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));

  return (
    <div className="p-4 pb-44 space-y-6 animate-fadeIn">
      <header className="flex flex-col">
        <h1 className="text-2xl font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">
          Svaram
        </h1>
        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-[9px] uppercase tracking-[0.2em] font-black`}>