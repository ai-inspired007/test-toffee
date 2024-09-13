"use client";

import { Character, Message } from "@prisma/client";

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
      <img
        className="h-28 w-28 rounded-full object-cover"
        src={character.image}
        alt={character.name + " Image"}
      />
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
    </div>
  );
};
