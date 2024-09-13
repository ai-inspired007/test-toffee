"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import BotPreview from "../../BotPreview";
import { TKnowledgePack } from "@/lib/types";

interface CharacterKnowledgeProps {
  name: string;
  description: string;
  imageData: string | null;
  knowledges: TKnowledgePack[];
  selectedKnowledgeIds: string[];
  setSelectedKnowledgeIds: (selectedKnowledgeIds: string[]) => void;
  categoryTags: string[];
}

const CharacterKnowledge: React.FC<CharacterKnowledgeProps> = ({
  name,
  description,
  imageData,
  knowledges,
  selectedKnowledgeIds,
  setSelectedKnowledgeIds,
  categoryTags,
}) => {
  const { data: session } = useSession();
  const user = session?.user || {};
  const [searchInput, setSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredKnowledges, setFilteredKnowledges] = useState<TKnowledgePack[]>(knowledges);

  useEffect(() => {
    const filtered = knowledges.filter((pack) => {
      const matchesSearch =
        pack.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (pack.description &&
          pack.description.toLowerCase().includes(searchInput.toLowerCase()));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.includes("All") ||
        pack.tags.some((tag) => selectedTags.includes(tag.name));
      return matchesSearch && matchesTags && !selectedKnowledgeIds.includes(pack.id);
    });
    setFilteredKnowledges(filtered);
  }, [searchInput, selectedTags, knowledges, selectedKnowledgeIds]);

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSelectedTags([]);
    } else {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag].filter((t) => t !== "All")
      );
    }
  };

  const handleConnectKnowledge = (knowledgeId: string) => {
    setSelectedKnowledgeIds([...selectedKnowledgeIds, knowledgeId]);
  };

  const handleRemoveKnowledge = (knowledgeId: string) => {
    setSelectedKnowledgeIds(selectedKnowledgeIds.filter((id) => id !== knowledgeId));
  };

  return (
    <div className="mt-5 flex w-full max-w-[1024px] flex-row">
      <div className="flex w-full flex-col items-start">
        <h1 className="text-[20px] font-semibold tracking-[0.075rem] text-white sm:text-[32px]">
          Knowledge Packs
        </h1>
        <p className="text-[13px] text-text-tertiary sm:text-sm">
          Take a look at the available knowledge packs and connect them to your character
        </p>
        <div className="mt-8 flex w-full flex-col gap-7 sm:w-[560px]">
          <div className="relative w-full">
            <Search className="absolute ml-2 h-full w-6 text-[#777777]" />
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent py-2 pl-10 pr-4 text-[13px] text-text-sub outline-none placeholder:text-text-tertiary"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for knowledge packs"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {["All", ...categoryTags].map((tag) => (
              <span
                key={tag}
                className={`rounded-lg ${selectedTags.includes(tag) ? "bg-white text-black" : "bg-bg-2 text-text-additional"}  cursor-pointer border border-white/10 px-3 py-[7px] text-sm`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex w-full flex-col gap-2">
            {filteredKnowledges.map((pack) => (
              <div key={pack.id} className="relative h-40 w-full">
                <div className="absolute z-10 flex h-full flex-col gap-1 p-5">
                  <span className="text-base font-medium leading-tight text-white">
                    {pack.name}
                  </span>
                  <div className="flex flex-row items-center gap-1 text-text-additional">
                    <span className="text-xs">Ayush</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-400" />
                    <GitFork2 />
                    <span className="text-xs">635.5k</span>
                  </div>
                  <p className="text-xs text-text-tertiary ">
                    {pack.description}
                  </p>
                  <button
                    className="mt-auto w-fit rounded-full bg-white px-4  py-1.5 text-sm font-medium text-black"
                    onClick={() => handleConnectKnowledge(pack.id)}
                  >
                    <span className="px-1 py-[3px]">Connect</span>
                  </button>
                </div>
                <div className="relative h-full w-full">
                  <div className="absolute z-[1] h-full w-full rounded-[14px] bg-gradient-to-l from-transparent via-[#202020dc] to-[#202020]" />
                  {pack.image && (
                    <Image
                      className="h-full w-full rounded-2xl border border-white/10 object-cover"
                      src={pack.image}
                      alt="Pack Image"
                      fill
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-auto mt-5 hidden flex-col sm:flex">
        <BotPreview
          imageData={imageData}
          user={user}
          name={name}
          description={description}
        />
        <div className="mt-8 w-full">
          {selectedKnowledgeIds.length > 0 && (
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-xs  font-medium text-text-additional">
                  Connected knowledge packs:
                </h3>
                <span className="rounded-full bg-bg-3 px-2.5 py-0 text-sm text-white">
                  {selectedKnowledgeIds.length}
                </span>
              </div>
              {selectedKnowledgeIds.map((knowledgeId) => {
                const addon = knowledges.find((k) => k.id === knowledgeId);
                if (!addon) return null;
                return (
                  <div key={addon.id} className="relative h-16 w-full">
                    <div className="absolute z-10 flex h-full w-full flex-row px-4 py-3">
                      <div className="flex w-full flex-col justify-between gap-1">
                        <span className=" text-sm font-medium text-white">
                          {addon.name}
                        </span>
                        <div className="flex flex-row items-center gap-1 text-xs text-text-additional">
                          <span className="text-xs">Ayush</span>
                          <div className="h-1 w-1 rounded-full bg-zinc-400" />
                          <GitFork2 />
                          <span className="text-xs">635.5k</span>
                        </div>
                      </div>
                      <button
                        className="mt-auto w-fit rounded-full bg-[#2F2F2F]  p-1.5 text-sm font-medium text-text-tertiary"
                        onClick={() => handleRemoveKnowledge(addon.id)}
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="absolute z-[1] inline-flex h-full w-full rounded-[14px] border border-white/10 bg-gradient-to-l from-transparent via-[#202020dc] to-[#202020]" />
                      {addon.image && (
                        <Image
                          className="h-full w-full rounded-2xl object-cover object-center"
                          src={addon.image}
                          alt="Addon Image"
                          fill
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterKnowledge;