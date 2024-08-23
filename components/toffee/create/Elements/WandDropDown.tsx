import { Dispatch, SetStateAction, useState } from "react";
import { Wand2,ListMinus, ListPlus, Sparkles, FileType2, Lightbulb, FileSignature, Speech } from "lucide-react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import axios from "axios";
import Image from "next/image";

export const WandDropDown = ({
  input,
  setInput,
  isImage,
  isTextarea
}: {
    input: string;
    setInput: (prompt: string) => void;
    isImage: boolean;
    isTextarea: boolean;
  }) => {
  const [loading, setLoading] = useState(false);
  
  const onGeneratePrompt = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "prompt" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  const onMakeShorter = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "short" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  const onMakeLonger = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "long" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  const onSimplifyLanguage = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "language" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  const onMakeNewIdeas = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "idea" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  const onFixSpelling = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "spell" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  const onChangeThone = async () => {
    setLoading(true);
    await axios.post("/api/character/generate/ai", { prompt: input, type: "thone" })
      .then(res => {
        setLoading(false);
        setInput(res.data.completion);
      });
  }
  
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {
          !loading ? (
            <Wand2 className="flex absolute top-2 right-2 text-icon-3 focus: shadow-2xl hover:shadow-xl w-5 h-5" />
          ) : (
            <Image
              className="flex absolute top-2 right-2"
              src={"/loading.svg"}
              alt="loading_svg"
              width={24}
              height={24}
              />
            )
        }
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={`text-white w-44 ${isImage ? "-right-[216px]" : "-right-[186px]"} ${isTextarea ? "top-[-60px]" : "top-[-28px]"} absolute text-sm rounded-lg bg-[#242424]`} align="end">
          {
            isImage && (
              <DropdownMenu.Item
                className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 pb-1 pt-2 outline-none data-[highlighted]:rounded-t-lg data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
                onClick={() => onGeneratePrompt()}
              >
                <Sparkles width={20} height={20} />Generate with AI
              </DropdownMenu.Item>
            )
          }
          <DropdownMenu.Item
            className={`flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none ${!isImage ? "data-[highlighted]:rounded-t-lg" : ""} data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100`}
            onClick={() => onMakeShorter()}
          >
            <ListMinus width={20} height={20} />Make shorter
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onMakeLonger()}
          >
            <ListPlus width={20} height={20} />Make longer
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onSimplifyLanguage()}
          >
            <FileType2 width={20} height={20} />Simplify language
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onMakeNewIdeas()}
          >
            <Lightbulb width={20} height={20} />Make new ideas
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 py-1 outline-none data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onFixSpelling()}
          >
            <FileSignature width={20} height={20} />Fix spelling
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full cursor-pointer select-none flex-row items-center gap-2 px-3 pb-2 pt-1 outline-none data-[highlighted]:rounded-b-lg data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
            onClick={() => onChangeThone()}
          >
            <Speech width={20} height={20} />Change the thone
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}