import { KnowledgeFile, KnowledgeText, KnowledgeLink } from "@prisma/client";
import { FilesPrivate } from "../../icons/Lock";
import Image from "next/image";
import { getFileIcon } from "./UploadFiles";
import { RiDeleteBin6Line } from "../../icons/Files";
import { PlusIcon, X } from "lucide-react";
import Modal from "../../../ui/Modal";
import axios from "axios";
import { useState } from "react";
import { formatBytes } from "./EditCandy";
import UploadFiles from "../../create/Elements/UploadFiles";
import AddText from "../../create/Elements/AddText";
import AddLink from "../../create/Elements/AddLink";
import { CandyFile, CandyText, CandyLink } from "../../create/Candy";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const Files = ({
  files,
  setFiles,
  texts,
  setTexts,
  links,
  setLinks,
  isPersonal
}: {
    files: Partial<KnowledgeFile>[] | undefined;
    texts: Partial<KnowledgeText>[] | undefined;
    links: Partial<KnowledgeLink>[] | undefined;
    setFiles: (newFiles: Partial<KnowledgeFile>[] | undefined) => void;
    setTexts: (newTexts: Partial<KnowledgeText>[] | undefined) => void;
    setLinks: (newLinks: Partial<KnowledgeLink>[] | undefined) => void;
    isPersonal: boolean
  }) => {
  const params = useParams();
  const router = useRouter();
  
  const [isModal, setIsModal] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<string | undefined>("");

  const [addedFiles, setAddedFiles] = useState<CandyFile[] | null>(null);
  const [addedTexts, setAddedTexts] = useState<CandyText[] | null>(null);
  const [addedLinks, setAddedLinks] = useState<CandyLink[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      addedFiles?.forEach(item => {
        if (item.file)
          formData.append('files', item.file)
      });
      formData.append('texts', JSON.stringify(addedTexts));
      formData.append('links', JSON.stringify(addedLinks));
      
      setIsLoading(true);
      // formData.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
      const response = await fetch(`/api/knowledge/${params.knowledgeId}`, {
        method: "PUT",
        body: formData
      });

      setIsLoading(false);
      setIsAdd(false);
      if (response.ok) {
        toast.success("Success updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        router.push(`/knowledge/${params.knowledgeId}?tab=files`)
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

  const deleteFile = () => {
    if (fileId) {
      setLoading(true);
      axios.delete(`/api/file/${fileId}/${selectedType}`)
        .then((res) => {
          setLoading(false);
          setIsModal(false);
          if (selectedType === "FILE")
            setFiles(files?.filter(item => item.id !== fileId));
          else if (selectedType === "TEXT") 
            setTexts(files?.filter(item => item.id !== fileId));
          else if (selectedType === "LINK")
            setLinks(files?.filter(item => item.id !== fileId));
        })
        .catch(() => {
          setIsModal(false);
        })
    }
  };

  return (
    <div className="flex-grow items-center flex flex-col">
      {isAdd ? (
        <div className="no-scrollbar flex h-full w-full max-w-[560px] flex-col gap-[32px] overflow-x-visible">
          
          <div className="flex flex-col gap-4 relative">
            <div className="w-full text-start text-[20px] font-semibold leading-[28px] text-white md:text-[32px] md:leading-[40px]">
              Add more knowledge
            </div>
            <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer top-1 right-0 absolute" onClick={() => setIsAdd(false)} />
            <UploadFiles files={addedFiles} setFiles={setAddedFiles} />
          </div>
          <AddText texts={addedTexts} setTexts={setAddedTexts} />
          <AddLink links={addedLinks} setLinks={setAddedLinks} />
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
      ) : (files && texts && links) ? (
        <div className="flex w-full flex-row flex-wrap gap-3">  
          {isPersonal &&
            <div
              key={"Add"}
              className="flex w-[210px] h-[160px] flex-col items-center justify-start gap-5 border border-neutral-800 rounded-2xl px-5 pt-6 cursor-pointer"
              onClick={() => setIsAdd(true)}
            >
              <div className="flex items-center justify-center">
                <div className="p-3 rounded-lg bg-[#BC7F44] cursor-pointer">
                  <PlusIcon className="text-white h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="text-[14px]  font-medium leading-normal text-center text-white">
                  {"Add more knowledge"}
                </div>
                <div className="text-[12px]  font-normal leading-5 text-center text-[#787878]">
                  {"PDF, PNG, MP4, DOC"}
                </div>
              </div>
            </div>
          }
          {files?.map((item, index) => (  
            <div  
              key={index}  
              className="flex w-[210px] h-[160px] flex-col items-center justify-start gap-5 border border-neutral-800 rounded-2xl px-5 pt-6 relative"  
            >
              <div className="absolute top-2 right-4 bg-[#202020] rounded-[20px] p-[6px] gap-1">
                <RiDeleteBin6Line className="h-6 w-6 cursor-pointer text-[#777777]" onClick={() => { setIsModal(true); setFileId(item.id); setSelectedType("FILE"); }} />
              </div>
              <div className="flex items-center justify-center">
                {getFileIcon(item.type)}
              </div>
              <div className="flex flex-col gap-2 items-center justify-center w-full">  
                <p className="text-sm text-text-sub  font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{item.name}</p>   
                <div className="text-[12px]  font-normal leading-5 text-center text-[#787878]">  
                  {formatBytes(item.size ? item.size : 0)}
                </div>  
              </div>  
            </div>  
          ))}
          {texts?.map((item, index) => (  
            <div  
              key={index}  
              className="flex w-[210px] h-[160px] flex-col items-center justify-start gap-5 border border-neutral-800 rounded-2xl px-5 pt-6 relative"  
            >
              <div className="absolute top-2 right-4 bg-[#202020] rounded-[20px] p-[6px] gap-1">
                <RiDeleteBin6Line className="h-6 w-6 cursor-pointer text-[#777777]" onClick={() => { setIsModal(true); setFileId(item.id); setSelectedType("TEXT"); }} />
              </div>
              <div className="flex items-center justify-center">
                {getFileIcon("")}
              </div>
              <div className="flex flex-col gap-2 items-center justify-center w-full">  
                <p className="text-sm text-text-sub  font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{item.name}</p>   
                <div className="text-[12px]  font-normal leading-5 text-center text-[#787878]">  
                  {formatBytes(item.size ? item.size : 0)}
                </div>  
              </div>  
            </div>  
          ))}
          {links?.map((item, index) => (  
            <div  
              key={index}  
              className="flex w-[210px] h-[160px] flex-col items-center justify-start gap-5 border border-neutral-800 rounded-2xl px-5 pt-6 relative"  
            >
              <div className="absolute top-2 right-4 bg-[#202020] rounded-[20px] p-[6px] gap-1">
                <RiDeleteBin6Line className="h-6 w-6 cursor-pointer text-[#777777]" onClick={() => { setIsModal(true); setFileId(item.id); setSelectedType("LINK"); }} />
              </div>
              <div className="flex items-center justify-center">
                <img src={item.icon} alt="Link Icon" className="w-12 h-12 rounded-md"/>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center w-full">  
                <p className="text-sm text-text-sub  font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{item.name}</p>   
                <div className="text-[12px]  font-normal leading-5 text-center text-[#787878]">  
                {formatBytes(item.size ? item.size : 0)}
                </div>  
              </div>  
            </div>  
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-w-72 items-center">
          <FilesPrivate />
          <span className="text-base  text-text-sub font-medium text-center mt-2">Files are private</span>
          <span className="text-sm text-text-tertiary  text-center">The creator of the Knowledge Pack has chosen to keep thecontents private</span>
        </div>
      )}
      <Modal isOpen={isModal} onClose={() => setIsModal(false)} className="w-full flex-col flex justify-center items-center">
        <div className="flex flex-col bg-bg-2 w-[368px] h-[172px] justify-start rounded-xl px-8">
          <span className="mt-8 text-white text-sm  font-medium text-center">{"You want to delete this file?"}</span>
          <span className=" mt-2 text-[#B1B1B1] text-sm  font-normal text-center">{"If you delete it, you can't recover it."}</span>
          <div className="flex flex-row justify-center gap-2 mt-10">
            <button onClick={() => setIsModal(false)} className=" w-full bg-[#202020]/30 rounded-full text-center text-white px-4 py-1.5 cursor-pointer font-normal text-sm border border-white/20">
              Cancel
            </button>
            <button onClick={() => deleteFile()} className="w-full flex justify-center cursor-pointer bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full text-center text-white px-4 py-1.5 font-normal text-sm border border-white/20">
              {loading ? <Image
                src={"/loading.svg"}
                alt="loading_svg"
                width={24}
                height={24}
              /> : "Yes, leave"
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Files;