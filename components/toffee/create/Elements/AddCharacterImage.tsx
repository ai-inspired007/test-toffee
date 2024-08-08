import { Dispatch, SetStateAction, useState } from "react";
import UploadCharacterImage from "./CharacterImage";
import { WandDropDown } from "./WandDropDown"

export const AddCharacterImage = ({
  advanceFunction,
  setImageData,
  setImageFile,
  imageData,
  imagePrompt,
  setImagePrompt,
  previousFunction,
}: {
  advanceFunction: () => void;
  imageData: string | null;
  setImageData: (image: string | null) => void;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  imagePrompt: string;
  setImagePrompt: (newImagePrompt: string) => void;
  previousFunction: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center mt-[100px] max-w-[720px]">
      <h1 className="text-white font-inter text-[32px] font-bold">Add your Character Image</h1>
      <p className="text-text-tertiary font-inter text-sm">{"Supported formats PNG and JPG, recommended size 260x300. 400KB max"}</p>
      <div className="mt-[38px] w-full flex items-center justify-center">
        <UploadCharacterImage
          onChange={setImageData}
          value={imageData}
          setFile={setImageFile}
        />
      </div>
      <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between mt-8 max-w-[456px]">
        <div className="relative">
          <textarea
            name="prompt"
            className="w-[calc(100%-30px)] text-[13px] text-text-sub px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden"
            id=""
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          />
          <WandDropDown input={imagePrompt} setInput={setImagePrompt} setImageData={setImageData} setImageFile={setImageFile} isImage={true} isTextarea={true} />
        </div>
        <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">Generate  your image with AI</span>
      </div>
      <div className="flex flex-row gap-4 mt-8">
        <button className="w-[220px] bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={previousFunction} disabled={isLoading}>
          {"Previous step"}
        </button>
        <button className="w-[220px] bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={advanceFunction} disabled={isLoading}>
          {"Continue"}
        </button>
      </div>
    </div>
  )
}