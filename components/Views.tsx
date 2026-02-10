
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
  <div className="flex items-center gap-3 p-1.5 animate-pulse transition-all duration-500">
    <div className={`w-10 h-10 rounded-lg backdrop-blur-3xl shadow-inner border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className="flex-1 space-y-1.5">
      <div className={`h-2.5 rounded w-3/4 blur-[2px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
      <div className={`h-1.5 rounded w-1/2 blur-[4px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
    </div>
  </div>
);

const SkeletonCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="flex-shrink-0 w-28 animate-pulse">
    <div className={`aspect-square rounded-2xl mb-2 backdrop-blur-3xl shadow-xl border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-200 border-gray-300'}`} />
    <div className={`h-2.5 rounded w-full mb-1 blur-[2px] ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
    <div className={`h-1.5 rounded w-2/3 blur-[4px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
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
    <div className={`relative group overflow-hidden rounded-xl transition-all duration-500 ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100 hover:translate-x-1'}`}>
      <div className={`flex items-center gap-2.5 p-2 transition-all cursor-pointer active:scale-95 ${isActive ? (isDarkMode ? 'bg-violet-500/15' : 'bg-violet-50') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5')}`}>
        <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm transition-all duration-500" onClick={() => !isDisabled && onPlay()}>
          <img src={track.cover} className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} alt={track.title} />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Icons.Play className={`w-4 h-4 text-white transform transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden" onClick={() => !isDisabled && onPlay()}>
          <h3 className={`font-bold truncate text-[13px] leading-tight transition-colors duration-300 ${isActive ? 'text-violet-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>{track.title}</h3>
          <p className={`text-[10px] truncate leading-tight mt-0.5 font-medium transition-colors duration-300 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{track.artist}</p>
        </div>
        
        <div className="flex items-center gap-1.5">
          {isDownloading && (
            <span className="text-[8px] font-bold text-violet-500 tabular-nums animate-pulse">
              {downloadProgress}%
            </span>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); if (!isDownloading && isOnline) onDownload(); }}
            className={`p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-90 ${isDownloaded ? 'text-violet-500 bg-violet-500/10' : (isDarkMode ? 'text-white/20 hover:text-white hover:bg-white/10' : 'text-gray-300 hover:text-violet-600')}`}
            disabled={isDownloading || !isOnline}
          >
            {isDownloaded ? <Icons.DownloadDone className="w-3.5 h-3.5" /> : 
             isDownloading ? <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> :
             <Icons.Download className="w-3.5 h-3.5" />}
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
    <div className="p-4 pb-44 space-y-5 animate-fadeIn">
      <header className="flex flex-col">
        <h1 className="text-xl font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">
          Svaram
        </h1>
        <p className={`${isDarkMode ? 'text-white/30' : 'text-gray-400'} text-[8px] uppercase tracking-[0.2em] font-black`}>
          {isOnline ? "Streaming" : "Offline"}
        </p>
      </header>

      <section>
        <h2 className={`text-[9px] font-black mb-2 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Discovery</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-0.5">
          {isLoading ? [1,2,3].map(i => <SkeletonCard key={i} isDarkMode={isDarkMode} />) : tracks.map(track => {
            const progress = isDownloadingMap[track.id];
            const isDownloading = progress !== undefined && progress < 100;
            return (
              <div key={track.id} className="flex-shrink-0 w-28 group relative transition-all duration-500">
                <div onClick={() => onPlayTrack(track)} className={`relative aspect-square mb-2 overflow-hidden rounded-[1.25rem] cursor-pointer shadow-md border transition-all duration-700 ${isDarkMode ? 'border-white/5' : 'border-gray-200'} group-hover:shadow-violet-500/20`}>
                  <img src={track.cover} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out" alt={track.title} />
                  <div className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ${currentTrackId === track.id ? 'opacity-100' : ''}`}>
                     <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Icons.Play className="w-4 h-4 text-white ml-0.5" />
                     </div>
                  </div>
                  {(downloadedIds.includes(track.id) || isDownloading) && (
                    <div className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 border border-white/10 backdrop-blur-md">
                      {isDownloading ? <div className="w-2.5 h-2.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /> : <Icons.DownloadDone className="w-2.5 h-2.5 text-violet-400" />}
                    </div>
                  )}
                </div>
                <h3 className={`font-bold truncate text-[10px] leading-tight px-0.5 ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{track.title}</h3>
                <p className={`text-[8.5px] truncate leading-tight mt-0.5 px-0.5 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{track.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={`text-[9px] font-black mb-2 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Recent Play</h2>
        <div className="space-y-0.5">
          {isLoading ? [1,2,3,4].map(i => <SkeletonTrack key={i} isDarkMode={isDarkMode} />) : tracks.slice().reverse().map(track => (
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
      <div className="p-4 space-y-4 animate-fadeIn pb-44">
        <header className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedArtist(null)}
            className={`p-2 rounded-full transition-all active:scale-75 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
          >
            <Icons.ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedArtist}</h1>
            <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{artistTracks.length} tracks</p>
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
    <div className="p-4 space-y-5 animate-fadeIn pb-44">
      <header className="flex justify-between items-center">
        <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Folders</h1>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${isDarkMode ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-black/5 text-black/40'}`}>
          {artistFolders.length} ARTISTS
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3.5">
        {artistFolders.map(([artist, data]) => (
          <div 
            key={artist}
            onClick={() => setSelectedArtist(artist)}
            className={`aspect-square relative group overflow-hidden rounded-[1.75rem] glass border transition-all duration-700 active:scale-[0.97] cursor-pointer shadow-md flex flex-col justify-end ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}
          >
            <img 
                src={data.cover} 
                alt={artist} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-out" 
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black via-black/40 to-transparent' : 'from-black/80 via-black/20 to-transparent'}`} />
            
            <div className="relative z-10 p-3.5">
              <div className={`w-7 h-7 mb-2 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 bg-white/10 text-white transform transition-transform group-hover:rotate-6`}>
                  <Icons.Folder className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-[11px] leading-tight truncate mb-0.5 text-white">{artist}</h3>
              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-white/60">
                {data.count} {data.count === 1 ? 'Track' : 'Tracks'}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500/10">
               <div className="h-full bg-violet-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
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
    <div className="p-4 space-y-4 animate-fadeIn pb-44">
      <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explore</h1>
      
      <div className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vibe..." 
          className={`w-full border rounded-xl py-3 pl-10 pr-4 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all backdrop-blur-3xl shadow-sm ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-white/20' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
        />
        <Icons.Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setFilterGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border ${filterGenre === genre ? 'bg-violet-600 border-violet-400 text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-400')}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {query && isOnline && !loadingAi && aiSuggestions.length === 0 && (
          <button onClick={handleAiSearch} className="w-full bg-violet-600/10 text-violet-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-violet-500/10 transition-all active:scale-[0.98]">
             Svaram AI Mix ✨
          </button>
      )}

      {loadingAi ? (
        <div className={`flex flex-col items-center justify-center py-10 rounded-2xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
           <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mb-3"></div>
           <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Refining Mix...</p>
        </div>
      ) : aiSuggestions.length > 0 && (
        <div className="space-y-2 animate-slideUp">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[9px] font-black text-violet-500 uppercase tracking-widest">AI Suggests</h2>
            <button onClick={() => setAiSuggestions([])} className={`text-[8px] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>CLOSE</button>
          </div>
          {aiSuggestions.map((s, idx) => (
             <div key={idx} className={`flex items-center gap-3 p-3 glass rounded-xl border active:scale-[0.98] transition-all ${isDarkMode ? 'border-violet-500/10' : 'border-violet-500/10 bg-white/50'}`}>
               <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 font-black text-[9px]">{idx + 1}</div>
               <div className="overflow-hidden"><h3 className={`font-bold text-[11px] truncate ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{s.title}</h3><p className={`text-[9px] truncate font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{s.artist}</p></div>
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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className={`w-24 h-24 glass rounded-full flex items-center justify-center animate-pulse border ${isDarkMode ? 'border-white/5 shadow-inner' : 'border-gray-100 shadow-md'}`}>
          <Icons.Player className={`w-10 h-10 ${isDarkMode ? 'text-white/10' : 'text-gray-200'}`} />
        </div>
        <p className={`${isDarkMode ? 'text-white/20' : 'text-gray-400'} text-[9px] font-black uppercase tracking-[0.2em]`}>Ready to Sync</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 animate-slideUp relative justify-between pb-36">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full aspect-square max-w-[240px] flex-shrink-0 group">
          <div className={`absolute inset-0 bg-violet-600/10 blur-[60px] rounded-full transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-90'}`} />
          <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5">
            <img src={currentTrack.cover} className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-105' : 'scale-100 opacity-60'}`} alt={currentTrack.title} />
          </div>
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-[2.5rem] z-10">
               <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full text-center space-y-1.5 animate-fadeIn">
          <h1 className={`text-xl font-black truncate px-4 leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentTrack.title}</h1>
          <p className="text-violet-500 text-xs font-bold uppercase tracking-[0.3em]">{currentTrack.artist}</p>
        </div>

        <div className="w-full space-y-4 px-2 group">
          <div 
            className={`h-1.5 w-full rounded-full overflow-hidden relative cursor-pointer group-hover:scale-y-125 transition-all duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newTime = (x / rect.width) * totalDuration;
              onSeek(newTime);
            }}
          >
            <div className="h-full bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={`flex justify-between text-[9px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(totalDuration || currentTrack.duration)}</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-around px-2">
            <button onClick={onToggleShuffle} className={`p-2 transition-all duration-500 ${isShuffle ? 'text-violet-500' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300')}`}>
              <Icons.Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrev} className={`p-4 transition-all duration-500 active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipBack className="w-7 h-7" /></button>
            <button onClick={onTogglePlay} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all duration-500 transform hover:scale-105 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {isBuffering ? (
                <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-black/10' : 'border-white/10'}`} />
              ) : isPlaying ? (
                <Icons.Pause className="w-8 h-8" />
              ) : (
                <Icons.Play className="w-8 h-8 ml-1" />
              )}
            </button>
            <button onClick={onNext} className={`p-4 transition-all duration-500 active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipForward className="w-7 h-7" /></button>
            <button onClick={onToggleRepeat} className={`p-2 transition-all duration-500 relative ${repeatMode !== RepeatMode.OFF ? 'text-violet-500' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300')}`}>
              <Icons.Repeat className="w-4 h-4" />
              {repeatMode === RepeatMode.ONE && <span className="absolute -top-1 -right-1 text-[7px] font-black bg-violet-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => !isDownloading && onToggleDownload(currentTrack.id)} 
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full glass border transition-all duration-500 active:scale-95 ${isDownloaded ? 'text-violet-500 bg-violet-500/10 border-violet-500/20 shadow-none' : (isDarkMode ? 'text-white/40 hover:text-white border-white/5 shadow-lg' : 'text-gray-400 hover:text-violet-700 border-gray-100 shadow-md')}`}
            >
              {isDownloading ? (
                 <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              ) : isDownloaded ? (
                 <Icons.DownloadDone className="w-4 h-4" />
              ) : (
                 <Icons.Download className="w-4 h-4" />
              )}
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isDownloading ? `${downloadProgress}%` : isDownloaded ? 'Offline Cache' : 'Secure offline'}</span>
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
    <div className="p-4 space-y-5 animate-fadeIn pb-44">
      <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      
      <div className="space-y-4">
        <div className={`glass rounded-[2rem] divide-y border shadow-xl overflow-hidden transition-all duration-500 ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-50 border-gray-100 bg-white'}`}>
          <div className="p-5 flex items-center justify-between group">
            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>Dark Theme</span>
            <button 
              onClick={onToggleTheme}
              className={`relative w-11 h-6 rounded-full transition-all duration-500 ${isDarkMode ? 'bg-violet-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Network Link</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-1000 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/80' : 'text-gray-900'}`}>{isOnline ? 'Active' : 'Offline'}</span>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Local Cache</span>
            <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">{downloadedCount} TRACKS</span>
          </div>
        </div>

        <div className={`glass rounded-[2rem] divide-y border shadow-xl overflow-hidden transition-all duration-500 ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-50 border-gray-100 bg-white'}`}>
          {[
            { label: 'Audio Quality', value: 'High' },
            { label: 'Build Manifest', value: 'v2.6' }
          ].map(item => (
            <div key={item.label} className={`p-5 flex items-center justify-between transition-all duration-300 cursor-pointer group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <span className={`text-[11px] font-bold transition-all duration-300 ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{item.label}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 group-hover:text-violet-500 ${isDarkMode ? 'text-white/20' : 'text-gray-300'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
