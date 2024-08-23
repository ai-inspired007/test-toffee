import { Dispatch, useState } from "react";
import Modal from "../../Modal";
import { X } from "lucide-react";
import SelectReason, { ReasonProps } from "./SelectReason";
import axios from "axios";

export const ReportModal = ({
  characterId,
  isReportModal,
  setReportModal
}: {
  characterId: string;
  isReportModal: boolean;
  setReportModal: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const reasonOptions: ReasonProps[] = [
    { value: 'sensitive', label: 'Sensitive content' },
  ];
  const [selectedOption, setSelectedOption] = useState(reasonOptions[0].value);
  const [description, setDescription] = useState("");

  const onReport = () => {
    axios.post(`/api/character/${characterId}/report`, {
      reportReason: selectedOption,
      reportContent: description
    })
      .catch(err => {
        console.log(err);
      });
    
    setReportModal(false);
  }

  return (
    <Modal isOpen={isReportModal} onClose={() => setReportModal(false)} className="w-full flex-col flex justify-end sm:justify-center items-center h-full">
      <div className="w-full flex sm:hidden items-center justify-center mb-1">
        <div className="rounded-full w-12 h-[5px] bg-bg-3"/>
      </div>
      <div className="flex flex-col bg-bg-3 sm:w-[476px] w-full h-[352px] justify-start rounded-2xl px-6 gap-6">
        <div className="w-full flex justify-between h-[48px] text-white text-lg  font-medium text-center">
          <span className="mt-[18px] font-medium text-white">Report this chat</span>
          <X className="h-6 w-6 mt-[18px] text-[#777777] cursor-pointer ml-auto" onClick={() => setReportModal(false)} />
        </div>
        <div className="w-full h-[68px] text-white text-sm  font-medium justify-start">
          <SelectReason options={reasonOptions} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        </div>
        <div className="w-full h-[104px] text-white text-sm  font-medium text-center justify-start">
          <div className="flex flex-col gap-1">
            <div className="flex justify-start">
              <span className="text-xs font-semibold text-text-tertiary">{"Description"}</span>
            </div>
            <div className="relative w-full">
              <textarea name="description" id="" className="w-full h-[84px] text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center gap-2 h-[36px]">
          <button onClick={() => setReportModal(false)} className="w-full bg-[#202020]/30 rounded-full text-center text-white px-4 py-1.5 cursor-pointer font-normal text-sm border border-white/20">
            Cancel
          </button>
          <button className="w-full flex justify-center cursor-pointer bg-gradient-to-r from-[#DF1C41] to-[#DF1C41] rounded-full text-center text-white px-4 py-1.5 font-normal text-sm border border-white/20" onClick={() => onReport()}>
            Report
          </button>
        </div>
      </div>
    </Modal>
  );
}