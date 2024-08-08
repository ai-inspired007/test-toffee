import { DropdownWrapper } from "@/components/tulpa/chat/dropdown-wrapper";
import Image from "next/image";

type RecommendedProps = {
  characters: {
    id: string;
    name: string;
    img: string;
    desc: string;
  }[];
};

export function Recommended({ characters }: RecommendedProps) {
  return (
    <DropdownWrapper label="Recommended">
      <div className="flex  max-h-full flex-col gap-3 overflow-y-auto no-scrollbar">
        {characters.map((character, index) => {
          return (
            <div
              key={index}
              className="flex cursor-pointer flex-row items-center justify-start gap-3 rounded-lg p-2 hover:bg-bg-3"
            >
              <div className="overflow-hidden rounded-full">
                <Image
                  src={character.img}
                  alt={`An image of ${character.name}`}
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="line-clamp-1 text-sm font-medium text-text-additional">
                  {character.name}
                </span>
                <p className="line-clamp-1 text-xs font-normal text-text-tertiary">
                  {character.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DropdownWrapper>
  );
}
