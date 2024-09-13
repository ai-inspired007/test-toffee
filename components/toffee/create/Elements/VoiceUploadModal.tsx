import { Dispatch, SetStateAction, useRef, useState } from "react";
import Modal from "../../../ui/Modal";
import {
  RiFilePdfLine,
  RiFileTextLine,
  RiFileWordLine,
  RiFileEditLine,
  RiDeleteBin6Line,
  RiFileUploadLine,
  MingcuteCheckLine,
  MdiFileImageOutline,
  MaterialSymbolsVideoFileOutline,
  MdiFileTableOutline,
} from "../../icons/Files";
import { CandyFile } from "../Candy";
import { MdiInformationOutline } from "../../icons/InformationLine";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Tooltip from "../../../ui/Tooltip";
import { getFileIcon } from "./UploadFiles";
import { validAudioInputTypes } from "@/lib/upload/util";
import { VoiceType } from "@/app/(create)/create/voice/page";

const VoiceUploadModal = ({
  isModal,
  files,
  setStep,
  setModal,
  setFiles,
  setIsGeneratingVoice,
  setUploadedVoice,
}: {
  isModal: boolean;
  files: CandyFile[] | null;
  setStep: Dispatch<React.SetStateAction<number>>;
  setModal: Dispatch<React.SetStateAction<boolean>>;
  setFiles: Dispatch<SetStateAction<CandyFile[] | null>>;
  setIsGeneratingVoice: Dispatch<React.SetStateAction<boolean>>;
  setUploadedVoice: Dispatch<React.SetStateAction<VoiceType | undefined>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [addings, setAddings] = useState<CandyFile[] | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const uploadedFiles = Array.from(newFiles).map((file) => ({
        name: file.name,
        file: file,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      }));
      setAddings((prevFiles) =>
        prevFiles ? [...prevFiles, ...uploadedFiles] : uploadedFiles,
      );
    }
  };

  const handleCreateVoice = () => {
    setIsGeneratingVoice(true);
    const uploadedFile = addings?.[0];
    if (uploadedFile) {
      const labels = {
        mode: "uploaded",
      };
      const formData = new FormData();
      formData.append("name", uploadedFile?.name?.split(".")?.[0]);
      formData.append("description", uploadedFile?.name);
      formData.append("labels", JSON.stringify(labels));
      if (uploadedFile?.file) {
        formData.append("files", uploadedFile.file);
      }

      fetch("/api/voice", {
        method: "POST",
        body: formData,
      })
        .then((res1) => res1.json())
        .then((data1: any) => {
          if (data1.voiceDetail.voiceId) {
            console.log("Voice ID:", data1.voiceDetail.voiceId);
            const voiceData: VoiceType = {
              name: data1.voiceDetail.name,
              voiceId: data1.voiceDetail.voiceId,
              description: data1.voiceDetail.description,
              audioUrl: data1.voiceDetail.preview_url,
              itemTypeId: "",
            };
            setUploadedVoice(voiceData);
            setTimeout(() => {
              setStep(2);
              setIsGeneratingVoice(false);
            }, 500);
          } else {
            console.log(data1);
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
    }
  };

  const handleFileInput = () => {
    if (addings) {
      setFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...addings] : addings,
      );
      setModal(false);
      setAddings(null);
      handleCreateVoice();
    } else {
      toast.error(`Please select at least one file before proceeding.`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  };
  const handleRemoving = (index: number) => {
    if (addings) {
      const updatedFiles = addings.filter((_, idx) => idx !== index);
      setAddings(updatedFiles.length > 0 ? updatedFiles : null);
    }
  };
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditConfirm = (index: number) => {
    if (files) {
      const updatedFiles = files.map((file, idx) =>
        idx === index ? { ...file, name: newFileName } : file,
      );
      setFiles(updatedFiles);
      setEditingFileIndex(null);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Enter") {
      handleEditConfirm(index);
    }
  };

  return (
    <Modal
      isOpen={isModal}
      onClose={() => setModal(false)}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="flex w-[476px] flex-col gap-6 rounded-xl bg-bg-2 p-6">
        <div className="flex w-full flex-row items-center gap-2">
          <span className="font-medium text-white">Add your audio file</span>
          <Tooltip
            text="Add more labels to increase the effectiveness of your knowledge pack"
            className="-left-20 bottom-8 w-64 rounded-md bg-[#242424] px-4 py-2 text-xs text-text-tertiary"
          >
            <MdiInformationOutline className="h-6 w-6 cursor-pointer text-[#777777]" />
          </Tooltip>
          <X
            className="ml-auto h-6 w-6 cursor-pointer text-[#777777]"
            onClick={() => setModal(false)}
          />
        </div>
        {addings ? (
          addings.map((file, index) => (
            <div
              key={index}
              className="flex w-full flex-row items-center gap-3 rounded-2xl border border-dashed border-white/10 p-4 text-white"
            >
              <div className="flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <div className="flex flex-grow flex-col gap-1">
                {editingFileIndex === index ? (
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className="w-full rounded  border border-white/10 bg-transparent p-1 text-sm font-medium text-text-sub"
                  />
                ) : (
                  <span className="text-sm font-medium  text-text-sub">
                    {file.name}
                  </span>
                )}
                <span className="text-xs text-text-tertiary ">{file.size}</span>
              </div>
              <div className="ml-auto flex flex-row gap-6 text-[#777777]">
                {editingFileIndex === index ? (
                  <MingcuteCheckLine
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => handleEditConfirm(index)}
                  />
                ) : (
                  <>
                    {/* <RiFileEditLine
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => handleEdit(index, file.name)}
                    /> */}
                    <RiDeleteBin6Line
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => handleRemoving(index)}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            onClick={triggerFileUpload}
            className="flex h-[222px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 p-5"
          >
            <div className="flex flex-row items-center gap-2">
              <RiFileUploadLine className="h-6 w-6 text-white" />
              <span className=" text-sm font-medium leading-[18px] text-white">
                Upload audio
              </span>
            </div>
            <span className="text-center  text-sm font-normal leading-[22px] text-text-tertiary">
              {
                "For the best results, upload a clear 20-30 second audio clip. Avoid background noise"
              }
            </span>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
          accept={validAudioInputTypes.join(", ")}
        />
        <div
          className="w-full cursor-pointer rounded-full border border-white/20 bg-gradient-to-r from-[#C28851] to-[#B77536] px-4 py-1.5 text-center font-medium text-white"
          onClick={handleFileInput}
        >
          Create voice
        </div>
      </div>
    </Modal>
  );
};

export default VoiceUploadModal;
