"use client";
import type { Character, Message, UserSettings } from "@prisma/client";
import { useState } from "react";
import { ChatDetail } from "./Elements/ChatDetail";
import ChatMainSection from "./ChatMainSection";
import ChatCandySection from "./ChatCandySection";
import { useMediaQuery } from "react-responsive";
import RecentChats from "../RecentChats";
import MobileNavPanel from "../MobileNav";
interface ChatPageProps {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number
    }
  };
  userId: string;
  userSettings: UserSettings | null;
  likeCount: number;
  like: boolean | null | undefined;
  star: boolean | null | undefined;
}

export const ChatPage = ({
  character,
  userId,
  userSettings,
  likeCount,
  like,
  star
}: ChatPageProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [openRight, setRightOpen] = useState(!isMobile);
  const [openRecent, setRecentOpen] = useState(false);
  const [openCandy, setCandyOpen] = useState(false);
  const [isReportModal, setReportModal] = useState(false);
  const [isShareModal, setShareModal] = useState(false)
  return (
    <>
      {openCandy ?
        <ChatCandySection /> :
        (
          openRecent ?
            <>
              <RecentChats characters={[]} />
              <MobileNavPanel />
            </>
            :
            (<ChatMainSection
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
            />)
        )
      }
      {openRight && <ChatDetail
        isOpen={openRight}
        character={character}
        openCandy={openCandy}
        setCandyOpen={setCandyOpen}
        likeCount={likeCount}
        like={like}
        star={star}
        setReportModal={setReportModal}
        setShareModal={setShareModal}
      />}
    </>
  );
};
