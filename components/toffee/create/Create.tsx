"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RiStarSLine } from "../icons/Star";
import { RiCodeBlock } from "../icons/CodeBlock";
import { RiStackLine } from "../icons/StackLine";

type CreationType = "Character" | "Utility" | "Candy";

function OptionCard({
  icon,
  title,
  description,
  onPressHandler,
  currentType,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPressHandler: () => void;
  currentType: CreationType;
}) {
  return (
    <Card
      onClick={onPressHandler}
      className={cn("p-6 pt-10 bg-bg-2 w-[248px] cursor-pointer", currentType === title ? "border border-white/30" : "border border-white/10",)}
    >
      <div className="flex h-full w-full flex-row lg:flex-col lg:items-center lg:justify-evenly">
        <div
          className={cn(
            "my-auto aspect-square h-fit w-fit rounded-2xl p-4 transition duration-300",
            currentType === title ? "bg-[#BC7F44] text-white" : "bg-bg-3 text-icon-3",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-2 items-center mt-10">
          <h1 className="font-medium text-white font-inter">{title}</h1>
          <span className="text-[13px] text-text-additional md:text-center font-inter">{description}</span>
        </div>
      </div>
    </Card>
  );
}

export default function CreatePage() {
  const [currentType, setCreationType] = useState<CreationType>("Character");
  const router = useRouter();

  const handleContinue = () => {
    const route = `/create/${currentType.toLowerCase()}`;
    router.push(route);
  };

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full h-full items-center justify-center relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" />
        <div className=" flex flex-col items-center">
          <h1 className="text-[32px] font-inter font-bold text-white">What would you like to create?</h1>
          <p className="my-4 px-6 text-sm text-text-tertiary font-inter">
            Select which option best describes what you have in mind.
          </p>
          <div className="mt-14 flex flex-col gap-y-4 px-6 md:mt-7 lg:flex-row lg:gap-x-4 lg:gap-y-0">
            <OptionCard
              currentType={currentType}
              onPressHandler={() => setCreationType("Character")}
              icon={<RiStarSLine className="h-8 w-8" />}
              title="Character"
              description="Create a life-like persona, be it real or fictional."
            />
            <OptionCard
              currentType={currentType}
              onPressHandler={() => setCreationType("Utility")}
              icon={<RiCodeBlock className="h-8 w-8" />}
              title="Utility"
              description="Create powerful tools with AI, such as a coding assistant."
            />
            <OptionCard
              currentType={currentType}
              onPressHandler={() => setCreationType("Candy")}
              icon={<RiStackLine className="h-8 w-8" />}
              title="Candy"
              description="Create a new world, where lore and setting are paramount."
            />
          </div>
          <div className="mt-14 flex flex-col gap-y-4 md:mt-7 lg:flex-row lg:gap-x-4 lg:gap-y-0">
            <button onClick={handleContinue} className="h-10 w-56 bg-gradient-to-r from-[#C28851] to-[#B77536] text-white rounded-full flex items-center justify-center">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}