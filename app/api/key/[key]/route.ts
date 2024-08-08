import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: { key: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const identifier = req.url + "-" + userId;
    const { success } = await rateLimit(identifier, 3);

    if (!params.key) {
      return new NextResponse("API key is required.", { status: 400 });
    }

    let options = {
      method: "POST",
      url: "https://api.corcel.io/cortext/text",
      headers: {
        "Content-Type": "application/json",
        // 'X-API-KEY': `${params.key}`
        Authorization: "Bearer " + params.key,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "assistant",
            content: `Random test prompt`,
          },
        ],
        model: "cortext-ultra",
        stream: false,
        miners_to_query: 1,
        top_k_miners_to_query: 40,
      }),
    };
    let request = require("request");
    const makeRequest = (options: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        request(options, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    };

    let response = await makeRequest(options);
    let data = JSON.parse(response.body);
    console.log("error", data.error);
    if (data.error != undefined && data.error == "Invalid API key") {
      console.log("Invalid");
      return new NextResponse("Internal Error", { status: 500 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    await prismadb.aPAIKey.upsert({
      where: {
        userId: userId,
      },
      update: {
        key: params.key,
      },
      create: {
        userId: userId,
        key: params.key,
      },
    });

    return new NextResponse("Success!", { status: 200 });
  } catch (error) {
    console.log("[KEY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
