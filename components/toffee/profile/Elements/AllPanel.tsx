import { Character, KnowledgePack } from "@prisma/client";
import { Empty } from "../../icons/Empty";
import { useRouter } from "next/navigation";
import CharacterCard from "../../CharacterCard";
import CandyCard from "../../CandyCard";
import VoiceCard from "../../VoiceCard";
import Carousel from "../../../ui/Carousel";
import { useEffect, useState } from "react";

type VoiceType = {
  name: string;
  description: string;
};

const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
  const selectedColors = shuffledColors.slice(0, length);
  return selectedColors.map(color => `linear-gradient(to right, ${color}4D 0%, ${color}00 15%)`);
};

const All = ({
  characters,
  candies,
  type
}: {
    characters: Partial<Character & { _count: { messages: number } }>[],
    candies: Partial<KnowledgePack>[],
    type: string
}) => {
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
    <div className="flex flex-col gap-8">
      <div className="w-full overflow-hidden">
        <Carousel title="Characters" className="flex text-white font-sans text-lg font-semibold leading-7">
          {characters?.map((character, index) => <CharacterCard key={index} character={character} link={`/character/${character.id}`} />)}
        </Carousel>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel title="Candies" className="flex text-white font-sans text-lg font-semibold leading-7">
          {candies?.map((candy, index)=>(
            <CandyCard candy={candy} key={index}/>
          ))}
        </Carousel>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel title="Voices" className="flex text-white font-sans text-lg font-semibold leading-7">
          {voicelist?.map((voice, index) => (
            <VoiceCard
              key={index}
              voice={voice}
              index={index}
              togglePlayPause={togglePlayPause}
              isPlaying={index === playingIndex}
              gradientColor={gradientBackgrounds[index]}
            />
          ))}
        </Carousel>
      </div>
    </div>
  )
}
export default All;