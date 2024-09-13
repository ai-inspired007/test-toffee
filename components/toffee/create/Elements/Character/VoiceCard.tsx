import { RiPlayFill } from '../../../icons/PlayFill';
import React from 'react';
import { RiVoiceprintLine } from '../../../icons/VoicePrint';
import { Voice } from '@prisma/client';

interface VoiceCardProps {
  voice: Partial<Voice>;
  index: number;
  togglePlayPause: (index: number) => void;
  isPlaying: boolean;
  gradientColor: string;
  selected: boolean;
  onSelect: () => void;
  round: boolean;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, index, togglePlayPause, isPlaying, gradientColor, selected, onSelect, round }) => {

  const handlePlayPauseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    togglePlayPause(index);
  };

  const originColor = (gradientColor && gradientColor.match(/(#[0-9A-F]{6})/i))?.[1] || '#ffffff';

  return (
    <div onClick={onSelect} className={`flex flex-row items-center relative bg-bg-3 rounded-2xl w-full min-w-[272px] h-20 pr-[30px] border ${selected ? 'border-[#BC7F44]' : 'border-white/10'}`}>
      <div
        className="flex items-center p-4 rounded-2xl gap-4 justify-center"
        style={{
          background: isPlaying ? gradientColor : "none",
        }}
      >
        <div onClick={handlePlayPauseClick} className="cursor-pointer">
          <div className="rounded-full p-2 w-12 h-12 flex items-center justify-center" style={{ backgroundColor: originColor }}>
            {isPlaying ? <RiVoiceprintLine className='w-6 h-6' /> : <RiPlayFill className='w-6 h-6' />}
          </div>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-medium text-white">{voice.name}</span>
          <span className="text-[#787878] text-xs ">{voice.description}</span>
        </div>
      </div>
      {round &&
        <div className={`ml-auto w-5 h-5 p-1 rounded-full border ${selected ? 'border-[#BC7F44]' : ' border-white/10'}`}>
          <div className={`rounded-full w-full h-full ${selected ? 'bg-[#BC7F44]' : ' '}`} />
        </div>
      }
    </div>
  );
};

export default VoiceCard;