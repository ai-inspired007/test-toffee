import { Dispatch, SetStateAction, useContext, useState } from "react";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { CodeRender } from "@/components/CodeRender";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/toffee/UserAvatar";
import { BotAvatar } from "@/components/toffee/BotAvatar";
import { toast } from "react-toastify";
import { getFileIcon } from "@/components/toffee/knowledge/Elements/UploadFiles";
import {
  Copy,
  Loader2,
  Volume2,
  Trash2,
  PenLine,
  RotateCw,
} from "lucide-react";
import { Message } from "@prisma/client";
export interface ChatMessageProps {
  id?: string;
  name?: string;
  role: "assistant" | "user";
  content?: string;
  image?: string;
  error: boolean;
  isEmbedded: boolean;
  scrollRef?: () => void;
  scroll?: boolean;
  image_url?: string | null;
  fileKey?: string;
  file_name?: string | null;
  file_type?: string | null;
  isTyping?: boolean;
  setIsTyping?: Dispatch<SetStateAction<boolean>>;
  needsOverlay?: boolean;
  onReGeneration?: (id: string) => Promise<void>;
  onDeleteMessage?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatMessage = ({
  id,
  name,
  role,
  content,
  image,
  error,
  scroll,
  image_url,
  isTyping,
  scrollRef,
  setIsTyping,
  file_name,
  file_type,
  isEmbedded,
  isLoading,
  onDeleteMessage,
  onReGeneration
}: ChatMessageProps) => {
  const streamingCompletionContext = useContext(StreamingCompletionContext);
  const [displayText, setDisplayText] = useState("");
  let p_content: string = "";
  if (content !== undefined) {
    p_content = content.replaceAll("|", "\n");
  }
  const onCopy = () => {
    if (!content) {
      return;
    }
    navigator.clipboard.writeText(p_content);
    toast.success("Message copied to clipboard.", {theme: "colored", autoClose: 1500, hideProgressBar: true,});
  };

  const onVoice = async () => {
    if (!content) {
      return;
    }
    const model = "aura-asteria-en";

      const res = await fetch(`/api/speak?model=${model}`, {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({content: content})
      });

      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
  };
  
  const renderStreamingModel = () => {
    if (isLoading || isTyping) {
      const completion = streamingCompletionContext?.completion!;
      // console.log("COMPLETION: " + completion);
      if (displayText.length == 0 && isLoading && !isTyping) {
        // start generating
        if (setIsTyping) setIsTyping(true);
      }

      let timer = undefined;
      if (isTyping) {
        // if we are typing, update the timer
        timer = setTimeout(() => {
          if (completion.length <= displayText.length) {
            return;
          }
          setDisplayText((displayText) =>
            completion.substring(0, displayText.length + 1),
          );
        }, 19);
      }

      // console.log(
      //   "[isTyping, displayText, completion, isLoading]: " +
      //     isTyping +
      //     "\n" +
      //     displayText +
      //     "\n" +
      //     completion +
      //     "\n" +
      //     isLoading
      // );
      // if completion is done (no more loading), and we are done typing too
      if (isTyping && displayText.length == completion.length && !isLoading) {
        // finished typing, scroll, and clear the timer
        if (setIsTyping) setIsTyping(false);
        if (scrollRef) scrollRef();
        clearTimeout(timer);
      }

      if (displayText.length === 0) {
        // return <BeatLoader color="white" size={5} />;
        return (
          <Loader2 className="h-4 w-4 animate-spin text-text-additional" />
        );
      }

      const split_text = displayText.split("\n");
      if (role === "assistant") {
        return (
          <>
            <CodeRender text={displayText} />
          </>
        );
      }
      return (
        <div>
          {split_text.map((text, index) => {
            if (text.length == 0) {
              return <br key={index} />;
            } else {
              return (
                <p className="!whitespace-normal !text-wrap" key={index}>
                  {text}
                </p>
              );
            }
          })}
        </div>
      );
    } else {
      // if we aren't loading or typing, just show the message
      const split_text = p_content.split("\n");
      // console.log(split_text);
      if (role === "assistant") {
        return <CodeRender text={p_content} />;
      }
      return (
        <div>
          {split_text.map((text, index) => {
            if (text.length == 0) {
              return <br key={index} />;
            } else {
              return (
                <p className="" key={index}>
                  {text}
                </p>
              );
            }
          })}
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        "group flex max-w-[650px] flex-nowrap text-wrap break-words",
        role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
        "overflow-x-auto whitespace-pre-wrap break-words",
      )}
    >
      {!error && role !== "user" && image && <BotAvatar size={8} image={image} />}
      {role === "user" && <UserAvatar />}
      <div className={`mx-2 flex flex-col gap-1.5 ${role === "user" && "items-end"}`}>
        {!error && <div className="flex flex-row items-center font-normal">
          <p className={cn("text-xs", role === "user" ? "ml-auto" : "")}>
            {role === "user" ? "You" : name}
          </p>
          {role === "user" ? null : (
            <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px]">
              Toffee
            </span>
          )}
        </div>}
        <div
          style={{
            borderRadius:
              role === "user" ? "10px 0px 10px 10px" : "0px 10px 10px 10px",
          }}
          className={cn(
            "max-w-fit flex-1 !whitespace-normal !text-wrap rounded-md px-3 py-2 text-[13px]",
            role === "user" ? "bg-[#474747]" : "bg-[#202020]",
            error
              ? "h-content mx-2 border border-red-700 bg-[#202020] p-2 opacity-80"
              : "",
          )}
        >
          {image_url != undefined && image_url != null && image_url != "" && (
            <Image
              className="mb-2 rounded-lg"
              width={300}
              height={300}
              src={image_url}
              alt="image"
            />
          )}
          {file_name != undefined && file_name != null && file_name != "" && (
            <div key="user-file" className="flex flex-row gap-2 max-w-[250px] min-w-[250px] max-h-[100px] text-white items-center p-3 py-1">
              <div className="flex items-center justify-center">
                {getFileIcon(file_type)}
              </div>
              <p className="text-sm text-text-sub font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{file_name}</p>
            </div>
          )}
          {/* {isLoading && role === "assistant" ? (
            streamingCompletionContext?.completion.length == 0 ? (
              <BeatLoader size={5} />
            ) : (
              
            )
          ) : (
            p_content 
          )} */}
          {renderStreamingModel()}
          {/* {isLoading ? <BeatLoader size={5} /> : p_content} */}
        </div>
        {role === "user" && (
          <div className="flex w-fit flex-row gap-2 rounded-md bg-[#202020] p-2 opacity-0 transition group-hover:opacity-60">
            <Copy className="h-4 w-4 cursor-pointer" onClick={onCopy} />
            <PenLine className="h-4 w-4 cursor-not-allowed" />
            {!isEmbedded && <Trash2 className="h-4 w-4 cursor-pointer" onClick={() => id && onDeleteMessage?.(id)} />}
          </div>
        )}
        {!error && role !== "user" && !isLoading && (
          <div className="flex w-fit flex-row gap-2 rounded-md bg-[#202020] p-2 opacity-0 transition group-hover:opacity-60">
            <Volume2 className="h-4 w-4 cursor-pointer" onClick={onVoice} />
            <Copy className="h-4 w-4 cursor-pointer" onClick={onCopy} />
            <PenLine className="h-4 w-4 cursor-not-allowed" />
            {!isEmbedded && <Trash2 className="h-4 w-4 cursor-pointer" onClick={() => id && onDeleteMessage?.(id)} />}
            {scroll && <RotateCw className="h-4 w-4 cursor-pointer" onClick={() => id && onReGeneration?.(id)} />}
          </div>
        )}
        {image_url != undefined && image_url != null && image_url != "" && (
          <Image
            className="mb-2 rounded-lg"
            width={300}
            height={300}
            src={image_url}
            alt="image"
          />
        )}
        {/* {p_content.length===0 && isLoading?<Loader2 className="h-4 w-4 animate-spin text-text-additional" />:<CodeRender text={p_content} />} */}
      </div>
    </div>
    )
}
