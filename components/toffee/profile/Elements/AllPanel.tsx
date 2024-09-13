import { Character, KnowledgePack, Voice } from "@prisma/client";
import { Empty } from "../../icons/Empty";
import { useRouter } from "next/navigation";
import CharacterCard from "../../CharacterCard";
import CandyCard from "../../CandyCard";
import VoiceCard from "../../VoiceCard";
import Carousel from "../../../ui/carousel";
import { useEffect, useState } from "react";
import VoiceCardDetailPopUp from "../../VoiceCardDetailPopUp";
import Modal from "@/components/ui/Modal";


const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  return [...Array(length)].map((_, index) => {
    const color = colors[index % 12];
    return `linear-gradient(to right, ${color}4D 0%, ${color}00 35.07%)`;
  });
}

const All = ({
  characters,
  candies,
  type,
  voiceList,
}: {
  characters: Partial<Character & { _count: { messages: number } }>[],
  candies: Partial<KnowledgePack>[],
  type: string,
  voiceList: Partial<Voice>[]
}) => {

  const router = useRouter();
  const colors = ['#F7604C', '#BCB8C5', '#CDF74C', '#6E3FF3', '#4CF788', '#F7A84C', '#E73FF3', '#EDACE2', '#F7E34C', '#F74C5D', '#3F7BF3', '#B64D8C'];
  const [gradientBackgrounds, setGradientBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    if (voiceList.length > 0 && gradientBackgrounds.length === 0) {
      setGradientBackgrounds(generateGradientBackgrounds(colors, voiceList.length));
    }
  }, [colors, voiceList.length, gradientBackgrounds.length]);

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
    <div className="flex flex-col gap-8">
      <div className="w-full overflow-hidden">
        <Carousel title="Characters" className="flex text-white font-sans text-lg font-semibold leading-7">
          {characters?.map((character, index) => <CharacterCard key={index} character={character} link={`/character/${character.id}`} />)}
        </Carousel>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel title="Candies" className="flex text-white font-sans text-lg font-semibold leading-7">
          {candies?.map((candy, index) => (
            <CandyCard candy={candy} key={index} />
          ))}
        </Carousel>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel title="Voices" className="flex text-white font-sans text-lg font-semibold leading-7">
          {voiceList?.map((voice, index) => (
            <VoiceCard
              key={index}
              voice={voice}
              index={index}
              togglePlayPause={togglePlayPause}
              isPlaying={index === currentPlayingIndex}
              gradientColor={gradientBackgrounds[index]}
              onShowDetails={handleShowDetails}
            />
          ))}
        </Carousel>
      </div>
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
  )
}
export default All;