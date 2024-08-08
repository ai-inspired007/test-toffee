import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextResponse } from "next/server";

export const maxDuration = 30;

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

    const memoryManager = await MemoryManager.getInstance();

    const characterId = params.characterId;
    console.log("[CHARACTER_ID]: ", characterId);
    await memoryManager.deleteCharacterMemory(characterId, userId);
    return new NextResponse("Character memory deleted.", { status: 200 });
  } catch (error) {
    console.log("[CHARACTER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
