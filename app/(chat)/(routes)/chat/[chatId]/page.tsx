import prismadb from "@/lib/prismadb";
import { auth, signIn } from "auth";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/toffee/chat/ChatPage";

interface PageProps {
  params: {
    chatId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await auth();
  let userId = session?.user?.id; 

  const character = await prismadb.character.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      subscriptions: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: { messages: true },
      },
    },
    
  });
  if(!userId) {
    return redirect("/login");
  }
  if (!character) {
    return redirect("/character/create");
  }

  const subs = character.subscriptions;

  if (character.userId !== "public" && character.userId !== userId && subs.length == 0 && !character.shared) {
    redirect("/");
  }

  const userSettings = await prismadb.userSettings.findUnique({
    where: {
      userId,
    },
  });

  const likeCount = await prismadb.characterFeedback.count({
    where: {
      characterId: params.chatId,
      like: true
    }
  });

  const feedback = await prismadb.characterFeedback.findFirst({
    where: {
      characterId: params.chatId,
      userId: userId
    }
  });
  return (
    <ChatPage
      userSettings={userSettings}
      character={character}
      userId={userId}
      likeCount={likeCount}
      like={feedback?.like}
      star={feedback?.star}
    />
  );
};

export const metadata = {
  title: "Toffee",
  description: "Unlock infinite context in AI conversations.",
};

export default Page;
