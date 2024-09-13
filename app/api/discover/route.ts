import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import { Character } from "@prisma/client";
export const maxDuration = 30;

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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const session = await auth();
    const user = session?.user;
    const name = searchParams.get("params") || "";
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
        category: true,
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
    const categories = await prismadb.category.findMany({
      select: {
        id: true,
        name: true,
        characters: true
      }
    });
    return NextResponse.json({
      characters: characters,
      categories: categories
    });
  } catch (error) {
    console.log("[CHARACTER_GET_DISCOVER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
