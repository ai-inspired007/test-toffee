import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { validImageInputTypes } from "@/lib/upload/util";
import { Trash2 } from 'lucide-react';
import { RiImageAddLine } from "../../icons/AddImageLine";

export interface ThemeProps {
  id: string | number;
  url: string;
}

interface ThemesProps {
  themes: ThemeProps[];
  selected: ThemeProps;
  setSelectedTheme: Dispatch<SetStateAction<ThemeProps>>;
  addTheme: (theme: ThemeProps) => void;
  deleteTheme: (id: string | number) => void;
}

const AddTheme = ({
  themes,
  selected,
  setSelectedTheme,
  addTheme,
  deleteTheme,
}: ThemesProps) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validImageInputTypes.includes(file.type)) {
      const url = URL.createObjectURL(file);
      const newTheme = { id: themes.length + 1, url };
      addTheme(newTheme);
      setSelectedTheme(newTheme);
    }
  };

  const handleDeleteTheme = (id: string | number) => {
    if (themes.length > 1) {
      deleteTheme(id);
    } else {
      alert("At least one theme must be present.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        className="w-full h-[282px] rounded-lg flex flex-col p-8 relative border border-white/10"
        style={{ background: `url(${selected.url}) center/cover no-repeat`}}
      >
        <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
        <div className="relative z-10">
        <div className="flex flex-row gap-3">
          <Image src={"/characters/zero.png"} alt="" className="rounded-full w-8 h-8" width={32} height={32} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row text-text-sub items-center">
              <span className="text-xs">Zero Two</span>
              <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px] leading-[14px]">Tul.pa</span>
            </div>
            <span className="text-[#DEDFE4] bg-bg-3 px-4 py-3 text-sm font-light" style={{ borderRadius: "0px 16px 16px 16px" }}>{"Hi, how's it going?"}</span>
          </div>
        </div>
        <div className="flex gap-3 flex-row-reverse">
          <Image src={"/you.png"} alt="" className="rounded-full w-8 h-8" width={32} height={32} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row text-text-sub items-center ml-auto">
              <span className="text-xs">You</span>
            </div>
            <span className="text-[#DEDFE4] bg-bg-3 px-4 py-3 text-sm font-light" style={{ borderRadius: "0px 16px 16px 16px" }}>{"Hey, could you give me some suggestions?"}</span>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <Image src={"/characters/zero.png"} alt="" className="rounded-full w-8 h-8" width={32} height={32} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row text-text-sub items-center">
              <span className="text-xs">Zero Two</span>
              <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px] leading-[14px]">Tul.pa</span>
            </div>
            <span className="text-[#DEDFE4] bg-bg-3 px-4 py-3 text-sm font-light" style={{ borderRadius: "0px 16px 16px 16px" }}>{"Sure, here some some suggestions for you"}</span>
          </div>
        </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 overflow-x-auto py-2">
        <label className="h-[152px] w-[229px] rounded-lg flex flex-col border border-white/10 items-center justify-center cursor-pointer flex-shrink-0">
          <RiImageAddLine className="text-icon-3 w-6 h-6 mb-2" />
          <span className="text-text-main text-sm font-normal">Add your photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
        
        {themes.map((theme, index) => (
          <div key={index} className={`relative h-[152px] w-[229px] rounded-lg flex flex-col items-center justify-center cursor-pointer p-2 flex-shrink-0 ${theme.id === selected.id ? "border-[1px] border-solid border-[#BC7F44]" : "border border-white/10"}`}>
            <Image src={theme.url} alt="" className="w-full h-full object-cover rounded-lg" width={152} height={200} onClick={() => setSelectedTheme(theme)} />
            {theme.id === selected.id && <div className="px-8 py-1 rounded-t-lg bg-[#BC7F44] text-[11px] text-white absolute bottom-0">Selected</div>}
            <button onClick={() => handleDeleteTheme(theme.id)} className="absolute top-3 right-3 bg-gray-900 text-white rounded-md p-1.5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTheme;