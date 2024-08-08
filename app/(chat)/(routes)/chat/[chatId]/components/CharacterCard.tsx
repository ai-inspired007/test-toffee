import Image from "next/image";
import { Flag2LineIcon } from "./icons/flag-2-line";
import { StarLineIcon } from "./icons/star-line";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/utils";
import { SecondaryButtonWrapper } from "@/components/tulpa/chat/secondary-button-wrapper";
import { Share2FillIcon } from "./icons/share-2-fill";
import { ThumbUpLineIcon } from "./icons/thumb-up-line";
import { ThumbDownLineIcon } from "./icons/thumb-down-line";
import { UserSettingsLineIcon } from "./icons/user-settings-line";
import { RightSidebarSubtitle } from "@/components/tulpa/chat/right-sidebar-subtitle";
type RightSidebarTopSectionProps = {
  character: {
    img: string;
    name: string;
    desc: string;
  };
  numChats: number;
  creator: string;
  numLikes: number;
  //   knowledge packs
};

export function CharacterCard({
  character,
  numChats,
  creator,
  numLikes,
}: RightSidebarTopSectionProps) {
  return (
    <div className="relative flex-grow  w-full overflow-hidden rounded-lg bg-bg-2">
      {/* Gradient thing */}
      <div className="absolute inset-0 h-[20%]  w-full bg-gradient-to-b from-[#E590944D] to-bg-2 " />

      {/* top elft and right icons */}
      <StarLineIcon className="absolute left-4 top-4 h-6 w-6 cursor-pointer stroke-icon-3" />
      <Flag2LineIcon className="absolute right-4 top-4 m-0 h-6 w-6 cursor-pointer stroke-icon-3" />

      {/* main container */}
      <div className="absolute inset-0 z-10 flex h-full w-full flex-col space-y-4 p-4">
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

        <div className="">
          <div className="flex items-center  gap-4 self-stretch">
            <div className="flex items-center justify-center gap-2 rounded-3xl bg-neutral-800 p-3">
              {/* <div className="relative h-6 w-6" /> */}
              <UserSettingsLineIcon className="h-6 w-6" />
            </div>
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
              <div className=" text-sm font-medium  text-zinc-400">
                Add Knowledge Packs
              </div>
              <div className="w-[169px]  text-xs font-normal text-neutral-500">
                Personalize this character{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
