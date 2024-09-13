"use client";

import { createContext, useContext, useState } from "react";
import type {
  CharacterKnowledgePack,
  ChatSetting,
  ChatTheme,
  KnowledgePack,
} from "@prisma/client";
import { TKnowledgePack } from "@/lib/types";

interface ChatPageContextValue {
  // characterKnowledgePacks: CharacterKnowledgePack[];
  // setcharacterKnowledgePacks: (value: CharacterKnowledgePack[]) => void;
  knowledgePacks: KnowledgePack[];
  setKnowledgePacks: (value: TKnowledgePack[]) => void;
  connectedCandies: KnowledgePack[];
  setConnectedCandies: (value: TKnowledgePack[]) => void;
  chatSettings: Partial<ChatSetting & { theme: ChatTheme }> | null;
  setChatSettings: (
    value: Partial<ChatSetting & { theme: ChatTheme }> | null,
  ) => void;
}

const ChatPageContext = createContext<ChatPageContextValue>({
  // characterKnowledgePacks: [],
  // setcharacterKnowledgePacks: (newValue) => {},
  knowledgePacks: [],
  setKnowledgePacks: (newValue) => {},
  connectedCandies: [],
  setConnectedCandies: (newValue) => {},
  chatSettings: {},
  setChatSettings: (newValue) => {},
});

export const ChatpageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [characterKnowledgePacks, setcharacterKnowledgePacks] = useState<
  //   CharacterKnowledgePack[]
  // >([]);
  const [knowledgePacks, setKnowledgePacks] = useState<TKnowledgePack[]>([]);
  const [connectedCandies, setConnectedCandies] = useState<TKnowledgePack[]>(
    [],
  );
  const [chatSettings, setChatSettings] = useState<Partial<
    ChatSetting & { theme: ChatTheme }
  > | null>(null);
  return (
    <ChatPageContext.Provider
      value={{
        knowledgePacks,
        setKnowledgePacks,
        connectedCandies,
        setConnectedCandies,
        chatSettings,
        setChatSettings,
      }}
    >
      {children}
    </ChatPageContext.Provider>
  );
};

export const useChatPage = () => {
  return useContext(ChatPageContext);
};

export const useChatPageContext = (): ChatPageContextValue => {
  return useContext(ChatPageContext);
};
