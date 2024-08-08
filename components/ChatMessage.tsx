"use client";

import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "./BotAvatar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import { Loader2 } from "lucide-react";
import {
  Copy,
  Settings,
  Volume2,
  Trash2,
  PenLine,
  PanelRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import Markdown from "react-markdown";
import { getFileIcon } from "./toffee/knowledge/Elements/UploadFiles";
import { RiDeleteBin6Line } from "./toffee/icons/Files";

import { useAIContext } from "@/contexts/AIProvider";
import { StreamingCompletionContext } from "@/lib/chat/context";
import { CodeRender } from "./CodeRender";
export interface ChatMessageProps {
  name?: string;
  role: "assistant" | "user";
  content?: string;
  isLoading?: boolean; // api loading
  image?: string;
  scroll?: boolean;
  load?: boolean;
  error: boolean;
  scrollRef?: () => void;
  image_url: string | null;
  file_name: string | null;
  file_type: string | null;
  isTyping?: boolean;
  setIsTyping?: Dispatch<SetStateAction<boolean>>;
  needsOverlay?: boolean;
}

type Sequence = Array<SequenceElement>;
type SequenceElement =
  | string
  | number
  | ((element: HTMLElement | null) => void | Promise<void>);

export const ChatMessage = ({
  name,
  role,
  content,
  isLoading,
  image,
  scroll,
  load,
  error,
  scrollRef,
  image_url,
  file_name,
  file_type,
  isTyping,
  setIsTyping,
  needsOverlay = false,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const streamingCompletionContext = useContext(StreamingCompletionContext);
  const { API: modelName } = useAIContext();
  const [displayText, setDisplayText] = useState("");

  let p_content: string = "";
  if (content !== undefined) {
    p_content = content.replaceAll("|", "\n");
  }

  // console.log(load);

  const computeSequence = (content: string) => {
    // console.log("CONTENT: " + content);
    const content_arr = content.split(" ");
    let res: Sequence = [];
    // if (!scrollRef) {
    //   return res;
    // }
    let it = 1;
    let current_string = "";
    for (let str of content_arr) {
      current_string += str;
      current_string += "   ";
      res.push(current_string);
      it++;
    }
    return res;
  };

  const onCopy = () => {
    if (!content) {
      return;
    }
    navigator.clipboard.writeText(p_content);
    toast({
      description: "Message copied to clipboard.",
    });
  };

  /*
    The issue is, we add message to messages and let API finish even if the last message is still typing. Need to change isLoading.
  */
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

  // const renderNormalModel = () => {
  //   if (isLoading) {
  //     return <BeatLoader size={5} />;
  //   } else if (role === "assistant" && scroll && load) {
  //     return (
  //       <TypeAnimation
  //         sequence={computeSequence(p_content)}
  //         omitDeletionAnimation={true}
  //         speed={{ type: "keyStrokeDelayInMs", value: 19 }}
  //         cursor={false}
  //       />
  //     );
  //   } else return p_content;
  // };

  //   console.log("IMAGE_URL: " + image_url);
  return (
    <div
      className={cn(
        "group flex max-w-[650px] flex-nowrap text-wrap break-words",
        role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
        "overflow-x-auto whitespace-pre-wrap break-words",
      )}
    >
      {role !== "user" && image && <BotAvatar size={8} image={image} />}
      {role === "user" && <UserAvatar />}
      <div className="mx-2 flex flex-col gap-1.5">
        <div className="flex flex-row items-center  font-normal">
          <p className={cn("text-xs", role === "user" ? "ml-auto" : "")}>
            {role === "user" ? "You" : name}
          </p>
          {role === "user" ? null : (
            <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px]">
              Toffee
            </span>
          )}
        </div>
        <div
          style={{
            borderRadius:
              role === "user" ? "10px 0px 10px 10px" : "0px 10px 10px 10px",
          }}
          className={cn(
            "max-w-fit flex-1 !whitespace-normal !text-wrap rounded-md px-3 py-2 text-[13px]",
            role === "user" ? "bg-[#474747]" : "bg-[#202020]",
            error
              ? "h-content mx-2 border border-red-700 bg-red-300 p-2 opacity-80"
              : "",
            !needsOverlay ? "pb-6" : "",
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
        {role !== "user" && !isLoading && (
          <div className="flex w-fit flex-row gap-2 rounded-md bg-[#202020] p-2 opacity-0 transition group-hover:opacity-60">
            <Volume2 className="h-4 w-4 cursor-not-allowed" />
            <Copy className="h-4 w-4 cursor-pointer" onClick={onCopy} />
            <PenLine className="h-4 w-4 cursor-not-allowed" />
            <Trash2 className="h-4 w-4 cursor-not-allowed" />
          </div>
        )}
      </div>
    </div>
  );
};
