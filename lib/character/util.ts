import { Character } from "@prisma/client";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import prismadb from "../prismadb";

// Only require id, image, name, description fields of character + extra metadata fields
export type CharacterWithMeta = Partial<Character> &
  Required<
    Pick<Character, "id" | "image" | "name" | "description" | "userId">
  > & {
    username: string | null;
    userImage: string;
    numChats: number;
    numSubscribers?: number;
  };

const idToUser = new Map<string, any>();
const characterToNumChats = new Map<string, number>();

const placeholderImageUrl = "";
const publicCharacterImageUrl = "";

export const onCopy = (content: string) => {
  if (!content) {
    return;
  }
  navigator.clipboard.writeText(content);
};

export function getUsername(user: any): string {
  if (user.username) {
    return user.username;
  } else {
    if (
      user.web3Wallets &&
      user.web3Wallets.length > 0 &&
      user.web3Wallets[0].web3Wallet
    ) {
      return user.web3Wallets[0].web3Wallet;
    } else {
      return user.id;
    }
  }
}

function getUserMeta(
  character: Character,
  users: any[],
): Pick<CharacterWithMeta, "username" | "userImage"> {
  if (character.userId === "public") {
    return { username: "VectorChat", userImage: publicCharacterImageUrl };
  }

  let user: any | undefined = undefined;
  if (idToUser.get(character.userId)) {
    user = idToUser.get(character.userId);
  } else {
    user = users.find((user) => user.id === character.userId);
  }

  if (!user) {
    return { username: null, userImage: placeholderImageUrl };
  }

  return {
    username: getUsername(user),
    userImage: user?.imageUrl ?? placeholderImageUrl,
  };
}

async function getNumChats(character: Character): Promise<number> {
  if (characterToNumChats.get(character.id)) {
    return characterToNumChats.get(character.id)!;
  }

  const numChats = await prismadb.message.aggregate({
    _count: {
      id: true,
    },
    where: {
      characterId: {
        equals: character.id,
      },
    },
  });

  characterToNumChats.set(character.id, numChats._count.id);

  return numChats._count.id;
}

async function getUsersByIds(userIds: string[]): Promise<any[]> {
  // Fetch user data using Vercel KV or local storage
  const storage = createStorage({
    driver: process.env.VERCEL
      ? vercelKVDriver({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
          env: false,
        })
      : memoryDriver(),
  });

  const users = await Promise.all(
    userIds.map(async (userId) => {
      return storage.getItem(`user:${userId}`);
    }),
  );

  return users.filter(Boolean);
}

export async function addMetadataToCharacters(
  characters: Character[],
): Promise<CharacterWithMeta[]> {
  const unique = new Set(characters.map((value) => value.userId));
  const userIds = Array.from(unique);

  // Fetch user data using the appropriate storage mechanism
  const users = await getUsersByIds(userIds);

  const data: CharacterWithMeta[] = await Promise.all(
    characters.map(async (character) => {
      const userMeta = getUserMeta(character, users);

      return {
        ...character,
        ...userMeta,
        numChats: await getNumChats(character),
      };
    }),
  );

  return data;
}
