"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { UserLine } from "../icons/UserLine";
import { VoicePrintFill } from "../icons/VoicePrintFill";
import { ColorFilterLine } from "../icons/ColorFilterLine";
import OptionCard from "./Elements/OptionCard";

export default function CreatePage() {
  const router = useRouter();

  const handleContinue = (currentType: string) => {
    const route = `/create/${currentType.toLowerCase()}`;
    router.push(route);
  };

  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col sm:rounded-2xl bg-bg-2 w-full min-h-full h-full items-center sm:justify-center justify-start relative sm:p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full sm:p-1.5 p-1 sm:h-9 sm:w-9 w-6 h-6 cursor-pointer absolute sm:top-6 sm:right-6 top-5 right-5" />
        <div className=" flex flex-col items-center relative gap-[24px] md:gap-[38px] mt-12 sm:mt-0">
          <div className = "flex flex-col gap-4 items-center">
            <h1 className="sm:text-[32px] text-[20px] font-inter font-bold text-white text-center">What would you like to create?</h1>
            <p className="sm:text-sm text-[13px] text-text-tertiary font-inter text-center mt-4 leading-[22px]">
              Select which option best describes what you have in mind.
            </p>
          </div>
          <div className="flex flex-col gap-y-4 px-6 lg:flex-row lg:gap-x-4 lg:gap-y-0">
            <OptionCard
              onPressHandler={() => handleContinue("Character")}
              icon={<UserLine />}
              title="Character"
              name="Character"
              description="Create a life-like persona, be it real or fictional."
              currentType={"Character"}
            />
            <OptionCard
              onPressHandler={() => handleContinue("Voice")}
              icon={<VoicePrintFill />}
              title="Voice"
              name="Voice"
              description="Craft compelling voices with AI, like a coding companion."
              currentType={"Voice"}
            />
            <OptionCard
              onPressHandler={() => handleContinue("Candy")}
              icon={<ColorFilterLine />}
              title="Candy"
              name="Candy"
              description="Enhance your character's by crafting additional pucks"
              currentType={"Candy"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}