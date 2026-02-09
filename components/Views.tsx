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
          {isOnline ? "High-Fi Streaming" : "Offline Library"}
        </p>
      </header>

      <section>
        <h2 className={`text-[10px] font-black mb-3 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Top Charts</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {isLoading ? [1,2,3].map(i => <SkeletonCard key={i} isDarkMode={isDarkMode} />) : tracks.map(track => {
            const progress = isDownloadingMap[track.id];
            const isDownloading = progress !== undefined && progress < 100;
            return (
              <div key={track.id} className="flex-shrink-0 w-32 group relative transition-transform active:scale-95">
                <div onClick={() => onPlayTrack(track)} className={`relative aspect-square mb-2 overflow-hidden rounded-[1.25rem] cursor-pointer shadow-lg border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <img src={track.cover} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" alt={track.title} />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${currentTrackId === track.id ? 'opacity-100' : ''}`}>
                     <Icons.Play className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  {(downloadedIds.includes(track.id) || isDownloading) && (
                    <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 border border-white/10 backdrop-blur-md">
                      {isDownloading ? <div className="w-2.5 h-2.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /> : <Icons.DownloadDone className="w-2.5 h-2.5 text-violet-400" />}
                    </div>
                  )}
                </div>
                <h3 className={`font-bold truncate text-[11px] leading-tight px-1 ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{track.title}</h3>
                <p className={`text-[9px] truncate leading-tight mt-0.5 px-1 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{track.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={`text-[10px] font-black mb-3 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Just for you</h2>
        <div className="space-y-1">
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

export const PlaylistView: React.FC<ViewProps> = ({ isOnline, onPlayTrack, currentTrackId, downloadedIds, onToggleDownload, isDownloadingMap, isLoading, isDarkMode }) => {
  const offlineTracks = MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-44">
      <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Library</h1>
      
      <div className="grid grid-cols-2 gap-3">
        <div className={`aspect-[1.1] glass rounded-3xl p-4 flex flex-col justify-end bg-gradient-to-br border active:scale-95 transition-all ${isDarkMode ? 'from-violet-600/20 via-transparent to-transparent border-white/5' : 'from-violet-500/10 to-transparent border-gray-200'}`}>
          <Icons.Playlist className="w-7 h-7 mb-3 text-violet-500" />
          <h3 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Favorites</h3>
          <p className={`text-[10px] mt-1 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>42 tracks</p>
        </div>
        <div className={`aspect-[1.1] glass rounded-3xl p-4 flex flex-col justify-end bg-gradient-to-br border active:scale-95 transition-all ${isDarkMode ? 'from-fuchsia-600/20 via-transparent to-transparent border-white/5' : 'from-fuchsia-500/10 to-transparent border-gray-200'}`}>
          <Icons.WifiOff className="w-7 h-7 mb-3 text-fuchsia-500" />
          <h3 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cached</h3>
          <p className={`text-[10px] mt-1 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{downloadedIds.length} tracks</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className={`text-[10px] font-black mb-3 uppercase tracking-[0.15em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Available Offline</h2>
        <div className="space-y-1">
          {isLoading ? [1,2,3].map(i => <SkeletonTrack key={i} isDarkMode={isDarkMode} />) : offlineTracks.length > 0 ? (
            offlineTracks.map(track => (
              <TrackItem 
                key={track.id}
                track={track}
                isActive={currentTrackId === track.id}
                isDownloaded={true}
                isOnline={isOnline}
                downloadProgress={isDownloadingMap[track.id]}
                onPlay={() => onPlayTrack(track)}
                onDownload={() => onToggleDownload(track.id)}
                isDarkMode={isDarkMode}
              />
            ))
          ) : (
            <div className={`py-16 text-center glass rounded-[2rem] border backdrop-blur-3xl shadow-2xl transition-all ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white/50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                <Icons.Download className={`w-6 h-6 ${isDarkMode ? 'opacity-20' : 'opacity-40 text-gray-400'}`} />
              </div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>No offline tracks found</p>
              <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-white/10' : 'text-gray-300'}`}>Tracks you download appear here</p>
            </div>
          )}
        </div>
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

  const genres = ['All', 'Pop', 'Electronic', 'Indie', 'Jazz'];

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
    <div className="p-4 space-y-5 animate-fadeIn pb-44">
      <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explore</h1>
      
      <div className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artists, tracks, moods..." 
          className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all backdrop-blur-3xl ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
        />
        <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-violet-500 transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setFilterGenre(genre)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${filterGenre === genre ? 'bg-violet-600 border-violet-400 text-white shadow-lg' : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500 active:scale-95')}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {query && isOnline && !loadingAi && aiSuggestions.length === 0 && (
          <button onClick={handleAiSearch} className="w-full bg-violet-600/10 text-violet-500 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-violet-500/20 hover:bg-violet-600/20 transition-all active:scale-[0.98] shadow-lg">
            Svaram AI Assistant ✨
          </button>
      )}

      {loadingAi ? (
        <div className={`flex flex-col items-center justify-center py-10 glass rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white/50'}`}>
           <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mb-3"></div>
           <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Generating AI Mix...</p>
        </div>
      ) : aiSuggestions.length > 0 && (
        <div className="space-y-3 animate-slideUp">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">AI Insights</h2>
            <button onClick={() => setAiSuggestions([])} className={`text-[9px] font-black transition-colors ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>DISMISS</button>
          </div>
          {aiSuggestions.map((s, idx) => (
             <div key={idx} className={`flex items-center gap-3 p-3 glass rounded-2xl border active:scale-[0.98] transition-transform ${isDarkMode ? 'border-violet-500/20' : 'border-violet-500/10 bg-white/60'}`}>
               <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 font-black text-[10px]">{idx + 1}</div>
               <div className="overflow-hidden"><h3 className={`font-bold text-xs truncate ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{s.title}</h3><p className={`text-[10px] truncate font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{s.artist}</p></div>
             </div>
          ))}
        </div>
      )}

      <div className="space-y-1">
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
        {!isLoading && filteredTracks.length === 0 && (
          <div className="py-20 text-center text-white/10 font-bold uppercase tracking-widest">No tracks found</div>
        )}
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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className={`w-28 h-28 glass rounded-full flex items-center justify-center animate-pulse border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <Icons.Player className={`w-12 h-12 ${isDarkMode ? 'text-white/10' : 'text-gray-200'}`} />
        </div>
        <div>
          <h2 className={`text-xl font-black ${isDarkMode ? 'text-white/80' : 'text-gray-900'}`}>Silent Radio</h2>
          <p className={`${isDarkMode ? 'text-white/30' : 'text-gray-400'} text-xs mt-1 font-medium`}>Select a track to start the vibe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 animate-slideUp relative justify-between pb-36">
      {isBuffering && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden z-50">
          <div className="h-full bg-violet-500 animate-[loading_1.5s_infinite_linear]" style={{width: '30%'}} />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full aspect-square max-w-[280px] flex-shrink-0">
          <div className={`absolute inset-0 bg-violet-600/20 blur-[80px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
          <img 
            src={currentTrack.cover} 
            className={`w-full h-full object-cover rounded-[3rem] shadow-2xl border transition-all duration-1000 ${isDarkMode ? 'border-white/10' : 'border-gray-100'} ${isPlaying ? 'scale-100 rotate-0' : 'scale-90 opacity-60'}`}
            alt={currentTrack.title}
          />
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[3rem]">
               <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full text-center space-y-1 animate-fadeIn">
          <h1 className={`text-xl font-black truncate px-6 leading-tight tracking-tight drop-shadow-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentTrack.title}</h1>
          <p className="text-violet-500 text-sm font-bold uppercase tracking-wider">{currentTrack.artist}</p>
        </div>

        <div className="w-full space-y-4 px-2">
          <div 
            className={`h-1.5 w-full rounded-full overflow-hidden relative cursor-pointer active:scale-y-150 transition-transform ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newTime = (x / rect.width) * totalDuration;
              onSeek(newTime);
            }}
          >
            <div className="h-full bg-violet-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.8)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={`flex justify-between text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration || currentTrack.duration)}</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-around">
            <button onClick={onToggleShuffle} className={`p-2 transition-all ${isShuffle ? 'text-violet-500 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300 hover:text-gray-900')}`}>
              <Icons.Shuffle className="w-5 h-5" />
            </button>
            <button onClick={onPrev} className={`p-4 transition-all active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipBack className="w-8 h-8" /></button>
            <button onClick={onTogglePlay} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:shadow-violet-500/20 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {isBuffering ? (
                <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-black/10' : 'border-white/10'}`} />
              ) : isPlaying ? (
                <Icons.Pause className="w-10 h-10" />
              ) : (
                <Icons.Play className="w-10 h-10 ml-1.5" />
              )}
            </button>
            <button onClick={onNext} className={`p-4 transition-all active:scale-75 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.SkipForward className="w-8 h-8" /></button>
            <button onClick={onToggleRepeat} className={`p-2 transition-all relative ${repeatMode !== RepeatMode.OFF ? 'text-violet-500 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]' : (isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-300 hover:text-gray-900')}`}>
              <Icons.Repeat className="w-5 h-5" />
              {repeatMode === RepeatMode.ONE && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-violet-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => !isDownloading && onToggleDownload(currentTrack.id)} 
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full glass border transition-all active:scale-95 ${isDownloaded ? 'text-violet-500 bg-violet-500/10 border-violet-500/20' : (isDarkMode ? 'text-white/40 hover:text-white border-white/5' : 'text-gray-400 hover:text-gray-900 border-gray-200')}`}
            >
              {isDownloading ? (
                 <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              ) : isDownloaded ? (
                 <Icons.DownloadDone className="w-4 h-4" />
              ) : (
                 <Icons.Download className="w-4 h-4" />
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{isDownloading ? `${downloadProgress}%` : isDownloaded ? 'Offline Ready' : 'Download Now'}</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
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
    <div className="p-4 space-y-6 animate-fadeIn pb-44">
      <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h1>
      
      <div className="space-y-5">
        <div className={`glass rounded-[2rem] divide-y border shadow-lg overflow-hidden transition-all ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-100 border-gray-200 bg-white'}`}>
          <div className="p-5 flex items-center justify-between">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Theme Mode</span>
            <div className="flex items-center gap-3">
               <span className={`text-[10px] font-black uppercase tracking-widest ${!isDarkMode ? 'text-violet-500' : 'text-gray-400'}`}>Light</span>
               <button 
                onClick={onToggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-violet-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'} shadow-md`} />
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-violet-500' : 'text-gray-400'}`}>Dark</span>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Network Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{isOnline ? 'Active Connection' : 'Offline Mode'}</span>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Storage Info</span>
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-tighter">{downloadedCount} Tracks Cached</span>
          </div>
        </div>

        <div className={`glass rounded-[2rem] divide-y border shadow-lg overflow-hidden transition-all ${isDarkMode ? 'divide-white/5 border-white/5' : 'divide-gray-100 border-gray-200 bg-white'}`}>
          {[
            { label: 'Hi-Fi Audio Master', value: 'Lossless' },
            { label: 'AI Prediction Algorithm', value: 'Neural-3' },
            { label: 'Cloud Sync State', value: 'Synced' },
            { label: 'App Version', value: '2.5.1-Native' }
          ].map(item => (
            <div key={item.label} className={`p-5 flex items-center justify-between transition-colors cursor-pointer group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <span className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{item.label}</span>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-white/20' : 'text-gray-300'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
