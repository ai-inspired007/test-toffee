import { Dispatch } from "react";
import Modal from "../../../ui/Modal";
import { X } from "lucide-react";
import Image from "next/image";
import { RiVoiceprintLine } from "../../icons/VoicePrint";

const VoiceCreatedModal = ({
  isModal,
  handleCancel,
}: {
  isModal: boolean;
  handleCancel: Function;
}) => {
  const handleTryit = () => {
    handleCancel();
  };

  return (
    <Modal
      isOpen={isModal}
      onClose={() => handleCancel()}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="relative flex h-[454px] w-[480px] flex-col justify-start rounded-xl bg-bg-2">
        <div className="flex h-[191px] w-[480px] justify-center rounded-xl bg-gradient-to-b from-[#F7604C4D] via-transparent via-100% to-[#121212]">
          <div className="mt-[70px] flex h-[91px] w-[91px] items-center justify-center rounded-full bg-[#F7604C]">
            <RiVoiceprintLine className="h-[42px] w-[42px]" />
          </div>
        </div>
        <div className="mt-5 flex w-full flex-col gap-4 px-6">
          <span className="text-center  text-2xl font-semibold text-white">
            Congrats, your voice has <br /> been created{" "}
          </span>
          <div className="flex flex-col">
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              Now you can use it and share with others. <br /> If you want
              customize it you are able to do so <br /> through chat settings{" "}
            </span>
          </div>
        </div>
        <div className="mt-8 flex w-full px-6">
          <button
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px]  text-sm font-medium leading-[18px] text-white"
            onClick={() => handleTryit()}
          >
            Try it
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VoiceCreatedModal;
