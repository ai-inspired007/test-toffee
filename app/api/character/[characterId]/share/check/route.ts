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

    const res = await prismadb.subscription.findFirst({
      where: {
        userId,
        characterId: params.characterId,
      },
    });

    if (res !== null) {
      return NextResponse.json({ isSubscribed: true });
    } else {
      return NextResponse.json({ isSubscribed: false });
    }
  } catch (error) {
    console.log("[CHARACTER_SHARE_CHECK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
