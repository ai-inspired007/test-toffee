import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { characterId: string } },
) {
  try {
    let body = await req.json();
    const { like } = body;
    console.log(like);
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.characterId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const feedback = await prismadb.characterFeedback.findFirst({
      where: {
        userId: userId,
        characterId: params.characterId
      }
    })

    if (feedback) {
      const updatedFeedback = await prismadb.characterFeedback.update({
        where: {
          id: feedback.id
        },
        data: {
          userId: userId,
          characterId: params.characterId,
          like: like
        }
      });
      if (!updatedFeedback) {
        return NextResponse.json("Not Found", {status: 404})
      }
    } else {
      const createdFeedback = await prismadb.characterFeedback.create({
        data: {
          userId: userId,
          characterId: params.characterId,
          like: like
        }
      });
      if (!createdFeedback) {
        return NextResponse.json("Not Found", {status: 404})
      }
    }
    return NextResponse.json("Success", {status: 200})
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}