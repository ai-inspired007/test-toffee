import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { characterId: string } },
) {
  try {
    let body = await req.json();
    const { knowledgePackId, isAdd } = body;

    const session = await auth();
    const userId = session?.user?.id;

    if (!params.characterId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    if (isAdd) {
      const createdConnect = await prismadb.characterKnowledgePack.create({
        data: {
          characterId: params.characterId,
          knowledgePackId: knowledgePackId
        }
      })

      if (!createdConnect) {
        return NextResponse.json("Not Found", { status: 404 })
      }
    } else {
      const deletedConnect = await prismadb.characterKnowledgePack.deleteMany({
        where: {
          characterId: params.characterId,
          knowledgePackId: knowledgePackId
        }
      })

      if (!deletedConnect) {
        return NextResponse.json("Not Found", { status: 404 })
      }
    }
    
    return NextResponse.json("Success", {status: 200})
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}