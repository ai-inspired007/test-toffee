import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Voice } from '@prisma/client';
import { MdiInformationOutline } from '../../../icons/InformationLine'
import { CloseFill } from '../../../icons/CloseFill';
import { RiVoiceprintLine } from '../../../icons/VoicePrint';
import { RiPlayFill } from '../../../icons/PlayFill';
import { SecondaryButtonWrapper } from "@/components/toffee/chat/Elements/SecondaryButtonWrapper";
import { Search, Trash2 } from "lucide-react";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import StepButton from "../Character/StepButton";
import { Character } from '@prisma/client';
import { None } from 'framer-motion';
import Image from "next/image";
import { TKnowledgePack } from '@/lib/types';

interface ConnectedCandiesProps {
  addons: TKnowledgePack[];
  selectedAddons: TKnowledgePack[];
  onClose: () => void;
  setSelectedAddons: (selectedAddons: TKnowledgePack[]) => void;
  onRemoveAddon: (addonId: string) => void;
}

const ConnectedCandies: React.FC<ConnectedCandiesProps> = ({ addons, selectedAddons, onClose, setSelectedAddons, onRemoveAddon }) => {

  type ItemType = {
    id: string;
    name: string;
  };
  const [selectedItemIds, setSelectedItemIds] = useState<Partial<string[]>>([]);


  const [searchInput, setSearchInput] = useState("");
  const [filteredAddons, setFilteredAddons] = useState<TKnowledgePack[]>([]);

  useEffect(() => {
    const filtered = addons.filter(addon =>
      addon.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      (addon.description && addon.description.toLowerCase().includes(searchInput.toLowerCase()))
    );
    setFilteredAddons(filtered);
  }, [addons, searchInput]);

  const arr: ItemType[] = [
    { id: "1", name: "JJK" },
    { id: "2", name: "ReZero" },
    { id: "3", name: "AOT" },
    { id: "4", name: "STF" },
    { id: "5", name: "Death Note" },
  ];

  const isAllSelected = selectedItemIds.length === arr.length;

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

  const handleConnectAddon = (addon: TKnowledgePack) => {
    setSelectedAddons([...selectedAddons, addon]);
  };

  return (
    <div className="rounded-lg relative py-4 px-6 w-[480px] bg-bg-2" >
      <div className='absolute top-0 left-0 w-full h-1/4 z-0' />
      <div className="flex justify-between items-center z-10 relative">
        <div className='flex items-center gap-2'>
          <div className="text-white text-main font-inter text-[16px] font-medium leading-5 custom-font-settings">Connected candies</div>
          <MdiInformationOutline className='text-[#787878]' />
        </div>
        <button className="text-[#787878] hover:text-gray-900 transition-colors duration-200" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>
          <CloseFill className="w-6 h-6" />
        </button>
      </div>
      <div className="flex w-full h-[730px] flex-col items-center z-10 relative">
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
                }}
                placeholder="Search for conversation"
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

          <div className="flex w-full flex-wrap mt-4 overflow-y-auto no-scrollbar h-full">
            {filteredAddons.map((addon) => (
              <div key={addon.id} className="relative h-16 w-full mt-2">
                <div className="absolute z-10 flex h-full w-full flex-row px-4 py-3">
                  <div className="flex w-full flex-col justify-between gap-1">
                    <span className="text-sm font-medium text-white">
                      {addon.name}
                    </span>
                    <div className="flex flex-row items-center gap-1 text-xs text-text-additional">
                      <GitFork2 /> {/* Assuming GitFork2 component is as it is in provided snippet */}
                      <span className="text-xs">635.5k</span>
                    </div>
                  </div>
                  <button
                    className="mt-auto w-fit rounded-full bg-[#2F2F2F] p-1.5 text-sm font-medium text-text-tertiary"
                    onClick={() => onRemoveAddon(addon.id)}
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
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default ConnectedCandies;