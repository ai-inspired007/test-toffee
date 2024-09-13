import LeftSideBar from "@/components/toffee/LeftSidebar";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { Character } from "@prisma/client";
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const userId = session?.user?.id;
  let recentChat: Character[] = [];
  if (userId) {
    const characters = await prismadb.character.findMany({
      where: {
        OR: [
          {
            userId: "public",
          },
          {
            AND: {
              shared: true,
              private: false,
            },
          },
          {
            userId,
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        image: true,
        name: true,
        description: true,
        instructions: true,
        greeting: true,
        seed: true,
        vectors: true,
        shared: true,
        private: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        voiceId: true,
        categoryId: true,
        messages: {
          select: {
            id: true,
            userId: true,
            characterId: true,
            createdAt: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
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
