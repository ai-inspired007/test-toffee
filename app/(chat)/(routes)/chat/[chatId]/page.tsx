import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/toffee/chat/ChatPage";
import { ChatpageProvider } from "@/contexts/ChatPageProvider";
import { getCandies } from "@/lib/query";
import { ChatPageWrapper } from "@/components/toffee/chat/ChatPageWrapper";

interface PageProps {
  params: {
    chatId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const session = await auth();
  let userId = session?.user?.id;
  const preloadedQuestion = searchParams.question as string | undefined;

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
  if (!userId) {
    return redirect("/login");
  }
  if (!character) {
    return redirect("/character/create");
  }

  const subs = character.subscriptions;

  if (
    character.userId !== "public" &&
    character.userId !== userId &&
    subs.length == 0 &&
    !character.shared
  ) {
    redirect("/");
  }

  const categories = await prismadb.category.findMany({
    select: {
      id: true,
      name: true,
      tags: true,
    },
  });

  const candies = await getCandies(userId);

  const connectedKnowledgePacks =
    await prismadb.characterKnowledgePack.findMany({
      where: {
        characterId: character.id,
      },
    });

  const userSettings = await prismadb.userSettings.findUnique({
    where: {
      userId,
    },
  });

  const chatSettings = await prismadb.chatSetting.findFirst({
    where: {
      userId,
    },
    include: {
      theme: true,
    },
  });

  const likeCount = await prismadb.characterFeedback.count({
    where: {
      characterId: params.chatId,
      like: true,
    },
  });

  const feedback = await prismadb.characterFeedback.findFirst({
    where: {
      characterId: params.chatId,
      userId: userId,
    },
  });

  return (
    <ChatpageProvider>
      <ChatPageWrapper
        userSettings={userSettings}
        chatSettings={chatSettings}
        character={character}
        userId={userId}
        likeCount={likeCount}
        like={feedback?.like}
        star={feedback?.star}
        categorielist={categories}
        candies={candies}
        connectedKnowledgePacks={connectedKnowledgePacks}
        preloadedQuestion={preloadedQuestion}
      />
    </ChatpageProvider>
  );
};

export const metadata = {
  title: "Toffee",
  description: "Unlock infinite context in AI conversations.",
};

export default Page;
