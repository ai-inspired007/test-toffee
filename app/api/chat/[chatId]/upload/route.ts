import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { MemoryManager, writeFile, deleteFile } from "@/lib/memory/memory";
import { deleteFiles } from "@/lib/utils";
import { getLoader } from "@/lib/memory/indexing";
import { Indexer } from "@/lib/memory/indexing";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import {PineconeStore} from "langchain/vectorstores/pinecone"
import { FileType, KnowledgePackType } from "@prisma/client";
import { CHARS_PER_DOC } from "@/lib/const";
import fs from "fs";
import { isEmpty } from "lodash";
import { Document } from "langchain/document";
import mime from "mime";
import { bufferToBlob } from "@/lib/memory/indexing";

export const maxDuration = 60;
const MAX_CHARS = 10;

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }
    
    const identifier = req.url + "-" + userId;
    const { success } = await rateLimit(identifier, 10);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const formData = await req.formData();
    const formDataEntryValues = Array.from(formData.values());

    if (isEmpty(formDataEntryValues)) {
      return new NextResponse("Input file is required.", { status: 400 });
    }

    let keyList: string[] = [];

    for (const formDataEntryValue of formDataEntryValues) {
      if (
        typeof formDataEntryValue === "object" &&
        "arrayBuffer" in formDataEntryValue
      ) {
        const file = formDataEntryValue as unknown as Blob;
        const buffer: any = Buffer.from(await file.arrayBuffer());
        const fileName = formDataEntryValue.name;
        
        if (!buffer ) {
          console.error(`Buffer not found for file: ${fileName}`);
        } else {
          const key = await writeFile(params.chatId, buffer);
        
          if (key)
            keyList.push(key);
          }
      }
    }

    return NextResponse.json({key: !isEmpty(keyList) ? keyList[0] : ""});
  } catch (error) {
    console.log("[EVOLVE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: { chatId: string } },
// ) {
//   try {
//     const session = await auth();
//     const userId = session?.user?.id;

//     let body = await req.json();
//     const { key } = body;

//     if (!params.chatId) {
//       return new NextResponse("Character ID is required.", { status: 400 });
//     }

//     if (!userId) {
//       return new NextResponse("User not authorized.", { status: 401 });
//     }

//     const identifier = req.url + "-" + userId;
//     const { success } = await rateLimit(identifier, 10);

//     if (!success) {
//       return new NextResponse("Rate limit exceeded", { status: 429 });
//     }

//     if (!await deleteFile(key))
//       return new NextResponse("Failed", { status: 200 });
      
//     return new NextResponse("Success", { status: 200 });
//   } catch (error) {
//     console.log("[EVOLVE_MEMORY_DELETE]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
