import React from 'react';
import MobileFrame from '@/components/MobileFrame';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

const tracks = [
  { title: 'Gentle Lullaby', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', length: '6:12' },
  { title: 'Calm Waves', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', length: '4:45' },
];

const PrenatalMusic: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack } = useAudioPlayer();

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-4 px-6 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Prenatal Music</h1>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-6 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="max-w-[380px] mx-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-600">Soothing tracks for you and baby</p>
            </div>

            <div className="space-y-3">
              {tracks.map((t) => (
                <div key={t.src} className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm">
                  <div>
                    <div className="font-medium text-sm text-[#1F2937]">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.length}</div>
                  </div>
                  <button
                    onClick={() => playTrack({ title: t.title, src: t.src })}
                    className="w-10 h-10 rounded-full bg-[#3B9B8F] flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default PrenatalMusic;
