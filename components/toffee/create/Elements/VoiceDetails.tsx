import SelectSharing, { SharingProps } from "./SelectSharing";
import { RiGlobalLine } from "../../icons/GlobalLine";
import { RiLockLine } from "../../icons/Lock";
import { RiDraftLine } from "../../icons/Files";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import Tooltip from "../../../ui/tooltip";
import { MdiInformationOutline } from "../../icons/InformationLine";
import SelectPharse, { PharseProps } from "./SelectPharse";
import { Tag } from "@prisma/client";
import VoiceCreatedModal from "./VoiceCreatedModal";
import { VoiceType } from "@/app/(create)/create/voice/page";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/Spinner";
import { RiCloseCircleLine } from 'react-icons/ri';

const VoiceDetails = ({
  voice,
  setStep,
}: {
  voice: VoiceType | undefined;
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
  const [description, setVoiceDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "1",
      name: "Personal",
      categoryId: "",
      type: "Voice"
    },
  ]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isVoiceCreated, setIsVoiceCreated] = useState<boolean>(false);
  const [isEditingVoice, setIsEditingVoice] = useState<boolean>(false);

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

  const validationCheck = () => {
    // Name
    if (name?.length === 0) {
      toast.error(`Please add name to generate voice.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    if (name?.length < 4) {
      toast.error(`Name length must be at least 4 characters.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    // Description
    if (description?.length === 0) {
      toast.error(`Please add description to generate voice.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    if (description?.length < 10) {
      toast.error(`Description length must be at least 10 characters.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validationCheck()) {
      setIsEditingVoice(true);
      const payload = {
        name,
        description,
        pharse: selectedPharseOption,
        sharing: selectedSharingOption,
        tags: selectedTags,
      };
      console.log("payload", payload);

      if (voice?.voiceId) {
        fetch(`/api/voice/${voice.voiceId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data: any) => {
            console.log("data", data);
            setIsVoiceCreated(true);
          })
          .catch((error: any) => {
            console.log(error);
            toast.error(`Error in updating voice: ${error}`, {
              theme: "colored",
              hideProgressBar: true,
              autoClose: 1500,
            });
          })
          .finally(() => {
            setIsEditingVoice(false);
          });
      }
    }
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col items-start">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <span className="text-[20px] mt-6 sm:text-[32px] font-semibold leading-10 text-white">
            Your voice
          </span>
          <span className="text-[13px] sm:text-sm font-inter font-normal leading-5 sm:leading-[22px] text-text-tertiary">
            Supported formats PNG and JPG, recommended size 260x300. 400KB max
          </span>
        </div>

        <div className="flex w-full cursor-pointer flex-col gap-2">
          <div className="border relative flex items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6">
            <div className="flex gap-5">
              <CustomAudioPlayer voice={voice} index={0} />
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-medium leading-5 text-white">
                  {voice?.name || "Voice"}
                </span>
                <span className="text-xs font-normal text-[#787878]">
                  {voice?.description || "This is new-generated voice."}
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
          <div className="flex items-center text-xs font-semibold text-text-tertiary">
            <span className="me-2 text-xs font-semibold text-text-tertiary">
              {"Voice Description"}
            </span>
            <MdiInformationOutline />
          </div>
          <div className="flex w-full flex-col justify-between gap-0 rounded-[7px] border border-[#202020]">
            <div className="relative">
              <textarea
                name="prompt"
                className="w-full resize-none overflow-hidden border-none bg-transparent px-4 pb-2 pt-3 text-[13px] text-text-sub outline-none"
                id="voice_detail_description"
                value={description}
                onChange={(e) => setVoiceDescription(e.target.value)}
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
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px] text-[14px] font-medium leading-[18px] text-white"
            onClick={() => handleContinue()}
            disabled={isEditingVoice}
          >
            Continue
          </button>
        </div>
      </div>
      {isEditingVoice && <Spinner />}
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
            className={`flex items-center gap-2 cursor-pointer rounded-full px-4 py-[7px]  text-xs font-medium ${selectedTags.has(tag.id) ? "bg-white text-black" : "bg-bg-3 text-text-sub"}`}
            onClick={() => handleTagClick(tag.id)}
          >
            <span>{tag.name}</span>
            <RiCloseCircleLine className={`text-xs font-medium`} />
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
