import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MAX_CHARS_PER_DOC, MAX_INCREMENTAL_LENGTH, MIN_CHARS_PER_DOC } from "../const";
import { MemoryManager } from "./memory";

export class Chunker extends MemoryManager {
    private static chunker_instance: Chunker;

    public constructor() {
        super();
    }

    /*
        Given a string, text, seperates the chunks in a way that minimizes semantic similarity. Returns a list of strings.
    
        First, split the text by sentence. Then, binary search over a threshold for when to merge adjacent similarities. 

        Merge text linearly under that threshold until you have less than max_docs documents. 
        We assume semantic similarity after merging is strictly greater than before merging. 
        For example, if we have [abc][d][e], and we merge [abc][de], we assume that if [abc][d] does not satisfy the threshold [abc][de] won't either.
        
        We'll round semantic similarity to one decimal point, so there are 1000 possible values (0.0% to 99.9%), so the runtime is log2(1000) * O(number sentences).
    */

    public static async getInstance(): Promise<Chunker> {
        if (!Chunker.chunker_instance) {
            Chunker.chunker_instance = new Chunker();   
        }

        return Chunker.chunker_instance;
    }

    public async chunkFullText(text: string, max_docs: number) {
        const parsed_text = text.replaceAll("\n", " ");
        const segment = new Intl.Segmenter('en', { 
            granularity: 'sentence'
        });
        const split_sentence = Array.from(segment.segment(parsed_text), s => s.segment);
        const split_remove_empty : string[] = [];
        for (const sentence of split_sentence) {
            if (sentence.trim().length > 0) {
                split_remove_empty.push(sentence.trim());
            }
        }
    
        const split_remove_empty_merged : string[] = [];
        const num_sentences = split_remove_empty.length;
        let merge_size = 3;
    
        for (let i = 0; i < split_remove_empty.length; i++) {
            let merged = "";
            for (let j = i; j < split_remove_empty.length; j++) {
                merged += split_remove_empty[j];
                merged += "\n";
                if (merged.length > merge_size * 128) {
                    i = j;
                    break;
                }
            }
            split_remove_empty_merged.push(merged.trim());
        }
    
        let precomp_similarities : number[] = [];
        let doc_embeddings = await super.getEmbeddings().embedDocuments(split_remove_empty_merged);
        const similarity = require('compute-cosine-similarity');
        for (let i = 0; i < split_remove_empty_merged.length - 1; i++) {
            precomp_similarities.push(similarity(doc_embeddings[i], doc_embeddings[i + 1]));
        }
        const evaluate = async (a : number) => {
            return precomp_similarities[a - 1];
        }
        const MAX_SCORE = 100000;
        let left = 0.02 * MAX_SCORE;
        let right = MAX_SCORE;
        let best = -1;
    
        while (left <= right) {
            let max_score = Math.floor((left + right) / 2);
            let splits = 0;
            let split_length = 0;
            if (split_remove_empty_merged.length == 0) {
                return [text];
            }
            for (let i = 1; i < split_remove_empty_merged.length; i++) {
                const score = await evaluate(i);
                const score_rounded = Math.floor((1 - score) * MAX_SCORE);
                if (score_rounded > max_score && split_length > MIN_CHARS_PER_DOC) {
                    ++splits;
                    split_length = split_remove_empty_merged[i].length;
                } else {
                    if (split_length > MAX_CHARS_PER_DOC) {
                        ++splits;
                        split_length = split_remove_empty_merged[i].length
                    } else {
                        split_length += split_remove_empty_merged[i].length;
                    }
                }
            }
    
            if (split_length > 0) {
                ++splits;
            }
            
            if (splits + 1 <= max_docs) {
                best = max_score;
                right = max_score - 1;
            } else {
                left = max_score + 1;
            }
        }
    
        if (best == -1) {
            return [text];
        }
    
        let split_ret : string[] = [];
        if (split_remove_empty_merged.length == 0) {
            return [text];
        }

        let split_content = split_remove_empty_merged[0];
        for (let i = 1; i < split_remove_empty_merged.length; i++) {
            const score = await evaluate(i);
            const score_rounded = Math.floor((1 - score) * MAX_SCORE);
            if (score_rounded <= best && split_content.length < MAX_CHARS_PER_DOC) {
                split_content += "\n" + split_remove_empty_merged[i];
            } else {
                if (split_content.length > MIN_CHARS_PER_DOC) {
                    split_ret.push(split_content);
                    split_content = split_remove_empty_merged[i] + '\n';
                }
            }
        }
        if (split_content.length > 0) {
            split_ret.push(split_content);
        }
    
        return split_ret;
    }
}

