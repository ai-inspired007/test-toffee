import { DropdownWrapper } from "./dropdown-wrapper";
import { GitFork2 } from "@/components/toffee/icons/Fork";
import Image from "next/image";
import { useChatPage } from "@/contexts/ChatPageProvider";

type CandiesCardProps = {
  candies: {
    id: string;
    name: string;
    img: string;
    desc: string;
  }[];
};

export function CandiesCard() {
  const {
    connectedCandies
  } = useChatPage();
  return (
    <DropdownWrapper label="Applied candies" height="22%">
      <div className="mb-4 flex flex-col gap-2">
        {connectedCandies.map((candy, index) => {
          return (
            <div key={candy.id} className="relative h-16 w-full">
              <div className="absolute z-10 flex h-full w-full flex-row px-4 py-3">
                <div className="flex w-full flex-col justify-between gap-1">
                  <span className=" text-sm font-medium text-white">
                    {candy.name}
                  </span>
                  <div className="flex flex-row items-center gap-1 text-xs text-text-additional">
                    <span className="text-xs">Ayush</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-400" />
                    <GitFork2 />
                    <span className="text-xs">635.5k</span>
                  </div>
                </div>
              </div>
              <div className="relative h-full w-full overflow-hidden">
                <div className="absolute z-[1] inline-flex h-full w-full rounded-[14px] border border-white/10 bg-gradient-to-l from-transparent via-[#202020dc] to-[#202020]" />
                {candy.image && (
                  <Image
                    className="h-full w-full rounded-2xl object-cover object-center"
                    src={candy.image}
                    alt="Addon Image"
                    fill
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DropdownWrapper>
  );
}
