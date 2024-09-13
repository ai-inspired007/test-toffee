import Image from "next/image";
import { Character } from '@prisma/client';
import { ArrowRight } from "lucide-react";

type VoiceCharacterCardProps = {
  characters: Partial<Character & { _count: { messages: number } }>[],
};

export function VoiceCharacterCard({ characters }: VoiceCharacterCardProps) {
  return (

    <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar w-full h-full">
      {characters.map((character, index) => {
        return (
          <div
            key={index}
            className="flex cursor-pointer items-center justify-between gap-2 rounded-2xl p-2 bg-[#202020BF] opacity-75 border border-white/10 flex-space px-[18px] py-4 transition-all duration-300 hover:bg-[#2F2F2F]"
          >
            <div className="flex">
              <div className="overflow-hidden rounded-full mr-4">
                <Image
                  src={character.image || "/default.png"}
                  alt={`An image of ${character.name}`}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="line-clamp-1 font-medium text-text-additional">
                  {character.name}
                </span>
                <p className="line-clamp-1 text-xs font-normal text-text-tertiary mt-1">
                  {character.description}
                </p>
              </div>
            </div>
            <div className="overflow-hidden text-text-tertiary mx-[10px]">
              <ArrowRight />
            </div>
          </div>
        );
      })}
    </div>
  );
}
