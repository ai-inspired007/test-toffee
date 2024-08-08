"use client";

import { ChatRequestOptions } from "ai";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { SendHorizonal, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "@/components/toffee/icons/Files";
import Image from "next/image";

import { ImageUpload } from "./ImageUpload";
import { Paperclip, Headphones } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadCharacterPic, validImageInputTypes } from "@/lib/upload/util";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { Textarea } from "@/components/ui/textarea";
import { useMicrophone } from "@/contexts/Microphone";
import { cn } from "@/lib/utils";
import { CandyFile } from "@/components/toffee/knowledge/Create";
import {getFileIcon} from "@/components/toffee/knowledge/Elements/UploadFiles"
import axios, { AxiosResponse } from "axios";

interface ChatFormProps {
  chatId: string;
  input: string;
  name: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void;
  isLoading: boolean;
  updateImage: Dispatch<SetStateAction<string>>;
  value: string;
  showImage: boolean;
  toggleShowImage: Dispatch<SetStateAction<boolean>>;
  uploadLoading: boolean;
  setUploadLoading: Dispatch<SetStateAction<boolean>>;
  needsOverlay?: boolean;
  file: CandyFile | null,
  setFile: Dispatch<SetStateAction<CandyFile | null>>;
  setFileKey: Dispatch<SetStateAction<string>>;
  setFileName: Dispatch<SetStateAction<string>>;
  setFileType: Dispatch<SetStateAction<string>>;
  setIsVoice: Dispatch<SetStateAction<boolean>>;
}

export const ChatForm = forwardRef<HTMLInputElement, ChatFormProps>(
  (
    {
      chatId,
      input,
      name,
      handleInputChange,
      onSubmit,
      isLoading, // API loading
      updateImage,
      value,
      showImage,
      toggleShowImage,
      setUploadLoading,
      uploadLoading,
      needsOverlay,
      file,
      setFile,
      setFileKey,
      setFileName,
      setFileType,
      setIsVoice
    }: ChatFormProps,
    ref,
  ) => {
    const streamingCompletionContext = useContext(StreamingCompletionContext);
    // const formRef = undefined;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const formData = new FormData();
    
    const [fileUploading, setFileUploading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const {
      microphone,
      initMicrophone,
    } = useMicrophone();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = e.target.files![0];
      if (!validImageInputTypes.includes(newFile.type)) {
        setFile({
          name: newFile.name,
          file: newFile,
          size: `${(newFile.size / 1024).toFixed(2)} KB`,
          type: newFile.type,
        })
        formData.append("file", newFile)
        setFileUploading(true);

        axios.post(`/api/chat/${chatId}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res: any) => {
            // console.log(res.data.key);
            setFileUploading(false);
            setFileKey(res.data.key);
            setFileName(newFile.name);
            setFileType(newFile.type);
          })
          .catch((err: any) => {
            toast({
              description: err.response.data,
              variant: "destructive",
            });
          });
      } else {
        setFile(null);
        const fileBlob = newFile as Blob;
        setUploadLoading(true);
        const tempUrl = URL.createObjectURL(fileBlob);
        //   setFile(e.target.files![0]);
        updateImage(tempUrl);
        toggleShowImage(true);

        let publicUrl = null;
        uploadCharacterPic(newFile, "chat", uploadLoading)
          .then((result) => {
            publicUrl = result;
            setUploadLoading(false);
            updateImage(publicUrl);
            URL.revokeObjectURL(tempUrl);
          });
        e.target.value = "";
      }
    };

    const handleRemoving = () => {
      if (file) {
        setFile(null);
      }
    };

    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height =
          Math.min(200, textAreaRef.current.scrollHeight) + "px";
      }
    }, [input]);

    useEffect(() => {
      if (microphone) {
        setIsVoice(true);
      }
    }, [microphone]);

    return (
      <div className="mb-4 px-4 w-full max-w-[650px] absolute bottom-0">
        {showImage && (
          <div className="rounded-full border-opacity-20">
            <ImageUpload
              value={value} // src
              onChange={(src) => {
                updateImage(src);
                toggleShowImage(!(src === ""));
              }}
              size={32}
              gcpBucket={"chat"}
              disabled={isLoading || uploadLoading}
              setIsLoading={setUploadLoading}
            />
          </div>
        )}
        <div className={`flex flex-col w-full rounded-3xl ${isFocused && "border-[#B77536] border"} ${(file && !isLoading) && "border-[#B77536] border"} bg-[#202020]`}>
          <div className={file && !isLoading ? "flex flex-row items-center w-full py-2 border-b-gray-400 flex-wrap border-b-[1px]" : ""}>
          {
            (file && !isLoading) && (
              <>
                <div key="user-file" className="flex flex-row gap-2 max-w-[250px] min-w-[250px] max-h-[100px] text-white items-center p-3 py-1">
                  <div className="flex items-center justify-center relative ">
                    {getFileIcon(file.type)}
                      {/* {fileUploading && (
                        <div className="absolute w-full h-full flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                          <Image
                            src={"/loading.svg"}
                            alt="loading_svg"
                            width={24}
                            height={24}
                          />
                        </div>)
                      } */}
                      
                  </div>
                  <p className="text-sm text-text-sub font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{file.name}</p>
                  <div className="flex flex-row text-[#777777] gap-6 ml-auto">
                      {
                        fileUploading ? (
                          <div className="w-full h-full flex items-center">
                            <Image
                              src={"/loading.svg"}
                              alt="loading_svg"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          <RiDeleteBin6Line className="h-6 w-6 cursor-pointer" onClick={() => handleRemoving()} />
                        )
                      }
                  </div>
                </div>
                {/* {
                  index < files.length-1 && <div className="w-5/6 sm:w-[1px] h-[1px] sm:h-8 m-auto sm:m-0 bg-gray-400"></div>
                }   */}
              </>
            )}
          </div>
          <div className="p-2 flex flex-row w-full items-center">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept={validImageInputTypes.join(", ") + ", application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
              className="hidden"
            />
            <form onSubmit={onSubmit} className="flex w-full items-center">
              <Textarea
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder={"Write a message"}
                className="border-none text-base focus:outline-none md:text-sm"
                rows={1}
                ref={textAreaRef}
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)}
                onPaste={(e) => {
                  const files = e.clipboardData.files;
                  if (!files) return;
                  const file = files[0];
                  console.log(file.type);
                  if (!validImageInputTypes.includes(file.type)) {
                    toast({
                      variant: "destructive",
                      description: `Invalid image input type. ${validImageInputTypes.join(
                        ", ",
                      )} are accepted.`,
                    });
                    return;
                  }

                  const fileBlob = file as Blob;
                  setUploadLoading(true); // so that a form submit can't happen
                  const tempUrl = URL.createObjectURL(fileBlob);
                  //   setFile(e.target.files![0]);
                  updateImage(tempUrl); // update image src
                  toggleShowImage(true); // show's image to user

                  let publicUrl = null;
                  uploadCharacterPic(file, "chat", uploadLoading).then(
                    (result) => {
                      publicUrl = result;
                      setUploadLoading(false);
                      updateImage(publicUrl);
                      URL.revokeObjectURL(tempUrl);
                    },
                  );
                }}
                onKeyDown={(e) => {
                  // Allow multiple lines in mobile devices (width < 640) pressing enter
                  // Tablet users can't do this, so that's a chore we might need to do
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    window.screen.width >= 640
                  ) {
                    document.getElementById("submit-button")?.click();
                  }
                }}
              />
              <Button disabled={uploadLoading} variant="ghost" id="submit-button" className="hidden">
                <SendHorizonal className="h-6 w-6" />
              </Button>
            </form>
            <Button
              disabled={isLoading || uploadLoading}
              variant="ghost"
              // onClick={() => toggleShowImage(!showImage)}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="cursor-pointer" onClick={() => initMicrophone()}>
              <Headphones className="h-9 w-9 rounded-full bg-[#C28851] p-2" />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ChatForm.displayName = "ChatForm";
