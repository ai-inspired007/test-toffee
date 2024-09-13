"use client";

import { TKnowledgePack } from "@/lib/types";
import { ChatPage } from "./ChatPage";
import type {
  Character,
  Message,
  UserSettings,
  KnowledgePack,
  CharacterKnowledgePack,
  Tag,
  ChatSetting,
  ChatTheme,
} from "@prisma/client";
import { useSearchParams } from "next/navigation";

interface ChatPageWrapperProps {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  userId: string;
  userSettings: UserSettings | null;
  chatSettings: Partial<ChatSetting & { theme: ChatTheme }> | null;
  likeCount: number;
  like: boolean | null | undefined;
  star: boolean | null | undefined;
  categorielist: { id: string; name: string; tags: Tag[] }[];
  candies: TKnowledgePack[];
  connectedKnowledgePacks: CharacterKnowledgePack[];
  preloadedQuestion?: string | null;
}

export const ChatPageWrapper = (props: ChatPageWrapperProps) => {
  const searchParams = useSearchParams();
  const preloadedQuestion = searchParams.get("question");

  return <ChatPage {...props} preloadedQuestion={preloadedQuestion} />;
};
