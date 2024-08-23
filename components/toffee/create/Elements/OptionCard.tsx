import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CreationType = "Character" | "Voice" | "Candy" | "Magically" | "Clone";

export default function OptionCard({
  icon,
  title,
  name,
  description,
  onPressHandler,
  currentType
}: {
  icon: React.ReactNode;
  title: string;
  name: string;
  description: string;
  onPressHandler: () => void;
  currentType: string | null;
}) {
  return (
    <Card
      onClick={onPressHandler}
      className={cn("p-4 sm:p-6 sm:pt-10 bg-bg-2 w-full sm:w-[248px] cursor-pointer", currentType === name ? "border border-white/30" : "border border-white/10",)}
    >
      <div className="flex h-full w-full flex-row lg:flex-col lg:items-center lg:justify-evenly gap-6 sm:gap-10">
        <div
          className={cn(
            "my-auto aspect-square h-fit w-fit rounded-2xl p-4 transition duration-300",
            currentType === name ? "bg-[#BC7F44] text-white" : "bg-bg-3 text-icon-3",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1 sm:gap-2 items-start sm:items-center">
          <h1 className="font-medium text-white font-inter">{title}</h1>
          <span className="text-[13px] text-text-additional md:text-center font-inter">{description}</span>
        </div>
      </div>
    </Card>
  );
}