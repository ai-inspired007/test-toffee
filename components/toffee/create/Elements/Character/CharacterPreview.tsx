"use client";
import { useState, useEffect, useCallback, Dispatch, SetStateAction, FC } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import BotPreview from "../../../BotPreview";
import StepButton from "./StepButton";
import { TKnowledgePack, TVoice } from "@/lib/types";
import SingleVoiceCard from "./SingleVoiceCard";
import { Avatar, AvatarImage } from "@/components/ui/ImageAvatar";
import { Voice, Tag } from "@prisma/client";
import TextareaBlock from "@/components/ui/TextareaBlock";
import SelectCategories from "./SelectCategories";
import { RiGlobalLine } from "../../../icons/GlobalLine";
import { RiLockLine } from "../../../icons/Lock";
import { UserFollowingIcon } from "../../../icons/ProfileIcons";
import { RiCloseCircleLine } from "react-icons/ri";
import ConnectedCandies from "./ConnectedCandies";
import SelectedAddons from "./SelectedAddons";
import Modal from "@/components/ui/Modal";

export const CharacterPreview = ({
  name,
  description,
  introduction,
  setIntroduction,
  imageData,
  advanceFunction,
  previousFunction,
  isSubmitLoading,
  addons,
  selectedAddons,
  setSelectedAddons,
  voice,
  categories,
  categoryId,
  setCategoryId,
  setSelectedTags,
  selectedTags,
}: {
  name: string;
  description: string;
  introduction: string;
  setIntroduction: (newIntroduction: string) => void;
  imageData: string | null;
  advanceFunction: () => void;
  previousFunction: () => void;
  isSubmitLoading: boolean;
  addons: TKnowledgePack[];
  selectedAddons: TKnowledgePack[];
  setSelectedAddons: (selectedAddons: TKnowledgePack[]) => void;
  voice: TVoice | undefined;
  categories: { id: string; name: string; tags: Tag[] }[];
  categoryId?: string;
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  selectedTags: Set<string>;
  setSelectedTags: (selectedTags: Set<string>) => void;
}) => {
  const { data: session } = useSession();
  let user = session?.user;
  const [searchInput, setSearchInput] = useState("");

  const handleConnectAddon = (addon: TKnowledgePack) => {
    setSelectedAddons([...selectedAddons, addon]);
  };

  const handleRemoveAddon = (addonId: string) => {
    setSelectedAddons(selectedAddons.filter((item) => item.id !== addonId));
  };


  const [tags, setTags] = useState<Tag[]>(categories[0]?.tags || []);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleTagClick = useCallback(
    (tagId: string) => {
      const updatedTags = new Set(selectedTags);
      if (updatedTags.has(tagId)) {
        updatedTags.delete(tagId);
      } else {
        updatedTags.add(tagId);
      }
      setSelectedTags(updatedTags);
    },
    [selectedTags, setSelectedTags],
  );

  const handleAddTag = async () => {
    if (newTag) {
      setLoadingState(true);
      try {
        const response = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag }),
        });
        const data = await response.json();
        setTags((prevTags) => [...prevTags, data]);
        setShowTagInput(false);
        setNewTag("");
      } catch (error) {
        console.error("[TAG_ADD]", error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  const cancelAddTag = () => {
    setShowTagInput(false);
    setNewTag("");
  };



  const colors = ['#F7604C', '#BCB8C5', '#CDF74C', '#6E3FF3', '#4CF788', '#F7A84C', '#E73FF3', '#EDACE2', '#F7E34C', '#F74C5D', '#3F7BF3', '#B64D8C'];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const getGradientColor = (color: string) => {
    return `linear-gradient(to right, ${color}4D 0%, ${color}00 35.07%)`;
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const [gradientColor, setGradientColor] = useState(getGradientColor(getRandomColor()));


  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-5 flex w-full max-w-[1024px] flex-row">
      <div className="flex flex-col items-start sm:w-[560px] w-full mx-5">
        <Avatar className="h-[72px] w-[72px]">
          <AvatarImage className="object-cover object-center" src={imageData || "/default.png"} />
        </Avatar>

        <h1 className="text-[20px] font-semibold tracking-[0.075rem] text-white sm:text-[32px]">
          {name}
        </h1>
        <p className="text-[13px] text-text-tertiary sm:text-sm">
          {description}
        </p>
        {voice && <div className="mt-6 w-full">
          <SingleVoiceCard
            voice={voice}
            togglePlayPause={handleTogglePlayPause}
            gradientColor={gradientColor}
            isPlaying={isPlaying}
          />
        </div>}

        <div className="mt-6 w-full">
          <TextareaBlock
            label="Introduction"
            name="introduction"
            value={introduction}
            onChange={setIntroduction}
            placeholder="How should your AI start the conversation? (Optional)"
          />
        </div>

        <div className="mt-6 w-full">
          <SelectCategories
            options={categories}
            setSelectedOption={setCategoryId}
            categoryId={categoryId}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        <div className="mt-8 w-full">
          <StepButton onClick={advanceFunction} text="Continue" />
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
    </div>
  );
};
