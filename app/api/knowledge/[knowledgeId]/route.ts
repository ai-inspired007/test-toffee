import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/gcs';
import { KnowledgeFile, KnowledgePackType } from '@prisma/client';
import { Indexer } from '@/lib/memory/indexing';
import qs from "qs";
import { deleteVectors } from "@/lib/memory/indexing";

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `knowledge/bg/${timestamp}${extension}`;
}

export async function PUT(
  req: Request,
  { params }: { params: { knowledgeId: string } },) {
  try {
    const session = await auth();
    const user = session?.user;

    const data = await req.formData()
    const img = data.get('image') as File;
    const files = data.getAll('files') as File[];
    const texts = data.get('texts') as string;
    const links = data.get('links') as string;
    const removeFileIds = data.get('deletedFiles') as string;
    const removeTextIds = data.get('deletedTexts') as string;
    const removeLinkIds = data.get('deletedLinks') as string;
    // if (!img || typeof img === "string") {
    //   throw new Error('Image not provided');
    // }
    const textData: { content: string }[] = JSON.parse(texts);
    const linkData: { title: string, url: string, icon: string }[] = JSON.parse(links);
    const removeFileData: string[] = JSON.parse(removeFileIds);
    const removeTextData: string[] = JSON.parse(removeTextIds);
    const removeLinkData: string[] = JSON.parse(removeLinkIds);

    let imageUrl: string | null = '';
    if (img) {
      const imgPath = generateFilePath(img.name);
      imageUrl = await uploadFile(img, imgPath);

      const updatedKnowledge = await prismadb.knowledgePack.update({
        where: {
          id: params.knowledgeId
        },
        data: {
          image: imageUrl,
        }
      });
    }

    if (removeFileData) {
      await deleteVectors(removeFileData)
      const conditions = removeFileData.map(item => ({ id: item }));
      await prismadb.knowledgeFile.deleteMany({
        where: {
          OR: conditions
        },
      });
    }

    if (removeTextData) {
      await deleteVectors(removeTextData)
      const conditions = removeTextData.map(item => ({ id: item }));
      await prismadb.knowledgeText.deleteMany({
        where: {
          OR: conditions
        },
      });
    }

    if (removeLinkData) {
      await deleteVectors(removeLinkData)
      const conditions = removeLinkData.map(item => ({ id: item }));
      await prismadb.knowledgeLink.deleteMany({
        where: {
          OR: conditions
        },
      });
    }

    let indexer = Indexer.getInstance();
    if (files) {
      console.log(files);
      (await indexer).indexIncomingFiles(files, params.knowledgeId)
      .then(res=> console.log(res))
    }
    if (textData) {
      console.log(textData);
      (await indexer).indexIncomingTexts(textData, params.knowledgeId)
    }
    if (linkData) {
      console.log(linkData);
      (await indexer).indexIncomingWebLinks(linkData, params.knowledgeId)
    }

    return NextResponse.json("Update successfully", { status: 200 });
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}