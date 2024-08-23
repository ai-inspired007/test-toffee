import { ArrowRightIcon, PlusIcon, XCircle } from "lucide-react";
import { RiPlayFill } from "../../icons/PlayFill";
import { Slider } from "@nextui-org/react";
import { RiVoiceprintLine } from "../../icons/VoicePrint";
import SelectSharing, { SharingProps } from "./SelectSharing";
import { RiGlobalLine } from "../../icons/GlobalLine";
import { RiLockLine } from "../../icons/Lock";
import { RiDraftLine } from "../../icons/Files";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import Tooltip from "../../Tooltip";
import { MdiInformationOutline } from "../../icons/InformationLine";
import SelectPharse, { PharseProps } from "./SelectPharse";
import { Tag } from "@prisma/client";
import VoiceCreatedModal from "./VoiceCreatedModal";

const VoiceDetails = ({
  setStep,
}: {
  setStep: Dispatch<React.SetStateAction<number>>;
}) => {
  const pharseOptions: PharseProps[] = [
    {
      value: "public",
      label: "Public and publicly available",
    },
    { value: "private", label: "Private only for myself" },
    { value: "unlisted", label: "Unlisted" },
  ];
  const sharingOptions: SharingProps[] = [
    {
      value: "public",
      label: "Public and publicly available",
      icon: RiGlobalLine,
    },
    { value: "private", label: "Private only for myself", icon: RiLockLine },
    { value: "unlisted", label: "Unlisted", icon: RiDraftLine },
  ];
  const [selectedPharseOption, setSelectedPharseOption] = useState(
    pharseOptions[0].value,
  );
  const [selectedSharingOption, setSelectedSharingOption] = useState(
    sharingOptions[0].value,
  );
  const [name, setName] = useState("");
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "1",
      name: "Personal",
      categoryId: "",
    },
  ]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isVoiceCreated, setIsVoiceCreated] = useState<boolean>(false);

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

  const handleContinue = () => {
    setIsVoiceCreated(true);
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col items-start gap-10">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <span className=" text-[32px] font-semibold leading-10 text-white">
            Your voice
          </span>
          <span className=" text-[14px] font-normal leading-[22px] text-text-tertiary">
            Supported formats PNG and JPG, recommended size 260x300. 400KB max
          </span>
        </div>

        <div className="flex w-full cursor-pointer flex-col gap-2">
          <div className="broder relative flex items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7604C]">
                <RiVoiceprintLine className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className=" text-[16px] font-medium leading-5 text-white">
                  Zero Two
                </span>
                <span className=" text-xs font-normal text-[#787878]">
                  {"I’m Zero Two from Darling in the Franxx"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible">
          <SelectPharse
            options={sharingOptions}
            selectedOption={selectedPharseOption}
            setSelectedOption={setSelectedPharseOption}
          />
        </div>

        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-light text-text-tertiary">
              {"Name"}
            </span>
            <textarea
              name="name"
              id=""
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent p-1 px-4 py-3 text-[13px] font-light text-text-sub outline-none"
              rows={1}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <span className="me-2 text-xs font-semibold text-text-tertiary">
              {"Voice Description"}
            </span>
            <Tooltip
              text="Add more labels to increase the effectiveness of your knowledge pack"
              className="-left-20 bottom-8 w-56 rounded-md bg-[#242424] px-4 py-2 text-xs text-text-tertiary"
            >
              <MdiInformationOutline className="h-5 w-5 cursor-pointer text-[#777777]" />
            </Tooltip>
          </div>
          <div className="flex w-full flex-col justify-between gap-0 rounded-[7px] border border-[#202020]">
            <div className="relative">
              <textarea
                name="prompt"
                className="w-full resize-none overflow-hidden  border-none bg-transparent px-4 pb-2 pt-3 text-[13px] text-text-sub outline-none"
                id=""
              ></textarea>
            </div>
            <span className="rounded-b-[7px] bg-bg-3 px-4 py-1 text-xs text-text-tertiary">
              {"How should your AI start the conversation? (Optional)"}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <span className="text-xs font-semibold text-text-tertiary">
            {"Tags"}
          </span>
          <TagSection
            tags={tags}
            showTagInput={showTagInput}
            selectedTags={selectedTags}
            handleTagClick={handleTagClick}
            setShowTagInput={setShowTagInput}
            setNewTag={setNewTag}
            handleAddTag={handleAddTag}
            cancelAddTag={cancelAddTag}
            newTag={newTag}
            isLoading={loadingState}
          />
        </div>

        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible">
          <SelectSharing
            options={sharingOptions}
            selectedOption={selectedSharingOption}
            setSelectedOption={setSelectedSharingOption}
          />
        </div>

        <div className="flex w-full">
          <button
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px]  text-[14px] font-medium leading-[18px] text-white"
            onClick={() => handleContinue()}
          >
            Continue
          </button>
        </div>
      </div>
      <VoiceCreatedModal
        isModal={isVoiceCreated}
        handleCancel={() => setIsVoiceCreated(false)}
      />
    </div>
  );
};

const TagSection: FC<{
  tags: Tag[];
  showTagInput: boolean;
  selectedTags: Set<string>;
  handleTagClick: (tagId: string) => void;
  setShowTagInput: Dispatch<SetStateAction<boolean>>;
  setNewTag: Dispatch<SetStateAction<string>>;
  handleAddTag: () => void;
  cancelAddTag: () => void;
  newTag: string;
  isLoading: boolean;
}> = ({
  tags,
  showTagInput,
  selectedTags,
  handleTagClick,
  setShowTagInput,
  setNewTag,
  handleAddTag,
  cancelAddTag,
  newTag,
  isLoading,
}) => (
  <>
    <div className="flex flex-row flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className={`cursor-pointer rounded-full px-4 py-[7px]  text-xs font-medium ${selectedTags.has(tag.id) ? "bg-white text-black" : "bg-bg-3 text-text-sub"}`}
          onClick={() => handleTagClick(tag.id)}
        >
          {tag.name}
        </div>
      ))}
      {showTagInput ? (
        <div className="flex flex-col gap-1">
          <input
            type="text"
            className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent p-1 px-4 py-1.5 text-xs text-text-sub outline-none"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={cancelAddTag}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelAddTag();
              if (e.key === "Enter") handleAddTag();
            }}
            placeholder="New Tag"
            autoFocus
            disabled={isLoading}
          />
        </div>
      ) : (
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-bg-3 p-2  text-xl font-medium text-text-additional"
          onClick={() => setShowTagInput(true)}
        >
          +
        </div>
      )}
    </div>
  </>
);

export default VoiceDetails;
