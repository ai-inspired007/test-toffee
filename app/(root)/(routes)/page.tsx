import { DiscoverPage } from "@/components/toffee/discover";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
const Discover: React.FC = async () => {
  const session = await auth();
  const user = session?.user;
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
          userId: user?.id,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
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
      voiceId: true,
      shared: true,
      private: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      categoryId: true,
      messages: {
        select: {
          id: true,
          userId: true,
          characterId: true,
        },
      },
      _count: {
        select: { messages: true },
      },
    },
  });
  const categories = await prismadb.category.findMany({
    select: {
      id: true,
      name: true,
      characters: true
    }
  });
  const voiceList = await prismadb.voice.findMany({

  });
  const tags = await prismadb.tag.findMany({
    include: {
      characters: true
    }
  })

  return (
    <DiscoverPage categories={categories} characters={characters} tags={tags} voiceList={voiceList} />
  )
}

export default Discover;
