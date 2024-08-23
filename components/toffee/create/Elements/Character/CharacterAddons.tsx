"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import BotPreview from "./BotPreview";
import StepButton from "./StepButton";
import { TKnowledgePack } from "@/lib/types";
import Modal from "@/components/toffee/Modal";
import { MdiInformationOutline } from "@/components/toffee/icons/InformationLine";
export const CharacterAddons = ({
  name,
  description,
  imageData,
  advanceFunction,
  previousFunction,
  isSubmitLoading,
  addons,
  selectedAddons,
  setSelectedAddons,
  categoryTags,
}: {
  name: string;
  description: string;
  imageData: string | null;
  advanceFunction: () => void;
  previousFunction: () => void;
  isSubmitLoading: boolean;
  addons: TKnowledgePack[];
  selectedAddons: TKnowledgePack[];
  setSelectedAddons: (selectedAddons: TKnowledgePack[]) => void;
  categoryTags: string[];
}) => {
  const { data: session } = useSession();
  let user = session?.user;
  const [searchInput, setSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["All"]);

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSelectedTags(["All"]);
    } else {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : ["All", ...prevTags.filter((t) => t !== "All"), tag]
      );
    }
  };

  const handleConnectAddon = (addon: TKnowledgePack) => {
    setSelectedAddons([...selectedAddons, addon]);
  };

  const handleRemoveAddon = (addonId: string) => {
    setSelectedAddons(selectedAddons.filter((item) => item.id !== addonId));
  };

  const filteredAddons = addons.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      (pack.description && pack.description.toLowerCase().includes(searchInput.toLowerCase()));
    const matchesTags = selectedTags.includes("All") ||
      pack.tags.some(tag => selectedTags.includes(tag.name));
    return matchesSearch && matchesTags && !selectedAddons.some(selected => selected.id === pack.id);
  });
  const [openCandyList, setOpenCandyList] = useState(false)
  return (
    <div className="mt-5 flex flex-row w-full max-w-[1024px] h-full">
      <div className="flex flex-col items-start w-full h-full">
        <h1 className="sm:text-[32px] text-[20px] font-semibold tracking-[0.075rem] text-white">
          Candies
        </h1>
        <p className="sm:text-sm text-[13px] text-text-tertiary">
          Take a look on available add-ons and connect it to your character
        </p>
        <div className="flex flex-col sm:w-[560px] w-full mt-8 gap-7 relative h-full">
          <div className="w-full relative">
            <Search className="text-[#777777] w-6 absolute h-full ml-2" />
            <input
              type="text"
              className="w-full text-[13px] text-text-sub bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg pr-4 pl-10 py-2 placeholder:text-text-tertiary"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for add-ons"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {["All", ...categoryTags].map((tag) => (
              <span
                key={tag}
                className={`rounded-lg ${selectedTags.includes(tag) ? "bg-white text-black" : "bg-bg-2 text-text-additional"}  px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2 w-full mb-28">
            {filteredAddons.length > 0 ? (
              filteredAddons.length < 6 ? filteredAddons.map((pack) => (
                <div key={pack.id} className="w-full h-40 relative">
                  <div className="absolute flex flex-col gap-1 z-10 p-5 h-full">
                    <span className="text-white leading-tight font-medium text-base">{pack.name}</span>
                    <div className="flex flex-row text-text-additional gap-1 items-center">
                      <span className="text-xs">Ayush</span>
                      <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                      <GitFork2 />
                      <span className="text-xs">635.5k</span>
                    </div>
                    <p className="text-xs text-text-tertiary ">{pack.description}</p>
                    <button
                      className="rounded-full py-1.5 px-4 bg-white text-black  text-sm font-medium w-fit mt-auto"
                      onClick={() => handleConnectAddon(pack)}
                    >
                      <span className="px-1 py-[3px]">Connect</span>
                    </button>
                  </div>
                  <div className="relative h-full w-full">
                    <div className="absolute z-[1] h-full w-full rounded-[14px] bg-gradient-to-l from-transparent to-[#202020] via-[#202020dc]" />
                    {pack.image && <Image
                      className="rounded-2xl object-cover w-full h-full border border-white/10"
                      src={pack.image}
                      alt="Pack Image"
                      fill
                    />}
                  </div>
                </div>
              )) : 
              <div className="flex flex-col items-center gap-2 mt-8">
                <Image src={"/full-pack.png"} width={128} height={82} alt="" />
                <span className="text-white font-medium text-sm mt-2">{"You’re pucks are full"}</span>
                <span className="text-text-tertiary text-xs">Remove at least one candy from your character to show more items here</span>
              </div>
            ) :
              <div className="flex flex-col items-center gap-2 mt-8">
                <Image src={"/no-card.svg"} width={128} height={82} alt="" />
                <span className="text-white font-medium text-sm mt-2">Oops! No results found</span>
                <span className="text-text-tertiary text-xs">Please check your search terms</span>
              </div>
            }
          </div>
          <div className="w-full fixed bottom-0 right-0 px-5 pb-8 sm:px-0 sm:absolute z-50 bg">
            <div className="bg-bg-3 rounded-full px-3 py-[11px] mb-4 flex flex-row w-full justify-between items-center" onClick={() => setOpenCandyList(true)}>
              <span className="text-sm text-white font-medium px-1">Added candies</span>
              <span className="bg-black rounded-full text-sm text-white px-2.5 py-1">{selectedAddons.length} <span className="text-text-tertiary">/ 5</span></span>
            </div>
            <StepButton onClick={advanceFunction} text="Continue" />
          </div>
        </div>
      </div>
      <Modal isOpen={openCandyList} onClose={() => setOpenCandyList(false)} className="w-full fixed bottom-0">
        <div className="flex flex-col p-5 bg-bg-2 rounded-t-2xl w-full">
          <div className="flex flex-row items-center gap-2 py-1">
            <span className="text-white text-sm font-medium">Added candies</span>
            <MdiInformationOutline className="text-text-tertiary" />
          </div>
          <div className="flex flex-col gap-1 w-full mt-6">
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="w-full h-16 relative">
                <div className="absolute flex flex-row z-10 py-3 px-4 h-full w-full">
                  <div className="flex flex-col w-full gap-1 justify-between">
                    <span className=" font-medium text-white text-sm">{addon.name}</span>
                    <div className="flex flex-row text-text-additional gap-1 items-center text-xs">
                      <span className="text-xs">Ayush</span>
                      <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                      <GitFork2 />
                      <span className="text-xs">635.5k</span>
                    </div>
                  </div>
                  <button
                    className="rounded-full p-1.5 bg-bg-2 text-text-tertiary  text-sm font-medium w-fit mt-auto"
                    onClick={() => handleRemoveAddon(addon.id)}
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative h-full w-full overflow-hidden">
                  <div className="absolute z-[1] h-full w-full rounded-[14px] bg-gradient-to-l from-transparent to-[#202020] via-[#202020dc] inline-flex border border-white/10" />
                  {addon.image && (
                    <Image
                      className="rounded-2xl object-cover object-center w-full h-full"
                      src={addon.image}
                      alt="Addon Image"
                      fill
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <div className="sm:flex flex-col ml-auto hidden mt-5">
        <BotPreview imageData={imageData} user={user} name={name} description={description} />
        <div className="w-full mt-8">
          {selectedAddons.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-row w-full justify-between items-center">
                <h3 className="text-text-additional  font-medium text-xs">Connected add-ons:</h3>
                <span className="text-white text-sm py-0 px-2.5 rounded-full bg-bg-3">{selectedAddons.length}</span>
              </div>
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="w-full h-16 relative">
                  <div className="absolute flex flex-row z-10 py-3 px-4 h-full w-full">
                    <div className="flex flex-col w-full gap-1 justify-between">
                      <span className=" font-medium text-white text-sm">{addon.name}</span>
                      <div className="flex flex-row text-text-additional gap-1 items-center text-xs">
                        <span className="text-xs">Ayush</span>
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        <GitFork2 />
                        <span className="text-xs">635.5k</span>
                      </div>
                    </div>
                    <button
                      className="rounded-full p-1.5 bg-bg-2 text-text-tertiary  text-sm font-medium w-fit mt-auto"
                      onClick={() => handleRemoveAddon(addon.id)}
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="relative h-full w-full overflow-hidden">
                    <div className="absolute z-[1] h-full w-full rounded-[14px] bg-gradient-to-l from-transparent to-[#202020] via-[#202020dc] inline-flex border border-white/10" />
                    {addon.image && (
                      <Image
                        className="rounded-2xl object-cover object-center w-full h-full"
                        src={addon.image}
                        alt="Addon Image"
                        fill
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}