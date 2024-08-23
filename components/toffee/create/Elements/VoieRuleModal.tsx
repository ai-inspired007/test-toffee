import { Dispatch, useState } from "react";
import Modal from "../../../ui/Modal";
import { X } from "lucide-react";
import Image from "next/image";

const VoiceRuleModal = ({
  isModal,
  handleCancel,
  handleAgree,
}: {
  isModal: boolean;
  handleCancel: Function;
  handleAgree: Function;
}) => {
  return (
    <Modal
      isOpen={isModal}
      onClose={() => handleCancel()}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="relative flex h-[396px] w-[515px] flex-col justify-start rounded-xl bg-bg-2">
        <div className="absolute right-4 top-3 flex">
          <X
            className="z-10 ml-auto h-6 w-6 cursor-pointer text-[#777777]"
            onClick={() => handleCancel()}
          />
        </div>
        <div className="absolute top-[176px] flex w-full flex-col gap-4 px-6">
          <span className="text-center  text-2xl font-semibold text-white">
            Rules for personal voice
          </span>
          <div className="flex flex-col">
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              Never record third parties without their consent.
            </span>
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              Don’t use voices to engage in deepfakes, fraud, scammers, or
              bullying.
            </span>
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              Don’t use protected intellectual property without approval.
            </span>
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              Always use voices for good and have fun!
            </span>
          </div>
        </div>
        <div className="absolute top-[336px] flex w-full px-6">
          <button
            className="w-full rounded-[20px] border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-[6px]  text-sm font-medium leading-[18px] text-white"
            onClick={() => handleAgree()}
          >
            Agree
          </button>
        </div>
        <div className="absolute top-[20px] flex w-full justify-center">
          <Image
            src="/voice_rule.svg"
            width={0}
            height={0}
            alt="rule"
            className="h-[140px] w-[140px]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default VoiceRuleModal;
