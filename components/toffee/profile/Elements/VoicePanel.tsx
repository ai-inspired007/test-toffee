import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceCard from '../../VoiceCard';
import { Empty } from "../../icons/Empty";

type VoiceType = {
  name: string;
  description: string;
};

const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
  const selectedColors = shuffledColors.slice(0, length);
  return selectedColors.map(color => `linear-gradient(to right, ${color}4D 0%, ${color}00 15%)`);
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
    <div className={`sm:grid-cols-auto-fit flex flex-col sm:flex-row flex-wrap gap-4 ${voicelist.length ? "justify-start" : "justify-center"}`}>
      {voicelist.length > 0 ? (
        voicelist.map((voice, index) => (
          <VoiceCard
            key={index}
            voice={voice}
            index={index}
            togglePlayPause={togglePlayPause}
            isPlaying={index === playingIndex}
            gradientColor={gradientBackgrounds[index]}
          />
        ))
      ) : (
        <div className="flex items-center w-full min-h-full justify-center">
          <div className="flex flex-col gap-2 items-center">
            <Empty />
            <span className="text-base  text-text-sub font-medium text-center mt-2">There is no voice</span>
            <span className="text-sm text-text-tertiary  text-center">{type==="admin"?"Looks like you still don't have any personal voice":"Looks like this auther don't have any voices yet"}</span>
            {type==="admin" && <div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full h-9 justify-center cursor-pointer" onClick={()=>router.push("/create/candy")}><span className="text-sm py-1 medium">Add new voice</span></div>}
          </div>
        </div>
      )
    }

    </div>
  );
};

export default Voices;