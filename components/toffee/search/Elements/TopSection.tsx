"use client";
import { TCharacter } from "@/lib/types";
import { ArrowRight, ArrowLeft, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
const SearchTopSection = ({characterlist}:{characterlist: TCharacter[]}) => {
  const [mi, setMI] = useState(0);
  const handleNext = () => {
    setMI(prev => (prev + 1) % characterlist.length);
  };

  const handlePrev = () => {
    setMI(prev => (prev - 1 + characterlist.length) % characterlist.length);
  };

  const getClass = (index: number) => {
    const position = (index - mi + characterlist.length) % characterlist.length;
    switch (position) {
      case 0: return 'item-0';
      case 1: return 'item-1';
      case 2: return 'item-2';
      case 3: return 'item-3';
      case 4: return 'item-4';
      default: return 'hidden';
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
          <span className="text-white text-xl font-semibold font-inter">Recommended ✨</span>
        </div>
        <div className="flex flex-row items-center bg-bg-3 rounded-full font-inter text-[#dddddd] px-4 py-1.5 text-sm gap-1 cursor-pointer" onClick={handleRefresh}>
          <RefreshCcwIcon className="h-5 w-5" />
          Refresh
        </div>
      </div>
      <div className="w-full h-full flex flex-row items-center justify-center gap-8">
        <ArrowLeft className="w-10 h-10 rounded-full border border-white/10 p-2 text-icon-3 cursor-pointer" onClick={handlePrev} />
        <div className="carousel select-none">
          {characterlist.map((character, index) => (
            <Image
              key={character.id}
              src={character.image}
              alt=""
              className={`w-[200px] h-[260px] object-cover carousel-item ${getClass(index)}`}
              width={200}
              height={260}
            />
          ))}
        </div>
        <ArrowRight className="w-10 h-10 rounded-full border border-white/10 p-2 text-icon-3 cursor-pointer" onClick={handleNext} />
      </div>
    </div>
  )
}

export default SearchTopSection;