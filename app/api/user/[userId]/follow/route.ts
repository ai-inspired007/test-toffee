import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    let body = await req.json();
    
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.userId) {
      return new NextResponse("User ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const createdFollow = await prismadb.follow.create({
      data: {
        follower_id: params.userId,
        following_id: body.following_id,
      }
    })

    console.log(createdFollow);

    return NextResponse.json({createdFollow})
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}