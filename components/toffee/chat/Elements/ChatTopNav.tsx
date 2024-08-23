"use client";
import { Character, Message } from "@prisma/client";
import {
  Settings,
  PanelRight
} from "lucide-react";
import { BotAvatar } from "../../BotAvatar";
import { useMediaQuery } from "react-responsive";
import { RiVoiceprintLine } from "../../icons/VoicePrint";
import { MdiInformationOutline } from "../../icons/InformationLine";
import { Flag2LineIcon } from "../../icons/Flag2LineIcon";
import { RiVolumeUpFill } from "../../icons/VolumeUpFill";
interface ChatHeaderProps {
  character: Character & {
    messages: Message[];
  };
  onClear: () => Promise<void>;
  userId: string;
  needsOverlay?: boolean;
  setRightOpen: () => void;
  openRecent: boolean,
  setRecentOpen: (openRecent: boolean) => void,
}

export const ChatTopNav = ({
  character,
  setRightOpen,
  openRecent,
  setRecentOpen,
}: ChatHeaderProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className="w-full px-6 py-3 flex justify-between border-b border-b-white/10">
      <div className="flex flex-row gap-2 items-center" onClick={() => setRecentOpen(true)}>
        <BotAvatar size={8} image={character.image} />
        <span className=" font-[500]">{character.name}</span>
        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full">Toffee</span>
      </div>
      <div className="flex flex-row gap-5 items-center">
        {isMobile ?
          <>
            <RiVoiceprintLine className="h-6 w-6 cursor-pointer text-icon-3" />
            <MdiInformationOutline className="h-6 w-6 cursor-pointer text-icon-3" onClick={setRightOpen} />
            <Settings className="h-6 w-6 cursor-pointer text-icon-3" />
          </> :
          <>
            <RiVolumeUpFill className="h-6 w-6 cursor-pointer text-icon-3" />
            <Flag2LineIcon className="h-6 w-6 cursor-pointer text-icon-3" />
            <Settings className="h-6 w-6 cursor-pointer text-icon-3" />
            <PanelRight className="h-6 w-6 cursor-pointer text-icon-3" onClick={setRightOpen} />
          </>}
      </div>
    </div>
  );
};
