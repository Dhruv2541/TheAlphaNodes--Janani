import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Track = { title: string; src: string } | null;

type AudioPlayerContextType = {
  current: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (t: Track) => void;
  toggle: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      try {
        localStorage.setItem('audioPlayerState', JSON.stringify({ current: null, isPlaying: false, currentTime: 0 }));
      } catch {}
    };

    const onTime = () => {
      const t = Math.floor(a.currentTime || 0);
      setCurrentTime(t);
      try {
        const state = { current: current ? { title: current.title, src: current.src } : null, isPlaying, currentTime: t };
        localStorage.setItem('audioPlayerState', JSON.stringify(state));
      } catch {}
    };

    const onLoaded = () => {
      setDuration(Math.floor(a.duration || 0));
    };

    a.addEventListener('ended', onEnded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoaded);

    // restore persisted state
    try {
      const saved = localStorage.getItem('audioPlayerState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.current?.src) {
          a.src = parsed.current.src;
          if (parsed.currentTime) a.currentTime = parsed.currentTime;
          setCurrent({ title: parsed.current.title, src: parsed.current.src });
          setCurrentTime(parsed.currentTime || 0);
          if (parsed.isPlaying) {
            a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        }
      }
    } catch (e) {}

    return () => {
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('timeupdate', onTime);
      a.pause();
      a.src = '';
    };
  }, []);

  const playTrack = (t: Track) => {
    if (!t) return;
    const a = audioRef.current!;
    if (current?.src !== t.src) {
      a.src = t.src;
      a.load();
    }
    a.play();
    setCurrent(t);
    setIsPlaying(true);
    try {
      localStorage.setItem('audioPlayerState', JSON.stringify({ current: { title: t.title, src: t.src }, isPlaying: true, currentTime: 0 }));
    } catch {}
  };

  const pause = () => {
    const a = audioRef.current!;
    a.pause();
    setIsPlaying(false);
    try {
      const state = { current: current ? { title: current.title, src: current.src } : null, isPlaying: false, currentTime: Math.floor(a.currentTime || 0) };
      localStorage.setItem('audioPlayerState', JSON.stringify(state));
    } catch {}
  };

  const seek = (seconds: number) => {
    const a = audioRef.current!;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.duration || 0, seconds));
    setCurrentTime(Math.floor(a.currentTime || 0));
    try {
      const state = { current: current ? { title: current.title, src: current.src } : null, isPlaying, currentTime: Math.floor(a.currentTime || 0) };
      localStorage.setItem('audioPlayerState', JSON.stringify(state));
    } catch {}
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) pause(); else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <AudioPlayerContext.Provider value={{ current, isPlaying, currentTime, duration, playTrack, toggle, pause, seek }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  return ctx;
};

export default AudioPlayerContext;
