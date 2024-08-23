"use client";
import { TCharacter } from "@/lib/types";
import { ArrowRight, ArrowLeft, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { ChatLine } from "../../icons/ChatLine";
import { formatNumber } from "@/lib/utils";
const SearchTopSection = ({ characterlist }: { characterlist: TCharacter[] }) => {
  const [mi, setMI] = useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleNext = () => {
    setMI(prev => (prev + 1) % characterlist.length);
  };

  const handlePrev = () => {
    setMI(prev => (prev - 1 + characterlist.length) % characterlist.length);
  };

  const getClass = (index: number) => {
    const position = (index - mi + characterlist.length) % characterlist.length;
    if (isMobile) {
      switch (position) {
        case 0: return 'item-1';
        case 1: return 'item-2';
        case 2: return 'item-3';
        default: return 'hidden';
      }
    } else {
      switch (position) {
        case 0: return 'item-0';
        case 1: return 'item-1';
        case 2: return 'item-2';
        case 3: return 'item-3';
        case 4: return 'item-4';
        default: return 'hidden';
      }
    }
  };
  const handleRefresh = () => {
    const randomIndex = Math.floor(Math.random() * characterlist.length);
    setMI(randomIndex);
  };
  return (
    <div className="flex flex-col h-[340px] bg-gradient-to-b from-[#9D7AFF33] to-[#9D7AFF00] w-full">
      <div className="flex flex-row justify-between py-6 px-6">
        <div className="flex flex-row items-center">
          <span className="text-white text-xl font-semibold ">Recommended ✨</span>
        </div>
        <div className="flex flex-row items-center bg-bg-3 rounded-full  text-[#dddddd] px-4 py-1.5 text-sm gap-1 cursor-pointer" onClick={handleRefresh}>
          <RefreshCcwIcon className="h-5 w-5" />
          Refresh
        </div>
      </div>
      <div className="w-full h-full flex flex-row items-center justify-center gap-8">
        {!isMobile && <ArrowLeft className="w-10 h-10 rounded-full border border-white/10 p-2 text-icon-3 cursor-pointer" onClick={handlePrev} />}
        <div className="carousel select-none">
          {characterlist.map((character, index) => (
            <div className={`w-[200px] h-[260px] carousel-item relative ${getClass(index)}`} key={index}>
              <Image
                key={character.id}
                src={character.image}
                alt=""
                className="w-full h-full object-cover rounded-xl"
                width={200}
                height={260}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-black/10 rounded-xl z-20 p-3 flex flex-col items-start justify-end">
                <span className="text-white  font-medium">{character.name}</span>
                <div className="inline-flex items-center justify-start gap-2 ">
                  <div className=" text-xs font-normal leading-none text-zinc-400">
                    Toffee
                  </div>
                  <div className="h-1 w-1 rounded-full bg-zinc-400"></div>
                  <div className="flex items-center justify-start gap-1">
                    <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5">
                      <ChatLine className="text-[#B1B1B1]" />
                    </div>
                    <div className=" text-xs font-normal leading-none text-zinc-400">
                      {character._count?.messages !== undefined && formatNumber(character._count.messages)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!isMobile && <ArrowRight className="w-10 h-10 rounded-full border border-white/10 p-2 text-icon-3 cursor-pointer" onClick={handleNext} />}
      </div>
    </div>
  )
}

export default SearchTopSection;