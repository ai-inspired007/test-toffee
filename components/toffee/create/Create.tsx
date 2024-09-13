"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserLine } from "../icons/UserLine";
import { VoicePrintFill } from "../icons/VoicePrintFill";
import { ColorFilterLine } from "../icons/ColorFilterLine";
import OptionCard from "./Elements/OptionCard";

export default function CreatePage() {
  const router = useRouter();

  const handleContinue = (currentType: string | null) => {
    const route = `/create/${currentType?.toLowerCase()}`;
    router.push(route);
  };

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  const handleCardClick = (name: string) => {
    if (name !== selectedName) {
      setSelectedName(name);
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }
  };

  useEffect(() => {
    if (clickCount === 2) {
      handleContinue(selectedName);
      setClickCount(0);
    }
  }, [clickCount, selectedName]);

  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar flex flex-col items-center sm:justify-center justify-start">
      <div className="sm:rounded-2xl bg-bg-2 w-full min-h-full h-full relative sm:p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full sm:p-1.5 p-1 sm:h-9 sm:w-9 w-6 h-6 cursor-pointer absolute sm:top-6 sm:right-6 top-5 right-5" />
        <div className=" flex flex-col items-center relative top-[22.17%] gap-[24px] md:gap-[38px] justify-center">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="sm:text-[32px] text-[20px] font-inter font-bold text-white text-center">What would you like to create?</h1>
            <p className="sm:text-sm text-[13px] text-text-tertiary font-inter text-center mt-4 leading-[22px]">
              Select which option best describes what you have in mind.
            </p>
          </div>
          <div className="flex flex-col gap-y-4 px-6 lg:flex-row lg:gap-x-4 lg:gap-y-0">
            <OptionCard
              onPressHandler={() => handleCardClick("character")}
              icon={<UserLine />}
              title="Character"
              name="character"
              description="Create a life-like persona, be it real or fictional."
              currentType={selectedName}
            />
            <OptionCard
              onPressHandler={() => handleCardClick("voice")}
              icon={<VoicePrintFill />}
              title="Voice"
              name="voice"
              description="Craft compelling voices with AI, like a coding companion."
              currentType={selectedName}
            />
            <OptionCard
              onPressHandler={() => handleCardClick("candy")}
              icon={<ColorFilterLine />}
              title="Candy"
              name="candy"
              description="Enhance your character's by crafting additional pucks"
              currentType={selectedName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}