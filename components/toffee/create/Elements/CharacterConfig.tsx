"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { WandDropDown } from "./WandDropDown";
export const CharacterConfig = ({
  name,
  description,
  imageData,
  greeting,
  setGreeting,
  instructions,
  setInstructions,
  seed,
  setSeed,
  advanceFunction,
  previousFunction,
}: {
  name: string;
  description: string;
  imageData: string | null;
  greeting: string;
  setGreeting: (newGreeting: string) => void;
  instructions: string;
  setInstructions: (newInstructions: string) => void;
  seed: string;
  setSeed: (newSeed: string) => void;
  advanceFunction: () => void;
  previousFunction: () => void;
}) => {
  const { data: session } = useSession();
  let user = session?.user;
  const [collapse, setCollapse] = useState(true)
  return (
    <div className="flex flex-row mt-[100px] w-full max-w-[1024px]">
      <div className="flex flex-col items-start">
        <h1 className="text-white font-inter font-bold text-[32px]">
          {"Now let’s configure your bot"}
        </h1>
        <p className="text-text-tertiary font-inter text-sm">
          Fill in your character information here!
        </p>
        <div className="flex flex-col w-[456px] mt-8 gap-7">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Greeting"}</span>
            <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between">
              <div className="relative">
                <textarea name="prompt" className="w-full text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden" id="" value={greeting} onChange={(e) => setGreeting(e.target.value)}></textarea>
                <WandDropDown input={greeting} setInput={setGreeting} setImageData={() => { }} isImage={false} isTextarea={true} />
              </div>
              <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">{"How should your AI start the conversation? (Optional)"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Instructions"}</span>
            <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between">
              <div className="relative">
                <textarea name="prompt" className="w-full text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden" id="" value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
                <WandDropDown input={instructions} setInput={setInstructions} setImageData={() => { }} isImage={false} isTextarea={true} />
              </div>
              <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">{"Describe your AI character."}</span>
            </div>
            {instructions.length < 200 ? (
              <span className="pl-0.5 text-xs text-muted-foreground">
                Enter at least {200 - instructions.length} more characters.
              </span>
            ) : instructions.length > 20000 ? (
              <span className="pl-0.5 text-xs text-red-500">
                Please delete {instructions.length - 2e4} characters.
              </span>
            ) : (
              <span className="pl-0.5 text-xs text-muted-foreground">
                {20000 - instructions.length} characters left.
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Example Conversation"}</span>
            <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between">
              <div className="relative">
                <textarea name="prompt" className="w-full text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden" id="" value={seed} onChange={(e) => setSeed(e.target.value)}></textarea>
                <WandDropDown input={seed} setInput={setSeed} setImageData={() => { }} isImage={false} isTextarea={true} />
              </div>
              <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">{"How should your AI start the conversation? (Optional)"}</span>
            </div>
            {seed.length < 200 ? (
              <span className="pl-0.5 text-xs text-muted-foreground">
                Enter at least {200 - seed.length} more characters.
              </span>
            ) : seed.length > 20000 ? (
              <span className="pl-0.5 text-xs text-red-500">
                Please delete {seed.length - 2e4} characters.
              </span>
            ) : (
              <span className="pl-0.5 text-xs text-muted-foreground">
                {20000 - seed.length} characters left.
              </span>
            )}
          </div>
          <div className="flex flex-col border border-[#202020] rounded-[7px] px-4 py-3">
            <div className="flex flex-row gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.25 5.25V7.5H5.25V9H8.25V11.25H9.75V5.25H8.25ZM11.25 9H18.75V7.5H11.25V9ZM15.75 12.75V15H18.75V16.5H15.75V18.75H14.25V12.75H15.75ZM12.75 16.5H5.25V15H12.75V16.5Z" fill="#B1B1B1" />
              </svg>
              <span className="text-text-sub font-inter text-[13px] leading-5">Advanced configurations</span>
              <div className="ml-auto" onClick={() => setCollapse(!collapse)} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`w-6 h-6 ${!collapse ? '' : 'transform rotate-180'}`}>
                  <path d="M12.0001 10.9451L7.54506 15.4001L6.27246 14.1275L12.0001 8.3999L17.7277 14.1275L16.4551 15.4001L12.0001 10.9451Z" fill="#B1B1B1" />
                </svg>
              </div>
            </div>
            <div className={`flex flex-col gap-[17px] overflow-hidden transition-max-height duration-300 ${collapse ? 'max-h-0' : 'max-h-screen'}`}>
              <div className="flex flex-col gap-1 pt-4">
                <span className="text-xs font-semibold text-text-tertiary">{"System prompt"}</span>
                <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between max-w-[456px]">
                  <div className="relative">
                    <textarea name="prompt" className="w-full text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden" id="" value={seed} onChange={(e) => setSeed(e.target.value)}></textarea>
                    <WandDropDown input={seed} setInput={setSeed} setImageData={() => { }} isImage={false} isTextarea={true} />
                  </div>
                  <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">{"System prompt"}</span>
                </div>
                {seed.length < 200 ? (
                  <span className="pl-0.5 text-xs text-muted-foreground">
                    Enter at least {200 - seed.length} more characters.
                  </span>
                ) : seed.length > 20000 ? (
                  <span className="pl-0.5 text-xs text-red-500">
                    Please delete {seed.length - 2e4} characters.
                  </span>
                ) : (
                  <span className="pl-0.5 text-xs text-muted-foreground">
                    {20000 - seed.length} characters left.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-tertiary">{"System prompt"}</span>
                <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between max-w-[456px]">
                  <div className="relative">
                    <textarea name="prompt" className="w-full text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden" id="" value={seed} onChange={(e) => setSeed(e.target.value)}></textarea>
                    <WandDropDown input={seed} setInput={setSeed} setImageData={() => { }} isImage={false} isTextarea={true} />
                  </div>
                  <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">{"System prompt"}</span>
                </div>
                {seed.length < 200 ? (
                  <span className="pl-0.5 text-xs text-muted-foreground">
                    Enter at least {200 - seed.length} more characters.
                  </span>
                ) : seed.length > 20000 ? (
                  <span className="pl-0.5 text-xs text-red-500">
                    Please delete {seed.length - 2e4} characters.
                  </span>
                ) : (
                  <span className="pl-0.5 text-xs text-muted-foreground">
                    {20000 - seed.length} characters left.
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-8">
            <div className="w-[220px] bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={previousFunction}>
              {"Previous step"}
            </div>
            <div className="w-[220px] bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={advanceFunction}>
              {"Continue"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-auto">
        <div className="px-6 w-full">
          <div className="text-white font-inter text-xs bg-bg-3 w-full text-center py-2 rounded-t-2xl">Bot preview</div>
        </div>
        <div className="relative">
          <div className="absolute bottom-4 z-10 max-w-72 overflow-hidden text-ellipsis pl-4 text-white ">
            <h1 className="mb-1 text-lg tracking-tight text-white font-medium">
              {name || "Enter character name..."}
            </h1>
            <p className="mb-2 max-w-32 overflow-hidden text-ellipsis text-text-additional">
              {user?.name || user?.id}
            </p>
            <p className="mt-2 w-full max-w-full text-wrap text-sm text-[#B9B9B9]">
              {description.slice(0, Math.min(description.length, 80)) +
                (description.length > 80 ? "…" : "") ||
                "Enter character description..."}
            </p>
          </div>
          <div className="relative h-full w-fit">
            <div className="absolute z-[1] h-full w-full rounded-b-2xl bg-gradient-to-b from-transparent from-10% to-black to-100% lg:from-40%" />
            <Image
              className="rounded-2xl object-cover w-[312px] h-[360px]"
              src={imageData || "/default.png"}
              alt="Character Image"
              width={312}
              height={360}
            />
          </div>
        </div>
      </div>
    </div>
  )
}