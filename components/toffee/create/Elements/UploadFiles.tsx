import { RiFilePdfLine, RiFileTextLine, RiFileWordLine, RiFileEditLine, RiDeleteBin6Line, RiFileUploadLine, MingcuteCheckLine, MdiFileImageOutline, MaterialSymbolsVideoFileOutline, MdiFileTableOutline } from "../../icons/Files";
import { CandyFile } from "../Candy";
import React, { useRef, Dispatch, SetStateAction, useState } from "react";
import Modal from "../../../ui/Modal";
import { MdiInformationOutline } from "../../icons/InformationLine";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Tooltip from "../../../ui/Tooltip";
export const getFileIcon = (mimeType: string) => {
  const type = mimeType.toLowerCase();

  if (type.startsWith('application/pdf')) {
    return (
      <div className="p-3 rounded-lg bg-[#FFE8B9]">
        <RiFilePdfLine className="text-black h-6 w-6" />
      </div>
    );
  } else if (type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return (
      <div className="p-3 rounded-lg bg-[#B9E8FF]">
        <RiFileWordLine className="text-black h-6 w-6" />
      </div>
    );
  } else if (type.startsWith('text/plain')) {
    return (
      <div className="p-3 rounded-lg bg-[#b4da6d]">
        <RiFileTextLine className="text-black h-6 w-6" />
      </div>
    );
  } else if (type.startsWith('image')) {
    return (
      <div className="p-3 rounded-lg bg-[#FFEBCC]">
        <MdiFileImageOutline className="text-black h-6 w-6" />
      </div>
    );
  } else if (type.startsWith('video')) {
    return (
      <div className="p-3 rounded-lg bg-[#CCE4FF]">
        <MaterialSymbolsVideoFileOutline className="text-black h-6 w-6" />
      </div>
    );
  } else {
    return (
      <div className="p-3 rounded-lg bg-[#D3D3D3]">
        <MdiFileTableOutline className="text-black h-6 w-6" />
      </div>
    );
  }
}

interface UploadFileProps {
  files: CandyFile[] | null;
  setFiles: Dispatch<SetStateAction<CandyFile[] | null>>;
}

const UploadFiles = ({ files, setFiles }: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [addings, setAddings] = useState<CandyFile[] | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const uploadedFiles = Array.from(newFiles).map(file => ({
        name: file.name,
        file: file,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      }));
      setAddings(prevFiles => prevFiles ? [...prevFiles, ...uploadedFiles] : uploadedFiles);
    }
  };
  const handleFileInput = () => {
    if (addings) {
      setFiles(prevFiles => prevFiles ? [...prevFiles, ...addings] : addings);
      setModal(false);
      setAddings(null);
    } else {
      toast.error(`Please select at least one file before proceeding.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    }
  }
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
  const handleEdit = (index: number, currentName: string) => {
    setEditingFileIndex(index);
    setNewFileName(currentName);
  };

  const handleEditConfirm = (index: number) => {
    if (files) {
      const updatedFiles = files.map((file, idx) =>
        idx === index ? { ...file, name: newFileName } : file
      );
      setFiles(updatedFiles);
      setEditingFileIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    if (files) {
      const updatedFiles = files.filter((_, idx) => idx !== index);
      setFiles(updatedFiles.length > 0 ? updatedFiles : null);
    }
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      handleEditConfirm(index);
    }
  };
  const [modal, setModal] = useState(false);

  return (
    <>
      <span className="text-sm text-text-tertiary mb-[16px]">
        {"Supported formats PNG and JPG, recommended size 260x300. 400KB max"}
      </span>
      <div className="flex flex-col w-full gap-8">
        {files && files.map((file, index) => (
          <div key={index} className="flex flex-row gap-3 w-full text-white items-center">
            <div className="flex items-center justify-center">
              {getFileIcon(file.type)}
            </div>
            <div className="flex flex-col gap-1 flex-grow">
              {editingFileIndex === index ? (
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="text-sm text-text-sub  font-medium bg-transparent border border-white/10 w-full rounded p-1"
                />
              ) : (
                <span className="text-sm text-text-sub  font-medium">{file.name}</span>
              )}
              <span className="text-xs text-text-tertiary ">{file.size}</span>
            </div>
            <div className="flex flex-row text-[#777777] gap-6 ml-auto">
              {editingFileIndex === index ? (
                <MingcuteCheckLine className="h-6 w-6 cursor-pointer" onClick={() => handleEditConfirm(index)} />
              ) : (
                <>
                  <RiFileEditLine className="h-6 w-6 cursor-pointer" onClick={() => handleEdit(index, file.name)} />
                  <RiDeleteBin6Line className="h-6 w-6 cursor-pointer" onClick={() => handleDelete(index)} />
                </>
              )}
            </div>
          </div>
        ))}
        <div onClick={() => setModal(true)} className="rounded-lg w-full flex flex-col gap-2 items-center justify-center border border-dashed border-white/40 p-5 cursor-pointer">
          <div className="flex flex-row gap-2 text-white">
            <RiFileUploadLine className="h-6 w-6" />
            <span className=" font-bold text-sm">Upload Files</span>
          </div>
          <span className="text-text-tertiary  text-sm">{"Supported formats PDF, PNG, MP4, DOC"}</span>
        </div>
        <Modal isOpen={modal} onClose={() => false} className="w-full flex-col flex justify-center items-center">
          <div className="bg-bg-2 w-[476px] rounded-xl flex flex-col p-6 gap-6">
            <div className="w-full flex flex-row items-center gap-2">
              <span className="font-medium text-white">Add your document</span>
              <Tooltip text="Add more labels to increase the effectiveness of your knowledge pack" className="bg-[#242424] text-text-tertiary px-4 py-2 rounded-md text-xs w-64 bottom-8 -left-20">
                <MdiInformationOutline className="h-6 w-6 text-[#777777] cursor-pointer" />
              </Tooltip>
              <X className="h-6 w-6 text-[#777777] cursor-pointer ml-auto" onClick={() => setModal(false)} />
            </div>
            {addings ? addings.map((file, index) => (
              <div key={index} className="flex flex-row gap-3 w-full text-white items-center p-4 border border-dashed border-white/10 rounded-2xl">
                <div className="flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex flex-col gap-1 flex-grow">
                  {editingFileIndex === index ? (
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className="text-sm text-text-sub  font-medium bg-transparent border border-white/10 w-full rounded p-1"
                    />
                  ) : (
                    <span className="text-sm text-text-sub  font-medium">{file.name}</span>
                  )}
                  <span className="text-xs text-text-tertiary ">{file.size}</span>
                </div>
                <div className="flex flex-row text-[#777777] gap-6 ml-auto">
                  {editingFileIndex === index ? (
                    <MingcuteCheckLine className="h-6 w-6 cursor-pointer" onClick={() => handleEditConfirm(index)} />
                  ) : (
                    <>
                      <RiFileEditLine className="h-6 w-6 cursor-pointer" onClick={() => handleEdit(index, file.name)} />
                      <RiDeleteBin6Line className="h-6 w-6 cursor-pointer" onClick={() => handleRemoving(index)} />
                    </>
                  )}
                </div>
              </div>
            )) : <div onClick={triggerFileUpload} className="rounded-lg w-full h-[222px] flex flex-col gap-2 items-center justify-center border border-dashed border-white/20 p-5 cursor-pointer">
              <div className="flex flex-row gap-2 text-white">
                <RiFileUploadLine className="h-6 w-6" />
                <span className=" font-bold text-sm">Add document</span>
              </div>
              <span className="text-text-tertiary  text-sm">{"Supported formats PDF, PNG, MP4, DOC"}</span>
            </div>}

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
            />
            {/* TODO: Adding label */}
            <div className="w-full cursor-pointer bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full text-center text-white px-4 py-1.5 font-medium border border-white/20" onClick={handleFileInput}>Add file</div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default UploadFiles;