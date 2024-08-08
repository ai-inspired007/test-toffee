import React from 'react';
import DiscoverPage from "@/components/toffee/knowledge/Discover";
import { Character, KnowledgeFile, KnowledgeLink, KnowledgeText } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { auth, signIn } from "auth";

interface KnowledgePackProps {
  params: {
    knowledgeId: string;
  };
}

const KnowledgePackCreate = async ({ params }: KnowledgePackProps) => {
  const session = await auth();
  let userId = session?.user?.id;
  if (!userId) {
    await signIn();
    return;
  }

  const candy = await prismadb.knowledgePack.findUnique({
    where: {
      id: params.knowledgeId
    },
    select: {
      name: true,
      type: true,
      image: true,
      userId: true,
      characterKnowledgePacks: true,
      files: true,
      texts: true,
      links: true,
      _count: {
        select: {
          characterKnowledgePacks: true
        }
      }
    },
  });
  
  const data: {
    name: string | undefined;
    type: string | undefined;
    isPersonal: boolean;
    knowledgeId: string;
    conns: number | undefined;
    image: string | null | undefined;
    characters: Partial<Character>[] | undefined;
    files: Partial<KnowledgeFile>[] | undefined;
    texts: Partial<KnowledgeText>[] | undefined;
    links: Partial<KnowledgeLink>[] | undefined;
  } = {
    name: candy?.name,
    type: candy?.type,
    isPersonal: userId === candy?.userId ? true : false,
    knowledgeId: params.knowledgeId,
    conns: candy?._count.characterKnowledgePacks,
    image: candy?.image,
    characters: candy?.characterKnowledgePacks,
    files: candy?.files,
    texts: candy?.texts,
    links: candy?.links
  };

  return <DiscoverPage data={data}/>;
}

export default KnowledgePackCreate;