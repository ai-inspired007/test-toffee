import { useState } from "react";
import Image from "next/image";
import { SearchLineIcon } from "../icons/SearchLineIcon";
import { GitForkOutline } from "../icons/Fork";
import { useChatPage } from "@/contexts/ChatPageProvider";
import { TKnowledgePack } from "@/lib/types";
import axios from "axios";

const ChatCandySection = ({
  categoryTags,
  chatId
}: {
    categoryTags: string[];
    chatId: string;
}) => {
  type ItemType = {
    id: number;
    name: string;
  };
  const {
    connectedCandies,
    setConnectedCandies,
    knowledgePacks,
  } = useChatPage();
  const [searchInput, setSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["All"]);

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSelectedTags(["All"]);
    } else {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags.filter((t) => t !== "All"), tag],
      );
    }
  };

  const handleConnectAddon = (addon: TKnowledgePack) => {
    let initData = connectedCandies;
    setConnectedCandies([...connectedCandies, addon]);
    axios.post(`/api/character/${chatId}/knowledge`, { knowledgePackId: addon.id, isAdd: true })
      .catch((err) => {
        setConnectedCandies(initData);
        console.log(err);
      });
  };

  const handleRemoveAddon = (addonId: string) => {
    let initData = connectedCandies;
    setConnectedCandies(connectedCandies.filter((item) => item.id !== addonId));
    axios.post(`/api/character/${chatId}/knowledge`, { knowledgePackId: addonId, isAdd: false })
      .catch((err) => {
        setConnectedCandies(initData);
        console.log(err);
    });
  };

  const filteredAddons = knowledgePacks.filter((pack: TKnowledgePack) => {
    const matchesSearch =
      pack.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      (pack.description &&
        pack.description.toLowerCase().includes(searchInput.toLowerCase()));
    const matchesTags =
      selectedTags.includes("All") ||
      pack.tags.some((tag) => selectedTags.includes(tag.name));
    return (
      matchesSearch &&
      matchesTags &&
      !connectedCandies.some((selected) => selected.id === pack.id)
    );
  });

  return (
    <div className="no-scrollbar h-screen flex-grow overflow-y-auto p-2">
      <div className="flex min-h-full w-full flex-col rounded-lg bg-bg-2">
        <label className="sticky top-0 z-50 flex w-full items-center rounded-t-lg border-0 border-b-2 border-white/10 bg-opacity-60 py-5 text-gray-400 backdrop-blur-lg backdrop-filter focus-within:text-gray-600 ">
          <SearchLineIcon className="pointer-events-none absolute left-6 h-6 w-6 text-[#B1B1B1]" />
          <input
            className="relative z-10 block h-9 w-full appearance-none rounded-none bg-transparent pl-14 text-sm text-white transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="What are you looking for?"
          />
        </label>
        <div className="flex w-full flex-col gap-3 p-6">
          <span className="pl-2 pr-4 text-xs text-text-additional ">
            Connected candies
          </span>
          {/* Connected candies example list */}
          <div className="flex flex-row flex-wrap gap-4">
            {connectedCandies.map((pack) => (
              <div key={pack.id} className="relative flex h-40 w-[389px] flex-col overflow-hidden rounded-2xl">
                <div className="absolute flex h-full w-full flex-col gap-1 bg-gradient-to-r from-[#202020] via-[#121212A6] to-[#12121200] p-5">
                  <span className="font-medium text-white ">
                    {pack.name}
                  </span>
                  <div className="mb-1 flex flex-row items-center gap-2 text-xs text-text-additional">
                    <span>{pack.description}</span>
                    <div className="h-1 w-1 rounded-full bg-[#b1b1b1]" />
                    <GitForkOutline />
                    <span>{633}</span>
                  </div>
                  <span className="text-xs text-text-tertiary ">
                    {pack.description}
                  </span>
                  <div className="mt-auto w-fit rounded-full bg-[#2F2F2F]  px-4 py-1.5 text-[#DDDDDD]">
                    <button className="px-1 py-[3px] text-sm" onClick={() => handleRemoveAddon(pack.id)}>Remove</button>
                  </div>
                </div>
                <Image
                  src={pack.image || ""}
                  alt=""
                  className="h-full w-full object-cover"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
            ))}
            
          </div>
          <div className="flex flex-row flex-wrap gap-2">
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
          {/* Avaliable list example */}
          <div className="w-full overflow-hidden">
            <div className="flex flex-row flex-wrap gap-4">
              {filteredAddons.map((pack) => (
                <div
                  key={pack.id}
                  className="relative flex h-40 w-[389px] flex-col overflow-hidden rounded-2xl"
                >
                  <div className="absolute flex h-full w-full flex-col bg-gradient-to-r from-[#202020] via-[#121212A6] to-[#12121200] p-5">
                    <span className="font-medium text-white ">
                      {pack.name}
                    </span>
                    <div className="mb-1 flex flex-row items-center gap-2 text-xs text-text-additional">
                      <span>{pack.description}</span>
                      <div className="h-1 w-1 rounded-full bg-[#b1b1b1]" />
                      <GitForkOutline />
                      <span>{633}</span>
                    </div>
                    <span className="text-xs text-text-tertiary ">
                      {pack.description}
                    </span>
                    <div className="mt-auto w-fit rounded-full bg-white  px-4 py-1 text-black">
                      <button className="px-1 py-[3px] text-sm" onClick={() => handleConnectAddon(pack)}>Connect</button>
                    </div>
                  </div>
                  <Image
                    src={pack.image || ""}
                    alt="Card Image"
                    className="h-full w-full object-cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatCandySection;
