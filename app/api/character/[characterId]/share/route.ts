import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";

export const maxDuration = 35;

export async function POST(
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
    const { success } = await rateLimit(identifier, 3);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    if (!params.characterId) {
      return new NextResponse("Invalid character ID", { status: 401 });
    }

    let character = await prismadb.character.findUnique({
      where: {
        id: params.characterId,
      },
    });

    if (!character) {
      return new NextResponse("Character with ID not found", { status: 401 });
    }

    if (character.userId == userId) {
      return new NextResponse("You cannot subscribe to your own character.", {
        status: 402,
      });
    }

    if (character.userId == "public") {
      return new NextResponse("You cannot subscribe to a public model.", {
        status: 402,
      });
    }

    let subscriptions = await prismadb.subscription.findMany({
      where: {
        userId,
        characterId: params.characterId,
      },
    });

    if (subscriptions.length == 0) {
      await prismadb.subscription.create({
        data: {
          userId,
          characterId: params.characterId,
        },
      });
      return new NextResponse(`Success.`, { status: 200 });
    } else {
      return new NextResponse(`You are already subscribed.`, { status: 401 });
    }
  } catch (error) {
    console.log("[CHARACTER_SHARE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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
    const { success } = await rateLimit(identifier, 3);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    if (!params.characterId) {
      return new NextResponse("Invalid character ID", { status: 401 });
    }

    let character = await prismadb.character.findUnique({
      where: {
        id: params.characterId,
      },
    });

    if (!character) {
      return new NextResponse("Character with ID not found", { status: 401 });
    }

    if (character.userId == userId) {
      return new NextResponse("You cannot unsubscribe to your own character.", {
        status: 402,
      });
    }

    if (character.userId == "public") {
      return new NextResponse("You cannot unsubscribe to a public model.", {
        status: 402,
      });
    }

    let subscriptions = await prismadb.subscription.deleteMany({
      where: {
        userId,
        characterId: params.characterId,
      },
    });

    if (subscriptions.count == 0) {
      return new NextResponse("You are not subscribed to this model.", {
        status: 402,
      });
    }

    return new NextResponse(`Success.`, { status: 200 });
  } catch (error) {
    console.log("[CHARACTER_SHARE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
