import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MAX_CHARS_PER_DOC, MAX_INCREMENTAL_LENGTH, MIN_CHARS_PER_DOC } from "../const";
import { MemoryManager } from "./memory";

export class Chunker extends MemoryManager {
    private static chunker_instance: Chunker;

    public constructor() {
        super();
    }

    public static async getInstance(): Promise<Chunker> {
        if (!Chunker.chunker_instance) {
            Chunker.chunker_instance = new Chunker();   
        }

        return Chunker.chunker_instance;
    }

    /*
    *   Chunk the text into chunks of size max_doc_length
    *   @param text: string - the text to chunk
    *   @param max_doc_length: number - the maximum length of a chunk
    *   @returns: string[] - the chunks of the text 
    */

    public async chunkFullText(text: string, max_doc_length: number) {
        // recursively chunk the text based on ['\n\n\n', '\n\n', '\n'] and then sentences, then words
        // if the text is too long, use the next splitting delimiter
        // if the text is too short, merge it with the previous chunk while the combined length is less than max_doc_length

        const delimiters = ['\n\n\n', '\n\n', '\n', 'sentence'];
        let chunks: { text: string; delimiter: string }[] = [{ text, delimiter: '' }];

        // Split by delimiters and sentences
        for (const delimiter of delimiters) {
            const newChunks: typeof chunks = [];
            chunks.forEach((chunk) => {
                if (chunk.text.length <= max_doc_length) {
                    newChunks.push(chunk);
                } else {
                    let subChunks: string[];
                    if (delimiter === 'sentence') {
                        const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
                        subChunks = Array.from(segmenter.segment(chunk.text)).map(({ segment }) => segment.trim());
                    } else {
                        subChunks = chunk.text.split(delimiter).filter(Boolean);
                    }
                    newChunks.push(...subChunks.map(text => ({ text, delimiter })));
                }
            });
            chunks = newChunks;
        }

        // Cut off long sentences if necessary
        chunks = chunks.flatMap(chunk => {
            if (chunk.text.length <= max_doc_length) return [chunk];
            const lastSpaceIndex = chunk.text.lastIndexOf(' ', max_doc_length);
            return lastSpaceIndex !== -1 
                ? [
                    { text: chunk.text.slice(0, lastSpaceIndex), delimiter: chunk.delimiter },
                    { text: chunk.text.slice(lastSpaceIndex + 1), delimiter: chunk.delimiter }
                ]
                : [chunk];
        });

        // Merge chunks if their total size is less than max_doc_length
        for (let i = delimiters.length - 1; i >= 0; i--) {
            const currentDelimiter = delimiters[i];
            const mergedChunks: typeof chunks = [];
            let currentChunk = chunks[0];

            for (let j = 1; j < chunks.length; j++) {
                if (currentChunk.delimiter === currentDelimiter &&
                    currentChunk.text.length + chunks[j].text.length <= max_doc_length) {
                    currentChunk = {
                        text: currentChunk.text + (currentDelimiter === 'sentence' ? ' ' : currentDelimiter) + chunks[j].text,
                        delimiter: chunks[j].delimiter
                    };
                } else {
                    mergedChunks.push(currentChunk);
                    currentChunk = chunks[j];
                }
            }
            mergedChunks.push(currentChunk);
            chunks = mergedChunks;
        }

        return chunks.map(chunk => chunk.text);
    }
}

