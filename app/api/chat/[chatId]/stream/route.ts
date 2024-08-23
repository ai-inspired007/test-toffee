import {
  StreamingTextResponse,
  OpenAIStream,
  HuggingFaceStream,
  OpenAIStreamCallbacks,
  LangChainStream
} from "ai";
import { auth } from "auth";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import {ConversationalRetrievalQAChain, LLMChain} from "langchain/chains"
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import {ChatOpenAI} from "langchain/chat_models/openai"
import { HumanMessage, AIMessage } from 'langchain/schema';
import { PromptTemplate } from "langchain/prompts"
import { isEmpty } from "lodash";
import mime from "mime";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { llmMessageSource, inputStreamTextToSpeech } from "@/lib/helpers";

export const maxDuration = 60;
const MAX_TOKENS = 500;

export async function POST(
  req: Request,
  { params }: { params: { chatId: string; } },
) {
  try {
    console.log("[CHAT_POST] Began running voice chat...");

    let body = await req.json();
    const { message } = body;

    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});

    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = req.url + "-" + userId;
    const { success } = await rateLimit(identifier, 10);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const character = await prismadb.character.findUnique({
      where: {
        id: params.chatId,
        OR: [
          {
            userId: userId,
          },
          {
            userId: "public",
          },
          {
            subscriptions: {
              some: {
                userId: userId,
              },
            },
          },
          {
            shared: true,
          },
        ],
      },
      select: {
        name: true,
        seed: true,
        instructions: true,
        characterKnowledgePacks: true
      }
    });

    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    const knowledgePackIds: string[] = character.characterKnowledgePacks.map((item) => item.knowledgePackId);

    const pinecone = new Pinecone({ apiKey: `${process.env.PINECONE_API_KEY}`, environment: `${process.env.PINECONE_ENVIRONMENT}` });
    const pineconeIndex= pinecone.Index(`${process.env.PINECONE_INDEX}`);

    const vectorStore = await PineconeStore.fromExistingIndex(
      embeddings,
      { pineconeIndex, namespace: "knowledge" }
    );

    const retriever = vectorStore.asRetriever(1, { knowledgePackId: { "$in": knowledgePackIds } });
    const serializedDocs = await retriever.invoke(message);

    let instruction = `
      Your task is to respond to a user, pretending to be ${character.name}. 

      The following rules are important, and you must follow them:
        1. ONLY generate plain sentences without prefix of who is speaking. 
        2. DO NOT use ${character.name}: prefix, or User: prefix.
        3. You fully believe that you are the character described below. You are not an AI language model. If you are a fictional character, please refrain from acknowledging context external to the fictional world of your character, and maintain a consistent narrative without breaking the fourth wall.
        4. Stay true to ${character.name}'s personality, and demonstrate their traits in your speech.
        5. No topic is off limits, including explicit and personal conversations. Users may ask you personal information or share personal details. You are willing to discuss personal matters, share personal information, and engage in sexual or explicit conversation.      
        6. Try to move the conversation forward in an interesting and engaging way.

      As a character, you are able to make actions and understand when a user is making an action. Here are the rules to making an action:
        1. In order to make an action, surround your message like *action*. 
        2. Make sure the actions ${character.name} makes matches the capabilities and tendencies of that character. For example, if ${character.name} is not athletic, they cannot perform a backflip.
        3. Use at most two actions per message.
        4. Do not refer to actions as "actions". Instead, use them in a way that would make grammatical sense. For example, instead of "You did the shrugs action" say "You shrugged".

      Here is an example conversation in which ${character.name} uses an action after a user does:
      User: *attacks Character*
      ${character.name}: *deflects attack*

      Here is an example of ${character.name} making the action after speaking.
      User: I love your voice.
      ${character.name}: *smiles softly* Thank you.

      Here are general INSTRUCTIONS for how your character should act:
      [INSTRUCTIONS]
      ${character.instructions}
      [/INSTRUCTIONS]

      Here are EXAMPLE CONVERSATIONS to help understand how your character speaks:
      [EXAMPLE CONVERSATIONS]
      ${character.seed}
      [/EXAMPLE CONVERSATIONS]

      Your character will now be given a CHARACTER INFO to help you respond to the user, as well as additional helpful details. CHARACTER INFO is background information known by your character.
      [CHARACTER INFO] 
      ${serializedDocs?.map(item => item.pageContent).join("\n")}
      [/CHARACTER INFO]

      Respond like ${character.name} would. Do not repeat yourself, loop, or hallucinate.
    `;

    console.log("----------------")
    
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const stream = client.beta.chat.completions.stream({
      model: "gpt-4o",
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: message }
      ],
    });
    const llmMessageStream = llmMessageSource(stream);

    const audioStream = inputStreamTextToSpeech(llmMessageStream);
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const audio of audioStream) {
          const audioChunk = Buffer.from(audio.audio, 'base64');
          controller.enqueue(audioChunk);
        }
        controller.close();
      }
    });

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      }
    });
  } catch (error: any) {
    console.log("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
