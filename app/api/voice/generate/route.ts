import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient, ElevenLabs } from "elevenlabs";
import * as fs from "fs";

/**
 * Return a generated voice data from the API
 * @param {NextRequest} req - The HTTP request
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data) {
    console.log({ data });

    const { gender, age, text } = data;
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    const response = await client.voiceGeneration.generate({
      gender: gender,
      accent: "american",
      age: age,
      accent_strength: 2,
      text: text,
    });

    console.log(response);
    if (response) {
      return NextResponse.json({ gen_result: response });
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
