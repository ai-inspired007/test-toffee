"use client";
import { useChat, useCompletion } from "ai/react";
import type { Character, Message, UserSettings } from "@prisma/client";
import { ChatHeader } from "./Elements/ChatHeader";
import { useRouter } from "next/navigation";
import { Dispatch, ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import { ChatForm } from "./Elements/ChatForm";
import { ChatMessages } from "./Elements/ChatMessages";
import { ChatMessageProps } from "./Elements/ChatMessage";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAIContext } from "@/contexts/AIProvider";
import { uploadCharacterPic } from "@/lib/upload/util";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { ChatDetail } from "./Elements/ChatDetail";
import { ChatTopNav } from "./Elements/ChatTopNav";
import { CandyFile } from "@/components/toffee/knowledge/Create";
import { v4 as uuidv4 } from 'uuid';
import { useSidebarContext } from "@/contexts/SidebarProvider";
import { MdiInformationOutline } from "../icons/InformationLine";
import VoiceChat from "./Elements/VoiceChat"
import { NowPlayingContextProvider } from "react-nowplaying";
import { MicrophoneContextProvider } from "@/contexts/Microphone";
import { AudioStoreContextProvider } from "@/contexts/AudioStore";
import { MessageMetadataContextProvider } from "@/contexts/MessageMetadata";
import { DeepgramContextProvider } from "@/contexts/Deepgram";
import { ReportModal } from "./Elements/ReportModal";
import { ShareModal } from "./Elements/ShareModal";
const ChatMainSection = ({ character, openRight, setRightOpen, openRecent, setRecentOpen, userSettings, userId, isReportModal, setReportModal, isShareModal, setShareModal }: {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number
    }
  },
  openRight: boolean,
  setRightOpen: (openRight: boolean) => void,
  openRecent: boolean,
  setRecentOpen: (openRecent: boolean) => void,
  userSettings: UserSettings | null;
  userId: string;
  isReportModal: boolean;
  setReportModal: Dispatch<React.SetStateAction<boolean>>;
  isShareModal: boolean;
  setShareModal: Dispatch<React.SetStateAction<boolean>>;
}) => {
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

  const [promptId, setPromptId] = useState<string>(uuidv4());
  const [completionId, setCompletionId] = useState<string>(uuidv4());
  const [selectedId, setSelectedId] = useState<string>("");

  // false = haven't started typing, true = started typing
  const [progress, setProgress] = useState(false);

  // Voice
  const [isVoice, setIsVoice] = useState(false);

  const API_URL = `/api/chat/${character.id}/${encodeURIComponent(
    image == "" || !image ? "EMPTY" : image,
  )}/${API}`;

  const focus = () => {
    focusRef?.current?.focus();
  };

  const { input, handleInputChange, handleSubmit, setInput, completion, setCompletion, stop, } = useCompletion({
    api: API_URL,
    body: {
      fileName,
      fileKey,
      fileType,
      promptId,
      completionId,
      isRegenerate: false
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
      const errorMessage: ChatMessageProps = {
        role: "assistant",
        content: `There was an error sending this message. If the issue persists, contact the developers.`,
        error: true,
        isEmbedded: false,
      };
      setMessages((current) => [...current, errorMessage]);
      setLoading(false);
      setInput("");
    },

    onFinish(prompt, completion) {
      setLoading(false);
      console.log("FINISHED STREAMING: " + loading);
    },
  });

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

  const onEmbedMessages = async () => {
    try {
      const apiUrl = `/api/chat/${character.id}/message/embed`;

      const response = await axios.get(apiUrl);

      setMessages((current) => current.map(item => ({ ...item, isEmbedded: true })))
      console.log('Response received:', response.data);
    } catch (error) {
      // Error handling
      console.error('Failed to send embed message:', error);
    }
  }

  useEffect(() => {
    const parseUpdates = async () => {
      console.log(completionId, selectedId)
      const aiMessage: ChatMessageProps = {
        id: selectedId.length ? selectedId : completionId,
        role: "assistant",
        content: completion,
        error: false,
        isEmbedded: false,
        image_url: null,
        file_name: null,
        file_type: null
      };
      if (completion !== "")
        setMessages((current) => [...current, aiMessage]);
      setCompletion("");
      // console.log("[FINISH]", completion);
      setInput("");
      setPromptId(uuidv4());
      setCompletionId(uuidv4());
      setSelectedId("");

      if (messages.filter(item => !item.isEmbedded).length === 30) {
        onEmbedMessages()
      }
      // router.refresh();
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

    const userMessage: ChatMessageProps = {
      id: promptId,
      role: "user",
      content: input,
      error: false,
      isEmbedded: false,
      image_url: image,
      fileKey: fileKey,
      file_name: fileName,
      file_type: fileType
    };

    setMessages((current) => [...current, userMessage]);
    updateImage("");
    setFile(null);
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
      isEmbedded: false,
      image_url: null,
      file_name: null,
      file_type: null,
    };
    setMessages((current) => [...current, aiMessage]);
    // onPostingMessages(input, completion)
    setInput("");
    setLoading(false);
    router.refresh();
  };

  const onReGeneration = async (id: string) => {
    console.log(id);
    if (messages.length > 2) {
      const POST_URL = `/api/chat/${character.id}/${encodeURIComponent(
        image == "" || !image ? "EMPTY" : image,
      )}/${API}`;
      const userMessage = messages[messages.length - 2];
      // const lastId = messages[messages.length - 1].id;
      setSelectedId(id);
      try {
        setLoading(true)

        setMessages((current) => current.slice(0, -1));

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userMessage.content,
            fileName: userMessage.file_name,
            fileKey: userMessage.fileKey,
            fileType: userMessage.file_type,
            promptId: userMessage.id,
            completionId: id,
            isRegenerate: true
          }),
        });
        handleStreamingResponse(response);
      } catch (error) {
        setLoading(false);
        const aiMessage: ChatMessageProps = {
          id: id,
          role: "assistant",
          content: "Failed during post processing. Contact developers if this issue persists.",
          error: true,
          isEmbedded: false,
          image_url: null,
        };
        setMessages((current) => [...current, aiMessage]);
        toast({
          description: "Failed during post processing. Contact developers if this issue persists.",
          variant: "destructive",
          duration: 1000,
        });
      }
    }
  }

  const handleStreamingResponse = async (response: Response) => {
    const reader = response.body?.getReader();

    if (!reader) {
      console.error("Failed to get reader from response body");
      return;
    }

    const decoder = new TextDecoder();
    let streamText = '';

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setLoading(false);

          console.log("Streaming completed");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        streamText += chunk;
        setCompletion(streamText);
      }
    };

    processStream().catch((err) => {
      console.error("Failed to read stream", err);
    });
  };

  const onDeleteMessage = async (id: string) => {
    try {
      const apiUrl = `/api/chat/character/message/${id}`;
      const response = await axios.delete(apiUrl);

      // Status 200 is automatically assumed here for successful response
      setMessages(currentMessages => currentMessages.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete message:', error);
      // Handle error appropriately (e.g., show user feedback)
    }
  }

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

  // TODO: move into separate component
  return (
    <>
      <MicrophoneContextProvider>
        {isVoice ?
          <AudioStoreContextProvider>
            <NowPlayingContextProvider>
              <MessageMetadataContextProvider>
                <DeepgramContextProvider>
                  <VoiceChat character={character} isVoice={isVoice} setIsVoice={setIsVoice} />
                </DeepgramContextProvider>
              </MessageMetadataContextProvider>
            </NowPlayingContextProvider>
          </AudioStoreContextProvider>
          :
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="sm:m-2 flex flex-grow flex-col items-center justify-start sm:rounded-2xl bg-[#121212] bg-chat text-white relative"
            >
              <ChatTopNav
                character={character}
                onClear={onClear}
                userId={userId}
                needsOverlay={!!userSettings?.chat_background_image}
                setRightOpen={() => setRightOpen(!openRight)}
                openRecent={openRecent}
                setRecentOpen={setRecentOpen}
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
                    onReGeneration={onReGeneration}
                    onDeleteMessage={onDeleteMessage}
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
                  setIsVoice={setIsVoice}
                />
              </StreamingCompletionContext.Provider>
            </div>
            <ReportModal isReportModal={isReportModal} setReportModal={setReportModal} characterId={character.id} />
            <ShareModal isShareModal={isShareModal} setShareModal={setShareModal} />
          </>
        }
      </MicrophoneContextProvider>
    </>
  );
};

export default ChatMainSection;
