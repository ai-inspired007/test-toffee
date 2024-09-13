import { RiPlayFill } from './icons/PlayFill';
import React, { useRef, useEffect } from 'react';
import { RiVoiceprintLine } from './icons/VoicePrint';
import { Voice } from '@prisma/client';

interface VoiceCardProps {
  voice: Partial<Voice>;
  index: number;
  isPlaying: boolean;
  gradientColor: string;
  togglePlayPause: (index: number) => void;
  onShowDetails: (voice: Partial<Voice>, originColor: string) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  index,
  isPlaying,
  gradientColor,
  togglePlayPause,
  onShowDetails,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const originColor = (gradientColor && gradientColor.match(/(#[0-9A-F]{6})4D/i))?.[1] || '#ffffff';
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onShowDetails(voice, originColor);
  };

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    togglePlayPause(index);
  }

  const handleEnd = () => {
    togglePlayPause(index);
  };

  return (
    <div className='bg-bg-3 rounded-2xl overflow-hidden border border-white/10 w-[280px] min-w-[280px] flex'>
      <div
        className="flex relative rounded-2xl w-full h-20"
        style={{ background: isPlaying ? gradientColor : 'var(--bg-3)' }}
        onClick={handleClick}
      >
        <div className="flex items-center p-4 rounded-2xl gap-4">
          <div className="rounded-full p-2 w-12 h-12 flex items-center justify-center" style={{ backgroundColor: originColor }} onClick={handleToggle}>
            {isPlaying ? <RiVoiceprintLine className='w-6 h-6' /> : <RiPlayFill className='w-6 h-6' />}
          </div>
          <div className="text-left ">
            <span className="block font-medium text-white">{voice.name}</span>
            <span className="block text-[#787878] text-xs whitespace-nowrap w-[171px] overflow-hidden">{voice.description}</span>
          </div>
        </div>
        <audio ref={audioRef} src={voice.preview_url} preload="auto" onEnded={handleEnd} />
      </div>
    </div>
  );
};

export default VoiceCard;