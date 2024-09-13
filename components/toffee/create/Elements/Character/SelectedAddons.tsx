import React from 'react';
import Image from 'next/image';
import { Trash2 } from "lucide-react";
import { TKnowledgePack } from "@/lib/types";
import { GitFork2 } from "@/components/toffee/icons/Fork";

interface SelectedAddonsProps {
  addons: TKnowledgePack[];
  onRemoveAddon: (addonId: string) => void;
}

const SelectedAddons: React.FC<SelectedAddonsProps> = ({ addons, onRemoveAddon }) => {
  return (
    <div className="flex flex-col gap-2">
      {addons.map(addon => (
        <div key={addon.id} className="relative h-16 w-full">
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
  );
};

export default SelectedAddons;