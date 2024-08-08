import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/gcs';
import { KnowledgePackType } from '@prisma/client';
import { Indexer } from '@/lib/memory/indexing';
import qs from "qs";

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `knowledge/bg/${timestamp}${extension}`;
}

export async function GET(req: Request) {
  try {
    const rawParams = req.url.split("?")[1];
    const searchParams = qs.parse(rawParams);
    const session = await auth();
    const user = session?.user;
    const page: any = searchParams.page ? searchParams.page : 1;
    const itemsPerPage: any = searchParams.itemsPerPage ? searchParams.itemsPerPage : 5;
    const query = searchParams.query ? (searchParams.query as string) : "";
    console.log(searchParams)
    
    const total = await prismadb.knowledgePack.count({
      where: {
        AND: {
          name: {
            contains: query,
          },
          // OR: [
          //   {
          //     userId: "public",
          //   },
          //   {
          //     sharing: "public"
          //   },
          //   {
          //     userId: user?.id
          //   }
          // ],
        },
      },
    })
    const knowledgePacks = await prismadb.knowledgePack.findMany({
      where: {
        AND: {
          name: {
            contains: query,
          },
          // OR: [
          //   {
          //     userId: "public",
          //   },
          //   {
          //     sharing: "public"
          //   },
          //   {
          //     userId: user?.id
          //   }
          // ],
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        // characterKnowledgePacks: true,
        // _count: {
        //   select: {
        //     characterKnowledgePacks: true,
        //   },
        // },
      },
      // orderBy: {
      //   characterKnowledgePacks: {
      //     _count: "desc"
      //   }
      // },
      skip: parseInt(page) * parseInt(itemsPerPage),
      take: parseInt(itemsPerPage)
    });
    console.log(knowledgePacks.length)
    // const scoredKnowledgePacks = knowledgePacks.map((item) => ({
    //   ...item,
    //   score: item._count.characterKnowledgePacks
    // })
    // );
    // const sortedKnowledgePacks = scoredKnowledgePacks.sort((a, b) => b.score - a.score); // Sorting by score descending
    

    return NextResponse.json({
      total,
      knowledgePacks
    }, {status: 200});
  } catch (error) {
    console.log("[CHARACTER_GET_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    const data = await req.formData()
    
    const name = data.get('name') as string
    const description = data.get('description') as string
    const img = data.get('image') as File
    const theme = data.get('theme') as string
    const themeFile = data.get('themeFile') as File
    const sharing = data.get('sharing') as string
    const texts = data.get('texts') as string;
    const files = data.getAll('files') as File[]
    const links = data.get('links') as string;;
    if (!img || typeof img === "string") {
      throw new Error('Image not provided');
    }
    const textData: {content: string}[] = JSON.parse(texts);
    const linkData: {title: string, url: string, icon: string}[] = JSON.parse(links)

    let imageUrl: string | null = '';
    if (img) {
      const imgPath = generateFilePath(img.name);
      imageUrl = await uploadFile(img, imgPath);
    }

    let themeUrl: string | null = '';
    if (themeFile) {
      const imgPath = generateFilePath(themeFile.name);
      themeUrl = await uploadFile(themeFile, imgPath);
    }

    const knowledge = await prismadb.knowledgePack.create({
      data: {
        name: name,
        theme: themeFile ? themeUrl : theme,
        image: imageUrl,
        type: KnowledgePackType.PACK,
        sharing: sharing,
        userId: user?.id,
        description: description,
        // parentId: null,
      }
    });

    let indexer = Indexer.getInstance();
    if (files) {
      console.log(files);
      (await indexer).indexIncomingFiles(files, knowledge.id)
      .then(res=> console.log(res))
    }
    if (textData) {
      console.log(textData);
      (await indexer).indexIncomingTexts(textData, knowledge.id)
    }
    if (linkData) {
      console.log(linkData);
      (await indexer).indexIncomingWebLinks(linkData, knowledge.id)
    }
    // if (knowledge) {
    //   return NextResponse.json({ knowledge: knowledge }, { status: 200 });
    // } else {
    //   return NextResponse.json({ error: 'PACK creation failed' }, { status: 500 });
    // }
    return NextResponse.json({ knowledge: "created" }, { status: 200 });
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
