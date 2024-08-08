import LeftSideBar from "@/components/toffee/LeftSidebar";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { Character } from "@prisma/client";
import { getCharacters } from "@/lib/query";
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const userId = session?.user?.id;
  let recentChat: Character[] = []
  if (userId) {
    const characters = await getCharacters({userId})
    recentChat = characters
      .map((character) => ({
        ...character,
        latestMessage: character.messages[0],
      }))
      .filter((character) => character.latestMessage)
      .sort(
        (a, b) =>
          b.latestMessage.createdAt.getTime() -
          a.latestMessage.createdAt.getTime(),
      );
  }
  return (
    <div className="flex w-screen flex-row overflow-hidden bg-black">
      <LeftSideBar characters={recentChat} />
      {children}
    </div>
  );
};

export default ChatLayout;
