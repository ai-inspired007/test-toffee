import { Character } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChatLine } from "../../icons/ChatLine";
import { formatNumber } from "@/lib/utils";
const FeaturedCard = ({
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
      <Image src={character.image || "/default.png"} width={0} height={0} sizes="100vw" alt="" className="rounded-lg object-cover sm:h-24 sm:w-24 w-8 h-8" />
      <div className="flex flex-col gap-1">
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
        <div className=" text-xs text-text-additional">
          {character?.description && character.description.length > 40
            ? `${character.description.slice(0, 40)}...`
            : character.description}
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;