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
import { SendHorizonal, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ImageUpload } from "./ImageUpload";
import { Paperclip, Headphones } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadCharacterPic, validImageInputTypes } from "@/lib/upload/util";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { Textarea } from "@/components/ui/textarea";

interface ChatFormProps {
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
}

export const ChatForm = forwardRef<HTMLInputElement, ChatFormProps>(
  (
    {
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
    }: ChatFormProps,
    ref,
  ) => {
    const streamingCompletionContext = useContext(StreamingCompletionContext);
    // const formRef = undefined;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height =
          Math.min(200, textAreaRef.current.scrollHeight) + "px";
      }
    }, [input]);
    return (
      <div className="mb-4 px-4 w-full max-w-[650px]">
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
        <div className="flex w-full flex-row items-center rounded-full bg-[#202020] p-1">
          <input
            type="file"
            id="file-input"
            onChange={async (e) => {
              const file = e.target.files![0];
              // console.log(file);
              const fileBlob = file as Blob;
              setUploadLoading(true);
              const tempUrl = URL.createObjectURL(fileBlob);
              //   setFile(e.target.files![0]);
              updateImage(tempUrl);
              toggleShowImage(true);

              let publicUrl = null;
              uploadCharacterPic(file, "chat", uploadLoading).then((result) => {
                publicUrl = result;
                setUploadLoading(false);
                updateImage(publicUrl);
                URL.revokeObjectURL(tempUrl);
              });
              e.target.value = "";
            }}
            accept={validImageInputTypes.join(", ")}
            className="hidden"
          />
          <form onSubmit={onSubmit} className="flex w-full">
            <Textarea
              disabled={isLoading}
              value={input}
              onChange={handleInputChange}
              placeholder={"Write a message"}
              className="rounded-full border-none text-base focus:outline-none md:text-sm"
              rows={1}
              ref={textAreaRef}
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
            <Button
              disabled={isLoading || uploadLoading}
              variant="ghost"
              // onClick={() => toggleShowImage(!showImage)}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="cursor=pointer">
              <Headphones className="h-9 w-9 rounded-full bg-[#C28851] p-2" />
            </div>
            <Button disabled={uploadLoading} variant="ghost" id="submit-button" className=" hidden">
              <SendHorizonal className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </div>
    );
  },
);

ChatForm.displayName = "ChatForm";
