import React, { Dispatch, useEffect, useState } from "react";
import Modal from "../../Modal";
import { X } from "lucide-react";
import Image from "next/image";
import { Search } from "lucide-react";
import { RiPlayFill } from "../../icons/PlayFill";
import { RiVoiceprintLine } from "../../icons/VoicePrint";
import { VoiceType } from "@/app/(create)/create/voice/page";

const VoiceLibraryModal = ({
  isModal,
  toggle,
  originalVoice,
  setVoice,
}: {
  isModal: boolean;
  toggle: Function;
  originalVoice: VoiceType | undefined;
  setVoice: Dispatch<React.SetStateAction<VoiceType | undefined>>;
}) => {
  type ItemType = {
    id: number;
    name: string;
  };

  const [searchInput, setSearchInput] = useState("");
  const [filteredPage, setFilteredPage] = useState(0);
  const [connectedPage, setConnectedPage] = useState(0);
  const [isDebounce, setIsDebounce] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number>();
  const [filteredVoiceList, setFilteredVoiceList] = useState<VoiceType[]>([]);

  const arr: ItemType[] = [
    { id: 1, name: "JJK" },
    { id: 2, name: "ReZero" },
    { id: 3, name: "AOT" },
    { id: 4, name: "STF" },
    { id: 5, name: "Death Note" },
  ];

  const voiceList: VoiceType[] = [...Array(16)]?.map((_, index) => ({
    name: "Zero Two",
    voiceId: index,
    description: "I'm Zero Two from Darling in the Franxx",
    itemTypeId: (index % 5) + 1,
  }));

  const toggleSelectItem = (id: number) => {
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

  const isAllSelected = selectedItemIds.length === arr.length;

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
  }, [selectedItemIds, searchInput]);

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
      <div className="relative flex h-[696px] w-[480px] flex-col justify-start rounded-xl bg-bg-2">
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
          {filteredVoiceList?.map((voice) => (
            <div
              key={voice?.voiceId}
              className="broder relative flex cursor-pointer items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6"
              onClick={() => setSelectedVoiceId(voice?.voiceId)}
            >
              <div className="flex gap-5">
                {voice?.voiceId === 0 ? (
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#F7604C]`}
                  >
                    <RiVoiceprintLine className="h-6 w-6" />
                  </div>
                ) : voice?.voiceId % 3 === 0 ? (
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#6E3FF3]`}
                  >
                    <RiPlayFill className="h-6 w-6" />
                  </div>
                ) : voice?.voiceId % 3 === 1 ? (
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#BCB8C5]`}
                  >
                    <RiPlayFill className="h-6 w-6" />
                  </div>
                ) : (
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#CDF74C]`}
                  >
                    <RiPlayFill className="h-6 w-6" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className=" text-[16px] font-medium leading-5 text-white">
                    {voice.name}
                  </span>
                  <span className=" text-xs font-normal text-[#787878]">
                    {voice.description}
                  </span>
                </div>
              </div>
              {/* Custom Radio */}
              <input
                type="radio"
                name="radio"
                className="custom-radio"
                checked={selectedVoiceId === voice?.voiceId}
              />
            </div>
          ))}
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
