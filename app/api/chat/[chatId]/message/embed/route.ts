import { Indexer } from "@/lib/memory/indexing";
import prismadb from "@/lib/prismadb";  
import { auth } from "auth";  
import { NextResponse } from "next/server";  

export async function GET(  
  req: Request,  
  { params }: { params: { chatId: string } },  
) {  
  try {  
    console.log("Embed ENDPOINT");  
    console.log("params:", params);  

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

    console.log(messageList.length)
    // if (messageList.length > 30) {
      let indexer = Indexer.getInstance();
      (await indexer).indexIncomingChat(
        messageList,
        params.chatId,
        userId,
        character.name
      );
      await prismadb.message.updateMany({
        where: {
          OR: messageList.map(item => ({id: item.id}))
        },
        data: {
          isEmbedded: true
        }
      })
    // }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {  
    console.error(error);  
    return new NextResponse("[CHAT_POSTPROCESS] Internal server error", { status: 500 });  
  }  
}