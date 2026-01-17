import React, { useCallback } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause } from 'lucide-react';

const fmt = (s: number) => {
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

const AudioPlayer: React.FC = () => {
  const { current, isPlaying, toggle, currentTime, duration, seek } = useAudioPlayer();

  const onSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const seconds = Math.floor((duration || 0) * pct);
    seek(seconds);
  }, [duration, seek]);

  if (!current) return null;

  const progressPct = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-[92%] max-w-[420px] z-50">
      <div className="bg-white rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-medium text-[#1F2937]">{current.title}</div>
            <div className="text-xs text-gray-500">Playing · {fmt(currentTime)} / {duration ? fmt(duration) : '--:--'}</div>
          </div>
          <button onClick={toggle} className="w-10 h-10 rounded-full bg-[#3B9B8F] flex items-center justify-center">
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer" onClick={onSeekClick}>
          <div className="h-full bg-[#3B9B8F]" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
