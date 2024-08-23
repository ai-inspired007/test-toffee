import { ArrowRightIcon } from "lucide-react";
import { RiPlayFill } from "../../icons/PlayFill";
import { Slider } from "@nextui-org/react";
import { Dispatch, useState } from "react";
import VoiceLibraryModal from "./VoiceLibraryModal";
import { VoiceType } from "@/app/(create)/create/voice/page";

const VoiceGeneral = ({
  setStep,
  setIsGeneratingVoice,
}: {
  setStep: Dispatch<React.SetStateAction<number>>;
  setIsGeneratingVoice: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openVoiceLibraryModal, setOpenVoiceLibraryModal] =
    useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceType | undefined>();

  const toggleVoiceLibraryModal = () => setOpenVoiceLibraryModal((x) => !x);

  const handleContinue = () => {
    setIsGeneratingVoice(true);
    setTimeout(() => {
      setStep(2);
      setIsGeneratingVoice(false);
    }, 2000);
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col items-start gap-10">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <span className=" text-[32px] font-semibold leading-10 text-white">
            Describe your dream voice
          </span>
          <span className=" text-[14px] font-normal leading-[22px] text-text-tertiary">
            Supported formats PNG and JPG, recommended size 260x300. 400KB max
          </span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <span className="text-xs font-semibold text-text-tertiary">
            {"Greeting"}
          </span>
          <div className="flex w-full flex-col justify-between gap-0 rounded-[7px] border border-[#202020]">
            <div className="relative">
              <textarea
                name="prompt"
                className="w-full resize-none overflow-hidden  border-none bg-transparent px-4 pb-2 pt-3 text-[13px] text-text-sub outline-none"
                id=""
              ></textarea>
            </div>
            <span className="rounded-b-[7px] bg-bg-3 px-4 py-1 text-xs text-text-tertiary">
              {"How should your AI start the conversation? (Optional)"}
            </span>
          </div>
        </div>
        <div
          className="flex w-full cursor-pointer flex-col gap-2"
          onClick={() => setOpenVoiceLibraryModal(true)}
        >
          <span className=" text-xs font-normal text-text-tertiary">
            {"Voice base"}
          </span>
          <div className="broder relative flex items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#BCB8C5]">
                <RiPlayFill className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className=" text-[16px] font-medium leading-5 text-white">
                  Zero Two
                </span>
                <span className=" text-xs font-normal text-[#787878]">
                  {"I’m Zero Two from Darling in the Franxx"}
                </span>
              </div>
            </div>
            <ArrowRightIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <span className="mb-2 flex pl-1  text-xs font-normal text-text-tertiary">
            Gender type
          </span>
          <div className="mx-2 my-3">
            {/* <CustomSlider /> */}
            <div className="custom-slider flex w-full flex-col gap-6">
              <Slider
                size="sm"
                step={1}
                label=""
                color="primary"
                showSteps={true}
                maxValue={6}
                minValue={0}
                defaultValue={4}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="mx-1 flex justify-between text-white">
            <span className=" text-[12px] font-normal leading-[20px]">
              Musculine
            </span>
            <span className="text-right  text-[12px] font-normal leading-[20px]">
              Femenine
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <span className="mb-2 flex pl-1  text-xs font-normal text-text-tertiary">
            Age
          </span>
          <div className="mx-2 my-3">
            {/* <CustomSlider /> */}
            <div className="custom-slider flex w-full flex-col gap-6">
              <Slider
                size="sm"
                step={1}
                label=""
                color="primary"
                showSteps={true}
                maxValue={6}
                minValue={0}
                defaultValue={4}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="mx-1 flex justify-between text-white">
            <span className=" text-[12px] font-normal leading-[20px]">
              Young
            </span>
            <span className="text-right  text-[12px] font-normal leading-[20px]">
              Old
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col"></div>
        <div className="flex w-full">
          <button
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px]  text-[14px] font-medium leading-[18px] text-white"
            onClick={() => handleContinue()}
          >
            Continue
          </button>
        </div>
      </div>
      <VoiceLibraryModal
        isModal={openVoiceLibraryModal}
        toggle={toggleVoiceLibraryModal}
        originalVoice={selectedVoice}
        setVoice={setSelectedVoice}
      />
    </div>
  );
};

export default VoiceGeneral;
