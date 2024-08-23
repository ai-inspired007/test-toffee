"use client";
import { useState, useEffect } from "react";
import { Tag, UserSettings } from "@prisma/client";
import Image from "next/image";
import TagCarousel from "@/components/toffee/CarouselWithTag";
import Carousel from "../../ui/Carousel";
import CharacterCard from "@/components/toffee/CharacterCard";
import CategoryCard2 from "./Elements/CategoryCard2";
import CandyCard from "../CandyCard";
import TopCard from "./Elements/TopCard";
import { TCategory, TKnowledgePack, TCharacter, User, TopOne } from "@/lib/types";
import { SearchBox, AutocompleteItem } from "../SearchBox";
import SearchTopSection from "./Elements/TopSection";
import stringComparison from "string-comparison";
import MobileNavPanel from "../MobileNav";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import { useMediaQuery } from "react-responsive";
import { useSearchParams, useRouter } from 'next/navigation';
interface PageProps {
  characterlist: TCharacter[];
  userlist: User[];
  knowledges: TKnowledgePack[];
  categories: TCategory[];
  tags: Tag[];
}

export function SearchPage({ characterlist, userlist, knowledges, categories, tags }: PageProps) {
  const tabs = ["Trending", "Categories"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab')?.toLocaleLowerCase() || tabs[0].toLocaleLowerCase();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [filteredCharacters, setFilteredCharacters] = useState<TCharacter[]>(characterlist);
  const [filteredKnowledges, setFilteredKnowledges] = useState<TKnowledgePack[]>(knowledges);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(userlist);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(tags);
  const [topone, setTopOne] = useState<TopOne | null>(null);
  const [query, setQuery] = useState<string>("");
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  let levenshtein = stringComparison.levenshtein;
  const findTopOne = (allItems: AutocompleteItem[], query: string): TopOne | null => {
    if (query.trim() === "") return null;
    const sortedItems = levenshtein.sortMatch(query, allItems.map(item => item.name)).sort((a, b) => b.rating - a.rating);
    if (sortedItems.length === 0) return null;

    const topMatch = sortedItems[0];
    const matchedItem = allItems.find(item => item.name === topMatch.member);

    if (matchedItem) {
      let itemData = null;
      switch (matchedItem.type) {
        case 'Character':
          itemData = characterlist.find(character => character.id === matchedItem.id) || null;
          break;
        case 'KnowledgePack':
          itemData = knowledges.find(knowledge => knowledge.id === matchedItem.id) || null;
          break;
        case 'Tag':
          itemData = tags.find(tag => tag.id === matchedItem.id) || null;
          break;
        default:
          break;
      }
      if (itemData) {
        if (matchedItem.type === "Character") {
          return { type: matchedItem.type, data: itemData, character: itemData as TCharacter };
        }
        if (matchedItem.type === "KnowledgePack") {
          return { type: matchedItem.type, data: itemData, candy: itemData as TKnowledgePack };
        }
        if (matchedItem.type === "Tag") {
          return { type: matchedItem.type, data: itemData, tag: itemData as Tag };
        }
      } else {
        return null
      }
    }
    return null;
  };
  useEffect(() => {
    let filteredChars = characterlist;
    let filteredKnows = knowledges;
    let filteredUsersList = userlist;
    let filteredTagsList = tags;

    if (query) {
      const queryLower = query.toLowerCase();

      filteredChars = characterlist.filter((character) =>
        character.name.toLowerCase().includes(queryLower) ||
        (character.category && character.category.name.toLowerCase().includes(queryLower)) ||
        character.tags.some(tag => tag.name.toLowerCase().includes(queryLower))
      );
      filteredKnows = knowledges.filter((knowledge) =>
        knowledge.name.toLowerCase().includes(queryLower) ||
        knowledge.tags.some(tag => tag.name.toLowerCase().includes(queryLower))
      );

      filteredUsersList = userlist.filter((user) =>
        (user.name || "").toLowerCase().includes(queryLower)
      );

      filteredTagsList = tags.filter((tag) =>
        tag.name.toLowerCase().includes(queryLower)
      );
    }

    const mergedAutocompleteItems: AutocompleteItem[] = [
      ...filteredChars.map(item => ({ id: item.id, name: item.name, type: 'Character' })),
      ...filteredKnows.map(item => ({ id: item.id, name: item.name, type: 'KnowledgePack' })),
      ...filteredUsersList.map(item => ({ id: item.userId, name: item.name || "", type: 'User' })),
      ...filteredTagsList.map(item => ({ id: item.id, name: item.name, type: 'Tag' })),
    ];

    const topMatch = findTopOne(mergedAutocompleteItems, query);
    setAutocompleteItems(mergedAutocompleteItems);
    setFilteredCharacters(topMatch && topMatch.type === "Character" ? filteredChars.filter(character => character.id !== topMatch.data.id) : filteredChars);
    setFilteredKnowledges(topMatch && topMatch.type === "KnowledgePack" ? filteredKnows.filter(knowledge => knowledge.id !== topMatch.data.id) : filteredKnows);
    setFilteredUsers(filteredUsersList);
    setFilteredTags(filteredTagsList);
    setTopOne(topMatch);

  }, [query, characterlist, knowledges, userlist, tags, selectedTab]);

  const { open, toggleOpen } = useSidebarContext();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleResize = () => {
    if (isMobile && open) {
      toggleOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, isMobile]);

  const handleTabClick = (name: string) => {
    setSelectedTab(name.toLowerCase());
  };
  return (
    <div className="h-screen w-full overflow-hidden p-0 sm:p-2 mb-20 sm:mb-0">
      <div className="flex h-full w-full flex-col items-center justify-start rounded-2xl bg-[#121212]">
        <SearchBox query={query} setQuery={setQuery} autocompleteItems={autocompleteItems} except={topone?.data.name} />
        {query.length === 0 && (
          <div className="w-full h-full overflow-auto no-scrollbar mb-1">
            <SearchTopSection characterlist={characterlist} />
            <div className="mt-5 flex w-full items-start justify-start space-x-1.5 px-5 sm:px-6">
              {tabs.map((name) => (
                <div
                  key={name}
                  className={`inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 ${selectedTab.toLocaleLowerCase() === name.toLocaleLowerCase() ? "bg-white text-black" : "bg-neutral-800 text-zinc-400"}`}
                  onClick={()=>handleTabClick(name)}
                >
                  <div className=" text-sm font-medium leading-none ">{name}</div>
                </div>
              ))}
            </div>
            {selectedTab === "trending" && (
              <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-5 sm:p-6 pt-4">
                {characterlist.length > 0 && (
                  <div className="w-full overflow-hidden flex flex-col gap-3">
                    {tags.length > 0 ? tags.map((tag, index) => {
                      const matchedList = characterlist.filter((item) => item.tags.some(characterTag => characterTag.id === tag.id));
                      let totChats = 0;
                      matchedList.map((item) => totChats + item._count.messages);
                      return (
                        matchedList.length > 0 ?
                          <TagCarousel isMobile={isMobile} key={index} totChats={totChats} title={`#${tag.name}`} className="text-white  text-[20px] font-semibold hover:underline" link={`/categories/${tag.categoryId}/tag/${tag.id}`}>
                            {matchedList.map((character, i) => (
                              <CharacterCard character={character} key={i} />
                            ))}
                          </TagCarousel> : null
                      )
                    }) :
                      <div className="overflow-hidden">
                        <Carousel title="Characters" className="text-white  text-[16px] sm:text-[20px] font-semibold">
                          {characterlist.map((character, i) => (
                            <CharacterCard character={character} key={i} />
                          ))}
                        </Carousel>
                      </div>
                    }
                  </div>
                )}
              </div>
            )}
            {selectedTab === "categories" && (
              <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-5 sm:p-6 pt-4">
                {filteredCharacters.length > 0 && (
                  <div className="w-full flex flex-row flex-wrap gap-3 overflow-hidden">
                    {categories.map((category, index) => (
                      <CategoryCard2 category={category} index={index} key={index} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {query.length > 0 && (
          <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-5 sm:p-6 pt-4 mb-8">
            <div className="h-full">
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <div className="max-w-[415px] w-full my-3">
                  {topone && <TopCard result={topone} />}
                </div>
                {filteredKnowledges.length > 0 && (
                  <div className="overflow-hidden">
                    {!isMobile ? <Carousel title="Candies" className="my-2 mt-5 text-[#777777] text-sm font-light">
                      {filteredKnowledges.map((knowledge, index) => (
                        <CandyCard candy={knowledge} key={index} />
                      ))}
                    </Carousel> :
                      <div className="flex flex-col w-full">
                        {filteredKnowledges.map((knowledge, index) => (
                          <CandyCard candy={knowledge} key={index} />
                        ))}
                      </div>
                    }
                  </div>
                )}
              </div>
              {filteredCharacters.length > 0 && (
                <div className="w-full overflow-hidden">
                  <Carousel title="Characters" className="my-2 mt-5 text-[#777777] text-sm font-light">
                    {filteredCharacters.map((character, i) => (
                      <CharacterCard character={character} key={i} />
                    ))}
                  </Carousel>
                </div>
              )}
              {filteredUsers.length > 0 && (<div className="">
                <div className="my-2 mt-5 text-[#777777] text-sm font-light">Users</div>
                <div className="w-full sm:flex flex-row flex-wrap grid grid-cols-2 gap-2">
                  {filteredUsers.map((user, i) => (
                    <div
                      key={i}
                      className="flex flex-col min-w-[152px] items-center justify-start gap-3 rounded-2xl bg-neutral-800 p-4 pt-5"
                    >
                      <Image
                        alt="User Profile Picture"
                        className="h-[72px] w-[72px] items-center rounded-full object-cover"
                        src={user.profile_image || "/profile/default_user.png"}
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
              </div>)}
              {!topone && filteredKnowledges.length === 0 && filteredCharacters.length === 0 && filteredUsers.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Image src={"/search/empty.svg"} alt="" sizes="100vw" width={0} height={0} className="w-32 object-contain" />
                  <span className="text-text-sub  font-medium mt-8">{"Oops! No results found"}</span>
                  <p className="text-text-tertiary text-sm  mt-2">{"Please check your search terms."}</p>
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