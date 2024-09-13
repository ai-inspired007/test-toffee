import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import prismadb from "@/lib/prismadb";

/**
 * Return voice list from the API
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  return await fetch(
    `https://api.elevenlabs.io/v1/voices/${id}/?show_legacy=true`,
    {
      method: "GET",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
    },
  )
    .then(async (response) => {
      const headers = new Headers();
      if (!response?.body) {
        return new NextResponse("Unable to get response from API.", {
          status: 500,
        });
      }

      return new NextResponse(response.body, { headers });
    })
    .catch((error: any) => {
      return new NextResponse(error || error?.message, { status: 500 });
    });
}

/**
 * Return a created voice_id from the API
 * @param {NextRequest} req - The HTTP request
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(req: NextRequest) {
  const data = await req.formData();

  const files = data.get("files") as File;
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const labels = data.get("labels") as string;

  console.log({ files, name, description, labels });

  if (files) {
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    const response = await client.voices.add({
      files: [files],
      name,
      description,
      labels,
    });

    console.log(response);
    if (response.voice_id) {
      return NextResponse.json({ voice_id: response.voice_id });
    } else {
      return NextResponse.json(
        { error: "Error in elevenlab api call" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "Add voice error" }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    const response = await client.voices.edit(id, {
      name: body.name,
      description: body.description,
    });

    console.log("Edit voice response", response);

    const voiceDetail = await prismadb.voice.findFirst({
      where: { voiceId: id },
    });

    console.log("Get voiceDetail response", voiceDetail);

    if (voiceDetail) {
      const updatedVoiceDetail = await prismadb.voice.update({
        where: { id: voiceDetail.id },
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
    } else {
      return new NextResponse(`Can't find voiceDetail for voiceId: ${id}`, {
        status: 500,
      });
    }
  } catch (error) {
    console.log("[VOICE_PUT]", error);
    return new NextResponse("Edit voice error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await prismadb.tag.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[TAG_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
