"use client";
import { Input } from "@/components/ui/input";
import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Loader2 } from "lucide-react";
import { Character as BaseCharacterProps, Category as BaseCategory } from "@prisma/client";
import React from "react";
import Carousel from "@/components/toffee/Carousel";
import CharacterCard from "@/components/toffee/CharacterCard";
import CategoryCard from "@/components/toffee/CategoryCard";
interface Character extends BaseCharacterProps {
  _count: {
    messages: number;
  };
}
interface Category extends BaseCategory {
  characters: Character[]
}
function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<F>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
}

export function Candies() {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [query, setQuery] = useState<string | null>(null);
  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const fetchCharacters = async (params?: string) => {
    try {
      setLoading(true);
      const url = params
        ? `/api/discover?params=${encodeURIComponent(params)}`
        : "/api/discover";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      setCharacters(data.characters);
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Using useCallback to ensure stability across renders
  const debouncedFetchCharacters = useCallback(
    debounce((query) => {
      fetchCharacters(query);
    }, 1000),
    [],
  );

  useEffect(() => {
    // Fire once on component mount if no query is available
    if (query === null) {
      fetchCharacters();
    } else {
      debouncedFetchCharacters(query);
    }
  }, [query, debouncedFetchCharacters]);
  return (
    <div className="h-screen w-full overflow-hidden p-2">
      <div className="flex h-full w-full flex-col items-center justify-start rounded-2xl bg-[#121212] ">
        <label className="sticky top-0 z-50 mt-1 block w-full rounded-lg bg-opacity-60 py-4 text-gray-400 backdrop-blur-lg  backdrop-filter focus-within:text-gray-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-6 top-7 -translate-y-1/2 transform"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.4279 16.1553L21.2826 20.0091L20.0091 21.2826L16.1553 17.4279C14.7214 18.5774 12.9378 19.2026 11.1 19.2C6.6288 19.2 3 15.5712 3 11.1C3 6.6288 6.6288 3 11.1 3C15.5712 3 19.2 6.6288 19.2 11.1C19.2026 12.9378 18.5774 14.7214 17.4279 16.1553ZM15.6225 15.4875C16.7647 14.3129 17.4026 12.7384 17.4 11.1C17.4 7.6188 14.5803 4.8 11.1 4.8C7.6188 4.8 4.8 7.6188 4.8 11.1C4.8 14.5803 7.6188 17.4 11.1 17.4C12.7384 17.4026 14.3129 16.7647 15.4875 15.6225L15.6225 15.4875Z"
              fill="#B1B1B1"
            />
          </svg>

          <Input
            placeholder="What are you looking for?"
            value={query || ""}
            onChange={handleQuery}
            className="form-input block w-full appearance-none rounded-none border border-b-2 border-l-0 border-r-0 border-t-0 border-white/10 px-4 py-3 pb-6 pl-14 text-white"
          />
        </label>
        {/* <div className="w-full">
          <InnerCarouselDiscoverCard />
        </div> */}
        <div className="no-scrollbar flex w-full flex-col gap-6 overflow-y-auto p-6">
          <div className="w-full overflow-hidden">
            <Carousel title="For you" className = "font-semibold my-2 text-xl">
              {characters.length > 0 ? characters.map((character, i) => (
                <CharacterCard character={character} key={i} />
              )) : (
                <div className="flex items-center justify-center w-full h-[282px] rounded-lg bg-[#202020] text-[#DEDFE4]">
                  {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : (
                    <span>{error ? "Failed to fetch characters" : "No characters found"}</span>
                  )}
                </div>
              )}
            </Carousel>
          </div>
          <div className="w-full overflow-hidden">
            <Carousel title="Categories" className = "font-semibold my-2 text-xl">
              {categories.length > 0 ? categories.map((category, i) => (
                <CategoryCard category={category} key={i} index={i}/>
              )) : (
                <div className="flex items-center justify-center w-full h-[282px] rounded-lg bg-[#202020] text-[#DEDFE4]">
                  {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : (
                    <span>{error ? "Failed to fetch categories" : "No categories found"}</span>
                  )}
                </div>
              )}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
