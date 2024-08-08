"use client";

import { Character } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAIContext } from "@/contexts/AIProvider";
import "./HideScrollbar.css";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  character: Character;
  initScroll: boolean;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
  chat_background_image?: string | null;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
  character,
  initScroll,
  isTyping,
  setIsTyping,
  chat_background_image,
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const scroll = () => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scroll();
  }, [messages.length, isTyping]);

  const [load, setLoad] = useState(messages.length === 0 ? true : false);
  const { API, updateAPI, blocked, toggleBlocked } = useAIContext();

  useEffect(() => {
    toggleBlocked(false);
    const timeout = setTimeout(() => {
      setLoad(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [toggleBlocked]);

  return (
    <div
      className="flex w-full flex-col items-center my-16"
      id="chat-messages"
    >
      <ChatMessage
        needsOverlay={!!chat_background_image}
        name={character.name}
        image={character.image}
        role="assistant"
        isLoading={load}
        isTyping={false}
        content={character.greeting}
        scrollRef={scroll}
        error={false}
        image_url={null}
        file_name={null}
        file_type={""}
      />
      {messages.map((message, index) => (
        <ChatMessage
          needsOverlay={!!chat_background_image}
          name={character.name}
          image={character.image}
          role={message.role}
          content={message.content}
          key={`${index}-${message.role}`}
          isLoading={false}
          isTyping={false}
          scroll={index == messages.length - 1}
          load={initScroll}
          scrollRef={scroll}
          error={message.error}
          image_url={message.image_url}
          file_name={message.file_name}
          file_type={message.file_type}
        />
      ))}
      {(isLoading || isTyping) && (
        <ChatMessage
          needsOverlay={!!chat_background_image}
          name={character.name}
          role="assistant"
          image={character.image}
          isLoading={isLoading}
          scrollRef={scroll}
          error={false}
          image_url={null}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          file_name={null}
          file_type={""}
        />
      )}
      <div ref={scrollRef} />
    </div>
  );
};
