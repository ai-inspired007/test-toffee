import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { uploadFile } from "@/lib/gcs";
import prismadb from "@/lib/prismadb";
import { auth } from "auth";

function generateFilePath(fileName: string): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:-]/g, "")
    .replace(/\..+/, "");
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `user/bg/${timestamp}${extension}`;
}

function getFilteredVoices(voices: any[], voiceDetails: any[], userId: string) {
  let filtered_voices: any[] = [];
  for (let voice of voices) {
    if (voice.category === "premade") {
      filtered_voices.push(voice);
    } else {
      const voiceId = voice.voice_id;
      const voiceDetail = voiceDetails?.find((x) => x.voiceId === voiceId);
      if (voiceDetail) {
        filtered_voices.push({
          ...voice,
          preview_url: voiceDetail.preview_url,
        });
      }
    }
  }
  filtered_voices.sort((a, b) =>
    a.category > b.category
      ? 1
      : a.category < b.category
        ? -1
        : a.name > b.name
          ? 1
          : -1,
  );
  return filtered_voices;
}

/**
 * Return voice list from the API
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return await fetch(`https://api.elevenlabs.io/v1/voices/?show_legacy=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
    },
  })
    .then(async (response) => {
      if (!response?.body) {
        return new NextResponse("Unable to get response from API.", {
          status: 500,
        });
      }

      console.log(response?.body);
      const data = await response.json();

      const voiceDetails = await prismadb.voice.findMany({
        where: {
          OR: [
            {
              sharing: "public",
            },
            {
              userId,
            },
          ],
        },
      });

      let filtered_voices = getFilteredVoices(
        data.voices,
        voiceDetails,
        userId,
      );
      return NextResponse.json({ voices: filtered_voices });
    })
    .catch((error: any) => {
      return NextResponse.json(
        { error: "Error in elevenlab error" },
        { status: 500 },
      );
    });
}

/**
 * Return a created voice_id from the API
 * @param {NextRequest} req - The HTTP request
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.formData();

  const files = data.get("files") as File;
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const labels = data.get("labels") as string;

  console.log({ files, name, description, labels });

  let fileUrl: string | null = "";
  const filePath = generateFilePath(files.name);
  fileUrl = await uploadFile(files, filePath);

  console.log("fileUrl", fileUrl);

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
      const createdVoiceDetail = await prismadb.voice.create({
        data: {
          userId,
          voiceId: response.voice_id,
          name: name,
          description,
          preview_url: fileUrl || "",
          pharse: "",
          sharing: "",
        },
      });

      console.log("createdVoiceDetail", createdVoiceDetail);
      return NextResponse.json({ voiceDetail: createdVoiceDetail });
    } else {
      return NextResponse.json(
        { error: "Error in elevenlab error" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }
}
