import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextResponse } from "next/server";
export const maxDuration = 30;

export const dynamic = "force-dynamic"; // Mark the route as dynamic

export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    const characters = await prismadb.character.findMany({
      where: {
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
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          where: {
            userId: user?.id,
          },
        },
      },
    });

    const sortedCharacters = characters
      .map((character) => ({
        ...character,
        latestMessage: character.messages[0],
      }))
      .filter((character) => character.latestMessage)
      .sort(
        (a, b) =>
          b.latestMessage.createdAt.getTime() -
          a.latestMessage.createdAt.getTime(),
      );

    return NextResponse.json(sortedCharacters);
  } catch (error) {
    console.log("[CHARACTER_GET_CHAT_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
