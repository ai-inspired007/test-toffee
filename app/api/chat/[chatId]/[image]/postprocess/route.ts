import { Indexer } from "@/lib/memory/indexing";  
import { MemoryManager } from "@/lib/memory/memory";  
import prismadb from "@/lib/prismadb";  
import { Role } from "@prisma/client";
import { auth } from "auth";  
import { NextResponse } from "next/server";  

export async function POST(  
  req: Request,  
  { params }: { params: { chatId: string; image: string } },  
) {  
  try {  
    const body = await req.json();  
    console.log("POSTPROCESS ENDPOINT");  
    console.log("params:", params);  
    console.log("body:", body);  
    
    const session = await auth();  
    const userId = session?.user?.id;  

    if (!userId) {  
      return new NextResponse("Unauthorized", { status: 401 });  
    }  

    const character = await prismadb.character.findUnique({  
      where: {  
        id: params.chatId,  
      },  
      include: {  
        messages: true,  
        subscriptions: true, // Include subscriptions to check user access  
      },  
    });  

    if (!character || (  
      character.userId !== userId &&   
      character.userId !== "public" &&   
      !character.subscriptions.some(s => s.userId === userId) &&   
      !character.shared  
    )) {  
      return new NextResponse("Character not found or unauthorized", { status: 404 });  
    }  

    // Create user message  
    const userMessage = await prismadb.message.create({  
      data: {  
        characterId: params.chatId,  
        content: body.prompt,  
        role: Role.user,  
        userId: userId,  
        image_url: params.image === "EMPTY" ? null : params.image,  
        file_name: body.fileName,
        file_type: body.fileType
      },  
    });  

    let completionMessage = null;  
    
    if (body.completion !== undefined && body.completion.length > 1) {  
      // Create the assistant message  
      const aiMessage = await prismadb.message.create({  
        data: {  
          characterId: params.chatId,  
          content: body.completion.trim(),  
          role: Role.assistant,  
          userId: userId,  
        },  
      });  

      completionMessage = {
        id: aiMessage.id,
        role: aiMessage.role,
        content: aiMessage.content,
        error: aiMessage.error,  
        isEmbedded: aiMessage.isEmbedded,
        image_url: aiMessage.image_url,  
      }
    }

    const messageList = await prismadb.message.findMany({
      where: {
        characterId: params.chatId,
        userId: userId,
        isEmbedded: false
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    // if (messageList.length > 30) {
    //   let indexer = Indexer.getInstance();
    //   (await indexer).indexIncomingChat(
    //     messageList,
    //     params.chatId,
    //     userId,
    //     character.name
    //   );
    //   await prismadb.message.updateMany({
    //     where: {
    //       OR: messageList.map(item => ({id: item.id}))
    //     },
    //     data: {
    //       isEmbedded: true
    //     }
    //   })
    // }

    const promptMessage = {
      id: userMessage.id,
      role: userMessage.role,
      content: userMessage.content,
      error: userMessage.error,  
      isEmbedded: userMessage.isEmbedded,
      image_url: userMessage.image_url, 
      file_name: userMessage.file_name,
      file_type: userMessage.file_type
    }

    return NextResponse.json({ promptMessage, completionMessage, total: messageList.length }, { status: 200 });

    // if(outputMessageId){  
    //   console.log("[OUTPUT_MESSAGE]:", outputMessageId)  
    //   return NextResponse.json({ promptMessageId: userMessage.id, completionMessageId: outputMessageId }, { status: 200 });  
    // } else {  
    //   return new NextResponse("[CHAT_POSTPROCESS] Assistant message was not created successfully", { status: 500 });  
    // }  
  } catch (error) {  
    console.error(error);  
    return new NextResponse("[CHAT_POSTPROCESS] Internal server error", { status: 500 });  
  }  
}