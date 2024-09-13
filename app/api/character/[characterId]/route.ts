import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { uploadFile } from '@/lib/gcs';

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `character/images/${timestamp}${extension}`;
}

export const maxDuration = 35;

export async function DELETE(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.characterId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const character = await prismadb.character.delete({
      where: {
        userId,
        id: params.characterId,
      },
    });

    if (!character) {
      return new NextResponse("User not authorized to delete.", {
        status: 401,
      });
    }

    const memoryManager = await MemoryManager.getInstance();
    await memoryManager.deleteAllKeys(params.characterId);
    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.characterId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const data = await req.formData();
    const avatarFile = data.get('avatarFile') as File | null;
    const characterInfo = data.get('characterInfo') as string;
    const body = JSON.parse(characterInfo);

    const {
      image,
      name,
      shared,
      private: isPrivate,
      description,
      instructions,
      seed,
      categoryId,
      greeting,
      tags,
      voiceId,
      knowledgePackIds
    } = body;

    let imageUrl = image;
    if (avatarFile) {
      const imgPath = generateFilePath(avatarFile.name);
      imageUrl = await uploadFile(avatarFile, imgPath);
    }

    const nowCharacter = await prismadb.character.findUnique({
      where: { id: params.characterId },
    });

    if (!nowCharacter) {
      return new NextResponse("Character not found or user not authorized.", { status: 404 });
    }

    const updateData: Partial<typeof body> = {};
    if (imageUrl) updateData.image = imageUrl;
    if (name) updateData.name = name;
    if (shared !== undefined) updateData.shared = shared;
    if (isPrivate !== undefined) updateData.private = isPrivate;
    if (description) updateData.description = description;
    if (instructions) updateData.instructions = instructions;
    if (seed) updateData.seed = seed;
    if (categoryId) updateData.categoryId = categoryId;
    if (greeting) updateData.greeting = greeting;
    if (voiceId) updateData.voiceId = voiceId;

    const updatedCharacter = await prismadb.character.update({
      where: { id: params.characterId },
      data: updateData,
    });

    // Update tags separately  
    if (tags && tags.length > 0) {
      await prismadb.characterTag.deleteMany({
        where: { characterId: params.characterId }
      });

      await prismadb.characterTag.createMany({
        data: tags.map((tagId: string) => ({
          characterId: params.characterId,
          tagId
        })),
      });
    }
    if (knowledgePackIds && knowledgePackIds.length > 0) {
      await prismadb.characterKnowledgePack.deleteMany({
        where: { characterId: params.characterId }
      });

      await prismadb.characterKnowledgePack.createMany({
        data: knowledgePackIds.map((knowledgePackId: string) => ({
          characterId: params.characterId,
          knowledgePackId
        })),
      });
    }

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('[CHARACTER_UPDATE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
    console.log(params.characterId);

    const body = await req.json();
    const session = await auth();
    const user = session?.user;
    const {
      image,
      name,
      description,
      instructions,
      seed,
      categoryId,
      greeting,
      tags
    } = body;
    const isShared = await prismadb.character.findFirst({
      where: {
        id: params.characterId,
      },
      select: {
        shared: true,
        private: true,
      },
    });

    if (isShared?.shared && !isShared?.private) {
      const openai = new OpenAI();

      const violate = await openai.moderations.create({
        input: name + "\n" + description + "\n" + greeting,
      });

      for (let result of violate.results) {
        if (result.flagged) {
          return new NextResponse("moderation-prompt", { status: 401 });
        }
      }
    }

    if (!params.characterId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!user || !user.id) {
      return new NextResponse("User not logged in.", { status: 401 });
    }

    if (!image || !name || !description || !seed || !instructions || !categoryId) {
      return new NextResponse("Missing a required field.", { status: 400 });
    }

    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier, 3);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const character = await prismadb.character.update({
      where: {
        id: params.characterId,
      },
      data: {
        categoryId,
        userId: user.id,
        image,
        name,
        description,
        instructions,
        seed,
        greeting: greeting || `Hi, I'm ${name}, ${description}. What do you want to chat about today?`,
        tags: {
          create: tags.map((tagId: string) => ({ tagId })),
        },
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}