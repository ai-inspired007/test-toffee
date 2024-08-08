import React from 'react';
import DiscoverPage from "@/components/toffee/knowledge/Discover";
import { Character, KnowledgeFile, KnowledgeText, KnowledgeLink } from "@prisma/client";

const KnowledgePackCreate: React.FC = () => {

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
    name: "Epic Java Pack",
    type: "PACK",
    isPersonal: true,
    conns: 1424,
    knowledgeId: "public",
    image: "/candies/d8532a4c8ac663ef052fe1bce13c1ff8.png",
    characters: [
      {
        name: "Zero Two",
        userId: "@VectorChat",
        description: "I'm Zero Two from Darling in the Franxx",
        image: "/characters/zero.png"
      },
      {
        name: "Rias Gremory",
        userId: "@VectorChat",
        description: "High school DxD",
        image: "/characters/riasg.png"
      },
      {
        name: "Yor Forger",
        userId: "@Akshat",
        description: "A loving mom who is definetely",
        image: "/characters/yor.png"
      },
      {
        name: "Gojo Saturo",
        userId: "@Mark",
        description: "The strongest. I;m the winner at",
        image: "/characters/gojo.png"
      },
      {
        name: "Zero Two",
        userId: "@VectorChat",
        description: "I'm Zero Two from Darling in the Franxx",
        image: "/characters/zero.png"
      },
      {
        name: "Rias Gremory",
        userId: "@VectorChat",
        description: "High school DxD",
        image: "/characters/riasg.png"
      },
      {
        name: "Yor Forger",
        userId: "@Akshat",
        description: "A loving mom who is definetely",
        image: "/characters/yor.png"
      },
      {
        name: "Gojo Saturo",
        userId: "@Mark",
        description: "The strongest. I;m the winner at",
        image: "/characters/gojo.png"
      }
    ],
    files: [],
    texts: [],
    links: []
  };

  return <DiscoverPage data={data}/>;
}

export default KnowledgePackCreate;