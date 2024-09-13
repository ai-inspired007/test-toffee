import { RiPlayFill } from '../../../icons/PlayFill';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RiVoiceprintLine } from '../../../icons/VoicePrint';
import { Voice } from '@prisma/client';
import { TKnowledgePack, TVoice } from "@/lib/types";

interface VoiceCardProps {
  voice: TVoice | undefined;
  togglePlayPause: () => void;
  isPlaying: boolean;
  gradientColor: string;
}

const SingleVoiceCard: React.FC<VoiceCardProps> = ({ voice, togglePlayPause, isPlaying, gradientColor }) => {

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const originColor = useMemo(() => (gradientColor && gradientColor.match(/(#[0-9A-F]{6})/i))?.[1] || '#ffffff', [gradientColor]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [playing]);

  const handlePlayPauseClick = () => {
    setPlaying(prevState => !prevState);
    togglePlayPause();
  }

  return (
    <div className={`flex flex-row items-center relative bg-bg-3 rounded-2xl w-full min-w-[272px] h-20 pr-[30px] border`}>
      <div
        className="flex items-center p-4 rounded-2xl gap-4"
        style={{
          background: isPlaying ? gradientColor : "none",
        }}
      >
        <div onClick={handlePlayPauseClick} className="cursor-pointer">
          <div className="rounded-full p-2 w-12 h-12 flex items-center justify-center" style={{ backgroundColor: originColor }}>
            {isPlaying ? <RiVoiceprintLine className='w-6 h-6' /> : <RiPlayFill className='w-6 h-6' />}
          </div>
        </div>
        <div className="text-left">
          <span className="block font-medium text-white">{voice?.name}</span>
          <span className="block text-[#787878] text-xs">{voice?.description}</span>
        </div>
      </div>
      <audio ref={audioRef} src={voice?.preview_url} onEnded={handlePlayPauseClick} />
    </div>
  );
};

export default SingleVoiceCard;