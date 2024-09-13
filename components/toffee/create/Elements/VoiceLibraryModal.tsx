import React, { Dispatch, useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import { X } from "lucide-react";
import Image from "next/image";
import { Search } from "lucide-react";
import { VoiceType } from "@/app/(create)/create/voice/page";
import CustomAudioPlayer from "./CustomAudioPlayer";

const VoiceLibraryModal = ({
  voices,
  loadingVoices,
  isModal,
  toggle,
  originalVoice,
  setVoice,
}: {
  voices: any[];
  loadingVoices: boolean;
  isModal: boolean;
  toggle: Function;
  originalVoice: VoiceType | undefined;
  setVoice: Dispatch<React.SetStateAction<VoiceType | undefined>>;
}) => {
  type ItemType = {
    id: string;
    name: string;
  };

  const [voiceList, setVoiceList] = useState<VoiceType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPage, setFilteredPage] = useState(0);
  const [connectedPage, setConnectedPage] = useState(0);
  const [isDebounce, setIsDebounce] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>();
  const [filteredVoiceList, setFilteredVoiceList] = useState<VoiceType[]>([]);

  const arr: ItemType[] = [
    { id: "1", name: "JJK" },
    { id: "2", name: "ReZero" },
    { id: "3", name: "AOT" },
    { id: "4", name: "STF" },
    { id: "5", name: "Death Note" },
  ];

  const toggleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === arr.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(arr.map((item) => item.id));
    }
  };

  const handleSaveChange = () => {
    setVoice(voiceList?.find((voice) => voice?.voiceId === selectedVoiceId));
    toggle();
  };

  const handleSelectAudio = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const isAllSelected = selectedItemIds.length === arr.length;

  useEffect(() => {
    setVoiceList(
      voices?.map((voice, index) => ({
        name: voice.name,
        voiceId: voice.voice_id,
        description: voice.description || "",
        itemTypeId: `${(index % 5) + 1}`,
        audioUrl: voice.preview_url || "",
      })),
    );
  }, [voices]);

  useEffect(() => {
    const delayTimeoutId = setTimeout(() => {
      if (selectedItemIds?.length) {
        setFilteredVoiceList(
          voiceList?.filter(
            (voice) =>
              selectedItemIds?.includes(voice?.itemTypeId) &&
              voice?.name?.includes(searchInput),
          ),
        );
      } else {
        setFilteredVoiceList(
          voiceList?.filter((voice) => voice?.name?.includes(searchInput)),
        );
      }
    }, 1500);
    return () => clearTimeout(delayTimeoutId);
  }, [selectedItemIds, searchInput, voiceList]);

  useEffect(() => {
    if (isModal) {
      setSelectedVoiceId(originalVoice?.voiceId);
    }
  }, [isModal, originalVoice]);

  return (
    <Modal
      isOpen={isModal}
      onClose={() => toggle()}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="relative flex h-[calc(100vh-120px)] sm:h-[696px] w-full sm:w-[480px] flex-col justify-start rounded-xl bg-bg-2">
        {/* Header */}
        <div className="mx-[24px] mb-[8px] mt-[16px] flex items-center justify-between">
          <span className="font-medium text-white">Voice library</span>
          <X
            className="ml-auto h-6 w-6 cursor-pointer text-[#777777]"
            onClick={() => toggle()}
          />
        </div>

        {/* Search Box */}
        <div className="mx-[24px] mt-[24px] flex items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute ml-2 h-full w-6 text-[#777777]" />
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent py-2 pl-10 pr-4 text-[13px] text-text-sub outline-none placeholder:text-text-tertiary"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setFilteredPage(0);
                setConnectedPage(0);
                setIsDebounce(true);
              }}
              placeholder="Search for the conversation"
            />
          </div>
        </div>

        {/* Tab line example */}
        <div className="mx-[24px] mt-[16px]">
          <div className="flex flex-row flex-wrap gap-1.5">
            <div
              className={`cursor-pointer rounded-lg border border-white/10 px-3 py-[5px]  text-sm font-medium ${isAllSelected ? "bg-white text-black" : "text-[#b1b1b1]"}`}
              onClick={handleSelectAll}
            >
              All
            </div>
            {arr.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer rounded-lg border border-white/10 px-3 py-[5px]  text-sm font-medium ${isSelected ? "bg-white text-black" : "text-[#b1b1b1]"}`}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="no-scrollbar mt-[16px] flex h-[432px] w-full flex-col gap-2 overflow-y-auto px-6">
          {loadingVoices ? (
            <div className="flex h-full items-center justify-center">
              <Image
                src="/loading.svg"
                width={0}
                height={0}
                alt="rule"
                className="h-[100px] w-[100px]"
              />
            </div>
          ) : (
            filteredVoiceList?.map((voice, index) => (
              <div
                key={voice?.voiceId}
                className="broder relative flex w-full  items-center justify-start gap-5 rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6"
              >
                <CustomAudioPlayer voice={voice} index={index} />
                <div
                  className="flex h-full w-full cursor-pointer items-center justify-between"
                  onClick={() => handleSelectAudio(voice?.voiceId)}
                >
                  <div className="flex flex-col gap-1">
                    <span className=" text-[16px] font-medium leading-5 text-white">
                      {voice.name}
                    </span>
                    <span className=" text-xs font-normal text-[#787878]">
                      {voice.description || "No description"}
                    </span>
                  </div>
                  {/* Custom Radio */}
                  <input
                    type="radio"
                    name="radio"
                    className="custom-radio"
                    checked={selectedVoiceId === voice?.voiceId}
                    readOnly
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-[28px] flex w-full px-6">
          <button
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px]  text-sm font-medium leading-[18px] text-white disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            disabled={selectedVoiceId === undefined}
            onClick={handleSaveChange}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VoiceLibraryModal;
