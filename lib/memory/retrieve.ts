import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { MemoryManager } from "./memory";
import {MinQueue} from "heapify";
import prismadb from "../prismadb";
import { SECONDARY_VECTOR_COUNT } from "../const";
import { generateSparseEmbedding } from "./indexing";
import { SparseValues } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import BM25Vectorizer from "wink-nlp/utilities/bm25-vectorizer";

const nlp = winkNLP(model);
const bm25 = BM25Vectorizer();

// Generate sparse vector for a document
export function generateSparseVector(text: string) {
    const tokens: any = nlp.readDoc(text).tokens().out();
    const vector = bm25.vectorOf(tokens);
    
    // Convert to Pinecone format
    const indices = [];
    const values = [];
    for (let [index, value] of Object.entries(vector)) {
        indices.push(parseInt(index));
        values.push(value);
    }
    
    return { indices, values };
}

type SummaryMetadata = {
    filename: string;
    knowledgePackId: string;
    summaryID: string;
};
export function hybridScoreNorm(dense: number[], sparse: SparseValues, alpha: number): [number[], SparseValues] {
    if (alpha < 0 || alpha > 1) {
        throw new Error("Alpha must be between 0 and 1");
    }
    const densePart = dense.map(value => value * alpha);
    const sparseValues = sparse.values.map(value => value * Number((1 - alpha).toFixed(1)));

    const hs: SparseValues = {
        indices: sparse.indices,
        values: sparseValues
    };

    return [densePart, hs];
}
export class Retrieve extends MemoryManager {
    private static retrieve_instance: Retrieve;
    
    public constructor() {
        super();
    }

    public static async getInstance(): Promise<Retrieve> {
        if (!Retrieve.retrieve_instance) {
            Retrieve.retrieve_instance = new Retrieve();   
            await Retrieve.retrieve_instance.init();
        }

        return Retrieve.retrieve_instance;
    }

    public async init() {
        await super.init();
        return;
    }

    public async vectorSearch(
        searchText: string,
        findNum: number,
        knowledgePackIDS: string[],
        context?: string,
    ) {
        if (searchText.length == 0) {
            return [];
        }

        const processQueue : string[] = [];

        for (let i = 0; i < knowledgePackIDS.length; i++) {
            processQueue.push(knowledgePackIDS[i]);
        }

        console.log("[RETRIEVER] PROCESS QUEUE: ", processQueue);

        const visitedKnowledgePacks : Set<string> = new Set();

        while (processQueue.length > 0) {
            const currentKnowledgePackId = processQueue.pop();
            if (!currentKnowledgePackId) {
                continue;
            }

            const currentKnowledgePackData = await prismadb.knowledgePack.findUnique({
                where: {
                    id: currentKnowledgePackId
                }
            });
            if (!currentKnowledgePackData) {
                continue;
            }
            const parentId = currentKnowledgePackData.parentId;
            if (parentId && !visitedKnowledgePacks.has(parentId)) {
                processQueue.push(parentId);
            }
            visitedKnowledgePacks.add(currentKnowledgePackId);
        }

        // first, embed the search text for search on pinecone
        const embedQuery = await super.getEmbeddings().embedQuery(searchText);
        const sparseQuery = generateSparseEmbedding(searchText.split(/\s+/))
        const [dense, sparse] = hybridScoreNorm(embedQuery, sparseQuery, 0.8)
        console.log("[RETRIEVER] SEARCH TEXT: ", searchText);
        console.log("[RETRIEVER] SEARCH SPARSE VECTOR: ", sparse);

        // run a vector search using pinecone, finding summaries most related to the searchText
        const searchResults = await super.getIndex().query(
            {
                queryRequest: {
                    vector: dense,
                    sparseVector: sparse,
                    topK: findNum,
                    namespace: "summaries",
                    filter: {
                        knowledgePackId: {
                            $in: Array.from(visitedKnowledgePacks)
                        }
                    },
                    includeMetadata: true,
                }
            }
        );

        console.log("[QUERIED FROM PINECONE]: ", searchResults.matches?.length);

        const summaryList = searchResults.matches;

        console.log("[RETRIEVER] SUMMARY LIST: ", summaryList);

        if (!summaryList) {
            return [];
        }

        /* TODO IMPLEMENT RELATED SUMMARIES
        // the primary related summaries
        const PRIMARY_SUMMARY_IDS : string[] = [];

        // priority queue for running dijkstra's over the labels
        const TOP_LABEL_ID_PQ = new MinQueue();

        // map from label id to int, and int to label id
        const LABEL_TO_INT : Map<string, number> = new Map();
        const INT_TO_LABEL : Map<number, string> = new Map();

        let counter = 0;

        const GET_STRING = (labelId: number) => {
            return INT_TO_LABEL.get(labelId);
        }

        const GET_INT = (label: string) => {
            if (!LABEL_TO_INT.has(label)) {
                LABEL_TO_INT.set(label, counter);
                INT_TO_LABEL.set(counter, label);
                counter++;
            } 
            return LABEL_TO_INT.get(label);
        }

        // for each summary we get from the vector search, add it to the primary summary list
        for (const summary of summaryList) {
            if (!summary.metadata) {
                continue;
            }
            const summaryMetadata : any = summary.metadata;
            const summaryId = summaryMetadata.summaryID;
            const summaryInfo = await prismadb.summary.findUnique({
                where: {
                    id: summaryId
                }
            });
            if (!summaryInfo) {
                continue;
            }
            PRIMARY_SUMMARY_IDS.push(summaryId);
            
            // we can't directly add to the queue because we only want unique keys to prevent priority queue slowdown
            const linkedLabelId = summaryInfo.parentId;
            GET_INT(linkedLabelId);
        }

        const LABEL_KEYS = Array.from(LABEL_TO_INT.keys());

        // store the labels initially found
        const INITIAL_LABELS : Set<number> = new Set();
        
        // store the secondary relaxed labels (think visited array but only for non initial labels)
        const SECONDARY_LABELS : Set<number> = new Set();

        // add the unique label ids to the priority queue
        for (let label of LABEL_KEYS) {
            const LABEL_NUM = GET_INT(label);
            if (!LABEL_NUM) {
                continue;
            }
            TOP_LABEL_ID_PQ.push(LABEL_NUM, 1);
            INITIAL_LABELS.add(LABEL_NUM);
        }

        const MAX_RELATED_LABELS = 5;
        
        // as long as we haven't seen more than MAX_RELATED_LABELS new labels, run dijkstra's to find adjacent labels
        while (TOP_LABEL_ID_PQ.size > 0) {
            // top off the top label
            const priority = TOP_LABEL_ID_PQ.peekPriority();
            const topLabel = TOP_LABEL_ID_PQ.pop();

            // if we've relaxed more than MAX_RELATED_LABELS labels, we can exit since we've found enough
            if (SECONDARY_LABELS.size > MAX_RELATED_LABELS) {
                break;
            }
            
            if (!topLabel) {
                continue;
            }

            const labelId = GET_STRING(topLabel);
            if (!labelId) {
                continue;
            }
            
            const label = await prismadb.label.findUnique({
                where: {
                    id: labelId
                },
                include: {
                    connections: true,
                }
            });
            if (!label) {
                continue;
            }

            const connectionList = label.connections;
            for (const connection of connectionList) {
                const connectedLabelId = connection.connectedToId;
                const newLabelInt = GET_INT(connectedLabelId);
                if (!newLabelInt) {
                    continue;
                }
                const score = connection.weight;
                const totalScore = priority * score;
                // if the label isn't an initial label and isn't a relaxed secondary label, add it to priority queue
                if (!INITIAL_LABELS.has(newLabelInt) && !SECONDARY_LABELS.has(newLabelInt)) {
                    TOP_LABEL_ID_PQ.push(newLabelInt, totalScore);
                }
            }

            // if the label isn't an initial label, relax and add it to secondary labels
            if (!INITIAL_LABELS.has(topLabel)) {
                SECONDARY_LABELS.add(topLabel); 
            }  
        }

        const SECONDARY_SUMMARY_IDS : string[] = [];

        const SECONDARY_LABEL_LIST = Array.from(SECONDARY_LABELS);

        // iterate over secondary labels, adding random summaries under the label (if they exist)
        for (let label of SECONDARY_LABEL_LIST) {
            const labelId = GET_STRING(label);
            if (!labelId) {
                continue;
            }
            const numSummaries = await prismadb.summary.count({
                where: {
                    parentId: labelId
                }
            });
            const TAKE_NUM = Math.min(SECONDARY_VECTOR_COUNT, numSummaries);

            // skip a random number to get a subarray of summaries
            const skip = Math.floor(Math.random() * (numSummaries - TAKE_NUM));
            const randomRelevantSummaries = await prismadb.summary.findMany({
                take: TAKE_NUM,
                skip: skip,
                where: {
                    parentId: labelId
                },
            });

            // for each relevant summary, add it to the secondary summary list
            for (const summary of randomRelevantSummaries) {
                SECONDARY_SUMMARY_IDS.push(summary.id);
            }
        }
        */

        const PRIMARY_SUMMARY_IDS = [];
        for (const summary of summaryList) {
            if (!summary.metadata) {
                continue;
            }
            const summaryMetadata : any = summary.metadata;
            const summaryId = summaryMetadata.summaryID;
            PRIMARY_SUMMARY_IDS.push(summaryId);
        }

        return [PRIMARY_SUMMARY_IDS, []];
    }
    

} 