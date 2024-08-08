"use client";
import { Input } from "@/components/ui/input";
import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Character as BaseCharacterProps, Category as BaseCategory } from "@prisma/client";
import React from "react";
import Carousel from "@/components/toffee/Carousel";
import CharacterCard from "@/components/toffee/CharacterCard";
import CategoryCard from "@/components/toffee/CategoryCard";
import StartWithCard from "./Elements/StartWithCard";
import BannersSlide from "./Elements/BannersSlide";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import MobileNavPanel from "../MobileNav";
import Image from "next/image";
import { Plus, RefreshCcw } from "lucide-react";
interface Character extends BaseCharacterProps {
  _count: {
    messages: number;
  };
}
interface Category extends BaseCategory {
  characters: BaseCharacterProps[]
}

export function DiscoverPage({ characters, categories }: { characters: Character[], categories: Category[] }) {
  const { open, toggleOpen } = useSidebarContext();
  const [isMobile, setIsMobile] = useState(false);
  const checkIfMobile = () => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
    }
  };
  const handleResize = () => {
    checkIfMobile();
    if (isMobile && open) {
      toggleOpen(false);
    }
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, isMobile]);
  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar mb-20 sm:mb-0">
      <div className="flex flex-col items-center justify-start rounded-2xl bg-[#121212] min-h-full w-full overflow-auto">
        <div className="p-5 sm:p-6 w-full my-2.5 rounded-2xl">
          <BannersSlide />
        </div>
        <div className="flex w-full flex-col gap-6 pl-5 sm:pl-6">
          <Carousel title="For you" className=" text-xl font-bold">
            {characters.map((character, i) => (
              <CharacterCard character={character} key={i} />
            ))}
          </Carousel>
          <Carousel title="Categories" className=" text-xl font-bold">
            {categories.map((category, i) => (
              category.characters.length > 0 && <CategoryCard category={category} key={i} index={i} />
            ))}
          </Carousel>
          <Carousel title="Start with" className="text-xl font-bold">
            {characters.map((character, i) => (
              <StartWithCard character={character} key={i} />
            ))}
          </Carousel>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-5 sm:p-6">
          <div className="bg-bg-3 rounded-2xl sm:h-36 h-[106px] py-3 px-4 sm:px:8 sm:py-6 flex flex-row gap-2 cursor-pointer">
            <div className="flex flex-col sm:gap-4 gap-2 py-1 sm:py-2">
              <span className="text-white font-inter font-bold sm:text-xl text-sm">Create your own character</span>
              <p className="text-text-tertiary font-inter sm:text-sm text-xs">Choose friend from the list to see his clubs he list to see his clubs</p>
            </div>
            <div className="relative flex items-center justify-center w-[200px] overflow-hidden">
              <Image src={"/discover/card1.png"} width={0} height={0} sizes="100vw" className="w-full h-full object-contain absolute top-0 right-0" alt=""/>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#BC7F44] text-white flex items-center justify-center z-10 cursor-pointer">
                <Plus className="sm:w-7 sm:h-7 w-5 h-5"/>
              </div>
            </div>
          </div>
          <div className="bg-bg-3 rounded-2xl sm:h-36 h-[106px]  flex flex-row gap-2 cursor-pointer">
            <div className="flex flex-col sm:gap-4 gap-2 py-4 px-4 sm:px:8 sm:py-8">
              <span className="text-white font-inter font-bold sm:text-xl text-sm">Try random character</span>
              <p className="text-text-tertiary font-inter sm:text-sm text-xs">Choose friend from the list to see his clubs he list to see his clubs</p>
            </div>
            <div className="relative flex items-start justify-center w-[200px] overflow-hidden">
              <Image src={"/discover/card2.png"} width={0} height={0} sizes="100vw" className="w-[188px] aspect-square object-contain absolute top-5 right-0" alt=""/>
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#2F2F2F] text-[#B1B1B1] flex items-center justify-center z-10 cursor-pointer mt-3 mr-8">
                <RefreshCcw className="sm:w-6 sm:h-6 w-4 h-4"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile && <MobileNavPanel />}
    </div>
  );
}
