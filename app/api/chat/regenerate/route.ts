import prismadb from "@/lib/prismadb";  
import OpenAI from "openai";  
import { NextResponse } from "next/server";  
import { StreamingTextResponse, OpenAIStream } from "ai";  

export async function POST(req: Request) {  
  try {  
    console.log("[MESSAGE_REGENERATE] Began running message regeneration...");  
    const { id, prompt } = await req.json();  

    // Find the original message  
    const message = await prismadb.message.findUnique({  
      where: {  
        id: id,  
      },  
    });  

    if (!message) {  
      return new NextResponse("Message not found", { status: 404 });  
    }  

    // Initialize OpenAI  
    let openai = new OpenAI({  
      apiKey: process.env.OPENAI_API_KEY,  
    });  

    // Regenerate the message  
    const systemPrompt = "Regenerate the following message";  
    let response = await openai.chat.completions.create({  
      messages: [  
        { role: "system", content: systemPrompt },  
        { role: "user", content: prompt },  
      ],  
      model: "gpt-4-1106-preview",  
      stream: true,  
      max_tokens: 1024,  
    }).catch(console.error);  

    if (!response) {  
      return new NextResponse("Model could not make completion.", { status: 500 });  
    }  

    // Stream handling  
    const stream = OpenAIStream(response);  

    // Collect streamed chunks into a complete string  
    const reader = stream.getReader();  
    let newContent = '';  

    while (true) {  
      const { done, value } = await reader.read();  
      if (done) break;  
      newContent += new TextDecoder().decode(value, { stream: true });  
    }  
    
    // Update the message in the database  
    await prismadb.message.update({  
      where: {  
        id: id,  
      },  
      data: {  
        content: newContent,  
      },  
    });  

    console.log("[MESSAGE_REGENERATE] Successfully updated message in the database.");  

    // Return a response with the updated message content  
    return new StreamingTextResponse(new ReadableStream({  
      start(controller) {  
        controller.enqueue(new TextEncoder().encode(newContent));  
        controller.close();  
      }  
    }));  

  } catch (error: any) {  
    console.log("[CHAT_POST]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}