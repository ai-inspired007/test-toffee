// Backend for character creation

import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { uploadFile } from '@/lib/gcs';
import qs from "qs";

export const maxDuration = 30;
const MAX_CHARS = 10;
const cosinesim = (A: number[], B: number[]) => {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return mA === 0 || mB === 0 ? 1 : dotproduct / (mA * mB);
};

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `character/bg/${timestamp}${extension}`;
}

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    const session = await auth();
    const user = session?.user;
    const data = await req.formData();
    const img = data.get('imgFile') as File
    const mainData = data.get('data') as string
    const body = JSON.parse(mainData);
    const {
      name,
      description,
      instructions,
      seed,
      categoryId,
      addedCategory,
      greeting,
      tags,
      addons
    } = body;
    if (!user || !user.id) {
      return new NextResponse("User not logged in.", { status: 401 });
    }

    if (
      !img ||
      !name ||
      !description ||
      !seed ||
      !instructions ||
      !categoryId
    ) {
      return new NextResponse("Missing a required field.", { status: 400 });
    }

    let imageUrl: string | null = '';
    if (img) {
      const imgPath = generateFilePath(img.name);
      imageUrl = await uploadFile(img, imgPath);
    }

    // const openai = new OpenAI();

    // const violate = await openai.moderations.create({
    //   input: name + "\n" + description,
    // });

    // for (let result of violate.results) {
    //   if (result.flagged) {
    //     return new NextResponse("moderation-prompt", { status: 401 });
    //   }
    // }

    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier, 3);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const num = await prismadb.character.count({
      where: {
        userId: user.id,
      },
    });

    if (num + 1 > MAX_CHARS) {
      return new NextResponse("Maximum characters exceeded", { status: 429 });
    }

    const character = await prismadb.character.create({
      data: {
        categoryId,
        userId: user.id,
        image: imageUrl ? imageUrl: "",
        name,
        description,
        instructions,
        seed,
        greeting:
          greeting ||
          `Hi, I'm ${name}, ${description}. What do you want to chat about today?`,
        utility: body.utility
          ? {
            create: {
              // Add properties for the utility object here
              ...body.utility,
            },
          }
          : undefined,
        storytelling: body.storytelling
          ? {
            create: {
              // Add properties for the storytelling object here
              ...body.storytelling,
            },
          }
          : undefined,
        tags: {
          create: tags.map((tagId: string) => ({ tagId })),
        },
      },
    });
    if (addons && addons.length > 0) {  
      await prismadb.characterKnowledgePack.createMany({  
        data: addons.map((addonId: string) => ({  
          characterId: character.id,  
          userId: user.id,  
          knowledgePackId: addonId,  
        })),  
      });  
    }
    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const rawParams = req.url.split("?")[1];
    const searchParams = qs.parse(rawParams);
    const session = await auth();
    const user = session?.user;

    const name = searchParams.params ? (searchParams.params as string) : "";
    const characters = await prismadb.character.findMany({
      where: {
        AND: {
          name: {
            contains: name,
          },
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
        shared: true,
        private: true,
        createdAt: true,
        updatedAt: true,
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
    const userId = user?.id || "default";
    let userprefs: Record<string, number> = {};
    let unvisited: string[] = [];
    type Peer = { similarity: number; prefs: Record<string, number> };
    let peers: Record<string, Peer> = {};
    characters.forEach((character) => {
      let total = 0;
      character.messages.forEach((message) => {
        if (message.userId === userId) {
          total += 1;
        } else if (
          !peers.hasOwnProperty(message.userId) &&
          Object.keys(peers).length < 50
        ) {
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
      const similarity = cosinesim(
        Object.values(userprefs),
        Object.values(peers[peer].prefs),
      );
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

    const sortedCharacters = Object.entries(userprefs)
      .map(([id, score]) => ({
        id,
        score,
        ...characters.find((character) => character.id === id),
      }))
      .sort((a, b) => b.score - a.score);
    return NextResponse.json(sortedCharacters);
  } catch (error) {
    console.log("[CHARACTER_DEFAULT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
