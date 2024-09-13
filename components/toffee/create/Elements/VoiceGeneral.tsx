import { ArrowRightIcon } from "lucide-react";
import { RiPlayFill } from "../../icons/PlayFill";
import { Slider } from "@nextui-org/react";
import { Dispatch, useEffect, useState } from "react";
import VoiceLibraryModal from "./VoiceLibraryModal";
import { VoiceType } from "@/app/(create)/create/voice/page";
import { toast } from "react-toastify";
import { CandyFile } from "../Candy";

const VoiceGeneral = ({
  voices,
  loadingVoices,
  setStep,
  setIsGeneratingVoice,
  setGeneratedVoice,
}: {
  voices: any[];
  loadingVoices: boolean;
  setStep: Dispatch<React.SetStateAction<number>>;
  setIsGeneratingVoice: Dispatch<React.SetStateAction<boolean>>;
  setGeneratedVoice: Dispatch<React.SetStateAction<VoiceType | undefined>>;
}) => {
  const [openVoiceLibraryModal, setOpenVoiceLibraryModal] =
    useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceType | undefined>();
  const [genderNum, setGenderNum] = useState<number>(4);
  const [ageNum, setAgeNum] = useState<number>(4);
  const [gender, setGender] = useState<string>("female");
  const [age, setAge] = useState<string>("middle_aged");
  const [description, setDescription] = useState<string>("");

  const toggleVoiceLibraryModal = () => setOpenVoiceLibraryModal((x) => !x);

  const handleGender = (value: number | number[]) => {
    if (typeof value === "number") {
      setGenderNum(value);
      value <= 3 ? setGender("male") : setGender("female");
    }
  };

  const handleAge = (value: number | number[]) => {
    if (typeof value === "number") {
      setAgeNum(value);
      value < 2
        ? setAge("young")
        : value < 5
          ? setAge("middle_aged")
          : setAge("old");
    }
  };

  const validationCheck = () => {
    if (description?.length > 20) {
      toast.error(`Description length must be less than 20 characters.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    if (!selectedVoice) {
      toast.error(`Please select voice.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validationCheck()) {
      setIsGeneratingVoice(true);
      if (selectedVoice) {
        const labels = {
          gender,
          age,
          accent: "american",
          accent_strength: "2",
          description,
        };

        fetch(`/api/voice/fetchAudio?url=${encodeURIComponent(selectedVoice.audioUrl)}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch the file from the URL");
            }
            return response.blob().then((blob) => {
              if (blob.type === "text/plain" || !blob.type) {
                const correctedBlob = blob.slice(0, blob.size, "audio/mpeg");
                return correctedBlob;
              }
              return blob;
            });
          })
          .then((fileBlob) => {
            const formData = new FormData();
            formData.append("name", selectedVoice?.name);
            formData.append("description", description);
            formData.append("labels", JSON.stringify(labels));
            formData.append("files", fileBlob);

            fetch("/api/voice", {
              method: "POST",
              body: formData,
            })
              .then((res1) => res1.json())
              .then((data1: any) => {
                if (data1.voiceDetail.voiceId) {
                  const voiceData: VoiceType = {
                    name: data1.voiceDetail.name,
                    voiceId: data1.voiceDetail.voiceId,
                    description: data1.voiceDetail.description,
                    audioUrl: data1.voiceDetail.preview_url,
                    itemTypeId: "",
                  };
                  setGeneratedVoice(voiceData);
                  setTimeout(() => {
                    setStep(2);
                    setIsGeneratingVoice(false);
                  }, 500);
                } else {
                  toast.error(data1.error || "Error generating voice", {
                    theme: "colored",
                    hideProgressBar: true,
                    autoClose: 1500,
                  });
                  setStep(0);
                  setIsGeneratingVoice(false);
                }
              })
              .catch((err1: any) => {
                console.log(err1);
                toast.error(`Error generating voice: ${err1}`, {
                  theme: "colored",
                  hideProgressBar: true,
                  autoClose: 1500,
                });
                setStep(0);
                setIsGeneratingVoice(false);
              });
          })
          .catch((error) => {
            console.log("Error uploading file:", error);
            toast.error(`Error generating voice: ${error}`, {
              theme: "colored",
              hideProgressBar: true,
              autoClose: 1500,
            });
            setStep(0);
            setIsGeneratingVoice(false);
          });
      }
    }
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col items-start gap-10">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <span className="font-inter text-xl sm:text-[32px] font-semibold leading-10 text-white">
            Describe your dream voice
          </span>
          <span className="text-[13px] font-inter sm:text-[14px] font-normal leading-[22px] text-text-tertiary">
            Supported formats PNG and JPG, recommended size 260x300. 400KB max
          </span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <span className="text-xs font-semibold text-text-tertiary">
            {"Description"}
          </span>
          <div className="flex w-full flex-col justify-between gap-0 rounded-[7px] border border-[#202020]">
            <div className="relative">
              <textarea
                name="prompt"
                className="w-full resize-none overflow-hidden  border-none bg-transparent px-4 pb-2 pt-3 text-[13px] text-text-sub outline-none"
                id="voice_general_description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <span className="rounded-b-[7px] bg-bg-3 px-4 py-1 text-xs text-text-tertiary">
              {"Explain about your voice in a few words shortly. (Optional)"}
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
          {selectedVoice ? (
            <div className="broder relative flex items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#BCB8C5]">
                  <RiPlayFill className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-start justify-center gap-1">
                  <span className=" text-[16px] font-medium leading-5 text-white">
                    {selectedVoice.name}
                  </span>
                  <span className=" text-xs font-normal text-[#787878]">
                    {selectedVoice.description || "No description"}
                  </span>
                </div>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="broder relative flex items-center justify-between rounded-2xl border-white/5 bg-[#202020BF] py-4 pl-[18px] pr-6">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#BCB8C5]">
                  <RiPlayFill className="h-6 w-6" />
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-normal text-[#787878]">
                    {"Please select voice"}
                  </span>
                </div>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-white" />
            </div>
          )}
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
                value={genderNum}
                onChange={handleGender}
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
                value={ageNum}
                onChange={handleAge}
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
        voices={voices}
        loadingVoices={loadingVoices}
        isModal={openVoiceLibraryModal}
        toggle={toggleVoiceLibraryModal}
        originalVoice={selectedVoice}
        setVoice={setSelectedVoice}
      />
    </div>
  );
};

export default VoiceGeneral;
