"use client";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Character as BaseCharacterProps, Category as BaseCategory, Tag } from "@prisma/client";
import CharacterCard from "@/components/toffee/CharacterCard";
import TagCarousel from "../CarouselWithTag";
import Image from "next/image";

interface Character extends BaseCharacterProps {
  _count: {
    messages: number;
  };
  tags: Tag[];
}

interface Category extends BaseCategory {
  characters: Character[];
  tags: Tag[];
}

export function CategoryPage({ data }: { data: Category | null }) {
  const [characters, setCharacters] = useState<Character[]>(data?.characters || []);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>(data?.characters || []);
  const [loading, setLoading] = useState(!data); // If data is given, set loading to false
  const [query, setQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["all"]);

  useEffect(() => {
    if (data) {
      // set initial characters and tags if data is available
      setCharacters(data.characters);
      setFilteredCharacters(data.characters);
      setLoading(false);
    }
  }, [data]);

  const tags = data?.tags || []; // Define tags from data

  const handleTagClick = (tagId: string) => {
    if (tagId === "all") {
      setSelectedTags(["all"]);
      setFilteredCharacters(characters);
      return;
    }

    setSelectedTags(prevTags =>
      prevTags.includes(tagId)
        ? prevTags.filter(id => id !== tagId)
        : [...prevTags.filter(id => id !== "all"), tagId]
    );
  };

  useEffect(() => {
    if (selectedTags.includes("all")) {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(char =>
        char.tags.some(tag => selectedTags.includes(tag.id))
      );
      setFilteredCharacters(filtered);
    }
  }, [selectedTags, characters]);

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query === "") {
      setFilteredCharacters(characters);
    } else {
      // Filter characters based on the query
      const filtered = characters.filter(char =>
        char.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [query, characters]);

  const groupedByTags = tags.reduce((acc, tag) => {
    acc[tag.id] = { ...tag, characters: [] };
    return acc;
  }, {} as Record<string, { id: string; name: string; characters: Character[] }>);

  filteredCharacters.forEach((char) => {
    char.tags.forEach((tag) => {
      if (groupedByTags[tag.id]) {
        groupedByTags[tag.id].characters.push(char);
      }
    });
  });
  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center justify-start rounded-2xl bg-[#121212] min-h-full w-full overflow-auto">
        <div className="w-full rounded-t-2xl h-[228px] bg-gradient-to-b from-[#6E3FF3] to-[#6E3FF380] flex flex-row items-center px-6 gap-8 relative">
          <div className="flex flex-row items-center z-10">
            <Image src={"/characters/yor.png"} width={0} height={0} sizes="100vw" alt="Yor" className="w-[113px] aspect-square rounded-2xl object-cover -mr-[60px]" />
            <Image src={"/characters/zero.png"} width={0} height={0} sizes="100vw" alt="Zero" className="w-[148px] aspect-square rounded-2xl object-cover z-10" />
            <Image src={"/characters/rias.png"} width={0} height={0} sizes="100vw" alt="Rias" className="w-[113px] aspect-square rounded-2xl object-cover -ml-[60px]" />
          </div>
          <div className="flex flex-col gap-0.5 z-10">
            <h1 className="text-white font-inter text-[40px] font-[550]">{data?.name}</h1>
            <div className="flex flex-row text-text-additional font-light font-inter text-sm items-center gap-3">
              <span>{data?.characters.length} Characters</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                <circle cx="2" cy="2" r="2" fill="#B1B1B1" />
              </svg>
              <span>{data?.characters.reduce((acc, char) => acc + char._count.messages, 0)} Chats</span>
            </div>
          </div>
          <div className="absolute w-full h-full pt-5 top-0 left-0">
            <div className="bg-chat-white w-full h-full" />
          </div>
        </div>
        <div className="w-full h-[180px] bg-gradient-to-b from-[#6E3FF34D] to-[#40258D00]">
          <label className="sticky top-0 z-50 w-full rounded-t-lg bg-opacity-60 py-3 text-gray-400 backdrop-blur-lg backdrop-filter focus-within:text-gray-600 flex items-center border-b border-white/10 font-inter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.4279 16.1553L21.2826 20.0091L20.0091 21.2826L16.1553 17.4279C14.7214 18.5774 12.9378 19.2026 11.1 19.2C6.6288 19.2 3 15.5712 3 11.1C3 6.6288 6.6288 3 11.1 3C15.5712 3 19.2 6.6288 19.2 11.1C19.2026 12.9378 18.5774 14.7214 17.4279 16.1553ZM15.6225 15.4875C16.7647 14.3129 17.4026 12.7384 17.4 11.1C17.4 7.6188 14.5803 4.8 11.1 4.8C7.6188 4.8 4.8 7.6188 4.8 11.1C4.8 14.5803 7.6188 17.4 11.1 17.4C12.7384 17.4026 14.3129 16.7647 15.4875 15.6225L15.6225 15.4875Z" fill="#B1B1B1" />
            </svg>
            <input
              placeholder="What are you looking for?"
              type="text"
              spellCheck="false"
              className="relative h-9 bg-transparent text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 block w-full appearance-none rounded-none pl-14 text-white z-10"
              value={query}
              onChange={handleQuery}
            />
          </label>
          <div className="flex flex-row flex-wrap gap-1.5 p-6">
            <span
              key="all"
              className={`rounded-lg ${selectedTags.includes("all") ? "bg-white text-black" : "bg-bg-2 text-text-additional"} px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}
              onClick={() => handleTagClick("all")}
            >
              All
            </span>
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`rounded-lg ${selectedTags.includes(tag.id) ? "bg-white text-black" : "bg-bg-2 text-text-additional"} px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        {
          !loading ? (
            <div className="flex w-full flex-col gap-6 pl-6 pb-6">
              {selectedTags.includes("all")
                ? tags.map((tag) => {
                  const matchedList = characters.filter(char => char.tags.some(t => t.id === tag.id));
                  const totChats = matchedList.reduce((total, char) => total + char._count.messages, 0);
                  return matchedList.length > 0 ? (
                    <TagCarousel title={`#${tag.name}`} className="text-xl font-semibold hover:underline" key={tag.id} link={`/categories/${tag.categoryId}/tag/${tag.id}`} totChats={totChats}>
                      {matchedList.map((character) => (
                        <CharacterCard character={character} key={character.id} />
                      ))}
                    </TagCarousel>
                  ) : null;
                })
                : selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  if (tag) {
                    const matchedList = filteredCharacters.filter(char => char.tags.some(t => t.id === tag.id));
                    const totChats = matchedList.reduce((total, char) => total + char._count.messages, 0);
                    return (
                      <TagCarousel title={`#${tag.name}`} className="text-xl font-semibold" key={tag.id} link={`/categories/${tag.categoryId}/tag/${tag.id}`} totChats={totChats}>
                        {matchedList.map((character) => (
                          <CharacterCard character={character} key={character.id} />
                        ))}
                      </TagCarousel>
                    );
                  }
                  return null;
                })}
            </div>
          ) : null
        }
      </div>
    </div>
  );
}