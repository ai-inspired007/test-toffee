import Image from "next/image";
import { Flag2LineIcon } from "../../icons/Flag2LineIcon";
import { StarLineIcon } from "../../icons/StarLineIcon";
import { Share2FillIcon } from "../../icons/Share2FillIcon";
import { ThumbUpLineIcon } from "../../icons/ThumbUpLineIcon";
import { ThumbDownLineIcon } from "../../icons/ThumbDownLineIcon";
import { UserSettingsLineIcon } from "../../icons/UserSettingsLineIcon";
import { RiHistoryFill } from "../../icons/HistoryFillIcon";
import { formatNumber } from "@/lib/utils";
import { SecondaryButtonWrapper } from "@/components/tulpa/chat/secondary-button-wrapper";
import { RightSidebarSubtitle } from "@/components/tulpa/chat/right-sidebar-subtitle";
import { Message } from "@prisma/client";
import { formatHistoryDate } from "./time-format";
import { useState } from "react";
type RightSidebarTopSectionProps = {
  character: {
    img: string;
    name: string;
    desc: string;
    messages: Message[]
  };
  numChats: number;
  creator: string;
  numLikes: number;
  openCandy: boolean;
  setCandyOpen: (openCandy: boolean) => void;
};

export function CharacterCard({
  character,
  numChats,
  creator,
  numLikes,
  openCandy,
  setCandyOpen
}: RightSidebarTopSectionProps) {
  const isMobileScreen = () => window.innerWidth <= 768;
  const [onHistory, setOnHistory] = useState(false);
  const cancelHistoryView = () => {
    setOnHistory(false);
  }
  return (
    <div className={`${isMobileScreen() ? "" : "rounded-lg"} relative flex-grow  w-full overflow-hidden  bg-bg-2`}>
      <div className="w-full bg-gradient-to-b from-[#E590944D] via-bg-2 to-bg-2 flex flex-col">

        <div className="p-4 w-full flex flex-row">
          <StarLineIcon className="h-6 w-6 cursor-pointer stroke-icon-3" />
          <Flag2LineIcon className="h-6 w-6 cursor-pointer stroke-icon-3 ml-auto" />
          {isMobileScreen() && <RiHistoryFill className="h-6 w-6 cursor-pointer text-icon-3 stroke-icon-3 ml-4" onClick={() => setOnHistory(!onHistory)} />}
        </div>

        {/* main container */}
        <div className="flex h-full w-full flex-col space-y-4 p-4">
          {/* Image + name */}
          <div className="flex w-full flex-col items-center space-y-2">
            <div className="overflow-hidden rounded-full">
              <Image
                src={character.img}
                alt={`An image of ${character.name}`}
                width={120}
                height={120}
              />
            </div>

            <span className="text-lg font-medium text-white">
              {character.name}
            </span>
            {/* Creator + Num chats */}
            <div className="flex w-full flex-row justify-center space-x-4">
              <RightSidebarSubtitle label="By" value={creator} />

              <div className="h-full w-[1px] bg-white bg-opacity-20" />

              <RightSidebarSubtitle
                label="Chats"
                value={formatNumber(numChats)}
              />
            </div>

            {/* Description */}
            <p className="text-center  text-sm font-normal  text-neutral-500">
              {character.desc}
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <SecondaryButtonWrapper className="">
              <div className="flex w-full flex-row items-center justify-center space-x-2">
                <Share2FillIcon className="h-6 w-6" />
                <span className="text-text-sub">Share</span>
              </div>
            </SecondaryButtonWrapper>

            <div className="flex w-full flex-row items-center space-x-2 overflow-hidden rounded-3xl bg-bg-3 px-3 py-2">
              <ThumbUpLineIcon className="h-5 w-5" />
              <span className="text-text-sub">{formatNumber(numLikes)}</span>
              <div className="h-full w-[1px] bg-white bg-opacity-20" />
              <ThumbDownLineIcon className="h-5 w-5" />
            </div>

            <div className="col-span-2">
              <SecondaryButtonWrapper>
                <div className="flex w-full justify-center">
                  <span className="text-text-sub">Start a new chat</span>
                </div>
              </SecondaryButtonWrapper>
            </div>
          </div>

          <div className="h-[1px] w-full bg-white bg-opacity-20" />

          <div className="flex items-center  gap-4 self-stretch cursor-pointer" onClick={()=>setCandyOpen(!openCandy)}>
            <div className="flex items-center justify-center gap-2 rounded-3xl bg-neutral-800 p-3">
              <UserSettingsLineIcon className="h-6 w-6" />
            </div>
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
              <div className=" text-sm font-medium  text-zinc-400">
                Customize candies
              </div>
              <div className="w-[169px]  text-xs font-normal text-neutral-500">
                Personalize this character{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Chat history for mobile */}
        {onHistory ? (
          <div className="z-20 fixed top-0 w-full h-screen bg-bg-2"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelHistoryView();
            }}
          >
            <div className="font-inter font-medium text-text-sub py-[18px] px-5">Chat history</div>
            <div className="flex flex-col px-5 mt-8">
              {character.messages.map((message, index) => (
                <div
                  key={index}
                  className="flex max-h-full cursor-pointer flex-col items-start gap-1 rounded-lg hover:bg-bg-3"
                >
                  <span className="text-xs  text-[#727272]">{formatHistoryDate(message.createdAt)}</span>
                  <span className="line-clamp-1  text-sm text-text-sub">
                    {message.content}
                  </span>
                  {index < character.messages.length && <div className="w-full bg-white/10 h-[1px] my-5" />}
                </div>
              ))}
            </div>
          </div>) : null}
      </div>
    </div>
  );
}
