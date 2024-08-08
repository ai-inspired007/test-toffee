import { useState } from "react";
import { Wand2,Tag } from "lucide-react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import axios from "axios";
import Image from "next/image";

export const WandTagify = ({
  description,
  category,
  characterTags,
  setCharacterTags,
}: {
    description: string;
    category: string | undefined;
    characterTags: string[];
    setCharacterTags: (newTags: string[]) => void;
  }) => {
  const [loading, setLoading] = useState(false);
  
  const onGenerateTags = async () => {
    setLoading(true);
    const input = `Character Description: ${description}\nCharacter Category: ${category}`
    await axios.post("/api/character/generate/ai", { prompt: input, type: "tag" })
      .then(res => {
        setLoading(false);
        const completion = res.data.completion;
        setCharacterTags([...characterTags, ...completion])
      });
  }
  
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {
          !loading ? (
            <Wand2 className="flex absolute top-2 right-2 text-white focus: shadow-2xl hover:shadow-xl" />
          ) : (
            <Image
              className="flex absolute top-2 right-2"
              src={"/loading.svg"}
              alt="loading_svg"
              width={30}
              height={30}
              />
            )
        }
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex text-white w-44 -right-[640px] top-[-88px] absolute text-sm rounded-lg bg-[#242424]" align="end">
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none data-[highlighted]:rounded-t-lg data-[highlighted]:rounded-b-lg data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onGenerateTags()}
          >
            <Tag width={20} height={20} />Generate Tags
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}