import { MemoryManager } from "./memory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { SRTLoader } from "langchain/document_loaders/fs/srt";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import mime from "mime";
function getLoader(
  fileName: string,
  fileBlob: Blob,
) {
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
    // case 'pptx':
    //   return new PPTXLoader(fileBlob);
    case "srt":
      return new SRTLoader(fileBlob);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}
function bufferToBlob(buffer: Buffer, mimeType?: string): Blob {
  const arrayBuffer: ArrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
  return new Blob([arrayBuffer], { type: mimeType || "" });
}
export class Recommend extends MemoryManager {
  private static recommend_instance: Recommend;

  public constructor() {
    super();
  }

  public static async getInstance(): Promise<Recommend> {
    if (!Recommend.recommend_instance) {
      Recommend.recommend_instance = new Recommend();
      await Recommend.recommend_instance.init();
    }

    return Recommend.recommend_instance;
  }

  public async init() {
    await super.init();
    return;
  }

  public async indexIncomingFiles(files: File[], knowledgePackId: string) {

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const bytes = await file.arrayBuffer();
      const fileBuffer = Buffer.from(bytes);
      const fileName = file.name
      const contentType = mime.getType(fileName);
      if (!fileBuffer || !contentType) {
        console.error(`get ${fileName} buffer fail`);
        continue;
      }
      const fileBlob = bufferToBlob(fileBuffer, contentType);
      const loader = getLoader(fileName, fileBlob);
      const docs = await loader.load();
      docs.forEach((doc) => {
        doc.metadata = {
          ...doc.metadata,
          knowledgePackId: knowledgePackId,
          fileName: fileName,
        };
      });
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);
      const embeddings = super.getEmbeddings();
      const pineconeClient = super.getVectorDBClient();
      const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX || "");
      await PineconeStore.fromDocuments(splits, embeddings, {
        pineconeIndex,
        namespace: "pack"
      });
      return true;
    }
  }
}