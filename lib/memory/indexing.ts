import {
  CHARS_PER_DOC,
  LABEL_GROUP_SIMILARITY_THRESHOLD,
  MAX_VECTORS,
  REGENERATE_COUNT,
  SHORT_TERM_MEMORY_SIZE
} from "../const";
import { Chunker } from "./chunk";
import { Vector } from "@pinecone-database/pinecone";
import { SparseValues } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { Document } from "langchain/document";
import prismadb from "../prismadb";
import { KnowledgePackType, Message } from "@prisma/client";
import { SUMMARIZE_PROMPT, LABEL_PROMPT, REGENERATE_LABEL } from "../prompts";
import { MemoryManager } from "./memory";
import { getVectors } from "../utils";
import mime from "mime";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { SRTLoader } from "langchain/document_loaders/fs/srt";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import {
  CheerioWebBaseLoader,
} from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {PineconeStore} from "langchain/vectorstores/pinecone"

// Utility functions

export function getLoader(fileName: string, fileBlob: Blob) {
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "txt":
    case "md":
      return new TextLoader(fileBlob);
    case "pdf":
      return new PDFLoader(fileBlob);
    case "docx":
      return new DocxLoader(fileBlob);
    case "csv":
      return new CSVLoader(fileBlob);
    case "json":
      return new JSONLoader(fileBlob);
    case "srt":
      return new SRTLoader(fileBlob);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

export function bufferToBlob(buffer: Buffer, mimeType?: string): Blob {
  const arrayBuffer: ArrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return new Blob([arrayBuffer], { type: mimeType || "" });
}

export function hashKeyword(keyword: string, numBuckets: number = 30522): number {
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = (hash << 5) - hash + keyword.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash % numBuckets);
}

// Function to generate sparse embedding using BM25
export function generateSparseEmbedding(keywords: string[], numBuckets: number = 30522): SparseValues {
  const sparseEmbedding: SparseValues = {
    indices: [],
    values: []
  };

  const termFrequencies: { [index: number]: number } = {};

  // Calculate term frequencies
  keywords.forEach(keyword => {
    const index = hashKeyword(keyword, numBuckets);
    if (termFrequencies[index] === undefined) {
      termFrequencies[index] = 0;
    }
    termFrequencies[index]++;
  });

  // Populate indices and values
  for (const index in termFrequencies) {
    sparseEmbedding.indices.push(parseInt(index));
    sparseEmbedding.values.push(termFrequencies[index]);
  }

  return sparseEmbedding;
}

// Core indexing logic
async function processTextChunks(
  texts: string[],
  knowledgePackId: string,
  fileName: string,
  parentFileId: string,
  labelNamespace: string,
  vectorNamespace: string
): Promise<boolean> {
  for (const content of texts) {
    try {
      console.log("[PROCESS_CHUNK]:", "Processing content: ", content.substring(0, 50), "..."); // Add preview of content for debugging
      const classified = await (await Indexer.getInstance()).classifyChunk(content);
      console.log("[PROCESS_CHUNK]: Complete")
      if (classified && classified.summary && classified.keywords) {
        const summary = classified.summary;
        const keywords = classified.keywords.split(/\s+/);

        const denseEmbedding = await (await Indexer.getInstance()).getEmbeddings().embedQuery(summary);
        const sparseEmbedding = generateSparseEmbedding(keywords);

        const relatedLabelResponse = await (await Indexer.getInstance()).getIndex().query({
          queryRequest: {
            vector: denseEmbedding,
            topK: 1,
            namespace: labelNamespace,
          }
        });

        const newLabel = await determineNewLabel(
          relatedLabelResponse,
          summary,
          knowledgePackId,
          content,
          parentFileId,
        );

        const storedSummary = await prismadb.summary.create({
          data: {
            knowledgePackId,
            sourceText: content,
            // fileId: parentFileId,
            parentId: newLabel,
            summaryText: summary,
          }
        });

        await updateLabelWithSummary(newLabel, storedSummary.id);

        if (await shouldRegenerateLabel(newLabel)) {
          await (await Indexer.getInstance()).regenerateLabel(newLabel);
        }

        const vector: Vector = {
          id: storedSummary.id,
          metadata: {
            fileID: fileName,
            knowledgePackId,
            summaryID: storedSummary.id
          },
          values: denseEmbedding,
          sparseValues: sparseEmbedding
        };

        const vectors = [vector];
        if (!await handleVectorUpsert(knowledgePackId, vectors, MAX_VECTORS)) {
          return false;
        }
      } else {
        console.error("Failed to classify chunk or received invalid response:", classified);
      }
    } catch (error) {
      console.error("Error processing content:", content, error);
    }
  }

  return true;
}

async function handleTextChunks(
  textData: string[],
  metaData: any
): Promise<boolean> {
  console.log(metaData, textData)
  const pinecone = new Pinecone({ apiKey: `${process.env.PINECONE_API_KEY}`, environment: `${process.env.PINECONE_ENVIRONMENT}` });

  const pineconeIndex = pinecone.Index(`${process.env.PINECONE_INDEX}`);

  await PineconeStore.fromTexts(textData, metaData, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}), {
      pineconeIndex, namespace: "knowledge"
  });
  return true
}

export async function deleteVectors(
  fileIds: string[]
): Promise<boolean> {
  console.log(fileIds)
  const pinecone = new Pinecone({ apiKey: `${process.env.PINECONE_API_KEY}`, environment: `${process.env.PINECONE_ENVIRONMENT}` });

  const pineconeIndex = pinecone.Index(`${process.env.PINECONE_INDEX}`);

  await pineconeIndex.namespace("knowledge").deleteMany({fileId: {"$in": fileIds}})

  return true
}

async function determineNewLabel(
  relatedLabelResponse: any,
  summary: string,
  knowledgePackId: string,
  content: string,
  parentFileId: string
): Promise<string> {
  if (relatedLabelResponse.matches && relatedLabelResponse.matches.length > 0) {
    const related = relatedLabelResponse.matches[0];
    if (related && related.score > LABEL_GROUP_SIMILARITY_THRESHOLD) {
      return related.id;
    }
  }

  const labelId = await (await Indexer.getInstance()).generateLabel(summary, knowledgePackId, content, parentFileId);
  if (!labelId) {
    throw new Error("Failed to generate a new label");
  }
  return labelId;
}

async function updateLabelWithSummary(labelId: string, summaryId: string): Promise<void> {
  await prismadb.label.update({
    where: { id: labelId },
    data: { summaries: { connect: { id: summaryId } } }
  });
}

async function shouldRegenerateLabel(labelId: string): Promise<boolean> {
  const numSummaries = await prismadb.summary.count({ where: { parentId: labelId } });
  return numSummaries % REGENERATE_COUNT === 0;
}

async function handleVectorUpsert(
  knowledgePackId: string,
  vectors: Vector[],
  maxVectors: number
): Promise<boolean> {
  const numVectors = await getVectors(knowledgePackId);
  if (numVectors + vectors.length > maxVectors) {
    console.log("[RETURN FALSE]");
    return false;
  }

  await (await Indexer.getInstance()).getIndex().upsert({
    upsertRequest: {
      vectors: vectors,
      namespace: "summaries"
    }
  });

  return true;
}

// Indexer class implementation
export class Indexer extends MemoryManager {
  private static indexer_instance: Indexer;

  public constructor() {
    super();
  }

  public async init() {
    await super.init();
    return;
  }

  public static async getInstance(): Promise<Indexer> {
    if (!Indexer.indexer_instance) {
      Indexer.indexer_instance = new Indexer();
      await Indexer.indexer_instance.init();
    }

    return Indexer.indexer_instance;
  }

  /*
      Summarizes a chunk of text using GPT-3.5-turbo, and returns the summary.
  */

  public async classifyChunk(chunk: string) {
    const openai = super.getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "system",
          content: SUMMARIZE_PROMPT,
        },
        {
          role: "user",
          content: `
                  [CHUNK]
                  ${chunk}
                  [/CHUNK]
                `,
        }
      ]
    });

    const completion = response.choices[0].message.content;

    if (completion) {
      try {
        const json_completion = JSON.parse(completion);
        return json_completion;
      } catch (error) {
        console.error("Error parsing JSON completion:", error);
        console.error("Completion content:", completion);
        return null;
      }
    } else {
      console.error("No completion content received.");
      return null;
    }
  }

  public async regenerateLabel(labelID: string) {
    const label = await prismadb.label.findUnique({
      where: {
        id: labelID,
      }
    });
    if (!label) {
      return;
    }

    const labelText = label.name;

    const recentSummaries = await prismadb.summary.findMany({
      where: {
        parentId: labelID,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const resultText = recentSummaries.map((summary) => summary.summaryText).join("\n");

    const openai = super.getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "system",
          content: REGENERATE_LABEL,
        },
        {
          role: "user",
          content: `
                    [OLD LABEL]
                    ${labelText}
                    [/OLD LABEL]

                    [NEW TEXT]
                    ${resultText}
                    [/NEW TEXT]
                    `,
        }
      ]
    });
    const completion = response.choices[0].message.content;
    if (!completion) {
      return null;
    }

    const json_completion = JSON.parse(completion);
    const created_label = json_completion.label;

    // update the label name in prismadb
    await prismadb.label.update({
      where: {
        id: labelID,
      },
      data: {
        name: created_label,
      }
    });

    // update the label in Pinecone
    const labelEmbedding = await super.getEmbeddings().embedQuery(created_label);
    await super.getIndex().upsert({
      upsertRequest: {
        vectors: [
          {
            id: labelID,
            values: labelEmbedding,
          }
        ],
        namespace: "labels",
      }
    });
  }

  /*
      Generates a label for a summary, and indexes it with Pinecone.
  */

  public async generateLabel(summary: string, knowledgePackId: string, sourceText: string, fileID: string) {
    const openai = super.getOpenAI();

    // generate a label using GPT-3.5-turbo
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "system",
          content: LABEL_PROMPT,
        },
        {
          role: "user",
          content: `
            [CHUNK]
            ${summary}
            [/CHUNK]
            `,
        }
      ]
    });
    const completion = response.choices[0].message.content;
    if (!completion) {
      return null;
    }
    console.log("[GENERATE_LABEL]", "Completion: ", completion);
    const json_completion = JSON.parse(completion);
    console.log("[GENERATE_LABEL]", "JSON Completion: ", json_completion);
    const created_label = json_completion.label;

    // create the label in prismadb
    const label = await prismadb.label.create({
      data: {
        name: created_label,
        knowledgePackId,
      }
    });

    console.log("[GENERATE_LABEL]", "Label: ", created_label, "ID: ", label.id);

    // embed the label, and find the top LABEL_DEGREE most related
    const labelEmbedding = await super.getEmbeddings().embedQuery(created_label);
    /* TODO: reimplement related labels
    const relatedLabels = await super.getIndex().query({
        queryRequest: {
            vector: labelEmbedding,
            topK: LABEL_DEGREE,
            namespace: "labels",
            includeMetadata: true,
        }
    });

    if (relatedLabels.matches) {
        // for each related label, add an edge with the weight equal to its similarity
        for (const related of relatedLabels.matches) {
            if (!related || !related.score || !related.metadata) {
                continue;
            }
            const from = label.id;
            const to = related.id;
            const weight = related.score;
            await prismadb.label.update({
                where: {
                    id: from,
                },
                data: {
                    connections: {
                        create: {
                            connectedToId: to,
                            weight,
                        }
                    }
                }
            });
            await prismadb.label.update({
                where: {
                    id: to,
                },
                data: {
                    connections: {
                        create: {
                            connectedToId: from,
                            weight,
                        }
                    }
                }
            });
        }
    }
    */

    // add the newly created label to the labels namespace in Pinecone
    await super.getIndex().upsert({
      upsertRequest: {
        vectors: [
          {
            id: label.id,
            values: labelEmbedding,
            metadata: {
              knowledgePackId,
              fileID,
            }
          }
        ],
        namespace: "labels",
      }
    });

    return label.id;
  }

  public async indexHybridText(
    publicText: string,
    knowledgePackId: string,
    fileName: string,
    textType: "MESSAGE"
  ): Promise<boolean> {
    const MAX_DOCS = Math.min(Math.ceil(publicText.length / CHARS_PER_DOC), 50);
    const chunker = new Chunker();
    const textChunks = await chunker.chunkFullText(publicText, MAX_DOCS);

    const parentFile = await prismadb.knowledgeFile.findFirst({ where: { knowledgePackId, name: fileName } });

    if (!parentFile) {
      console.log("[INDEX_ERROR_4]: Parent File not found.");
      return false;
    }

    return await processTextChunks(
      textChunks,
      knowledgePackId,
      fileName,
      parentFile.id,
      "labels",
      "summaries"
    );
  }

  public async indexIncomingFiles(files: File[], knowledgePackId: string): Promise<boolean> {
    let textData: string[] = [];
    let metaData: { fileId: string, knowledgePackId: string, type: string}[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const fileBuffer = Buffer.from(bytes);
      const fileName = file.name;
      const contentType = mime.getType(fileName);
      
      if (!fileBuffer || !contentType) {
        console.error(`Buffer or content type not found for file: ${fileName}`);
        continue;
      }

      const fileBlob = bufferToBlob(fileBuffer, contentType);
      const loader = getLoader(fileName, fileBlob);
      const docs = await loader.load();
      const textChunks = (await new RecursiveCharacterTextSplitter({
        separators: ["|", "##", ">", "-"], chunkSize: CHARS_PER_DOC, chunkOverlap: 200
      }).splitDocuments(docs)).map(doc => doc.pageContent);

      let parentFile = await prismadb.knowledgeFile.findFirst({ where: { knowledgePackId, name: fileName } });

      if (!parentFile) {
        parentFile = await prismadb.knowledgeFile.create({
          data: {
            knowledgePackId: knowledgePackId,
            name: fileName,
            size: file.size,
            type: file.type
          }
        });
      }

      textChunks.map((item) => {
        textData.push(item)
        metaData.push({
          fileId: parentFile.id,
          knowledgePackId,
          type: "FILE",
        });
      });
    }
    await handleTextChunks(textData, metaData);
      // console.log(`[PROCESS_FILE_CHUNK]: Start for ${fileName}`)
      // if (!await processTextChunks(
      //   textChunks,
      //   knowledgePackId,
      //   fileName,
      //   parentFile.id,
      //   "labels",
      //   "summaries"
      // )) {
      //   console.log(`[PROCESS_FILE_CHUNK]: Error from ${fileName}`)
      //   continue;
      // }
    console.log("[PROCESS_FILE_CHUNK]: Return True")
    return true;
  }

  public async indexIncomingTexts(texts: {content: string}[], knowledgePackId: string): Promise<boolean> {
    let textData: string[] = [];
    let metaData: { fileId: string, knowledgePackId: string, type: string}[] = [];
    for (const text of texts) {
      const textChunks = (await new RecursiveCharacterTextSplitter({
        separators: ["|", "##", ">", "-"], chunkSize: CHARS_PER_DOC, chunkOverlap: 200
      }).splitDocuments([new Document({pageContent: text.content})])).map(doc => doc.pageContent);

      let parentFile = await prismadb.knowledgeText.findFirst({ where: { knowledgePackId, name: text.content.slice(0, 20) } });

      if (!parentFile) {
        parentFile = await prismadb.knowledgeText.create({
          data: {
            knowledgePackId: knowledgePackId,
            content: text.content,
            name: text.content.slice(0, 30),
            size: text.content.length
          }
        });
      }

      textChunks.map((item) => {
        textData.push(item)
        metaData.push({
          fileId: parentFile.id,
          knowledgePackId,
          type: "TEXT",
        });
      });
    }
    await handleTextChunks(textData, metaData);
      // console.log("[PROCESS_TEXT_CHUNK]: Start")
      // if (!await processTextChunks(
      //   textChunks,
      //   knowledgePackId,
      //   fileName,
      //   parentFile.id,
      //   "labels",
      //   "summaries"
      // )) {
      //   console.log("[PROCESS_TEXT_CHUNK]: Return False")
      //   return false;
      // } 
    console.log("[PROCESS_TEXT_CHUNK]: Return True")
    return true;
  }

  public async indexIncomingWebLinks(links: {title: string, url: string, icon: string}[], knowledgePackId: string): Promise<boolean> {
    let textData: string[] = [];
    let metaData: { fileId: string, knowledgePackId: string, type: string}[] = [];
    for (const link of links) {
      const loader = new CheerioWebBaseLoader(link.url);
      const docs = await loader.load();

      const textChunks = (await new RecursiveCharacterTextSplitter({
        separators: ["|", "##", ">", "-"], chunkSize: CHARS_PER_DOC, chunkOverlap: 200
      }).splitDocuments(docs)).map(doc => doc.pageContent);

      let parentFile = await prismadb.knowledgeLink.findFirst({ where: { knowledgePackId, name: link.title } });

      if (!parentFile) {
        const stringArray = docs.map(doc => doc.pageContent);
        const totalLength = stringArray.reduce((total, currentString) => total + currentString.length, 0);
        parentFile = await prismadb.knowledgeLink.create({
          data: {
            knowledgePackId: knowledgePackId,
            name: link.title,
            size: totalLength,
            url: link.url,
            icon: link.icon
          }
        });
      }

      textChunks.map((item) => {
        textData.push(item)
        metaData.push({
          fileId: parentFile.id,
          knowledgePackId,
          type: "LINK",
        });
      });
    }
    await handleTextChunks(textData, metaData);
      // if (!await processTextChunks(
      //   textChunks,
      //   knowledgePackId,
      //   link,
      //   parentFile.id,
      //   "labels",
      //   "summaries"
      // )) {
      //   console.log(`[PROCESS_FILE_CHUNK]: Error from ${link}`)
      //   continue;
      // }
    console.log("[PROCESS_LINK_CHUNK]: Return True")
    return true;
  }

  public async splitExampleConversation(
    seedContent: string,
    delimiter: string = "\n",
  ) {
    const content = seedContent.split(delimiter);
    return content;
  }

  public async indexExampleConversation(
    seedContent: string,
    characterId: string,
    userId: string,
  ) {
    /*
        For now, do nothing.
        TODO: develop tone analysis algorithm to transform example conversation into prompt.
    */
  }

  public async indexIncomingChat(
    messages: Message[],
    characterId: string,
    userId: string,
    characterName: string
  ) {
    // console.log("[INDEX_INCOMING_CHAT]", "Prompt: ", prompt, "Content: ", completion, "Character ID: ", characterId, "User ID: ", userId);

    // let textSplitNewlines = completion.split("\n");
    // let formattedContent = "";
    // for (let i = 0; i < textSplitNewlines.length; i++) {
    //   if (textSplitNewlines[i].length > 0) {
    //     formattedContent += textSplitNewlines[i];
    //     formattedContent += "/";
    //   }
    // }

    // let modifiedContent = `
    //   [START OF USER PROMPT]
    //   User: ${prompt}
    //   [/END OF USER PROMPT]

    //   [START OF CHARACTER REPLY]
    //   Character: ${formattedContent}
    //   [/END OF CHARACTER REPLY]
    // `;

    // console.log("[INDEX_INCOMING_CHAT]", "Modified Content: ", modifiedContent);

    let knowledgePack = await prismadb.knowledgePack.findFirst({
      where: {
        type: KnowledgePackType.MEMORY,
        memoryMetadata: {
          characterId,
          userID: userId,
        }
      }
    });

    let knowledgePackId;

    if (!knowledgePack) {
      console.log("[INDEX_INCOMING_CHAT]", "Creating new knowledge pack.");
      const newKnowledgePack = await prismadb.knowledgePack.create({
        data: {
          name: `${characterName}'s Memory`,
          type: KnowledgePackType.MEMORY,
          memoryMetadata: {
            create: {
              characterId,
              userID: userId,
            }
          }
        }
      });
      knowledgePackId = newKnowledgePack.id;
    } else {
      knowledgePackId = knowledgePack.id;
    }

    let messageList = messages.map(message => {
      if (message.role === "user") {
        return `User: ${message.content}`;
      } else if (message.role === "assistant") {
        return `${characterName}: ${message.content}`;
      }
    });
    let messageContent = messageList.join("\n")

    let newMemory = await prismadb.knowledgeChat.create({
      data: {
        knowledgePackId: knowledgePackId,
        name: `${characterName}'s Conversations With ${userId}`,
      }
    });

    // const file = await prismadb.knowledgeFile.findFirst({
    //   where: {
    //     knowledgePackId,
    //     name: `${character.name}'s Conversations With ${userId}`,
    //   }
    // });

    // if (!file) {
    //   console.log("[INDEX_ERROR_2]: Conversation file not found.");
    //   return;
    // }

    let textData: string[] = [];
    let metaData: { fileId: string, knowledgePackId: string, type: string}[] = [];

    for (let i = 0; i < messageList.length; i += 6) {
      let chunk = messageList.slice(i, i + 6).join("\n");
      textData.push(chunk);
      metaData.push({
        fileId: newMemory.id,
        knowledgePackId,
        type: "MEMORY",
      });
    }

    await handleTextChunks(textData, metaData);

    // await this.indexHybridText(modifiedContent, knowledgePackId, file.name, "MESSAGE");
  }
}

// Exporting the singleton instance of the Indexer class.
export const indexer = Indexer.getInstance();