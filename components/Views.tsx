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
  <div className="flex items-center gap-3 p-1 animate-pulse transition-all duration-200">
    <div className={`w-9 h-9 rounded-lg backdrop-blur-3xl shadow-inner border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className="flex-1 space-y-1">
      <div className={`h-2 rounded w-3/4 blur-[1px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
      <div className={`h-1 rounded w-1/2 blur-[2px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
    </div>
  </div>
);

const SkeletonCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="flex-shrink-0 w-24 animate-pulse">
    <div className={`aspect-square rounded-xl mb-1.5 backdrop-blur-3xl shadow-lg border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className={`h-2 rounded w-full mb-1 blur-[1px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
    <div className={`h-1 rounded w-2/3 blur-[2px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
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
    <div className={`relative group overflow-hidden rounded-lg transition-all duration-200 ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100'}`}>
      <div className={`flex items-center gap-2 p-1.5 transition-all cursor-pointer active:scale-[0.98] ${isActive ? (isDarkMode ? 'bg-violet-500/10' : 'bg-violet-50') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5')}`}>
        <div className="relative w-9 h-9 flex-shrink-0 overflow-hidden rounded-lg shadow-sm" onClick={() => !isDisabled && onPlay()}>
          <img src={track.cover} className={`w-full h-full object-cover transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} alt={track.title} />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Icons.Play className={`w-3.5 h-3.5 text-white transform transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden" onClick={() => !isDisabled && onPlay()}>
          <h3 className={`font-bold truncate text-[12px] leading-tight transition-colors duration-200 ${isActive ? 'text-violet-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>{track.title}</h3>
          <p className={`text-[9px] truncate leading-tight mt-0.5 font-medium transition-colors duration-200 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{track.artist}</p>
        </div>
        
        <div className="flex items-center gap-1">
          {isDownloading && (
            <span className="text-[7px] font-bold text-violet-500 tabular-nums">
              {downloadProgress}%
            </span>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); if (!isDownloading && isOnline) onDownload(); }}
            className={`p-1 rounded-full transition-all duration-200 ${isDownloaded ? 'text-violet-500 bg-violet-500/10' : (isDarkMode ? 'text-white/20 hover:text-white hover:bg-white/10' : 'text-gray-300 hover:text-violet-600')}`}
            disabled={isDownloading || !isOnline}
          >
            {isDownloaded ? <Icons.DownloadDone className="w-3 h-3" /> : 
             isDownloading ? <div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> :
             <Icons.Download className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const HomeView: React.FC<ViewProps> = ({ isOnline, onPlayTrack, currentTrackId, downloadedIds, onToggleDownload, isDownloadingMap, isLoading, isDarkMode }) => {
  const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));

  return (
    <div className="p-4 pb-44 space-y-4 animate-fadeIn">
      <header className="flex flex-col">
        <h1 className="text-lg font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">
          Svaram
        </h1>
        <p className={`${isDarkMode ? 'text-white/30' : 'text-gray-400'} text-[7px] uppercase tracking-[0.2em] font-black`}>
          {isOnline ? "Fast Streaming" : "Cached Mode"}
        </p>
      </header>

      <section>
        <h2 className={`text-[8px] font-black mb-2 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Recommended</h2>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {isLoading ? [1,2,3,4].map(i => <SkeletonCard key={i} isDarkMode={isDarkMode} />) : tracks.map(track => {
            const progress = isDownloadingMap[track.id];
            const isDownloading = progress !== undefined && progress < 100;
            return (
              <div key={track.id} className="flex-shrink-0 w-24 group relative transition-all duration-300">
                <div onClick={() => onPlayTrack(track)} className={`relative aspect-square mb-1.5 overflow-hidden rounded-xl cursor-pointer border transition-all duration-300 ${isDarkMode ? 'border-white/5' : 'border-gray-200'} active:scale-95`}>
                  <img src={track.cover} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" alt={track.title} />
                  <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${currentTrackId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     <Icons.Play className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className={`font-bold truncate text-[9px] leading-tight transition-colors duration-200 ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{track.title}</h3>
                <p className={`text-[8px] truncate leading-tight mt-0.5 font-medium transition-colors duration-200 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{track.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={`text-[8px] font-black mb-2 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Tracks</h2>
        <div className="space-y-0.5">
          {isLoading ? [1,2,3,4,5].map(i => <SkeletonTrack key={i} isDarkMode={isDarkMode} />) : tracks.slice().reverse().map(track => (
            <TrackItem 
              key={track.id}
              track={track}
              isActive={currentTrackId === track.id}
              isDownloaded={downloadedIds.includes(track.id)}
              isOnline={isOnline}
              downloadProgress={isDownloadingMap[track.id]}
              onPlay={() => onPlayTrack(track)}
              onDownload={() => onToggleDownload(track.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export const FolderView: React.FC<ViewProps> = ({ isOnline, onPlayTrack, currentTrackId, downloadedIds, onToggleDownload, isDownloadingMap, isLoading, isDarkMode }) => {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));
  
  const artistFolders = useMemo(() => {
    const map = new Map<string, { count: number, cover: string }>();
    tracks.forEach(t => {
      if (!map.has(t.artist)) {
        map.set(t.artist, { count: 1, cover: t.cover });
      } else {
        const current = map.get(t.artist)!;
        map.set(t.artist, { ...current, count: current.count + 1 });
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [tracks]);

  const artistTracks = useMemo(() => {
    if (!selectedArtist) return [];
    return tracks.filter(t => t.artist === selectedArtist);
  }, [selectedArtist, tracks]);

  if (selectedArtist) {
    return (
      <div className="p-4 space-y-3 animate-fadeIn pb-44">
        <header className="flex items-center gap-2.5">
          <button 
            onClick={() => setSelectedArtist(null)}
            className={`p-1.5 rounded-full transition-all active:scale-75 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedArtist}</h1>
            <p className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{artistTracks.length} tracks</p>
          </div>
        </header>

        <div className="space-y-0.5">
          {artistTracks.map(track => (
            <TrackItem 
              key={track.id}
              track={track}
              isActive={currentTrackId === track.id}
              isDownloaded={downloadedIds.includes(track.id)}
              isOnline={isOnline}
              downloadProgress={isDownloadingMap[track.id]}
              onPlay={() => onPlayTrack(track)}
              onDownload={() => onToggleDownload(track.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fadeIn pb-44">
      <header className="flex justify-between items-center">
        <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Folders</h1>
        <div className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-black/5 text-black/40'}`}>
          {artistFolders.length} ARTISTS
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {artistFolders.map(([artist, data]) => (
          <div 
            key={artist}
            onClick={() => setSelectedArtist(artist)}
            className={`aspect-square relative group overflow-hidden rounded-xl glass border transition-all duration-300 active:scale-95 cursor-pointer flex flex-col justify-end ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}
          >
            <img 
                src={data.cover} 
                alt={artist} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black/80 via-black/40 to-transparent' : 'from-black/70 via-black/20 to-transparent'}`} />
            
            <div className="relative z-10 p-3">
              <div className="w-6 h-6 mb-1.5 rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 bg-white/10 text-white">
                  <Icons.Folder className="w-3 h-3" />
              </div>
              <h3 className="font-bold text-[10px] leading-tight truncate text-white">{artist}</h3>
              <p className="text-[7px] font-black uppercase tracking-[0.1em] text-white/60">
                {data.count} items
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SearchView: React.FC<ViewProps> = ({ isOnline, onPlayTrack, currentTrackId, downloadedIds, onToggleDownload, isDownloadingMap, isLoading, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('All');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const gemini = new GeminiMusicService();

  const genres = ['All', 'New', 'Old', 'Sad', 'Holi'];

  const filteredTracks = useMemo(() => {
    return MOCK_TRACKS.filter(t => {
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase()) || 
                         t.artist.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = filterGenre === 'All' || t.category === filterGenre;
      const matchesAvailability = isOnline || downloadedIds.includes(t.id);
      return matchesQuery && matchesGenre && matchesAvailability;
    });
  }, [query, filterGenre, isOnline, downloadedIds]);

  const handleAiSearch = async () => {
    if (!query || !isOnline) return;
    setLoadingAi(true);
    const results = await gemini.getMusicRecommendations(query);
    setAiSuggestions(results);
    setLoadingAi(false);
  };

  return (
    <div className="p-4 space-y-3.5 animate-fadeIn pb-44">
      <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Find</h1>
      
      <div className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Song or artist..." 
          className={`w-full border rounded-lg py-2.5 pl-9 pr-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all backdrop-blur-3xl ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-white/20' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
        />
        <Icons.Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setFilterGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all border ${filterGenre === genre ? 'bg-violet-600 border-violet-400 text-white' : (isDarkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-400')}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {query && isOnline && !loadingAi && aiSuggestions.length === 0 && (
          <button onClick={handleAiSearch} className="w-full bg-violet-600/10 text-violet-500 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-violet-500/10 active:scale-95 transition-all">
             AI Match ✨
          </button>
      )}

      {loadingAi ? (
        <div className={`flex flex-col items-center justify-center py-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
           <div className="animate-spin w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full mb-2"></div>
           <p className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Matching...</p>
        </div>
      ) : aiSuggestions.length > 0 && (
        <div className="space-y-1.5 animate-slideUp">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[8px] font-black text-violet-500 uppercase tracking-widest">Suggestions</h2>
            <button onClick={() => setAiSuggestions([])} className={`text-[7px] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>HIDE</button>
          </div>
          {aiSuggestions.map((s, idx) => (
             <div key={idx} className={`flex items-center gap-2 p-2.5 glass rounded-lg border active:scale-95 transition-all ${isDarkMode ? 'border-violet-500/10' : 'border-violet-500/10 bg-white/50'}`}>
               <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 font-black text-[8px]">{idx + 1}</div>
               <div className="overflow-hidden"><h3 className={`font-bold text-[10px] truncate ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{s.title}</h3><p className={`text-[8px] truncate font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{s.artist}</p></div>
             </div>
          ))}
        </div>
      )}

      <div className="space-y-0.5">
        {isLoading ? [1,2,3,4,5].map(i => <SkeletonTrack key={i} isDarkMode={isDarkMode} />) : filteredTracks.map(track => (
          <TrackItem 
            key={track.id}
            track={track}
            isActive={currentTrackId === track.id}
            isDownloaded={downloadedIds.includes(track.id)}
            isOnline={isOnline}
            downloadProgress={isDownloadingMap[track.id]}
            onPlay={() => onPlayTrack(track)}
            onDownload={() => onToggleDownload(track.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export const PlayerTabView: React.FC<{
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  isDownloaded: boolean;
  onToggleDownload: (id: string) => void;
  downloadProgress?: number;
  isBuffering: boolean;
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  isDarkMode: boolean;
}> = ({ 
  currentTrack, isPlaying, onTogglePlay, onNext, onPrev, isDownloaded, 
  onToggleDownload, downloadProgress, isBuffering, currentTime, totalDuration, onSeek,
  isShuffle, onToggleShuffle, repeatMode, onToggleRepeat, isDarkMode
}) => {
  const isDownloading = downloadProgress !== undefined && downloadProgress < 100;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className={`w-20 h-20 glass rounded-full flex items-center justify-center border ${isDarkMode ? 'border-white/5' : 'border-gray-100 shadow-sm'}`}>
          <Icons.Player className={`w-8 h-8 ${isDarkMode ? 'text-white/5' : 'text-gray-200'}`} />
        </div>
        <p className={`${isDarkMode ? 'text-white/10' : 'text-gray-300'} text-[8px] font-black uppercase tracking-widest`}>Tap to Stream</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 animate-slideUp relative justify-between pb-36">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full aspect-square max-w-[220px] flex-shrink-0">
          <div className={`absolute inset-0 bg-violet-600/5 blur-[50px] rounded-full transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
          <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-xl border border-white/5">
            <img src={currentTrack.cover} className={`w-full h-full object-cover transition-all duration-500 ${isPlaying ? 'scale-105' : 'scale-100 opacity-70'}`} alt={currentTrack.title} />
          </div>
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-2xl z-10">
               <div className="w-8 h-8 border-3 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full text-center space-y-1 animate-fadeIn">
          <h1 className={`text-lg font-black truncate px-4 leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentTrack.title}</h1>
          <p className="text-violet-500 text-[10px] font-bold uppercase tracking-[0.2em]">{currentTrack.artist}</p>
        </div>

        <div className="w-full space-y-3 px-2">
          <div 
            className={`h-1 w-full rounded-full overflow-hidden relative cursor-pointer active:scale-y-125 transition-all duration-150 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newTime = (x / rect.width) * totalDuration;
              onSeek(newTime);
            }}
          >
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={`flex justify-between text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(totalDuration || currentTrack.duration)}</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-around px-2">
            <button onClick={onToggleShuffle} className={`p-1.5 transition-all duration-200 ${isShuffle ? 'text-violet-500' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300')}`}>
              <Icons.Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrev} className={`p-3 transition-all duration-200 active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipBack className="w-6 h-6" /></button>
            <button onClick={onTogglePlay} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300 transform hover:scale-105 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {isBuffering ? (
                <div className={`w-7 h-7 border-4 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-black/10' : 'border-white/10'}`} />
              ) : isPlaying ? (
                <Icons.Pause className="w-7 h-7" />
              ) : (
                <Icons.Play className="w-7 h-7 ml-0.5" />
              )}
            </button>
            <button onClick={onNext} className={`p-3 transition-all duration-200 active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipForward className="w-6 h-6" /></button>
            <button onClick={onToggleRepeat} className={`p-1.5 transition-all duration-200 relative ${repeatMode !== RepeatMode.OFF ? 'text-violet-500' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300')}`}>
              <Icons.Repeat className="w-4 h-4" />
              {repeatMode === RepeatMode.ONE && <span className="absolute -top-1 -right-1 text-[6px] font-black bg-violet-500 text-white rounded-full w-3 h-3 flex items-center justify-center">1</span>}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => !isDownloading && onToggleDownload(currentTrack.id)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full glass border transition-all duration-200 active:scale-95 ${isDownloaded ? 'text-violet-500 bg-violet-500/10 border-violet-500/20' : (isDarkMode ? 'text-white/40 hover:text-white border-white/5' : 'text-gray-400 hover:text-violet-700 border-gray-100')}`}
            >
              {isDownloading ? (
                 <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              ) : isDownloaded ? (
                 <Icons.DownloadDone className="w-3.5 h-3.5" />
              ) : (
                 <Icons.Download className="w-3.5 h-3.5" />
              )}
              <span className="text-[8px] font-black uppercase tracking-widest">{isDownloading ? `${downloadProgress}%` : isDownloaded ? 'Offline' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC<{
  isOnline: boolean;
  downloadedCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}> = ({ isOnline, downloadedCount, isDarkMode, onToggleTheme }) => {
  return (
    <div className="p-4 space-y-4 animate-fadeIn pb-44">
      <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      
      <div className="space-y-3">
        <div className={`glass rounded-2xl divide-y border shadow-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-50 border-gray-100 bg-white'}`}>
          <div className="p-4 flex items-center justify-between group">
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>Dark Theme</span>
            <button 
              onClick={onToggleTheme}
              className={`relative w-9 h-5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-violet-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Status</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isOnline ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/80' : 'text-gray-900'}`}>{isOnline ? 'Online' : 'Local'}</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Local Cache</span>
            <span className="text-[8px] font-black text-violet-500 uppercase tracking-widest">{downloadedCount} tracks</span>
          </div>
        </div>

        <div className={`glass rounded-2xl divide-y border shadow-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-50 border-gray-100 bg-white'}`}>
          {[
            { label: 'Quality', value: 'Lossless' },
            { label: 'Version', value: '2.6' }
          ].map(item => (
            <div key={item.label} className={`p-4 flex items-center justify-between transition-all duration-200 cursor-pointer group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <span className={`text-[10px] font-bold transition-all duration-200 ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{item.label}</span>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-200 group-hover:text-violet-500 ${isDarkMode ? 'text-white/20' : 'text-gray-300'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};