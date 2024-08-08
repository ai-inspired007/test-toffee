import { Character } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChatLine } from "./icons/ChatLine";
import { formatNumber } from "@/lib/utils";
const CharacterCard = ({
  character,
  link
}: {
  character: Partial<Character & { _count: { messages: number } }>;
  link?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      className="select-none relative flex min-h-[240px] h-[240px] min-w-[163px] w-[163px] sm:min-w-[172px] sm:w-[172px] items-center justify-center rounded-2xl bg-center cursor-pointer font-inter"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href={link ? link : `/chat/${character.id}`}
    >
      <Image
        src={character.image || "/default.png"}
        alt="character_img"
        width={0}
        height={0}
        sizes="100vw"
        className="absolute h-full w-full rounded-2xl object-cover"
      />
      <div className="left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-b from-transparent via-black/60 to-black">
        <div className="flex h-full flex-col justify-end space-y-1 px-4 pb-4">
          <div className="self-stretch font-inter font-medium text-white truncate">
            {character.name}
          </div>
          <div className="inline-flex items-center justify-start gap-2 ">
            <div className="font-inter text-xs font-normal leading-none text-zinc-400">
              Toffee
            </div>
            <div className="h-1 w-1 rounded-full bg-zinc-400"></div>
            <div className="flex items-center justify-start gap-1">
              <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5">
                <ChatLine className="text-[#B1B1B1]" />
              </div>
              <div className="font-inter text-xs font-normal leading-none text-zinc-400">
                {character._count?.messages !== undefined && formatNumber(character._count.messages)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isHovered && (
        <div className="absolute z-30 w-full h-full rounded-2xl bg-bg-3 overflow-hidden">
          <div className="bg-gradient-to-b from-[#F7604C4D] to-transparent via-transparent via-30% w-full h-full p-3 flex flex-col justify-between">
            <div>
              <Image
                src={character.image || "/default.png"}
                alt="character_img"
                width={0}
                height={0}
                sizes="100vw"
                className="h-12 w-12 rounded-full object-cover border border-black"
              />
              <div className="font-inter text-xs text-text-additional mt-4">
                {character?.description && character.description.length > 160
                  ? `${character.description.slice(0, 160)}...`
                  : character.description}
              </div>
            </div>
            <div className="font-inter text-xs text-text-additional mt-auto">
              {"Ask question..."}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default CharacterCard;