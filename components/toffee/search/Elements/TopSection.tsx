"use client";
import { TCharacter } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { formatNumber } from "@/lib/utils";
import { RefreshLineIcon } from "../../icons/RefreshLineIcon";
import { ArrowLeftLineIcon } from "../../icons/ArrowLeftLineIcon";
import { ArrowRightLineIcon } from "../../icons/ArrowRightLineIcon";
const SearchTopSection = ({
  characterlist,
}: {
  characterlist: TCharacter[];
}) => {
  const [mi, setMI] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLg = useMediaQuery({ query: "(max-width: 1024px)" });
  const handleNext = () => {
    setMI((prev) => (prev + 1) % characterlist.length);
  };

  const handlePrev = () => {
    setMI((prev) => (prev - 1 + characterlist.length) % characterlist.length);
  };

  const getClass = (index: number) => {
    const position = (index - mi + characterlist.length) % characterlist.length;
    if (isMobile) {
      switch (position) {
        case 0:
          return "item-1";
        case 1:
          return "item-2";
        case 2:
          return "item-3";
        default:
          return "hidden";
      }
    } else if (isLg) {
      switch (position) {
        case 0:
          return "item-1";
        case 1:
          return "item-2";
        case 2:
          return "item-3";
        default:
          return "hidden";
      }
    } else {
      switch (position) {
        case 0:
          return "item-0";
        case 1:
          return "item-1";
        case 2:
          return "item-2";
        case 3:
          return "item-3";
        case 4:
          return "item-4";
        default:
          return "hidden";
      }
    }
  };
  const handleRefresh = () => {
    const randomIndex = Math.floor(Math.random() * characterlist.length);
    setMI(randomIndex);
  };
  return (
    <div className="bg-linear-indigo flex h-[352px] w-full flex-col">
      <div className="flex flex-row justify-between px-6 py-6">
        <div className="flex flex-row items-center gap-x-1 pt-1">
          <span className="text-xl font-semibold text-white">Recommended</span>
          {/* <StarIcon /> */}
          <span>✨</span>
        </div>
        <div className="w-full max-w-[120px]">
          <button
            type="button"
            className="inline-flex w-full cursor-pointer flex-row items-center justify-center gap-x-1 rounded-full bg-toffee-bg-3 px-4 py-1.5 text-sm font-medium leading-4.5  text-icon-3 transition duration-200 hover:bg-toffee-bg-additional "
            onClick={handleRefresh}
          >
            <RefreshLineIcon className="w- 6 h-6" />
            <span className="px-1 py-0.5 text-toffee-text-sub">Refresh</span>
          </button>
        </div>
      </div>
      <div className="mx-auto flex h-full w-full flex-row items-center justify-center gap-x-4 md:max-w-[1059px] md:px-6 md:pt-3">
        {!isMobile && (
          <div className="shrink-0">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-toffee-text-additional transition duration-200 hover:border-white/20 focus-visible:outline-none"
              onClick={handlePrev}
            >
              <ArrowLeftLineIcon className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="carousel select-none">
          {characterlist.map((character, index) => (
            <div
              className={`carousel-item relative h-[260px] w-[200px] overflow-hidden ${getClass(index)}`}
              key={index}
            >
              <div className="item-overlay"></div>
              <Image
                key={character.id}
                src={character.image}
                alt=""
                className="h-full w-full rounded-xl object-cover"
                width={200}
                height={260}
              />
              <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-start justify-end rounded-xl bg-gradient-to-t from-black/80 to-black/10 p-3">
                <span className="item-tag ietms-center mb-2 flex justify-center rounded-2xl border border-white/[0.06] bg-toffee-bg-3/75 px-3 py-1 text-center text-xs backdrop-blur-xl">
                  Fantasy
                </span>
                <span className="mb-1 font-medium text-white">
                  {character.name}
                </span>
                <div className="inline-flex items-center justify-start gap-x-2">
                  <div className="text-xs leading-none text-toffee-text-additional">
                    Toffee
                  </div>

                  <div className="h-1 w-1 rounded-full bg-zinc-400"></div>

                  <div className="flex items-center justify-center gap-1 lg:justify-start">
                    <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5 text-toffee-text-additional">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998V2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.3451 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.3451 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-toffee-text-additional">
                      {character._count?.messages !== undefined &&
                        formatNumber(character._count.messages)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!isMobile && (
          <div className="shrink-0">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-toffee-text-additional transition duration-200 hover:border-white/20 focus-visible:outline-none"
              onClick={handleNext}
            >
              <ArrowRightLineIcon className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTopSection;
