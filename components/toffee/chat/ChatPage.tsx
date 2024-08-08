"use client";
import type { Character, Message, UserSettings } from "@prisma/client";
import { useState } from "react";
import { ChatDetail } from "./Elements/ChatDetail";
import ChatMainSection from "./ChatMainSection";
import ChatCandySection from "./ChatCandySection";
interface ChatPageProps {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number
    }
  };
  userId: string;
  userSettings: UserSettings | null;
}

export const ChatPage = ({
  character,
  userId,
  userSettings,
}: ChatPageProps) => {
  const [openRight, setRightOpen] = useState(true);
  const [openCandy, setCandyOpen] = useState(false);
  return (
    <>
      {openCandy ? <ChatCandySection /> : <ChatMainSection character={character} openRight={openRight} setRightOpen={setRightOpen} userSettings={userSettings} userId={userId} />}
      {openRight && <ChatDetail isOpen={openRight} character={character} openCandy={openCandy} setCandyOpen={setCandyOpen} />}
    </>
  );
};
