"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";
import { SparklingFill } from "../icons/SparklingFill";
import { FileCopyLine } from "../icons/FileCopyLine";
import OptionCard from "./Elements/OptionCard";
import VoiceRuleModal from "./Elements/VoieRuleModal";
import UploadFiles from "./Elements/UploadFiles";
import { CandyFile } from "./Candy";
import VoiceUploadModal from "./Elements/VoiceUploadModal";
import VoiceGeneral from "./Elements/VoiceGeneral";
import GeneratingVoice from "./Elements/GeneratingVoice";
import VoiceDetails from "./Elements/VoiceDetails";

const VoiceCreate = () => {
  const [currentType, setCreationType] = useState<string>("generate");
  const [option, setOption] = useState<number>(0);
  const [isRuleModal, setRuleModal] = useState(false);
  const [isUploadModal, setUploadModal] = useState(true);
  const [uploadedFiles, setVoiceFiles] = useState<CandyFile[] | null>(null);
  const steps = ["General", "Details"];
  const [step, setStep] = useState<number>(0);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState<boolean>(false);
  const [isAgreedRule, setIsAgreedRule] = useState<boolean>(false);

  const handleContinue = () => {
    console.log(currentType);
    if (currentType === "generate") {
      setStep(1);
      setOption(0);
    } else if (currentType === "clone") {
      setStep(0);
      setOption(1);
      setRuleModal(true);
    }
  };

  const handleCancelVoiceRuleModal = () => {
    setRuleModal(false);
  };

  const handleAgreeRule = () => {
    setIsAgreedRule(true);
    setRuleModal(false);
    setUploadModal(true);
  };

  return (
    <div className="no-scrollbar h-screen w-full overflow-y-auto p-2">
      <div className="relative flex h-full min-h-full w-full flex-col items-center justify-center rounded-2xl bg-bg-2 p-6">
        <X
          className="absolute right-6 top-6 h-9 w-9 cursor-pointer rounded-full bg-bg-3 p-1.5 text-icon-3"
          onClick={() => setUploadModal(true)}
        />
        {step === 0 && !isGeneratingVoice && (
          <div className=" flex flex-col items-center">
            <h1 className=" text-[32px] font-bold text-white">
              Create your own voice
            </h1>
            <p className="my-4 px-6 text-center  text-sm text-text-tertiary">
              Toffee is a conversational Ai platform that supports both
              productivity and <br /> entertainment applications
            </p>
            <div className="mt-14 flex flex-col gap-y-4 px-6 md:mt-7 lg:flex-row lg:gap-x-4 lg:gap-y-0">
              <OptionCard
                currentType={currentType}
                onPressHandler={() => setCreationType("generate")}
                icon={<SparklingFill />}
                title="Magically generate"
                name="generate"
                description="Generate an image for your character with Ai"
              />
              <OptionCard
                currentType={currentType}
                onPressHandler={() => setCreationType("clone")}
                icon={<FileCopyLine />}
                title="Clone voice"
                name="clone"
                description="Upload an image of your character from a computer"
              />
            </div>
            <div className="mt-14 flex flex-col gap-y-4 md:mt-7 lg:flex-row lg:gap-x-4 lg:gap-y-0">
              <button
                onClick={handleContinue}
                className="flex h-10 w-56 items-center justify-center rounded-full bg-gradient-to-r from-[#C28851] to-[#B77536] text-white"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {step && (
          <div className="absolute top-6 flex w-full items-center justify-center">
            <div className="flex flex-row gap-0.5 rounded-full bg-black p-0.5 text-white">
              {steps.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-row items-center ${index === step - 1 && "rounded-full bg-[#BC7F44] p-0.5"}`}
                >
                  <div
                    className={
                      index < step - 1
                        ? "flex h-7 w-7 items-center justify-center rounded-full bg-bg-3"
                        : "flex h-6 w-6 items-center justify-center rounded-full bg-black"
                    }
                  >
                    {index + 1}
                  </div>
                  {index === step - 1 && (
                    <div className="px-2 text-xs">{item}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {option === 0 ? (
          step === 1 ? (
            isGeneratingVoice ? (
              <GeneratingVoice />
            ) : (
              <VoiceGeneral
                setStep={setStep}
                setIsGeneratingVoice={setIsGeneratingVoice}
              />
            )
          ) : step === 2 ? (
            <VoiceDetails setStep={setStep} />
          ) : null
        ) : option === 1 ? (
          step === 0 ? (
            isGeneratingVoice ? (
              <GeneratingVoice />
            ) : !isAgreedRule ? (
              <VoiceRuleModal
                isModal={isRuleModal}
                handleAgree={handleAgreeRule}
                handleCancel={handleCancelVoiceRuleModal}
              />
            ) : (
              <VoiceUploadModal
                isModal={isUploadModal}
                files={uploadedFiles}
                setStep={setStep}
                setModal={setUploadModal}
                setFiles={setVoiceFiles}
                setIsGeneratingVoice={setIsGeneratingVoice}
              />
            )
          ) : step === 2 ? (
            <VoiceDetails setStep={setStep} />
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default VoiceCreate;
