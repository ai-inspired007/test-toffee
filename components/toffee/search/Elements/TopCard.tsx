import CandyCard from "../../CandyCard";
import Image from "next/image";
import { TopOne } from "@/lib/types";
const TopCard = ({ result }: { result: TopOne }) => {
  return (
    <div>
      <div className="mb-4 text-sm leading-4.5 text-toffee-text-tertiary">
        Top Result
      </div>
      {result.type === "Character" && result.character && (
        <div className="relative flex w-full flex-row items-center gap-x-4 rounded-2xl bg-toffee-bg-3 p-3 ring-1 ring-inset ring-white/[0.06] transition duration-200 hover:bg-toffee-bg-additional">
          <Image
            alt="ZeroTwo Profile"
            className="h-[104px] w-[91px] rounded-xl object-cover object-center"
            src={result.character.image || "/default.png"}
            width={91}
            height={104}
            sizes="100vw"
          />
          <div className="flex flex-col space-y-2 text-left">
            <div className="text-lg font-medium leading-6 tracking-[-0.18px] text-white">
              {result.character.name}
            </div>
            <div className="flex w-full items-center justify-center pb-0.5 lg:items-start lg:justify-start">
              <div className="flex items-center  justify-center gap-2 lg:justify-start ">
                <div className="stroke-slate-50 text-xs text-toffee-text-additional">
                  VectorChat
                </div>
                <div className="ml-1 h-1 w-1 rounded-full bg-toffee-text-additional"></div>
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
                    635.5k
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full max-w-56 text-xs text-toffee-text-tertiary">
              {result.character.description}
            </div>
          </div>
        </div>
      )}
      {result.type === "KnowledgePack" && result.candy && (
        <div>
          <CandyCard candy={result.candy} />
        </div>
      )}
      {result.type === "Tag" && result.tag && (
        <div className="relative flex w-full flex-row items-center gap-x-4 rounded-2xl bg-toffee-bg-3 p-3 ring-1 ring-inset ring-white/[0.06] transition duration-200 hover:bg-toffee-bg-additional">
          <div className="bg-toffee-yellow-lighter flex h-[104px] w-[91px] shrink-0 items-center justify-center rounded-xl">
            <span className="text-[32px] font-semibold leading-[40px] tracking-[0.16px] text-black">
              {result.tag.name.slice(0, 1)}
            </span>
          </div>
          <div className="flex flex-col space-y-1 text-left">
            <div className="flex items-center gap-x-4">
              <div className="text-lg font-medium uppercase leading-6 tracking-[-0.18px] text-white">
                {result.tag.name}
              </div>
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
                  635.5k
                </span>
              </div>
            </div>
            <div className="w-full max-w-56 text-xs leading-[22px] text-toffee-text-tertiary">
              {
                "Take a look on available add-ons and connect it to your character"
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCard;
