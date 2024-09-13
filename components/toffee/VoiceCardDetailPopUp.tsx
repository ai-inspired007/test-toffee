import React, { useState, useEffect, useRef } from 'react';
import { Voice } from '@prisma/client';
import { MdiInformationOutline } from './icons/InformationLine';
import { CloseFill } from './icons/CloseFill';
import { RiVoiceprintLine } from './icons/VoicePrint';
import { RiPlayFill } from './icons/PlayFill';
import { SecondaryButtonWrapper } from "@/components/toffee/chat/Elements/SecondaryButtonWrapper";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import StepButton from "../toffee/create/Elements/Character/StepButton";
import { Character } from '@prisma/client';
import { VoiceCharacterCard } from './VoiceCharacterCard';
import { None } from 'framer-motion';

interface VoiceCardDetailPopUpProps {
  voice: Partial<Voice>;
  originColor: string;
  characters: Partial<Character & { _count: { messages: number } }>[];
  onClose: () => void;
}

const VoiceCardDetailPopUp: React.FC<VoiceCardDetailPopUpProps> = ({ voice, originColor, onClose, characters }) => {

  type ItemType = {
    id: string;
    name: string;
  };

  const [isPlaying, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [filteredPage, setFilteredPage] = useState(0);
  const [connectedPage, setConnectedPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [isDebounce, setIsDebounce] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Partial<string[]>>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>();
  const [filteredVoiceList, setFilteredVoiceList] = useState<Partial<Character & { _count: { messages: number } }>[]>([]);

  const arr: ItemType[] = [
    { id: "1", name: "JJK" },
    { id: "2", name: "ReZero" },
    { id: "3", name: "AOT" },
    { id: "4", name: "STF" },
    { id: "5", name: "Death Note" },
  ];

  const isAllSelected = selectedItemIds.length === arr.length;

  const categoryTags = ["JJK", "ReZero", "AOT", "STF", "Death Note"];

  // Initialize audio  
  useEffect(() => {
    audioRef.current = new Audio(voice.preview_url || ""); // Set the audio source.  

    // Handle the end of the audio playback   
    const handleEnded = () => setPlaying(false);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current?.pause(); // Cleanup on unmount  
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current = null; // Reset the ref  
    };
  }, [voice.preview_url]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => console.error("Audio play failed: ", error));
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset to start if needed on pause  
      }
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setPlaying((prev) => !prev); // Toggle play state  
  };

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

  useEffect(() => {
    const delayTimeoutId = setTimeout(() => {
      if (selectedItemIds?.length) {
        setFilteredVoiceList(
          characters?.filter(
            (character) =>
              selectedItemIds?.includes(character.id) &&
              character?.name?.includes(searchInput),
          ),
        );
      } else {
        setFilteredVoiceList(
          characters?.filter((character) => character?.name?.includes(searchInput)),
        );
      }
    }, 1500);
    return () => clearTimeout(delayTimeoutId);
  }, [selectedItemIds, searchInput, characters]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    togglePlayPause();
  };

  // Create the background gradient style using the originColor prop  
  const backgroundStyle = {
    background: `linear-gradient(to bottom, ${originColor}32 0%, ${originColor}15 50% ,#12121200 100%)`,
  };
  return (
    <div className="rounded-lg relative py-4 px-6 w-full sm:w-[480px] bg-bg-2" >
      <div style={isPlaying ? backgroundStyle : {}} className='absolute top-0 left-0 w-full h-1/4 z-0' />
      <div className="flex justify-between items-center z-10 relative">
        <div className='flex items-center gap-2'>
          <div className="text-white text-main font-inter text-[16px] font-medium leading-5 custom-font-settings">Voice Details</div>
          <MdiInformationOutline className='text-[#787878]' />
        </div>
        <button onClick={onClose} className="text-[#787878] hover:text-gray-900 transition-colors duration-200">
          <CloseFill className="w-6 h-6" />
        </button>
      </div>
      <div className="flex w-full h-[calc(100vh-120px)] sm:h-[730px] flex-col items-center z-10 relative">
        {/* Image + name */}
        <div className="flex w-full flex-col items-center">
          <div className="overflow-hidden rounded-full">
            <div onClick={handleClick} className="cursor-pointer">
              <div className="rounded-full p-2 w-20 h-20 flex items-center justify-center" style={{ backgroundColor: originColor }}>
                {isPlaying ? <RiVoiceprintLine className='w-6 h-6' /> : <RiPlayFill className='w-6 h-6' />}
              </div>
            </div>
          </div>

          <span className="font-medium text-white mt-6">
            {voice.name}
          </span>

          <span className="font-medium text-[#787878] mt-1 font-inter text-xs">
            {voice.description}
          </span>

        </div>
        <div className='w-fit mt-5'>
          <button className="bg-bg-3 rounded-full px-4 py-1.5">
            <span className="text-text-sub px-1 py-[3px] text-sm font-medium font-inter">Save Voice</span>
          </button>
        </div>
        <div className='mt-8'>
          <span className="font-medium text-[#787878] font-inter text-xs">
            Try this voice with these characters
          </span>
        </div>
        <div className="flex flex-col w-full mt-4 h-full overflow-hidden">
          {/* Search Box */}
          <div className="flex items-center justify-between">
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

          <div className="flex flex-row flex-wrap gap-1.5 mt-6">
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

          <div className='mt-6 h-full overflow-hidden'>
            <VoiceCharacterCard characters={filteredVoiceList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCardDetailPopUp;