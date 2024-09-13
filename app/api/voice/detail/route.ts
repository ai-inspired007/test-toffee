import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";

/**
 * Return added voice detail by id
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const newVoiceDetail = await prismadb.voice.create({
      data: {
        name: body.name || "",
        userId: userId || "",
        voiceId: body.voice_id || "",
        description: body.description || "",
        pharse: body.pharse || "",
        tags: body.tags || [],
        sharing: body.sharing || "",
        preview_url: body.preview_url || "",
      },
    });

    return NextResponse.json(newVoiceDetail);
  } catch (error) {
    console.log("[TAG_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
