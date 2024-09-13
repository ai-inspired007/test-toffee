import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * Return voice detail by voiceId
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const voiceDetail = await prismadb.voice.findFirst({
      where: { voiceId: id },
    });

    return NextResponse.json(voiceDetail);
  } catch (error) {
    console.log("[TAG_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * Return updated voice detail by voiceDetail id
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedVoiceDetail = await prismadb.voice.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        pharse: body.pharse,
        tags: body.tags,
        sharing: body.sharing,
      },
      select: {
        id: true,
        name: true,
        description: true,
        pharse: true,
        tags: true,
        sharing: true,
      },
    });

    return NextResponse.json(updatedVoiceDetail);
  } catch (error) {
    console.log("[TAG_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await prismadb.voice.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[TAG_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
