import React, { FC, useEffect, useState } from "react";
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

  const navigate = (type: ImageType | null) => {
    advanceFunction();
  }

  const [clickCount, setClickCount] = useState<number>(0);

  const handleCardClick = (name: ImageType) => {
    if (name !== imageType) {
      setImageType(name);
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }
  };

  useEffect(() => {
    if (clickCount === 2) {
      navigate(imageType);
      setClickCount(0);
    }
  }, [clickCount, imageType]);

  return (
    <div className="flex flex-col items-center mt-28 w-full p-5">
      <div className="flex flex-col items-center gap-4">
        <h2 className="sm:text-[32px] text-[20px] text-center leading-10 font-semibold text-white  tracking-[0.075rem]">{"How do you want to add your character's image?"}</h2>
        <p className="sm:text-sm text-[13px] text-text-tertiary  leading-[22px] w-full text-center">You can either upload your own image, or generate it in a variety of styles with AI.</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <OptionCard
          onPressHandler={() => handleCardClick('upload')}
          icon={<Upload className="h-8 w-8" />}
          title="Upload an image"
          name="upload"
          description="Upload an image of your character from a computer"
          currentType={imageType}
        />
        <OptionCard
          onPressHandler={() => handleCardClick('generate')}
          icon={<Sparking2FillIcon className="h-8 w-8" />}
          title="Generate image"
          name="generate"
          description="Generate an image for your character with Ai"
          currentType={imageType}
        />
      </div>
    </div>
  );
};

export default SelectImageType;