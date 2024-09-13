"use client";
import type {
  Character,
  Message,
  UserSettings,
  CharacterKnowledgePack,
  KnowledgePack,
  Tag,
  ChatSetting,
  ChatTheme,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { ChatDetail } from "./Elements/ChatDetail";
import ChatMainSection from "./ChatMainSection";
import ChatCandySection from "./ChatCandySection";
import { useMediaQuery } from "react-responsive";
import RecentChats from "../RecentChats";
import MobileNavPanel from "../MobileNav";
import { useChatPage } from "@/contexts/ChatPageProvider";
import { TKnowledgePack } from "@/lib/types";
interface ChatPageProps {
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
  categorielist: { id: string; name: string; tags: Tag[] }[];
  candies: TKnowledgePack[];
  connectedKnowledgePacks: CharacterKnowledgePack[];
  like: boolean | null | undefined;
  star: boolean | null | undefined;
  preloadedQuestion?: string | null;
}

export const ChatPage = ({
  character,
  userId,
  userSettings,
  chatSettings,
  likeCount,
  categorielist,
  candies,
  connectedKnowledgePacks,
  like,
  star,
  preloadedQuestion,
}: ChatPageProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openRight, setRightOpen] = useState(!isMobile);
  const [openRecent, setRecentOpen] = useState(false);
  const [openCandy, setCandyOpen] = useState(false);
  const [isReportModal, setReportModal] = useState(false);
  const [isShareModal, setShareModal] = useState(false);
  const [categoryTags, setCategoryTags] = useState<Set<string>>(new Set());
  const [input, setInput] = useState(preloadedQuestion || "");

  useEffect(() => {
    if (preloadedQuestion) {
      setInput(preloadedQuestion);
    }
  }, [preloadedQuestion]);

  const { setConnectedCandies, setKnowledgePacks, setChatSettings } =
    useChatPage();

  useEffect(() => {
    setKnowledgePacks(candies);
    const knowledgePackIds = connectedKnowledgePacks.map(
      (candy) => candy.knowledgePackId,
    );
    setConnectedCandies(
      candies.filter((item) => knowledgePackIds.includes(item.id)),
    );
    setChatSettings(chatSettings);
    // getCharacterKnowledge();
  }, []);

  useEffect(() => {
    if (character.categoryId) {
      const category = categorielist.find(
        (cat) => cat.id === character.categoryId,
      );
      setCategoryTags(new Set(category?.tags.map((tag) => tag.name)));
    }
  }, [categorielist]);

  return (
    <>
      {openCandy ? (
        <ChatCandySection
          categoryTags={Array.from(categoryTags)}
          chatId={character.id}
        />
      ) : openRecent ? (
        <>
          <RecentChats characters={[]} />
          <MobileNavPanel />
        </>
      ) : (
        <ChatMainSection
          character={character}
          openRight={openRight}
          setRightOpen={setRightOpen}
          openRecent={openRecent}
          setRecentOpen={setRecentOpen}
          userSettings={userSettings}
          userId={userId}
          isReportModal={isReportModal}
          setReportModal={setReportModal}
          isShareModal={isShareModal}
          setShareModal={setShareModal}
          initialInput={input}
        />
      )}
      {openRight && (
        <ChatDetail
          isOpen={openRight}
          character={character}
          openCandy={openCandy}
          setCandyOpen={setCandyOpen}
          likeCount={likeCount}
          like={like}
          star={star}
          setReportModal={setReportModal}
          setShareModal={setShareModal}
        />
      )}
    </>
  );
};
