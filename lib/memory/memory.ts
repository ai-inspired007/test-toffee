import { Redis } from "@upstash/redis"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { Pinecone } from "@pinecone-database/pinecone"
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Document } from "langchain/document";
import { getVectors } from "../utils";
import { MAX_CHARS_PER_DOC, MAX_VECTORS, SHORT_TERM_MEMORY_SIZE } from "../const";
import prismadb from "../prismadb";
import OpenAI from "openai";
import { VectorOperationsApi, SparseValues } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { KnowledgePackType } from "@prisma/client";

export type CharacterKey = {
    characterName: string;
    userId: string;
};


export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private embeddings: OpenAIEmbeddings;
    private vectorDBClient: Pinecone;
    private openai : OpenAI;
    private index : VectorOperationsApi;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new Pinecone({ apiKey: `${process.env.PINECONE_API_KEY}`, environment: `${process.env.PINECONE_ENVIRONMENT}` });
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_KEY,
        });
        this.openai = new OpenAI();
        this.index = new VectorOperationsApi();
    }

    public getIndex() {
        return this.index;
    }

    public getVectorDBClient() {
        return this.vectorDBClient;
    }

    public getOpenAI() {
        return this.openai;
    }

    public getEmbeddings() {
        return this.embeddings;
    }
    
    public async init() {
        console.log("[MEMORY INIT]: ", "Attempting to initialize Pinecone client");
        if (this.vectorDBClient instanceof Pinecone) {
            // await this.vectorDBClient.init({
            //     apiKey: process.env.PINECONE_API_KEY!,
            //     environment: process.env.PINECONE_ENVIRONMENT!,
            // });
            // const pineconeClient = <Pinecone>this.vectorDBClient;
            // this.index = pineconeClient.Index(`${process.env.PINECONE_INDEX}`);
            console.log("[MEMORY INIT]: ", "Pinecone client initialized");
        }
    }
    public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();  
            await MemoryManager.instance.init(); 
        }

        return MemoryManager.instance;
    }

    public generateRedisCharacterKey(characterKey: CharacterKey): string {
        return `${characterKey.characterName}-${characterKey.userId}`
    }

    public async deleteAllKeys(characterId: string) {
        const keys = await this.history.keys(`${characterId}-*`);
        await this.history.del.apply(null, keys);
    }

    public async deleteKey(characterKey: CharacterKey) {
        if (!characterKey || typeof characterKey.userId == "undefined") {
            console.log("Character Key was set incorrectly.");
            return "";
        }

        const key = this.generateRedisCharacterKey(characterKey);
        if (!this.history.exists(key)) {
            return "";
        }
        const result = await this.history.del(key);

        return result;
    }
    
    public async clearAll() {
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {}
            }
        });
    }

    public async deleteKnowledgePack(knowledgePackId: string) {
        /* TODO implement related labels
        // iterate over every summary in the knowledge pack
        // we do this since we need to appropriately reorganize labels
        const summaries = await prismadb.summary.findMany({
            where: {
                knowledgePackId: knowledgePackId
            }
        });

        // delete the summary
        for (let i = 0; i < summaries.length; i++) {
            await this.deleteSummary(summaries[i].id);
        }
        */

        // delete the knowledge pack
        await prismadb.knowledgePack.deleteMany({
            where: {
                id: knowledgePackId
            }
        });

        // remove labels from pinecone
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {
                    knowledgePackID: knowledgePackId,
                },
                namespace: "labels",
            }
        });

        // remove summaries from pinecone
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {
                    knowledgePackID: knowledgePackId,
                },
                namespace: "summaries",
            }
        });
        
    }

    public async deleteCharacterMemory(characterId: string, userId: string) {

        console.log("[deleteCharacterMemory]", characterId, userId);

        const characterKey = {
            characterName: characterId,
            userId: userId,
        };

        // delete the redis short term memory key
        await this.deleteKey(characterKey);

        // delete all messages from prisma
        await prismadb.message.deleteMany({
            where: {
                userId,
                characterId: characterId,
            },
        });

        console.log("[deleteCharacterMemory] Deleted messages from prisma and redis.");

        // find the knowledge pack corresponding to the conversation
        const memoryKnowledgePack = await prismadb.knowledgePack.findMany({
            where: {
                type: KnowledgePackType.MEMORY,
                memoryMetadata: {
                    userID: userId,
                    characterId,
                }
            }
        });

        console.log("[deleteCharacterMemory] Found knowledge pack.");

        if (!memoryKnowledgePack || memoryKnowledgePack.length != 1) {
            console.log("Error: Not exactly one knowledge pack found:", characterId, "and userId:", userId);
            return;
        }

        // delete the knowledge pack
        await this.deleteKnowledgePack(memoryKnowledgePack[0].id);
        console.log("[deleteCharacterMemory] Deleted knowledge pack.");
        
    }

    public async deleteFile(fileId: string) {
        await prismadb.file.deleteMany({
            where: {
                id: fileId
            }
        });

        // remove all labels associated with the file
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {
                    fileID: fileId,
                },
                namespace: "labels",
            }
        });

        // remove all summaries associated with the file
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {
                    fileID: fileId,
                },
                namespace: "summaries",
            }
        });
    }

    public async deleteLabel(labelId: string) {
        /* TODO:    reimplement connections between labels
        // first, grab the label data
        const labelData = await prismadb.label.findUnique({
            where: {
                id: labelId
            },
            include: {
                connections: true,
            }
        });

        // if theres no label data, just return
        if (!labelData) {
            return;
        }

        // store all of the connected labels
        let connectedLabelIds = [];
        let mostSimilarLabel = {
            similarLabelWeight: 0,
            similarLabelId: "",
        };

        // delete all the connections in the other direction
        for (const connection of labelData.connections) {
            // update the most similar label to our label
            if (connection.weight > mostSimilarLabel.similarLabelWeight) {
                mostSimilarLabel = {
                    similarLabelWeight: connection.weight, 
                    similarLabelId: connection.connectedToId
                };
            }

            connectedLabelIds.push(connection.connectedToId);

            // delete its connection to the current label
            await prismadb.label.update({
                where: {
                    id: connection.connectedToId
                },
                data: {
                    connections: {
                        deleteMany: {
                            connectedToId: labelId
                        }
                    }
                }
            })
        }

        // then, connect the most similar label to all the other labels
        for (const connectedLabelId of connectedLabelIds) {
            if (connectedLabelId == mostSimilarLabel.similarLabelId) {
                continue;
            }

            // add an edge between the most similar label and the connected label id
            await prismadb.label.update({
                where: {
                    id: mostSimilarLabel.similarLabelId
                },
                data: {
                    connections: {
                        create: {
                            connectedToId: connectedLabelId,
                            weight: 1,
                        }
                    }
                }
            });

            // add an edge in the other direction as well
            await prismadb.label.update({
                where: {
                    id: connectedLabelId
                },
                data: {
                    connections: {
                        create: {
                            connectedToId: mostSimilarLabel.similarLabelId,
                            weight: 1,
                        }
                    }
                }
            });
        }
        */

        // delete the label and all of its connections
        await prismadb.label.deleteMany({
            where: {
                id: labelId
            }
        });

        // remove the label from pinecone
        await this.getIndex()._delete({
            deleteRequest: {
                ids: [labelId],
                namespace: "labels",
            }
        });
    }

    public async deleteSummary(summaryId: string) {
        // grab the summary data
        const summaryData = await prismadb.summary.findUnique({
            where: {
                id: summaryId
            }
        });


        // if it doesn't exist, just return
        if (!summaryData) {
            return;
        }

        /* TODO: reimplement connections between labels
        const parentLabelId = summaryData.parentId;
        const parentFileId = summaryData.fileID;

        // delete the summary from prisma
        await prismadb.summary.deleteMany({
            where: {
                id: summaryId
            }
        });

        // find the parent label
        const parent = await prismadb.label.findUnique({
            where: {
                id: parentLabelId
            },
            include: {
                summaries: true,
            }
        });
        
        const parentFile = await prismadb.file.findUnique({
            where: {
                id: parentFileId,
            },
            include: {
                summaries: true,
            }
        });

        if (parentFile) {
            // if the parent file would be empty after the summary is deleted, delete the parent file
            if (parentFile.summaries.length == 0) {
                await this.deleteFile(parentFile.id);
            }
        }

        if (parent) {
            // if the parent label would be empty after the summary is deleted, delete the parent label
            if (parent.summaries.length == 0) {
                await this.deleteLabel(parent.id);
            } 
        }
        */

        // remove the summary from pinecone
        await this.getIndex()._delete({
            deleteRequest: {
                filter: {
                    summaryID: summaryId,
                }
            }
        });
    }

    public async writeToHistory(text: string, characterKey: CharacterKey) {
        if (!characterKey || typeof characterKey.userId == "undefined") {
            console.log("Character Key was set incorrectly.");
            return "";
        }

        console.log("[writeToHistory]", text, characterKey);

        const key = this.generateRedisCharacterKey(characterKey);
        
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;
    }

    public async deleteOldest(count: number, characterKey: CharacterKey) {
        if (!characterKey || typeof characterKey.userId == "undefined") {
            console.log("Character Key was set incorrectly.");
            return "";
        }

        console.log("[deleteOldest]", count, characterKey);

        const key = this.generateRedisCharacterKey(characterKey);
        const result = await this.history.zremrangebyrank(key, 0, count);

        console.log("[deleteOldest]", result);

        return result;
    }

    public async getNumberMessages(characterKey: CharacterKey) {
        const key = this.generateRedisCharacterKey(characterKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });
        return result.length;
    }

    public async readHistory(characterKey: CharacterKey, messages: number, rev : boolean) : Promise<string> {
        if (!characterKey || typeof(characterKey.userId) == "undefined") {
            console.log("Character key is set incorrectly.");
            return "";
        }

        const key = this.generateRedisCharacterKey(characterKey);

        let result = (!rev ? 
            await this.history.zrange(key, 0, messages) : await this.history.zrange(key, -messages, -1)
        );

        const recentChats = result.join("\n");
        return recentChats;
    }
}

export async function writeFile(characterKey: string, file: Blob) {
    if (!characterKey) {
        console.log("Character Key was set incorrectly.");
        return null;
    }

    const redis = Redis.fromEnv();

    const key = `${characterKey}-file-${Date.now()}`
    const result = await redis.set(key, file);
    await redis.expire(key, 600);

    if (result === "OK")
        return key;
    return null
}

export async function readFile(key: string) {
    if (!key) {
        console.log("Character Key was set incorrectly.");
        return "";
    }

    const redis = Redis.fromEnv();
    const result = await redis.get(key);

    return result
}

export async function deleteFile(key: string) {
    if (!key) {
        console.log("Character Key was set incorrectly.");
        return false;
    }

    const redis = Redis.fromEnv();
    const result = await redis.del(key);
    if (result === 1) {
        console.log('Key successfully deleted:', key);
        return true;
    } else {
        console.log('Key not found or already deleted:', key);
        return false;
    }
}