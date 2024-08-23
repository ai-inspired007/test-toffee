"use client";
import React, { useState } from "react";
import UploadImage from "./UploadImage";
import UploadFiles from "./UploadFiles";
import AddText from "./AddText";
import AddLink from "./AddLink";
import { X } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { CandyFile, CandyText, CandyLink } from "../Create";
import ProgressBar from "./ProgressBar";
import { KnowledgeFile, KnowledgeLink, KnowledgeText } from "@prisma/client";
import { useRouter } from "next/navigation";

const MAX_VOLUME_BYTES = 10 * 1024 * 1024;

const convertToBytes = (size: string): number => {
  const unit = size.slice(-2).toUpperCase();
  const value = parseFloat(size.slice(0, -2));

  switch (unit) {
    case "KB":
      return value * 1024;
    case "MB":
      return value * 1024 * 1024;
    case "GB":
      return value * 1024 * 1024 * 1024;
    default:
      return value;
  }
};

const calculateTotalSize = (
  oldFiles: Partial<KnowledgeFile>[] | undefined,
  files: CandyFile[] | null,
  texts: CandyText[] | undefined,
  links: CandyLink[] | undefined
): number => {
  const oldFileTotal = oldFiles? oldFiles.reduce((total, file: any) => total + file.size, 0) : 0;
  const fileTotal = files? files.reduce((total, file) => total + convertToBytes(file.size), 0) : 0;
  const textTotal = texts? texts.reduce((total, text: any) => total + text.content?.length, 0): 0;
  return oldFileTotal + fileTotal + textTotal
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

const EditCandy = ({
  knowledgeId,
  setIsEdit,
  files,
  texts,
  links,
  image
}: {
    knowledgeId: string;
    files: Partial<KnowledgeFile>[] | undefined;
    texts: Partial<KnowledgeText>[] | undefined;
    links: Partial<KnowledgeLink>[] | undefined;
    setIsEdit: (isEdit: boolean) => void;
    image: string | null | undefined;
  }) => {
    const router = useRouter();
    
  const [imageURL, setImageURL] = useState<string | null>(image ? image: null);
  const [bgFile, setBgFile] = useState<File | null>(null);

  const [uploadedFiles, setCandyFiles] = useState<CandyFile[] | null>(null);
  const [addedTexts, setTexts] = useState<CandyText[] | undefined>(texts?.map(item => ({ id: item.id, content: item.content, knowledgePackId: item.knowledgePackId})));
  const [addedLinks, setLinks] = useState<CandyLink[] | undefined>(links?.map(item => ({ id: item.id, title: item.name, url: item.url, icon: item.icon, knowledgePackId: item.knowledgePackId})));

  const [oldFiles, setOldFiles] = useState(files);

  const totalSizeBytes = calculateTotalSize(oldFiles, uploadedFiles, addedTexts, addedLinks);
  const progressPercentage = Math.min((totalSizeBytes / MAX_VOLUME_BYTES) * 100, 100);
  const formattedSize = formatBytes(totalSizeBytes);

  
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      if (bgFile)
        formData.append('image', bgFile);
      uploadedFiles?.forEach(item => {
        if (item.file)
          formData.append('files', item.file)
      });
      formData.append('texts', JSON.stringify(addedTexts));
      formData.append('links', JSON.stringify(addedLinks));

      const remainFileIds = oldFiles?.map(item => item.id);
      const removeFileIds = files?.filter(item => !remainFileIds?.includes(item.id)).map(item => item.id);
      
      const remainTextIds = addedTexts?.filter(item => item.id !== "").map(item => item.id);
      const removeTextIds = texts?.filter(item => !remainTextIds?.includes(item.id)).map(item => item.id);

      const remainLinkIds = addedLinks?.filter(item => item.id !== "").map(item => item.id);
      const removeLinkIds = links?.filter(item => !remainLinkIds?.includes(item.id)).map(item => item.id);

      formData.append('deletedFiles', JSON.stringify(removeFileIds));
      formData.append('deletedTexts', JSON.stringify(removeTextIds));
      formData.append('deletedLinks', JSON.stringify(removeLinkIds));
      
      setIsLoading(true);
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        method: "PUT",
        body: formData
      });

      setIsLoading(false);
      setIsEdit(false);
      if (response.ok) {
        toast.success("Success updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        router.refresh();
      } else {
        const error = await response.text();
        toast.error(`Error updating user: ${error}`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Error updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto no-scrollbar">
      <ToastContainer />
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer top-6 right-6 fixed" onClick={() => setIsEdit(false)} />
        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible justify-center">
          <div className="w-full text-start text-[32px] font-medium text-white mt-16">
            Edit your candy
          </div>
          <ProgressBar percentage={progressPercentage} value={formattedSize} max={"10 MB"} />
          <UploadImage
            onChange={setImageURL}
            value={imageURL}
            setFile={setBgFile}
          />
          <UploadFiles files={uploadedFiles} setFiles={setCandyFiles} oldFiles={oldFiles} setOldFiles={setOldFiles} />
          <AddText texts={addedTexts} setTexts={setTexts} />
          <AddLink links={addedLinks} setLinks={setLinks} />
          <div className="flex items-center justify-between w-full h-[56px] mt-6 bg-white rounded-full">
            <span className="w-[300px] ml-6 my-5 text-black  text-sm">Careful - you have unsaved changes!</span>
            <button onClick={() => handleUpdate()} className="flex w-[134px] justify-center mr-4 cursor-pointer bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full text-center text-white px-4 py-1.5 font-normal text-sm border border-white/20">
              {isLoading ? <Image
                src={"/loading.svg"}
                alt="loading_svg"
                width={24}
                height={24}
              /> : "Save changes"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCandy;