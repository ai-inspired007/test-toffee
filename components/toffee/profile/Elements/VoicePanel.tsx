import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceCard from '../../VoiceCard';
import { Empty } from "../../icons/Empty";
import { Voice, Character } from '@prisma/client';
import VoiceCardDetailPopUp from "../../VoiceCardDetailPopUp";
import Modal from "@/components/ui/Modal";

const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  return [...Array(length)].map((_, index) => {
    const color = colors[index % 12];
    return `linear-gradient(to right, ${color}4D 0%, ${color}00 35.07%)`;
  });
}

interface VoicesProps {
  type: string;
  voicelist: Partial<Voice>[];
  characters: Partial<Character & { _count: { messages: number } }>[],

}

const Voices: React.FC<VoicesProps> = ({ type, voicelist, characters }) => {
  const router = useRouter();
  const colors = ['#F7604C', '#BCB8C5', '#CDF74C', '#6E3FF3', '#4CF788', '#F7A84C', '#E73FF3', '#EDACE2', '#F7E34C', '#F74C5D', '#3F7BF3', '#B64D8C'];
  const [gradientBackgrounds, setGradientBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    if (voicelist.length > 0 && gradientBackgrounds.length === 0) {
      setGradientBackgrounds(generateGradientBackgrounds(colors, voicelist.length));
    }
  }, [colors, voicelist.length, gradientBackgrounds.length]);

  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Partial<Voice> | null>(null);
  const [gradientOriginColor, setGradientOriginColor] = useState<string | null>(null);

  const togglePlayPause = (index: number) => {
    setCurrentPlayingIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleShowDetails = (voice: Partial<Voice>, originColor: string) => {
    setSelectedVoice(voice);
    setGradientOriginColor(originColor);
  };

  const handleCloseDetails = () => {
    setSelectedVoice(null);
    setGradientOriginColor(null);
  };

  return (
    <div className={`flex flex-wrap w-full gap-4 ${voicelist.length ? "justify-start" : "justify-center"}`}>
      {voicelist.length > 0 ? (
        voicelist.map((voice, index) => (
          <VoiceCard
            key={index}
            voice={voice}
            index={index}
            togglePlayPause={togglePlayPause}
            isPlaying={index === currentPlayingIndex}
            gradientColor={gradientBackgrounds[index]}
            onShowDetails={handleShowDetails}
          />
        ))
      ) : (
        <div className="flex items-center w-full min-h-full justify-center">
          <div className="flex flex-col gap-2 items-center">
            <Empty />
            <span className="text-base  text-text-sub font-medium text-center mt-2">There is no voice</span>
            <span className="text-sm text-text-tertiary  text-center">{type === "admin" ? "Looks like you still don't have any personal voice" : "Looks like this auther don't have any voices yet"}</span>
            {type === "admin" && <div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full h-9 justify-center cursor-pointer" onClick={() => router.push("/create/candy")}><span className="text-sm py-1 medium">Add new voice</span></div>}
          </div>
        </div>
      )
      }
      <Modal onClose={handleCloseDetails} isOpen={selectedVoice !== null}>
        {selectedVoice && gradientOriginColor && (
          <VoiceCardDetailPopUp
            voice={selectedVoice}
            originColor={gradientOriginColor}
            onClose={handleCloseDetails}
            characters={characters}
          />
        )}
      </Modal>

    </div>
  );
};

export default Voices;