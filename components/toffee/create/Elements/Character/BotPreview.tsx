import { FC } from "react";
import Image from "next/image";
const BotPreview: FC<{ imageData: string | null; user: any; name: string; description: string }> = ({ imageData, user, name, description }) => (
  <div className="flex flex-col items-center">
    <div className="px-6 w-full">
      <div className="text-white text-xs bg-bg-3 w-[264px] text-center py-2 rounded-t-2xl font-normal">Bot preview</div>
    </div>
    <div className="relative">
      <div className="absolute top-[260px] z-10 max-w-[264px] overflow-hidden text-ellipsis pl-4 text-white ">
        <h1 className="mb-1 text-[19.2px] text-white font-medium leading-6 truncate">{name || "Your Amazing Character"}</h1>
        <p className="mt-2 w-full max-w-[280px] h-full text-[14.4px] text-[#B9B9B9] leading-6 text-balance">
          {description || "Tell us about your character. What are they like? Where are they from?"}
        </p>
      </div>
      <div className="relative h-full w-fit">
        <div className="absolute z-[1] h-full w-full border border-white border-opacity-10 border-b-0 rounded-2xl bg-gradient-to-b from-transparent from-10% to-black to-100% lg:from-40%" />
        <Image className="rounded-2xl object-cover w-[312px] h-[360px]" src={imageData || "/default.png"} alt="Character Image" width={312} height={360} />
      </div>
    </div>
  </div>
);

export default BotPreview;