// Backend for character editing & deletion

import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

export async function PATCH(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
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

    if (
      !image ||
      !name ||
      !description ||
      !seed ||
      !instructions ||
      !categoryId
    ) {
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
        greeting:
          greeting ||
          `Hi, I'm ${name}, ${description}. What do you want to chat about today?`,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
