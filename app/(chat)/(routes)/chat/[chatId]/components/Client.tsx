"use client";
import { useChat, useCompletion } from "ai/react";
import type { Character, Message, UserSettings } from "@prisma/client";
import { ChatHeader } from "./ChatHeader";
import { useRouter } from "next/navigation";
import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import { ChatForm } from "@/components/ChatForm";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAIContext } from "@/contexts/AIProvider";
import { uploadCharacterPic } from "@/lib/upload/util";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { ChatDetail } from "./ChatDetail";
import { ChatTopNav } from "./ChatTopNav";
import { CandyFile } from "@/components/toffee/knowledge/Create";

interface ChatClientProps {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number
    }
  };
  userId: string;
  userSettings: UserSettings | null;
}

export const ChatClient = ({
  character,
  userId,
  userSettings,
}: ChatClientProps) => {
  const router = useRouter();
  const { API, updateAPI, toggleBlocked } = useAIContext();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    character.messages,
  );
  const [initScroll, setInitScroll] = useState(false);
  // change to images
  const [image, updateImage] = useState("");
  const focusRef = useRef<ElementRef<"input">>(null);
  // show images
  const [showImage, toggleShowImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // pdf file
  const [file, setFile] = useState<CandyFile | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileKey, setFileKey] = useState("");
  const [fileType, setFileType] = useState("");

  // false = haven't started typing, true = started typing
  const [progress, setProgress] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);

  const API_URL = `/api/chat/${character.id}/${encodeURIComponent(
    image == "" || !image ? "EMPTY" : image,
  )}/${API}`;

  const focus = () => {
    focusRef?.current?.focus();
  };

  // console.log("USING: " + API);

  const onClear = async () => {
    try {
      await axios.delete(`/api/character/${character.id}/clear`);
      toast({
        description: "Successfully cleared the chat.",
      });
      toggleBlocked(false);
      setMessages([]);
    } catch (error) {
      console.log(error);
      toast({
        description: `Something went wrong. Please wait a bit and try again. If the error persists, contact a developer.`,
        variant: "destructive",
      });
    }
  };

  const {
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    completion,
    setCompletion,
    stop,
  } = useCompletion({
    api: API_URL,
    body: {
      fileName,
      fileKey,
      fileType
    },
    onError(error) {
      let message = error.message;
      if (error.message == "moderation-prompt") {
        message =
          "Your prompt violates OpenAI policy. Please reword it before sending again, or switch to a different model.";
      } else if (error.message == "moderation-chat") {
        message =
          "Your chat, character, or files violate OpenAI policy. Your model has been switched to Llama 2. To use GPT-4 Turbo, review OpenAI guidelines and reload after you've fixed the issue. If the violation is in your chat, clear your history.";
        updateAPI("Llama");
        toggleBlocked(true);
      }
      toast({
        description: `${message}`,
        variant: "destructive",
        duration: 14000,
      });
      const newUserMessage: ChatMessageProps = {
        role: "user",
        content: `There was an error sending this message. If the issue persists, contact the developers.`,
        error: true,
        image_url: null,
        file_name: null,
        file_type: null,
      };
      setMessages((current) => [...current.slice(0, -1), newUserMessage]);
      setLoading(false);
      setInput("");
    },

    onFinish(prompt, completion) {
      setLoading(false);
      // console.log("FINISHED STREAMING: " + loading);
    },
  });

  useEffect(() => {
    // console.log("IN USE EFFECT");
    const parseUpdates = async () => {
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: completion,
        error: false,
        image_url: null,
        file_name: null,
        file_type: null
      };
      if (completion !== "")
        setMessages((current) => [...current, aiMessage]);
      setCompletion("");
      // console.log("[FINISH]", completion);
      setInput("");
      // router.refresh();
      const POST_URL = `/api/chat/${character.id}/${encodeURIComponent(
        image === "" || !image ? "EMPTY" : image,
      )}/postprocess`;
      // console.log("PROMPT: " + input);
      // try {
      //   await axios.post(POST_URL, {
      //     prompt: input,
      //     output: completion,
      //   });
      // } catch (error) {
      //   console.log(error);
      //   toast({
      //     description: `Failed during post processing. Contact developers if this issue persists.`,
      //     variant: "destructive",
      //     duration: 1000,
      //   });
      //   return;
      // }
    };
    focus();

    // console.log("[CURRENT STATE OF ISTYPING]: " + isTyping);

    // if we start typing, set progress to true
    if (isTyping && !progress) {
      setProgress(true);
    }

    // if we finished typing and had started, parse updates and reset
    if (!isTyping && progress) {
      parseUpdates();
      setProgress(false);
    }
  }, [messages, isTyping]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (uploadLoading) {
      toast({
        description: "Image is still uploading.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    } // can't submit if image is still uploading

    if (input.length == 0 || input.length > 2048) {
      handleSubmit(e); // handled by useCompletion
      return;
    }

    toggleShowImage(false);

    setIsTyping(true); // start typing
    setLoading(true); // currently loading
    setCompletion(""); // reset completion from previous message
    // console.log(completion);

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
      error: false,
      image_url: image,
      file_name: fileName,
      file_type: fileType
    };

    setMessages((current) => [...current, userMessage]);
    updateImage("");
    setFile(null);
    setFileName("");
    setFileType("");
    setFileKey("");
    setInitScroll(true);
    handleSubmit(e);
  };

  const onStopGeneration = () => {
    stop();
    // console.log("[ON STOP]");
    const aiMessage: ChatMessageProps = {
      role: "assistant",
      content: completion.length > 0 ? completion : "Streaming canceled.",
      error: completion.length == 0 ? true : false,
      image_url: null,
      file_name: null,
      file_type: null
    };
    setMessages((current) => [...current, aiMessage]);
    setInput("");
    setLoading(false);
    router.refresh();
  };

  const [uploadLoading, setUploadLoading] = useState(false); // upload loading

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log(e.dataTransfer);
    // console.log("Client.tsx drop handler");

    if (!e.dataTransfer.files[0]) return;

    const file = e.dataTransfer.files[0];
    const fileBlob = file as Blob;

    const tempUrl = URL.createObjectURL(fileBlob);
    //   setFile(e.target.files![0]);
    updateImage(tempUrl);
    toggleShowImage(true);
    setUploadLoading(true);

    let publicUrl = null;
    uploadCharacterPic(file, "chat", uploadLoading).then((result) => {
      publicUrl = result;
      // console.log(publicUrl);
      updateImage(publicUrl);
      setUploadLoading(false);
      URL.revokeObjectURL(tempUrl);
    });

    // setDragActive(false);
    e.dataTransfer.clearData();
  };

  // useEffect(() => {
  //   // console.log("[ISLOADINGCLIENT]: " + loading);
  // }, [loading]);

  // TODO: move into separate component
  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="m-2 flex flex-grow flex-col items-center justify-start rounded-2xl bg-[#121212] bg-chat text-white relative"
      >
        <ChatTopNav
          character={character}
          onClear={onClear}
          userId={userId}
          needsOverlay={!!userSettings?.chat_background_image}
          setRightOpen={() => setRightOpen(!rightOpen)}
        />
        <StreamingCompletionContext.Provider
          value={{ completion, stopGenerating: onStopGeneration }}
        >
          <div className="no-scrollbar w-full max-w-[750px] flex-grow overflow-x-hidden p-4 mb-10">
            <ChatHeader character={character} />
            <ChatMessages
              chat_background_image={userSettings?.chat_background_image}
              isLoading={loading}
              character={character}
              messages={messages}
              initScroll={initScroll}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
            />
          </div>
          <ChatForm
            isLoading={loading || isTyping}
            name={character.name}
            chatId={character.id}
            input={input}
            handleInputChange={handleInputChange}
            onSubmit={onSubmit}
            ref={focusRef}
            updateImage={updateImage} // image src update
            value={image} // image src
            showImage={showImage} // for showing component above chat input
            toggleShowImage={toggleShowImage}
            uploadLoading={uploadLoading}
            setUploadLoading={setUploadLoading}
            needsOverlay={!!userSettings?.chat_background_image}
            file={file}
            setFile={setFile}
            setFileKey={setFileKey}
            setFileName={setFileName}
            setFileType={setFileType}
          />
        </StreamingCompletionContext.Provider>
      </div>
      <ChatDetail isOpen={rightOpen} character={character} />
    </>
  );
};
