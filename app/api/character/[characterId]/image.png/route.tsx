import prismadb from "@/lib/prismadb";
import { ImageResponse } from "next/og";
import {
  checkIfPngImageExistsFromWebpUrl,
  fromWebpUrlUploadToStorage,
} from "@/lib/gcs";

export async function GET(
  request: Request,
  { params }: { params: { characterId: string } },
) {
  const characterId = params.characterId;
  console.log("Request:", request);

  if (!characterId) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Character not found.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  console.log("Character ID:", characterId);

  let character;
  try {
    character = await prismadb.character.findUnique({
      where: {
        id: characterId,
      },
    });
  } catch (error) {
    console.error("Error fetching character from database:", error);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Error fetching character data.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  console.log("Fetched Character:", character);

  if (!character || !character.shared || character.userId === "public") {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Character not found.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  if (!character.image) {
    console.error("Character image is undefined:", character);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Character image not found.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  const desc = character.description || "";
  const name = character.name || "";

  let pngExists;
  try {
    [pngExists] = await checkIfPngImageExistsFromWebpUrl(character.image);
  } catch (error) {
    console.error("Error checking if PNG exists:", error);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Error checking image existence.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  console.info("PNG exists:", pngExists, "Character image:", character.image);

  let url = "";
  if (!pngExists) {
    try {
      url = await fromWebpUrlUploadToStorage(character.image);
    } catch (error) {
      console.error("Error uploading WebP to storage:", error);
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: "black",
              background: "white",
              width: "100%",
              height: "100%",
              padding: "50px 200px",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Error processing character image.
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }
  } else {
    try {
      url = character.image.replace(".webp", ".png");
    } catch (error) {
      console.error("Error replacing image extension:", error);
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: "black",
              background: "white",
              width: "100%",
              height: "100%",
              padding: "50px 200px",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Error processing character image.
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }
  }

  const MAX_LEN = 100;
  const MAX_LEN_NAME = 14;
  return new ImageResponse(
    (
      <div
        tw="flex w-full h-full"
        style={{
          backgroundImage:
            "url(https://media.discordapp.net/attachments/896524738111893505/1212265388553936927/Page_thumbnail.png?ex=65f1351f&is=65dec01f&hm=771377d09da09bdaab3a1ece93693a4f3febbec5409c2c659656a5684633c194&=&format=png&quality=lossless)",
          backgroundSize: "1200px 630px",
        }}
      >
        <div tw="flex flex-col absolute top-[274px] left-[100px] h-[256px] w-[500px] bg-[#F3F3F3] justify-end">
          <p tw="text-[24px] w-[142px] h-[48px] px-[16px] py-[4px] rounded-[46px] bg-white">
            {" "}
            Chat with{" "}
          </p>
          <p tw="text-[60px] font-semibold leading-[40px]">
            {" "}
            {name.length > MAX_LEN_NAME
              ? name.substring(0, MAX_LEN_NAME) + "..."
              : name}
          </p>
          <p tw="font-light text-[22px] text-gray-600">
            {" "}
            {desc.length > MAX_LEN ? desc.substring(0, MAX_LEN) + "..." : desc}
          </p>
        </div>
        <img
          style={{
            objectFit: "cover",
            backgroundColor: "white",
          }}
          width="353"
          height="427"
          tw="absolute top-[100px] left-[714px] rounded-[20px]"
          src={url}
          alt="cover"
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
