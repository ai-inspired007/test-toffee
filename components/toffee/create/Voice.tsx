"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { SparklingFill } from "../icons/SparklingFill";
import { FileCopyLine } from "../icons/FileCopyLine";
import VoiceRuleModal from "./Elements/VoieRuleModal";
import UploadFiles from "./Elements/UploadFiles";
import { CandyFile } from "./Candy";
import VoiceUploadModal from "./Elements/VoiceUploadModal";
import VoiceGeneral from "./Elements/VoiceGeneral";
import GeneratingVoice from "./Elements/GeneratingVoice";
import VoiceDetails from "./Elements/VoiceDetails";
import { toast } from "react-toastify";
import { VoiceType } from "@/app/(create)/create/voice/page";
import OptionCard from "./Elements/OptionCard";
import SelectImageType from "./Elements/Character/ImageType";
import { Upload } from "lucide-react";

const VoiceCreate = () => {
  const [option, setOption] = useState<number>(0);
  const [isRuleModal, setRuleModal] = useState(false);
  const [isUploadModal, setUploadModal] = useState(true);
  const [uploadedFiles, setVoiceFiles] = useState<CandyFile[] | null>(null);
  const [step, setStep] = useState<number>(0);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState<boolean>(false);
  const [isAgreedRule, setIsAgreedRule] = useState<boolean>(false);
  const [voices, setVoices] = useState([]);
  const [loadingVoices, setLoadingVoices] = useState<boolean>(false);
  const [generatedVoice, setGeneratedVoice] = useState<VoiceType>();
  const [uploadedVoice, setUploadedVoice] = useState<VoiceType>();
  const steps = ["General", "Details"];

  const handleContinue = (currentType: string | null) => {
    if (currentType === "generate") {
      setStep(1);
      setOption(0);
      getVoices();
    } else if (currentType === "upload") {
      console.log(currentType);
      setStep(0);
      setRuleModal(true);
      setIsAgreedRule(false);
      setOption(1);
    }
  };

  const handleCancelVoiceRuleModal = () => {
    setStep(0);
    setRuleModal(false);
    setIsAgreedRule(false);
  };

  const handleAgreeRule = () => {
    setIsAgreedRule(true);
    setRuleModal(false);
    setUploadModal(true);
  };

  async function getVoices() {
    setLoadingVoices(true);
    const response = await fetch("/api/voice", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.voices) {
        setVoices(data.voices);
        console.log("/api/voice", data.voices);
        setLoadingVoices(false);
      }
      return data;
    } else {
      const error = await response.text();
      toast.error(`Error creating candy: ${error}`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  }

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  const handleCardClick = (name: string) => {
    if (name !== selectedName) {
      setSelectedName(name);
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }
  };

  useEffect(() => {
    if (clickCount === 2) {
      handleContinue(selectedName);
      setClickCount(0);
    }
  }, [clickCount, selectedName]);

  const handleStepClick = (index: number) => {
    if (index < step) {
      setStep(index);
    }
  };
  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar ">
      <div className="flex flex-col rounded-2xl bg-bg-2 sm:w-full h-full overflow-auto items-center justify-start relative px-4">
        <div className="no-scrollbar flex w-full flex-col gap-6 overflow-auto items-center pb-[95px]">
          <div className="w-full flex sm:justify-center justify-between items-center relative bg-bg-2 mt-6">
            {step > 0 && (
              <div className="top-6 flex w-full items-center justify-start sm:justify-center">
                <div className="flex flex-row gap-0.5 rounded-full bg-black p-0.5 text-white">
                  {steps.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleStepClick(index)}
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
          </div>
          <X
            className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6"
            onClick={() => setUploadModal(true)}
          />
        </div>
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
                onPressHandler={() => handleCardClick('generate')}
                icon={<SparklingFill />}
                title="Magically generate"
                name="generate"
                description="Generate an image for your character with Ai"
                currentType={selectedName}
              />
              <OptionCard
                onPressHandler={() => handleCardClick('upload')}
                icon={<FileCopyLine />}
                title="Clone voice"
                name="upload"
                description="Upload an image of your character from a computer"
                currentType={selectedName}
              />
            </div>
          </div>
        )}

        {option === 0 ? (
          step === 1 ? (
            isGeneratingVoice ? (
              <GeneratingVoice />
            ) : (
              <div className="flex">
                <VoiceGeneral
                  voices={voices}
                  loadingVoices={loadingVoices}
                  setStep={setStep}
                  setIsGeneratingVoice={setIsGeneratingVoice}
                  setGeneratedVoice={setGeneratedVoice}
                />
              </div>
            )
          ) : step === 2 ? (
            <VoiceDetails voice={generatedVoice} setStep={setStep} />
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
                setUploadedVoice={setUploadedVoice}
              />
            )
          ) : step === 2 ? (
            <VoiceDetails voice={uploadedVoice} setStep={setStep} />
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default VoiceCreate;
