"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import BotPreview from "../../../BotPreview";
import StepButton from "./StepButton";
import { TKnowledgePack } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import ConnectedCandies from "./ConnectedCandies";
import SelectedAddons from "./SelectedAddons";

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
  const [showModal, setShowModal] = useState(false);

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSelectedTags(["All"]);
    } else {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : ["All", ...prevTags.filter((t) => t !== "All"), tag],
      );
    }
  };

  const handleConnectAddon = (addon: TKnowledgePack) => {
    setSelectedAddons([...selectedAddons, addon]);
  };

  const handleRemoveAddon = (addonId: string) => {
    setSelectedAddons(selectedAddons.filter((item) => item.id !== addonId));
  };

  const filteredAddons = addons.filter((pack) => {
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
      !selectedAddons.some((selected) => selected.id === pack.id)
    );
  });

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="mt-5 flex w-full max-w-[1024px] flex-row">
      <div className="flex w-full flex-col items-start mx-5">
        <h1 className="text-[20px] font-semibold tracking-[0.075rem] text-white sm:text-[32px]">
          Candies
        </h1>
        <p className="text-[13px] text-text-tertiary sm:text-sm">
          Take a look on available add-ons and connect it to your character
        </p>
        <div className="mt-8 flex w-full flex-col gap-7 sm:w-[560px]">
          <div className="relative w-full">
            <Search className="absolute ml-2 h-full w-6 text-[#777777]" />
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent py-2 pl-10 pr-4 text-[13px] text-text-sub outline-none placeholder:text-text-tertiary"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for add-ons"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2">
            {filteredAddons.map((pack) => (
              <div key={pack.id} className="flex flex-col w-full">
                <div className="relative h-40 w-full">
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
                      onClick={() => handleConnectAddon(pack)}
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
              </div>
            ))}
          </div>
          <div className="mt-8 w-full">
            <StepButton onClick={advanceFunction} text="Continue" />
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
          {selectedAddons.length > 0 && (
            <>
              <SelectedAddons
                addons={selectedAddons}
                onRemoveAddon={handleRemoveAddon}
              />
              <div className="mt-4">
                <span className="font-inter text-toffee-text-accent text-sm font-medium leading-5" onClick={handleShowModal}>Show all connected candies</span>
              </div>
              <Modal isOpen={showModal} onClose={handleCloseModal}>
                <ConnectedCandies
                  addons={selectedAddons}
                  selectedAddons={selectedAddons}
                  onClose={handleCloseModal}
                  setSelectedAddons={setSelectedAddons}
                  onRemoveAddon={handleRemoveAddon}
                />
              </Modal>
            </>
          )}

        </div>
      </div>
    </div >
  );
};
