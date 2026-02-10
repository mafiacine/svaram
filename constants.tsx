import React from 'react';
import { Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Holi Paral Ba 4 Ke',
    artist: 'Khesari Lal Yadav, Shilpi Raj',
    cover: 'https://khesari.in/siteuploads/thumb/c/11307_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14931/Holi%20Paral%20Ba%204%20Ke(Khesari.in).mp3',
    isOffline: true,
    duration: 243,
    category: 'New',
    popularity: 95,
    releaseDate: '2011-10-18'
  },
  {
    id: '2',
    title: 'Tor Mahtari Jindabad',
    artist: 'Khesari Lal Yadav',
    cover: 'https://khesari.in/siteuploads/thumb/c/11297_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14922/Tor%20Mahtari%20Jindabad(Khesari.in).mp3',
    isOffline: true,
    duration: 246,
    category: 'New',
    popularity: 98,
    releaseDate: '2016-11-25'
  },
  {
    id: '3',
    title: 'Tatkal Aaja',
    artist: 'Khesari Lal Yadav',
    cover: 'https://khesari.in/siteuploads/thumb/c/11292_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14920/Tatkal%20Aaja(Khesari.in).mp3',
    isOffline: false,
    duration: 340,
    category: 'New',
    popularity: 99,
    releaseDate: '2019-11-29'
  },
  {
    id: '4',
    title: '	Right Sali Pe Ba Jija Ka',
    artist: 'Pawan Singh',
    cover: 'https://khesari.in/siteuploads/thumb/c/11300_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14924/Right%20Sali%20Pe%20Ba%20Jija%20Ka(Khesari.in).mp3',
    isOffline: true,
    duration: 202,
    category: 'Sad',
    popularity: 92,
    releaseDate: '2020-06-29'
  },
  {
    id: '5',
    title: 'Odhaniya Ae Gori',
    artist: 'Pawan Singh',
    cover: 'https://khesari.in/siteuploads/thumb/c/11283_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14912/Odhaniya%20Ae%20Gori(Khesari.in).mp3',
    isOffline: false,
    duration: 203,
    category: 'Old',
    popularity: 94,
    releaseDate: '2020-10-01'
  },
  {
    id: '6',
    title: 'Kaniya Bane Ke Pari',
    artist: 'Khesari Lal Yadav',
    cover: 'https://khesari.in/siteuploads/thumb/c/11278_5.jpg',
    audioUrl: 'https://dd.khesari.in/files/sfd30/14907/Kaniya%20Bane%20Ke%20Pari(Khesari.in).mp3',
    isOffline: false,
    duration: 263,
    category: 'New',
    popularity: 94,
    releaseDate: '2020-10-01'
  },
  {
    id: '7',
    title: 'Piya Mor Baurahe Chumma Lebahu Na Jane',
    artist: 'Khesari Lal Yadav',
    cover: 'https://khesari2.in/siteuploads/thumb/c/17264_3.jpg',
    audioUrl: 'https://khesari2.in/siteuploads/files/sfd62/30741/Piya%20Mor%20Baurahe%20Chumma%20Lebahu%20Na%20Jane(Khesari2.IN).mp3',
    isOffline: false,
    duration: 274,
    category: 'New',
    popularity: 94,
    releaseDate: '2020-10-01'
  },
  {
    id: '8',
    title: 'Aag Lagaibu Ka',
    artist: 'Khesari Lal Yadav',
    cover: 'https://khesari2.in/siteuploads/thumb/c/26352_4.jpg',
    audioUrl: 'https://khesari2.in/siteuploads/files/sfd83/41235/%20Petrol%20Jawaniya%20Se%20Gori%20Aag%20Lagaibu%20Ka(Khesari2.IN).mp3',
    isOffline: false,
    duration: 248,
    category: 'New',
    popularity: 94,
    releaseDate: '2020-10-01'
  },
  {
    id: '9',
    title: 'Babuni Tere Rang Mein',
    artist: 'Pawan Singh',
    cover: 'https://khesari2.in/siteuploads/thumb/sft36/17975_3.jpg',
    audioUrl: 'https://khesari2.in/siteuploads/files/sfd36/17976/Babuni%20Tere%20Rang%20Me%20Main%20Bhola%20Bhala%20Lalla%2056%20Inch%20Dabbang%20Ho%20Gaya(Khesari2.IN).mp3',
    isOffline: false,
    duration: 248,
    category: 'New',
    popularity: 94,
    releaseDate: '2020-10-01'
  },
];

export const Icons = {
  Home: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Folder: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  ),
  Playlist: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  ),
  Search: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Settings: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Player: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
  ),
  Play: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  Pause: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
  ),
  SkipBack: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
  ),
  SkipForward: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
  ),
  Shuffle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
  ),
  Repeat: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
  ),
  WifiOff: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>
  ),
  Download: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  DownloadDone: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Filter: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  ArrowLeft: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  )
};
