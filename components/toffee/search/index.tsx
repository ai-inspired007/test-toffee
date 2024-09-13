"use client";
import { useState, useEffect } from "react";
import { Tag, UserSettings, Voice } from "@prisma/client";
import Image from "next/image";
import TagCarousel from "@/components/toffee/CarouselWithTag";
import Carousel from "../../ui/Carousel";
import CharacterCard from "@/components/toffee/CharacterCard";
import CategoryCard2 from "./Elements/CategoryCard2";
import CandyCard from "../CandyCard";
import TopCard from "./Elements/TopCard";
import {
  TCategory,
  TKnowledgePack,
  TCharacter,
  TVoice,
  User,
  TopOne,
} from "@/lib/types";
import { SearchBox, AutocompleteItem } from "../SearchBox";
import SearchTopSection from "./Elements/TopSection";
import stringComparison from "string-comparison";
import MobileNavPanel from "../MobileNav";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import { useMediaQuery } from "react-responsive";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftLineIcon } from "../icons/ArrowLeftLineIcon";
import { ArrowRightLineIcon } from "../icons/ArrowRightLineIcon";
import VoiceCard from "../VoiceCard";
import VoiceCardDetailPopUp from "../VoiceCardDetailPopUp";
import Modal from "@/components/ui/Modal";

interface PageProps {
  characterlist: TCharacter[];
  userlist: User[];
  knowledges: TKnowledgePack[];
  categories: TCategory[];
  voicelist: TVoice[];
  tags: Tag[];
}

export function SearchPage({
  characterlist,
  userlist,
  knowledges,
  categories,
  tags,
  voicelist
}: PageProps) {
  const tabs = ["Trending", "Categories"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab =
    searchParams.get("tab")?.toLocaleLowerCase() || tabs[0].toLocaleLowerCase();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [filteredCharacters, setFilteredCharacters] =
    useState<TCharacter[]>(characterlist);
  const [filteredKnowledges, setFilteredKnowledges] =
    useState<TKnowledgePack[]>(knowledges);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(userlist);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(tags);
  const [filteredVoice, setFilteredVoice] = useState<TVoice[]>(voicelist);
  const [topone, setTopOne] = useState<TopOne | null>(null);
  const [query, setQuery] = useState<string>("");
  const [autocompleteItems, setAutocompleteItems] = useState<
    AutocompleteItem[]
  >([]);
  let levenshtein = stringComparison.levenshtein;

  const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
    return [...Array(length)].map((_, index) => {
      const color = colors[index % 12];
      return `linear-gradient(to right, ${color}4D 0%, ${color}00 35.07%)`;
    });
  }

  const colors = ['#F7604C', '#BCB8C5', '#CDF74C', '#6E3FF3', '#4CF788', '#F7A84C', '#E73FF3', '#EDACE2', '#F7E34C', '#F74C5D', '#3F7BF3', '#B64D8C'];
  const [gradientBackgrounds, setGradientBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    if (filteredVoice.length > 0 && gradientBackgrounds.length === 0) {
      setGradientBackgrounds(generateGradientBackgrounds(colors, filteredVoice.length));
    }
  }, [colors, filteredVoice.length, gradientBackgrounds.length]);

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

  const findTopOne = (allItems: AutocompleteItem[], query: string): TopOne | null => {
    if (query.trim() === "") return null;
    const sortedItems = levenshtein
      .sortMatch(
        query,
        allItems.map((item) => item.name),
      )
      .sort((a, b) => b.rating - a.rating);
    if (sortedItems.length === 0) return null;

    const topMatch = sortedItems[0];
    const matchedItem = allItems.find((item) => item.name === topMatch.member);

    if (matchedItem) {
      let itemData = null;
      switch (matchedItem.type) {
        case "Character":
          itemData =
            characterlist.find(
              (character) => character.id === matchedItem.id,
            ) || null;
          break;
        case "KnowledgePack":
          itemData =
            knowledges.find((knowledge) => knowledge.id === matchedItem.id) ||
            null;
          break;
        case "Tag":
          itemData = tags.find((tag) => tag.id === matchedItem.id) || null;
          break;
        case 'Voice':
          itemData = voicelist.find(voice => voice.id === matchedItem.id) || null;
          break;
        default:
          break;
      }
      if (itemData) {
        if (matchedItem.type === "Character") {
          return {
            type: matchedItem.type,
            data: itemData,
            character: itemData as TCharacter,
          };
        }
        if (matchedItem.type === "KnowledgePack") {
          return {
            type: matchedItem.type,
            data: itemData,
            candy: itemData as TKnowledgePack,
          };
        }
        if (matchedItem.type === "Tag") {
          return {
            type: matchedItem.type,
            data: itemData,
            tag: itemData as Tag,
          };
        }
        if (matchedItem.type === "Voice") {
          return { type: matchedItem.type, data: itemData, voice: itemData as TVoice };
        }
      } else {
        return null;
      }
    }
    return null;
  };
  useEffect(() => {
    let filteredChars = characterlist;
    let filteredKnows = knowledges;
    let filteredUsersList = userlist;
    let filteredTagsList = tags;
    let filteredVoice = voicelist;

    if (query) {
      const queryLower = query.toLowerCase();

      filteredChars = characterlist.filter(
        (character) =>
          character.name.toLowerCase().includes(queryLower) ||
          (character.category &&
            character.category.name.toLowerCase().includes(queryLower)) ||
          character.tags.some((tag) =>
            tag.name.toLowerCase().includes(queryLower),
          ),
      );
      filteredKnows = knowledges.filter(
        (knowledge) =>
          knowledge.name.toLowerCase().includes(queryLower) ||
          knowledge.tags.some((tag) =>
            tag.name.toLowerCase().includes(queryLower),
          ),
      );

      filteredUsersList = userlist.filter((user) =>
        (user.name || "").toLowerCase().includes(queryLower),
      );

      filteredTagsList = tags.filter((tag) =>
        tag.name.toLowerCase().includes(queryLower),
      );

      filteredVoice = voicelist.filter((voice) => voice.name.toLowerCase().includes(queryLower));
    }

    const mergedAutocompleteItems: AutocompleteItem[] = [
      ...filteredChars.map(item => ({ id: item.id, name: item.name, type: 'Character' })),
      ...filteredKnows.map(item => ({ id: item.id, name: item.name, type: 'KnowledgePack' })),
      ...filteredUsersList.map(item => ({ id: item.userId, name: item.name || "", type: 'User' })),
      ...filteredTagsList.map(item => ({ id: item.id, name: item.name, type: 'Tag' })),
      ...filteredVoice.map(item => ({ id: item.id, name: item.name, type: 'Voice' })),
    ];

    const topMatch = findTopOne(mergedAutocompleteItems, query);
    setAutocompleteItems(mergedAutocompleteItems);
    setFilteredCharacters(
      topMatch && topMatch.type === "Character"
        ? filteredChars.filter((character) => character.id !== topMatch.data.id)
        : filteredChars,
    );
    setFilteredKnowledges(
      topMatch && topMatch.type === "KnowledgePack"
        ? filteredKnows.filter((knowledge) => knowledge.id !== topMatch.data.id)
        : filteredKnows,
    );
    setFilteredUsers(filteredUsersList);
    setFilteredTags(filteredTagsList);
    setTopOne(topMatch);
    setFilteredVoice(filteredVoice);

  }, [query, characterlist, knowledges, userlist, tags, selectedTab, voicelist]);

  const { open, toggleOpen } = useSidebarContext();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const handleResize = () => {
    if (isMobile && open) {
      toggleOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, isMobile]);

  const handleTabClick = (name: string) => {
    setSelectedTab(name.toLowerCase());
  };
  return (
    <div className="mb-20 h-screen w-full overflow-hidden p-0 sm:mb-0 sm:p-2">
      <div className="flex h-full w-full flex-col items-center justify-start bg-toffee-bg-2 sm:rounded-2xl">
        <div
          className={` ${query.length > 0 ? "" : "border-b border-transparent focus-within:border-toffee-stroke-accent"} flex w-full items-center gap-x-6  py-[18px] pl-5 transition duration-200 sm:py-5 sm:pl-6`}
        >
          <div className="hidden items-center gap-x-4 text-white sm:flex">
            <button
              type="button"
              className="transition duration-200 hover:text-toffee-text-tertiary focus-visible:outline-none"
            >
              <ArrowLeftLineIcon />
            </button>
            <button
              type="button"
              className="transition duration-200 hover:text-toffee-text-tertiary focus-visible:outline-none"
            >
              <ArrowRightLineIcon />
            </button>
            <span className="block h-6 w-px bg-white/[0.06]"></span>
          </div>
          <SearchBox
            query={query}
            setQuery={setQuery}
            autocompleteItems={autocompleteItems}
            except={topone?.data.name}
          />
        </div>
        <span
          className={`${query.length > 0 ? "block h-px w-full border-b border-toffee-stroke-accent" : "hidden"}`}
        ></span>
        {query.length === 0 && (
          <div className="no-scrollbar mb-1 h-full w-full overflow-auto">
            <SearchTopSection characterlist={characterlist} />
            <div className="mt-5 flex w-full items-start justify-start space-x-1.5 px-5 sm:px-6">
              {tabs.map((name) => (
                <div
                  key={name}
                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 ${selectedTab.toLocaleLowerCase() === name.toLocaleLowerCase() ? "bg-white text-black" : "bg-neutral-800 text-zinc-400"}`}
                  onClick={() => handleTabClick(name)}
                >
                  <div className="text-sm font-medium leading-none ">
                    {name}
                  </div>
                </div>
              ))}
            </div>
            {selectedTab === "trending" && (
              <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-5 pt-4 sm:p-6">
                {characterlist.length > 0 && (
                  <div className="flex w-full flex-col gap-3 overflow-hidden">
                    {tags.length > 0 ? (
                      tags.map((tag, index) => {
                        const matchedList = characterlist.filter((item) =>
                          item.tags.some(
                            (characterTag) => characterTag.id === tag.id,
                          ),
                        );
                        let totChats = 0;
                        matchedList.map(
                          (item) => totChats + item._count.messages,
                        );
                        return matchedList.length > 0 ? (
                          <TagCarousel
                            isMobile={isMobile}
                            key={index}
                            totChats={totChats}
                            title={`#${tag.name}`}
                            className="text-[20px]  font-semibold text-white hover:underline"
                            link={`/categories/${tag.categoryId}/tag/${tag.id}`}
                          >
                            {matchedList.map((character, i) => (
                              <CharacterCard character={character} key={i} />
                            ))}
                          </TagCarousel>
                        ) : null;
                      })
                    ) : (
                      <div className="overflow-hidden">
                        <Carousel
                          title="Characters"
                          className="text-[16px]  font-semibold text-white sm:text-[20px]"
                        >
                          {characterlist.map((character, i) => (
                            <CharacterCard character={character} key={i} />
                          ))}
                        </Carousel>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {selectedTab === "categories" && (
              <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-5 pt-4 sm:p-6">
                {filteredCharacters.length > 0 && (
                  <div className="flex w-full flex-row flex-wrap gap-3 overflow-hidden">
                    {categories.map((category, index) => (
                      <CategoryCard2
                        category={category}
                        index={index}
                        key={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {query.length > 0 && (
          <div className="no-scrollbar mb-8 flex h-full w-full flex-col gap-6 overflow-y-auto p-5 sm:p-6">
            <div className="h-full">
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <div className="w-full max-w-[415px]">
                  {topone && <TopCard result={topone} />}
                </div>
                {filteredKnowledges.length > 0 && (
                  <div className="overflow-hidden">
                    {!isMobile ? (
                      <Carousel
                        title="Candies"
                        className="mb-2 text-sm leading-4.5 text-toffee-text-tertiary"
                      >
                        {filteredKnowledges.map((knowledge, index) => (
                          <CandyCard candy={knowledge} key={index} />
                        ))}
                      </Carousel>
                    ) : (
                      <div className="flex w-full flex-col">
                        {filteredKnowledges.map((knowledge, index) => (
                          <CandyCard candy={knowledge} key={index} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {filteredCharacters.length > 0 && (
                <div className="w-full overflow-hidden">
                  <Carousel
                    title="Characters"
                    className="my-2 mt-5 text-sm font-light text-[#777777]"
                  >
                    {filteredCharacters.map((character, i) => (
                      <CharacterCard character={character} key={i} />
                    ))}
                  </Carousel>
                </div>
              )}
              {filteredVoice.length > 0 && (
                <div className="w-full overflow-hidden">
                  <Carousel title="Voices" className="my-2 mt-5 text-[#777777] text-sm font-light">
                    {filteredVoice.map((voice, index) => (
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
                  <Modal onClose={handleCloseDetails} isOpen={selectedVoice !== null}>
                    {selectedVoice && gradientOriginColor && (
                      <VoiceCardDetailPopUp
                        voice={selectedVoice}
                        originColor={gradientOriginColor}
                        onClose={handleCloseDetails}
                        characters={characterlist}
                      />
                    )}
                  </Modal>
                </div>
              )}
              {filteredUsers.length > 0 && (
                <div className="">
                  <div className="my-2 mt-5 text-sm font-light text-[#777777]">
                    Users
                  </div>
                  <div className="grid w-full grid-cols-2 flex-row flex-wrap gap-2 sm:flex">
                    {filteredUsers.map((user, i) => (
                      <div
                        key={i}
                        className="flex min-w-[152px] flex-col items-center justify-start gap-3 rounded-2xl bg-neutral-800 p-4 pt-5"
                      >
                        <Image
                          alt="User Profile Picture"
                          className="h-[72px] w-[72px] items-center rounded-full object-cover"
                          src={
                            user.profile_image || "/profile/default_user.png"
                          }
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                        <div className="flex flex-col gap-2">
                          <div className=" text-[14px] font-medium leading-normal text-white">
                            {user.name}
                          </div>
                          <div className=" text-xs font-normal text-neutral-500">
                            {user.characterCount} Characters
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!topone &&
                filteredKnowledges.length === 0 &&
                filteredCharacters.length === 0 &&
                filteredUsers.length === 0 && (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Image
                      src={"/search/empty.svg"}
                      alt=""
                      sizes="100vw"
                      width={0}
                      height={0}
                      className="w-32 object-contain"
                    />
                    <span className="mt-8 text-base font-medium leading-5 text-toffee-text-sub">
                      {"Oops! No results found"}
                    </span>
                    <p className="mt-2 text-sm leading-4.5 text-toffee-text-tertiary">
                      {"Please check your search terms."}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      {isMobile && <MobileNavPanel />}
    </div>
  );
}
