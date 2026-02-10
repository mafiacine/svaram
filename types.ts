export enum Tab {
  HOME = 'HOME',
  FOLDER = 'FOLDER',
  SEARCH = 'SEARCH',
  PLAYER = 'PLAYER',
  SETTINGS = 'SETTINGS'
}

export enum RepeatMode {
  OFF = 'OFF',
  ONE = 'ONE',
  ALL = 'ALL'
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  isOffline: boolean;
  duration: number; // Duration in seconds
  category: string;
  popularity: number;
  releaseDate: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  cover: string;
}

export interface UserState {
  isOnline: boolean;
  currentTab: Tab;
  currentTrack: Track | null;
  isPlaying: boolean;
  downloadedIds: string[];
  isShuffle: boolean;
  repeatMode: RepeatMode;
}