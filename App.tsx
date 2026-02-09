
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tab, Track, RepeatMode } from './types';
import { MOCK_TRACKS, Icons } from './constants';
import Player from './components/Player';
import { HomeView, PlaylistView, SearchView, SettingsView, PlayerTabView } from './components/Views';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set([Tab.HOME]));
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('svaram_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Playback settings
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.OFF);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    const saved = localStorage.getItem('svaram_last_track');
    return saved ? JSON.parse(saved) : null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('svaram_downloads');
    return saved ? JSON.parse(saved) : ['1', '2', '4'];
  });
  const [isDownloadingMap, setIsDownloadingMap] = useState<Record<string, number>>({});

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('svaram_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Optimized Tab Loading
  useEffect(() => {
    if (!loadedTabs.has(activeTab)) {
      setIsLoadingView(true);
      const timer = setTimeout(() => {
        setLoadedTabs(prev => {
          const next = new Set(prev);
          next.add(activeTab);
          return next;
        });
        setIsLoadingView(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLoadingView(false);
    }
  }, [activeTab]);

  // Sync isPlaying with Audio element
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handlePlayTrack = useCallback((track: Track, forcePlay = false) => {
    const isDownloaded = downloadedIds.includes(track.id);
    if (!isOnline && !isDownloaded) return;

    if (currentTrack?.id === track.id && !forcePlay) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsBuffering(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOnline, downloadedIds, isPlaying, currentTrack]);

  const handleNext = useCallback(() => {
    const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));
    if (tracks.length === 0) return;

    if (repeatMode === RepeatMode.ONE && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextTrack: Track;
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * tracks.length);
      if (tracks.length > 1 && tracks[randomIndex].id === currentTrack?.id) {
        randomIndex = (randomIndex + 1) % tracks.length;
      }
      nextTrack = tracks[randomIndex];
    } else {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
      nextTrack = tracks[(currentIndex + 1) % tracks.length];
    }
    
    handlePlayTrack(nextTrack, true);
  }, [isOnline, currentTrack, isShuffle, repeatMode, downloadedIds, handlePlayTrack]);

  const handlePrev = useCallback(() => {
    const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    handlePlayTrack(prevTrack, true);
  }, [isOnline, currentTrack, downloadedIds, handlePlayTrack]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const onAudioEnded = () => {
    if (repeatMode === RepeatMode.OFF && !isShuffle) {
      const tracks = isOnline ? MOCK_TRACKS : MOCK_TRACKS.filter(t => downloadedIds.includes(t.id));
      const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex === tracks.length - 1) {
        setIsPlaying(false);
        return;
      }
    }
    handleNext();
  };

  useEffect(() => {
    localStorage.setItem('svaram_downloads', JSON.stringify(downloadedIds));
  }, [downloadedIds]);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('svaram_last_track', JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      if (currentTrack && !downloadedIds.includes(currentTrack.id)) {
        setIsPlaying(false);
      }
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentTrack, downloadedIds]);

  const simulateDownload = useCallback((trackId: string) => {
    if (isDownloadingMap[trackId] !== undefined) return;
    setIsDownloadingMap(prev => ({ ...prev, [trackId]: 0 }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadedIds(prev => [...new Set([...prev, trackId])]);
        setIsDownloadingMap(prev => {
          const next = { ...prev };
          delete next[trackId];
          return next;
        });
      } else {
        setIsDownloadingMap(prev => ({ ...prev, [trackId]: progress }));
      }
    }, 250);
  }, [isDownloadingMap]);

  const handleToggleDownload = (trackId: string) => {
    if (downloadedIds.includes(trackId)) {
      setDownloadedIds(prev => prev.filter(id => id !== trackId));
    } else if (isOnline) {
      simulateDownload(trackId);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === RepeatMode.OFF) return RepeatMode.ALL;
      if (prev === RepeatMode.ALL) return RepeatMode.ONE;
      return RepeatMode.OFF;
    });
  };

  const renderView = () => {
    const commonProps = { 
      isOnline, 
      onPlayTrack: handlePlayTrack, 
      currentTrackId: currentTrack?.id,
      downloadedIds,
      onToggleDownload: handleToggleDownload,
      isDownloadingMap,
      isLoading: isLoadingView,
      isDarkMode
    };

    switch (activeTab) {
      case Tab.HOME: return <HomeView {...commonProps} />;
      case Tab.PLAYLIST: return <PlaylistView {...commonProps} />;
      case Tab.SEARCH: return <SearchView {...commonProps} />;
      case Tab.PLAYER: return (
        <PlayerTabView 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrev={handlePrev}
          isDownloaded={currentTrack ? downloadedIds.includes(currentTrack.id) : false}
          onToggleDownload={handleToggleDownload}
          downloadProgress={currentTrack ? isDownloadingMap[currentTrack.id] : undefined}
          isBuffering={isBuffering}
          currentTime={currentTime}
          totalDuration={totalDuration}
          onSeek={handleSeek}
          isShuffle={isShuffle}
          onToggleShuffle={toggleShuffle}
          repeatMode={repeatMode}
          onToggleRepeat={toggleRepeat}
          isDarkMode={isDarkMode}
        />
      );
      case Tab.SETTINGS: return (
        <SettingsView 
          isOnline={isOnline} 
          downloadedCount={downloadedIds.length} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
        />
      );
      default: return <HomeView {...commonProps} />;
    }
  };

  return (
    <div className={`relative h-screen flex flex-col max-w-md mx-auto overflow-hidden transition-colors duration-500 shadow-2xl selection:bg-violet-500/30 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onEnded={onAudioEnded}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadedMetadata={() => audioRef.current && setTotalDuration(audioRef.current.duration)}
      />

      {!isOnline && (
        <div className={`${isDarkMode ? 'bg-fuchsia-600/90' : 'bg-fuchsia-500'} text-white text-[9px] font-black py-1.5 flex items-center justify-center gap-2 z-[70] shadow-lg backdrop-blur-md uppercase tracking-widest`}>
          <Icons.WifiOff className="w-3.5 h-3.5" /> Offline Radio
        </div>
      )}

      {isBuffering && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500/10 z-[60] overflow-hidden">
          <div className="h-full bg-violet-500 w-1/4 animate-[loading_1.5s_infinite_linear] shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
        </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {renderView()}
      </main>

      {activeTab !== Tab.PLAYER && currentTrack && (
        <div onClick={() => setActiveTab(Tab.PLAYER)}>
          <Player 
            currentTrack={currentTrack} 
            isPlaying={isPlaying} 
            onTogglePlay={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            onNext={(e) => { e.stopPropagation(); handleNext(); }}
            onPrev={(e) => { e.stopPropagation(); handlePrev(); }}
            isBuffering={isBuffering}
            currentTime={currentTime}
            totalDuration={totalDuration}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      <nav className={`h-[76px] border-t flex items-center justify-around px-3 z-[60] shrink-0 pb-1 backdrop-blur-xl transition-colors duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        {[
          { tab: Tab.HOME, icon: <Icons.Home />, label: 'Home' },
          { tab: Tab.PLAYLIST, icon: <Icons.Playlist />, label: 'Library' },
          { tab: Tab.SEARCH, icon: <Icons.Search />, label: 'Discover' },
          { tab: Tab.PLAYER, icon: <Icons.Player />, label: 'Live' },
          { tab: Tab.SETTINGS, icon: <Icons.Settings />, label: 'Config' }
        ].map(({ tab, icon, label }) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 px-3 py-1 rounded-2xl ${activeTab === tab ? 'text-violet-500 scale-110' : (isDarkMode ? 'text-white/20' : 'text-gray-400')}`}
          >
            <div className={`w-5 h-5 transition-transform duration-500 ${activeTab === tab ? 'rotate-[-5deg]' : ''}`}>{icon}</div>
            <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-opacity duration-500 ${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(450%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
