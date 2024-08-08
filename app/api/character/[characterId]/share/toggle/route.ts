import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 35;

export async function POST(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { checked } = await req.json();

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const identifier = req.url + "-" + userId;
    const { success } = await rateLimit(identifier, 10);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    if (!params.characterId) {
      return new NextResponse("Invalid character ID", { status: 401 });
    }

    const isShared = checked != "Private";
    const isPrivate = checked != "Public";

    if (isShared && !isPrivate) {
      const openai = new OpenAI();

      const character = await prismadb.character.findUnique({
        where: {
          id: params.characterId,
        },
      });

      if (!character) {
        return new NextResponse("Character not found", { status: 404 });
      }

      const violate = await openai.moderations.create({
        input:
          character.name +
          "\n" +
          character.description +
          "\n" +
          character.greeting +
          "\n",
      });

      for (let result of violate.results) {
        if (result.flagged) {
          return new NextResponse("moderation-prompt", { status: 401 });
        }
      }
    }

    await prismadb.character.update({
      where: {
        id: params.characterId,
      },
      data: {
        shared: isShared,
        private: isPrivate,
      },
    });

    return new NextResponse("Success.");
  } catch (error) {
    console.log("[CHARACTER_SHARE_TOGGLE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { characterId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const identifier = req.url + "-" + userId;
    const { success } = await rateLimit(identifier, 10);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    if (!params.characterId) {
      return new NextResponse("Invalid character ID", { status: 401 });
    }

    const comp = await prismadb.character.findUnique({
      where: {
        id: params.characterId,
      },
    });

    let ret = "Private";

    if (!comp) {
      return NextResponse.json({ shared: false });
    }

    if (comp?.shared && !comp.private) {
      ret = "Public";
    } else if (comp?.shared && comp.private) {
      ret = "Restricted";
    }

    return NextResponse.json({ shared: ret });
  } catch (error) {
    console.log("[CHARACTER_SHARE_TOGGLE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
