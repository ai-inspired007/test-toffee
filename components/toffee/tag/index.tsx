"use client";
import { Input } from "@/components/ui/input";
import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Character as BaseCharacterProps, Category as BaseCategory, Tag } from "@prisma/client";
import React from "react";
import CharacterCard from "@/components/toffee/CharacterCard";
import Image from "next/image";
import { SortDescIcon } from "../icons/SortDescIcon";
import { formatNumber } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import MobileNavPanel from "../MobileNav";
interface Character extends BaseCharacterProps {
  _count: {
    messages: number;
  };
}
export function TagPage({ tag, characters, chats }: { tag: Tag | null, characters: Character[], chats: number }) {
  const [query, setQuery] = useState<string | null>(null);
  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar mb-20 sm:mb-0">
      <div className="flex flex-col items-center justify-start rounded-2xl bg-[#121212] min-h-full w-full overflow-auto">
        <div className="w-full rounded-t-2xl h-[228px] flex flex-row items-end px-6 gap-8 justify-end relative pb-6">
          <div className="flex flex-col gap-0.5 z-20">
            <h1 className="text-white  text-[40px] font-[550]"># {tag?.name}</h1>
            <div className="flex flex-row text-text-additional  text-sm items-center gap-3 tracking-wide font-light">
              <span>{characters.length} Characters</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                <circle cx="2" cy="2" r="2" fill="#B1B1B1" />
              </svg>
              <span>{formatNumber(chats)} Chats</span>
            </div>
          </div>
          <div className="flex flex-row gap-3 items-center z-20 justify-end mt-auto ml-auto">
            <span className=" text-sm font-medium text-white">Popularity</span>
            <SortDescIcon className="w-6 h-6 text-[#B1B1B1]" />
          </div>
          <div className="bg-black/70 w-full h-full absolute z-10 top-0 left-0" />
          <Image src={"/candies/candy1.png"} alt="Candy" className="w-full h-full absolute object-cover top-0 left-0" height={0} width={0} sizes="100vw" />
        </div>
        <div className="w-full h-[96px] bg-gradient-to-b from-[#3FA6F333]  to-[#3FA6F300]">
          <label className="sticky top-0 z-50 w-full rounded-t-lg bg-opacity-60 py-3 text-gray-400 backdrop-blur-lg backdrop-filter focus-within:text-gray-600 flex items-center border-b border-white/10 ">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4279 16.1553L21.2826 20.0091L20.0091 21.2826L16.1553 17.4279C14.7214 18.5774 12.9378 19.2026 11.1 19.2C6.6288 19.2 3 15.5712 3 11.1C3 6.6288 6.6288 3 11.1 3C15.5712 3 19.2 6.6288 19.2 11.1C19.2026 12.9378 18.5774 14.7214 17.4279 16.1553ZM15.6225 15.4875C16.7647 14.3129 17.4026 12.7384 17.4 11.1C17.4 7.6188 14.5803 4.8 11.1 4.8C7.6188 4.8 4.8 7.6188 4.8 11.1C4.8 14.5803 7.6188 17.4 11.1 17.4C12.7384 17.4026 14.3129 16.7647 15.4875 15.6225L15.6225 15.4875Z"
                fill="#B1B1B1"
              />
            </svg>
            <input
              placeholder="What are you looking for?"
              type="text"
              spellCheck="false"
              className="relative h-9 bg-transparent text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 block w-full appearance-none rounded-none pl-14  text-white z-10"
            />
          </label>
        </div>
        <div className="flex w-full flex-row sm:gap-6 gap-4 sm:p-6 p-4 flex-wrap">
          {characters.map((character, i) => (
            <CharacterCard character={character} key={i} />
          ))}
        </div>
      </div>
      {isMobile && <MobileNavPanel />}
    </div>
  );
}