import React, { FC } from "react";
import OptionCard from "../OptionCard";
import { Upload } from "lucide-react";
import { Sparking2FillIcon } from "@/components/toffee/icons/Sparking2FillIcon";

type ImageType = "upload" | "generate";

interface SelectImageTypeProps {
  imageType: ImageType | null;
  setImageType: (imageType: ImageType) => void;
  advanceFunction: () => void;
  previousFunction: () => void;
}

const SelectImageType: FC<SelectImageTypeProps> = ({ imageType, setImageType, advanceFunction, previousFunction }) => {

  const navigate = (type: ImageType) => {
    setImageType(type);
    advanceFunction();
  }

  return (
    <div className="flex flex-col items-center mt-4 w-full">
      <div className="flex flex-col items-center gap-4">
        <h2 className="sm:text-[32px] text-[20px] text-center leading-10 font-semibold text-white  tracking-[0.075rem]">{"How do you want to add your character's image?"}</h2>
        <p className="sm:text-sm text-[13px] text-text-tertiary  leading-[22px] w-full text-center">You can either upload your own image, or generate it in a variety of styles with AI.</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <OptionCard
          onPressHandler={() => navigate("upload")}
          icon={<Upload className="h-8 w-8" />}
          title="Upload an image"
          name="upload"
          description="Upload an image of your character from a computer"
          currentType={imageType}
        />
        <OptionCard
          currentType={imageType}
          onPressHandler={() => navigate("generate")}
          icon={<Sparking2FillIcon className="h-8 w-8" />}
          title="Generate image"
          name="generate"
          description="Generate an image for your character with Ai"
        />
      </div>
    </div>
  );
};

export default SelectImageType;