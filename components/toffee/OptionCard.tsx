import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CreationType = "Character" | "Voice" | "Candy" | "Magically" | "Clone";

export default function OptionCard({
  icon,
  title,
  description,
  onPressHandler,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPressHandler: () => void;
}) {
  return (
    <Card
      onClick={onPressHandler}
      className={cn("p-6 group pt-10 bg-bg-2 cursor-pointer border border-white/10", "hover:border hover:border-white/30",)}
    >
      <div className="flex h-full w-full flex-row lg:flex-col lg:items-center lg:justify-evenly">
        <div
          className={cn(
            "my-auto aspect-square h-fit w-fit rounded-2xl p-4 transition duration-300 bg-bg-3 text-icon-3", "group-hover:bg-[#BC7F44] group-hover:text-white",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-2 items-center text-center mt-10 md:w-[200px]">
          <h1 className="font-medium text-white  text-base w-full leading-5">{title}</h1>
          <span className="text-[13px] text-text-additional md:text-center  w-full leading-5">{description}</span>
        </div>
      </div>
    </Card>
  );
}