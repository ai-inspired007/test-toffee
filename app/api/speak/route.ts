import { Message } from "ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * Return a stream from the API
 * @param {NextRequest} req - The HTTP request
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(req: NextRequest) {
  const url = req.url;
  const voiceId = "FGY2WhTYpPnrIDTdsKH5"; // replace "default_voice_id" with your default voice ID if needed
  const modelId = "eleven_multilingual_v2";
  const message: Message = await req.json();
  const start = Date.now();

  let text = message.content;

  text = text
    .replaceAll("¡", "")
    .replaceAll("https://", "")
    .replaceAll("http://", "")
    .replaceAll(".com", " dot com")
    .replaceAll(".org", " dot org")
    .replaceAll(".co.uk", " dot co dot UK")
    .replaceAll(/```[\s\S]*?```/g, "\nAs shown on the app.\n")
    .replaceAll(
      /([a-zA-Z0-9])\/([a-zA-Z0-9])/g,
      (match, precedingText, followingText) => {
        return precedingText + " forward slash " + followingText;
      }
    );

  const requestBody = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: 0.75, // Customize these values as needed
      similarity_boost: 0.75, // Customize these values as needed
    },
  };

  console.log(process.env.ELEVENLABS_API_KEY)
  return await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        "X-Request-Referrer": url,
      },
    }
  )
    .then(async (response) => {
      const headers = new Headers();
      headers.set("X-DG-Latency", `${Date.now() - start}`);
      headers.set("Content-Type", "audio/mp3");

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