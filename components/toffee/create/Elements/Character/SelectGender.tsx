import React, { FC } from "react";
import Image from "next/image";
type GenderType = "Male" | "Female" | "Non-Binary" | "Prefer Not To Answer";

interface SelectGenderProps {
  gender: GenderType | null;
  setGender: (gender: GenderType) => void;
  advanceFunction: () => void;
  previousFunction: () => void;
}

const genderOptions: { type: GenderType, image: string }[] = [
  { type: "Male", image: "/gender/male.png" },
  { type: "Female", image: "/gender/female.png" },
  { type: "Non-Binary", image: "/gender/non.png" },
  { type: "Prefer Not To Answer", image: "/gender/na.png" }
];

const SelectGender: FC<SelectGenderProps> = ({ gender, setGender, advanceFunction, previousFunction }) => {
  return (
    <div className="flex flex-col items-center justify-center sm:gap-8 gap-6 mt-4">
      <div className = "flex flex-col gap-4 items-center text-center md:w-[594px]">
        <h2 className="sm:text-[32px] text-[20px] text-center font-semibold text-white leading-10 tracking-[0.005rem]">What is the gender of your character?</h2>
        <p className="sm:text-sm text-[13px] text-center text-text-tertiary leading-[22px]">{"Please select your character's gender. It will affect their, tone of speech, appearance, and voice."}</p>
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-4 justify-center mt-4">
        {genderOptions.map((option) => (
          <div
            key={option.type}
            onClick={() => {
              setGender(option.type);
              advanceFunction();
            }}
            className={`relative cursor-pointer transition-transform transform rounded-2xl overflow-hidden hover:border hover:border-[#BC7F44] border border-white/10 w-[163px] h-[198px] sm:w-[200px] sm:h-[200px]`}
          >
            <Image  src={option.image} alt={option.type} className="w-full h-full object-cover" width={0} height={0} sizes="100vw"/>
            <div className={`absolute inset-0 flex items-end justify-center hover:bg-gradient-to-t hover:from-[#121212bb] hover:via-[#1212122d] hover:to-[#12121200] bg-gradient-to-t from-[#121212] via-[#12121299] to-[#12121200]`}>
              <span className="text-white font-normal text-[14px] leading-[18px] w-[180px] h-[16px] text-center mb-[16px] mx-[10px]">{option.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectGender;