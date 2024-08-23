import { Character } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChatLine } from "../../icons/ChatLine";
import { formatNumber } from "@/lib/utils";
const TryCard = ({
  character,
  link
}: {
  character: Partial<Character & { _count: { messages: number } }>;
  link?: string;
}) => {
  return (
    <Link
      className="p-3 flex flex-row items-center gap-4 rounded-lg cursor-pointer bg-bg-3 min-w-80 w-80"
      href={link ? link : `/chat/${character.id}`}
    >
      <Image src={character.image || "/default.png"} width={0} height={0} sizes="100vw" alt="" className="rounded-lg object-cover sm:h-14 sm:w-14 w-8 h-8" />
      <div className="flex flex-col">
        <div className=" font-medium text-white truncate">
          {character.name}
        </div>
        <div className="inline-flex items-center justify-start gap-2 ">
          <div className=" text-xs font-normal leading-none text-zinc-400">
            Toffee
          </div>
          <div className="h-1 w-1 rounded-full bg-zinc-400"></div>
          <div className="flex items-center justify-start gap-1">
            <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5">
              <ChatLine className="text-[#B1B1B1]" />
            </div>
            <div className=" text-xs font-normal leading-none text-zinc-400">
              {character._count?.messages !== undefined && formatNumber(character._count.messages)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TryCard;