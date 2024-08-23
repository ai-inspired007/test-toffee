"use client";
import { Input } from "@/components/ui/input";
import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Character as BaseCharacterProps, Category as BaseCategory, Tag as BaseTag, CharacterTag as BaseCharacterTag } from "@prisma/client";
import React from "react";
import Carousel from "@/components/toffee/Carousel";
import TagCarousel from "@/components/toffee/TagCarousel";
import CharacterCard from "@/components/toffee/CharacterCard";
import CategoryCard from "@/components/toffee/CategoryCard";
import StartWithCard from "./Elements/StartWithCard";
import BannersSlide from "./Elements/BannersSlide";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import MobileNavPanel from "../MobileNav";
import Image from "next/image";
import { Plus, RefreshCcw } from "lucide-react";
import TryCard from "./Elements/TryCard";
import FeaturedCard from "./Elements/FeaturedCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import Loading from "../../ui/Loading";
import { DiscordIcon, TwitterIcon, InstagramIcon, LinkedinIcon, HomeBottomIcon  } from "../icons/HomeIcons";
interface Character extends BaseCharacterProps {
  _count: {
    messages: number;
  };
}
interface Category extends BaseCategory {
  characters: BaseCharacterProps[]
}

interface Tag extends BaseTag {
  characters: BaseCharacterTag[]
}

export function DiscoverPage({ characters, categories, tags }: { characters: Character[], categories: Category[], tags: Tag[] }) {
  const router = useRouter();
  const { open, toggleOpen } = useSidebarContext();
  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  
  const handleResize = () => {
    if (isMobile && open) {
      toggleOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, isMobile]);
  const handleTryRandomCharacter = useCallback(() => {
    if (characters.length > 0) {
      setLoading(true)
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
      router.push(`/chat/${randomCharacter.id}`);
    }
  }, [characters, router]);

  const handleTagClick = (tagId: string) => {
    if (tagId === "all") {
      setSelectedTag("all");
      setFilteredCharacters(characters);
      return;
    }
    setSelectedTag(tagId);
    const charactersByTag = tags.find(item => item.id === tagId)?.characters.map(characterTag => characterTag.characterId);
    setFilteredCharacters(characters.filter(item => charactersByTag?.includes(item.id)));
  };

  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar mb-20 sm:mb-0">
      {loading ?
        <Loading />
        :
        <div className="flex flex-col items-center justify-start rounded-2xl bg-[#121212] min-h-full w-full overflow-auto">
          <div className="flex w-full flex-col gap-10 pl-6 sm:pl-6 pb-[35px] mt-6">
            <div className="w-full pr-6 rounded-2xl">
              <BannersSlide />
            </div>
            <Carousel title="For you" className=" font-semibold text-xl">
              {characters.map((character, i) => (
                <CharacterCard character={character} key={i} />
              ))}
            </Carousel>
            <Carousel title="Try these" className=" font-semibold text-xl" row={2}>
              {characters.map((character, i) => (
                <TryCard character={character} key={i} />
              ))}
            </Carousel>
            <Carousel title="Featured" className=" font-semibold text-xl">
              {characters.map((character, i) => (
                <FeaturedCard character={character} key={i} />
              ))}
            </Carousel>
            <div className="flex flex-col gap-4">
              <Link
                href={`/search?tab=categories`}
              >
                <span className=" font-semibold text-xl text-white cursor-pointer hover:underline hover:underline-offset-4">Categories</span>
              </Link>
              <div className="flex flex-row gap-1.5 overflow-auto no-scrollbar">
                <span
                  key="all"
                  className={`rounded-lg ${selectedTag === "all" ? "bg-white text-black" : "bg-bg-2 text-text-additional"} px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}
                  onClick={() => handleTagClick("all")}
                >
                  All
                </span>
                {tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className={`rounded-lg ${selectedTag === tag.id ? "bg-white text-black" : "bg-bg-2 text-text-additional"} px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}
                    onClick={() => handleTagClick(tag.id)}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <TagCarousel>
                {filteredCharacters.map((character, i) => (
                  <CharacterCard character={character} key={i} />
                ))}
              </TagCarousel>
            </div>
            <Carousel title="Start with" className=" font-semibold text-xl">
              {characters.map((character, i) => (
                <StartWithCard character={character} key={i} />
              ))}
            </Carousel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pr-6">
              <Link href={"/create/character"} className="bg-bg-3 rounded-2xl sm:h-36 h-[106px] py-3 px-6 sm:px:8 sm:py-6 flex flex-row justify-between gap-2 cursor-pointer">
                <div className="flex flex-col sm:gap-4 gap-2 py-1 sm:py-2">
                  <span className="text-white  font-bold sm:text-xl text-sm">Create your own character</span>
                  <p className="text-text-tertiary  sm:text-sm text-xs">Choose friend from the list to see his clubs he list to see his clubs</p>
                </div>
                <div className="relative flex items-center justify-center w-[200px] overflow-hidden">
                  <Image src={"/discover/card1.png"} width={0} height={0} sizes="100vw" className="w-full h-full object-contain absolute top-0 right-0" alt="" />
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#BC7F44] text-white flex items-center justify-center z-10 cursor-pointer">
                    <Plus className="sm:w-7 sm:h-7 w-5 h-5" />
                  </div>
                </div>
              </Link>
              <div className="bg-bg-3 rounded-2xl sm:h-36 h-[106px] flex flex-row justify-between gap-2 cursor-pointer" onClick={handleTryRandomCharacter}>
                <div className="flex flex-col sm:gap-4 gap-2 py-4 sm:px:8 sm:py-8 px-6">
                  <span className="text-white  font-bold sm:text-xl text-sm">Try random character</span>
                  <p className="text-text-tertiary  sm:text-sm text-xs">Choose friend from the list to see his clubs he list to see his clubs</p>
                </div>
                <div className="relative flex items-start justify-center w-[200px] overflow-hidden">
                  <Image src={"/discover/card2.png"} width={0} height={0} sizes="100vw" className="w-[188px] aspect-square object-contain absolute top-5 right-0" alt="" />
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#2F2F2F] text-[#B1B1B1] flex items-center justify-center z-10 cursor-pointer mt-3 mr-8">
                    <RefreshCcw className="sm:w-6 sm:h-6 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col pr-6 gap-7 justify-between">
              <div className="w-full flex justify-between h-7">
                <div className="flex gap-2 items-center">
                  <HomeBottomIcon />
                  <span className="font-hellix font-semibold text-xl leading-6 text-[#DEDFE4]">toffee</span>
                </div>
                <div className="flex gap-6 text-icon-3">
                  <LinkedinIcon className="w-full h-full cursor-pointer" />
                  <TwitterIcon className="w-full h-full cursor-pointer" />
                  <DiscordIcon className="w-full h-full cursor-pointer" />
                  <InstagramIcon className="w-full h-full cursor-pointer" />
                </div>
              </div>
              <div className="w-full flex justify-between h-5">
                <span className=" font-normal text-sm text-[#7F7F7F]">© 2024 Meeko. All right reserved</span>
                <div className="flex gap-8">
                  <span className=" font-normal text-sm text-[#7F7F7F]">Terms of Service</span>
                  <span className=" font-normal text-sm text-[#7F7F7F]">Privacy Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isMobile && <MobileNavPanel />}
    </div>
  );
}
