import { RiPlayFill } from './icons/PlayFill';
import { RiVoiceprintLine } from './icons/VoicePrint';

type VoiceType = {
  name: string;
  description: string;
};

interface VoiceCardProps {
  voice: VoiceType;
  index: number;
  togglePlayPause: (index: number) => void;
  isPlaying: boolean;
  gradientColor: string;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, index, togglePlayPause, isPlaying, gradientColor }) => {
  const handleClick = () => {
    togglePlayPause(index);
  };

  const originColor = gradientColor.match(/(#[0-9A-F]{6})4D/i)?.[1] || '#ffffff';

  return (
    <div className='flex relative bg-bg-3 rounded-2xl sm:w-fit w-full min-w-[272px] h-20'>
      <div
        className="flex items-center p-4 rounded-2xl gap-4 border border-white/10"
        style={{
          background: isPlaying ? gradientColor : "none",
        }}
      >
        <div onClick={handleClick} className="cursor-pointer">
          <div className="rounded-full p-2 w-12 h-12 flex items-center justify-center" style={{ backgroundColor: originColor }}>
            {isPlaying ? <RiVoiceprintLine className='w-6 h-6'/> : <RiPlayFill className='w-6 h-6'/>}
          </div>
        </div>
        <div className="text-left">
          <span className=" block font-medium  text-white">{voice.name}</span>
          <span className=" block  text-[#787878] text-xs ">{voice.description}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceCard;