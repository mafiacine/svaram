
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tab, Track, RepeatMode } from './types';
import { MOCK_TRACKS, Icons } from './constants';
import Player from './components/Player';
import { HomeView, FolderView, SearchView, SettingsView, PlayerTabView } from './components/Views';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set([Tab.HOME]));
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('svaram_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
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
    document.body.style.backgroundColor = isDarkMode ? '#000' : '#f9fafb';
  }, [isDarkMode]);

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
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsLoadingView(false);
    }
  }, [activeTab, loadedTabs]);

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
      case Tab.FOLDER: return <FolderView {...commonProps} />;
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
    <div className={`relative h-screen flex flex-col max-w-md mx-auto overflow-hidden transition-all duration-700 shadow-2xl selection:bg-violet-500/30 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
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
        <div className={`${isDarkMode ? 'bg-fuchsia-600/90' : 'bg-fuchsia-500'} text-white text-[8px] font-black py-1.5 flex items-center justify-center gap-2 z-[70] shadow-md backdrop-blur-md uppercase tracking-[0.2em] animate-pulse`}>
          <Icons.WifiOff className="w-3 h-3" /> Offline Mode
        </div>
      )}

      {isBuffering && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500/10 z-[60] overflow-hidden">
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

      <nav className={`h-[72px] border-t flex items-center justify-around px-2 z-[60] shrink-0 pb-2 backdrop-blur-3xl transition-all duration-700 ${isDarkMode ? 'bg-black/90 border-white/5' : 'bg-white/95 border-gray-100'}`}>
        {[
          { tab: Tab.HOME, icon: <Icons.Home />, label: 'Home' },
          { tab: Tab.FOLDER, icon: <Icons.Folder />, label: 'Folder' },
          { tab: Tab.SEARCH, icon: <Icons.Search />, label: 'Search' },
          { tab: Tab.PLAYER, icon: <Icons.Player />, label: 'Player' },
          { tab: Tab.SETTINGS, icon: <Icons.Settings />, label: 'Settings' }
        ].map(({ tab, icon, label }) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`group flex flex-col items-center gap-1 transition-all duration-500 px-3 py-1.5 rounded-xl relative ${activeTab === tab ? 'text-violet-500 scale-105' : (isDarkMode ? 'text-white/20 hover:text-white/50' : 'text-gray-400 hover:text-violet-500')}`}
          >
            <div className={`w-5 h-5 transition-all duration-500 transform group-hover:scale-110 ${activeTab === tab ? 'rotate-[-4deg] drop-shadow-[0_0_5px_rgba(139,92,246,0.3)]' : ''}`}>{icon}</div>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === tab ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>{label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(450%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;
