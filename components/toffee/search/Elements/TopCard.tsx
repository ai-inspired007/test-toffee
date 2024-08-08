import { Character } from "@prisma/client";
import Image from "next/image";
import { TopOne } from "@/lib/types";
const TopCard = ({
  result,
}: {
  result: TopOne;
}) => {
  return (
    <div className="flex flex-col w-full gap-2 font-inter">
      <div className="my-2 text-[#777777] text-sm font-light">
        Top Result
      </div>
      {result.type === "Character" && result.character &&
      <div className="relative h-32 w-full rounded-2xl bg-neutral-800 p-3 pr-16 flex flex-row">
        <Image
          alt="ZeroTwo Profile"
          className="inline-flex aspect-auto items-center justify-center  rounded-xl"
          src={result.character.image || "/default.png"}
          width={91}
          height={104}
          sizes="100vw"
        />
        <div className=" flex flex-col pt-1.5 space-y-2 px-4 text-left">
          <div className="text-lg font-normal leading-normal text-white">
            {result.character.name}
          </div>
          <div className="flex w-full items-center justify-center lg:items-start pb-0.5 lg:justify-start">
            <div className="flex  items-center  justify-center gap-2 lg:justify-start ">
              <div className="text-xs font-light leading-4 text-[#b1b1b1]">
                VectorChat
              </div>
              <div className="h-1 w-1 ml-1 rounded-full bg-[#b1b1b1]"></div>
              <div className="flex items-center justify-center gap-1 lg:justify-start">
                <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                      fill="#B1B1B1"
                    />
                  </svg>
                </div>
                <div className="text-xs font-light leading-none text-[#b1b1b1]">
                  635.5k
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-normal leading-2 text-neutral-500 lg:px-0">
            {result.character.description}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default TopCard;