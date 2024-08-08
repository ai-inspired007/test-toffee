import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiPlayFill } from '../../icons/PlayFill';
import { RiVoiceprintLine } from '../../icons/VoicePrint';

type VoiceType = {
  name: string;
  description: string;
};

const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
  const selectedColors = shuffledColors.slice(0, length);
  return selectedColors.map(color => `linear-gradient(to right, ${color}4D 0%, ${color}00 15%)`);
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
    <div className='bg-bg-3 rounded-2xl sm:w-fit w-full'>
    <div
      className="flex flex-row items-center p-4 rounded-2xl gap-4 border border-white/10"
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
        <span className=" block font-medium font-inter text-white">{voice.name}</span>
        <span className=" block  text-[#787878] text-xs font-inter">{voice.description}</span>
      </div>
    </div>
    </div>
  );
};

interface VoicesProps {
  type: string;
}

const Voices: React.FC<VoicesProps> = ({ type }) => {
  const router = useRouter();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFF5', '#FF33C1', '#57FF33', '#3375FF', '#FFFF33', '#33BFFF'];
  const [gradientBackgrounds, setGradientBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    if (gradientBackgrounds.length === 0) {
      setGradientBackgrounds(generateGradientBackgrounds(colors, 4));
    }
  }, [colors, gradientBackgrounds.length]);

  if (gradientBackgrounds.length === 0) {
    return null;
  }

  const voicelist: VoiceType[] = [
    {
      name: "Zero Two",
      description: "I'm Zero Two from Darling in the Franxx",
    },
    {
      name: "Zero Two",
      description: "I'm Zero Two from Darling in the Franxx",
    },
    {
      name: "Zero Two",
      description: "I'm Zero Two from Darling in the Franxx",
    },
    {
      name: "Zero Two",
      description: "I'm Zero Two from Darling in the Franxx",
    },
  ];

  const togglePlayPause = (index: number) => {
    setPlayingIndex(index === playingIndex ? null : index);
  };

  return (
    <div className="sm:grid-cols-auto-fit flex flex-col sm:flex-row flex-wrap min-w-max gap-4 justify-start">
      {voicelist.map((voice, index) => (
        <VoiceCard
          key={index}
          voice={voice}
          index={index}
          togglePlayPause={togglePlayPause}
          isPlaying={index === playingIndex}
          gradientColor={gradientBackgrounds[index]}
        />
      ))}
    </div>
  );
};

export default Voices;