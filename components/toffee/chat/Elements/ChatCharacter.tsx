"use client";

import { Character, Message } from "@prisma/client";
import { BotAvatar } from "./BotAvatar";
export const ChatHeader = ({
  character,
}: {
  character: Character & {
    messages: Message[];
  };
}) => {
  const MAX_LEN = 40;
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <BotAvatar size={28} image={character.image} />
      <div className="inline-flex h-20  flex-col items-center justify-start gap-1">
        <div className="mt-4  text-lg font-medium leading-normal text-neutral-200">
          {character.name}
        </div>
        <div className="text-center">
          <span className=" text-sm font-normal leading-snug text-neutral-500">
            By{" "}
          </span>
          <span className=" text-sm font-normal leading-snug text-zinc-400">
            VectorChat
          </span>
        </div>
        <div className="w-full text-center text-sm font-normal text-neutral-500">
          {character.description.length > MAX_LEN
            ? character.description.substring(0, MAX_LEN) + "..."
            : character.description}
        </div>
      </div>
      <div className="flex w-full flex-row items-start my-12 group max-w-[650px] flex-nowrap text-wrap break-words mr-auto">
        <BotAvatar size={8} image={character.image} />
        <div className="mx-2 flex flex-col gap-1.5">
          <div className="flex flex-row items-center  font-normal">
            <p className="text-xs">{character.name}</p>
            <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px]">
              Toffee
            </span>
          </div>
          <div className="max-w-fit flex-1 !whitespace-normal !text-wrap rounded-md px-3 py-2 text-[13px] bg-[#202020]" style={{borderRadius:"0px 10px 10px 10px"}}>
          {character.greeting}
          </div>
        </div>
      </div>
    </div>
  );
};
