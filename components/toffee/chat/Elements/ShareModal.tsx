import { Dispatch } from "react";
import Modal from "../../../ui/Modal";
import { X } from "lucide-react";
import { WhatsappIcon, TelegramIcon, TwitterIcon, FacebookIcon, LinkIcon } from '../../icons/Socials';
import { Star7, Star8, Star9, Star10, UploadIcon } from "../../icons/ShareChatIcons";

export const ShareModal = ({
  isShareModal,
  setShareModal
}: {
  isShareModal: boolean;
  setShareModal: Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal isOpen={isShareModal} onClose={() => setShareModal(false)} className="w-full flex-col flex justify-center items-center">
      <div className="flex flex-col w-[480px] h-[433px] shrink-0 rounded-lg bg-[#121212]">
        <div className="w-full h-[191px] shrink-0 bg-gradient-to-b from-[rgba(244,184,88,0.10)] to-[rgba(244,184,88,0)] relative">
          <X className="h-6 w-6 text-[#777777] cursor-pointer right-4 top-4 absolute" onClick={() => setShareModal(false)} />
          <Star7 className="w-[20.391px] h-[20.391px] shrink-0 rotate-[-60deg] opacity-30 left-[161px] top-[133px] absolute" />
          <Star8 className="w-[17.202px] h-[17.202px] shrink-0 rotate-[-26.666deg] opacity-30 left-[280px] top-[48px] absolute" />
          <Star9 className="w-[11.3px] h-[11.3px] shrink-0 rotate-[-26.666deg] opacity-30 left-[180px] top-[54px] absolute" />
          <Star10 className="w-[8.778px] h-[8.778px] shrink-0 rotate-[28.972deg] opacity-30 left-[282px] top-[130px] absolute" />
          <div className="flex mx-[200px] mt-[63px] justify-center items-center w-20 h-20 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
            <UploadIcon />
          </div>
        </div>
        <div className="flex flex-col w-full h-[242px] text-white text-sm  font-medium text-center items-center">
          <div className="w-[310px] h-[114px] items-center">
            <span className="flex flex-col text-[#FFF] text-center  text-2xl font-semibold leading-8">Share with others</span>
            <span className="flex flex-col mt-4 text-[#777] text-center  text-sm font-normal leading-[22px]">Now you can use it and share with others. If you want customize it you are able to do so through chat settings</span>
          </div>
          <div className='flex flex-row gap-3 mt-8 rounded-full w-full items-center justify-center text-white'>
            <div className="flex justify-center items-center w-12 h-12 p-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
              <WhatsappIcon className="w-6 h-6" />
            </div>
            <div className="flex justify-center items-center w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
              <TelegramIcon />
            </div>
            <div className="flex justify-center items-center w-12 h-12 p-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
              <TwitterIcon className="w-6 h-6" />
            </div>
            <div className="flex justify-center items-center w-12 h-12 p-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
              <FacebookIcon className="w-6 h-6" />
            </div>
            <div className="flex justify-center items-center w-12 h-12 p-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121212] cursor-pointer">
              <LinkIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}