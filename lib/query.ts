import prismadb from "./prismadb";
import { cosinesim } from "./utils";
import { ScoredCharacter, TCategory, TCharacter, TKnowledgePack } from "./types";
interface GetCharactersParams {
  userId?: string;
  isPublic?: boolean;
  isShared?: boolean;
  isPrivate?: boolean;
}  
export const getCharacters = async ({userId, isPublic=true, isShared=true, isPrivate=false}: GetCharactersParams) => {
  const conditions: any[] = [];
  if (userId) {
    conditions.push({ userId });
  }
  if (isPublic) {
    conditions.push({ userId: 'public' });
  }
  if (isShared) {
    conditions.push({ shared: true });
  }
  if (isPrivate) {
    conditions.push({ private: true });
  } else {
    conditions.push({ private: false });
  }
  const characters = await prismadb.character.findMany({
    where: {
      OR: conditions,
    },
    orderBy: { createdAt: 'desc' },
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
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
          characters: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          role: true,
          userId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          image_url: true,
          file_name: true,
          file_type: true,
          characterId: true,
          error: true,
          isEmbedded: true
        },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
      tags: {
        select: {
          tag: {
            select: { id: true, name: true, categoryId: true },
          },
        },
      },
    },
  });
  const flatCharacters = characters.map(character => ({
    ...character,
    tags: character.tags.map(tagRelation => tagRelation.tag)
  }));

  return flatCharacters
}

export const getCandies = async (userId?: string) => {
  const knowledges = await prismadb.knowledgePack.findMany({
    where: {
      type: "PACK",
      OR: [
        { userId: 'public' || userId },
        { sharing: "public" },
      ],
    },
    select: {
      id: true, name: true, description: true, image: true, userId: true, createdAt: true, updatedAt: true,
      sharing: true,
      type: true,
      parentId: true,
      tags: {
        select: {
          tag: {
            select: { id: true, name: true, categoryId: true }
          }
        }
      },
    }
  });
  const flatKnowledges = knowledges.map(knowledge => ({
    ...knowledge,
    tags: knowledge.tags.map(tagRelation => tagRelation.tag),
    theme: null
  }));
  return flatKnowledges
}

export const getCategories = async () => {
  const categories = await prismadb.category.findMany({
    include: {
      characters: true
    }
  });
  return categories
}

export const getTags = async () => {
  const tags = await prismadb.tag.findMany();
  return tags;
}

export const sortedCharacters = async (userId?: string) => {
  let userprefs: Record<string, number> = {};
  let unvisited: string[] = [];
  type Peer = { similarity: number; prefs: Record<string, number> };
  let peers: Record<string, Peer> = {};
  const flatCharacters = await getCharacters({ userId });
  flatCharacters.forEach((character) => {
    let total = 0;
    character.messages.forEach((message) => {
      if (message.userId === userId) {
        total += 1;
      } else if (!peers.hasOwnProperty(message.userId) && Object.keys(peers).length < 50) {
        peers[message.userId] = { similarity: 0, prefs: {} };
      }
    });

    userprefs[character.id] = total;
    if (total === 0) unvisited.push(character.id);

    for (const key in peers) peers[key].prefs[character.id] = 0;

    character.messages.forEach((message) => {
      if (message.userId in peers) {
        peers[message.userId].prefs[character.id] += 1;
      }
    });
  });

  for (const peer in peers) {
    const similarity = cosinesim(Object.values(userprefs), Object.values(peers[peer].prefs));
    peers[peer].similarity = similarity;
  }

  unvisited.forEach((characterId) => {
    let score = 0;
    let normalizer = 0;
    for (const peer in peers) {
      score += peers[peer].prefs[characterId] * peers[peer].similarity;
      normalizer += peers[peer].similarity;
    }
    userprefs[characterId] = normalizer === 0 ? 0 : score / normalizer;
  });

  const scoredCharacters: ScoredCharacter[] = Object.entries(userprefs)
    .map(([id, score]) => ({
      ...flatCharacters.find((character) => character.id === id)!,
      score,
    }))
    .sort((a, b) => b.score - a.score);

  const sortedCharacters: TCharacter[] = scoredCharacters.map(character => {
    const { score, ...rest } = character;
    return rest as TCharacter;
  });
  return sortedCharacters
}

export const getUsers = async (userId?:string) => {
  const users = await prismadb.userSettings.findMany({
    where: userId?{userId:{not:userId}}: {},
    include: {
      _count: {select: {characters: true}}
    }
  })
  const userWithCharacterCount = users.map(user => ({
    ...user, characterCount: user._count.characters
  }))
  return userWithCharacterCount
}