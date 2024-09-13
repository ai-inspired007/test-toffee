import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from '@/lib/gcs';
import { ChatTheme, ThemeType } from "@prisma/client";

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `setting/theme/${timestamp}${extension}`;
}

export async function POST(req: NextRequest) {  
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }
    
    const data = await req.formData();
    const selectedNewFile = data.get('selectedNewFile') as File;
    const newFiles = data.getAll('newFiles') as File[];
    const removedThemes = data.get('removedThemes') as string;
    const remainData = data.get('remainData') as string;
    let { voiceId, themeId, prompt, chat_model } = JSON.parse(remainData);

    let removedData: ChatTheme[] = JSON.parse(removedThemes);
    if (removedData.length) {
      await prismadb.chatTheme.deleteMany({
        where: {
          OR: removedData.map(item => ({id: item.id}))
        }
      })
    }

    let newThemes = [];
    for (let newFile of newFiles) {
      if (newFile) {
        const filePath = generateFilePath(newFile.name);
        const fileUrl = await uploadFile(newFile, filePath);
        newThemes.push({
          userId,
          url: fileUrl || ""
        })
      }
    }

    if (newThemes.length) {
      await prismadb.chatTheme.createMany({
        data: newThemes
      })
    }

    if (selectedNewFile) {
      const filePath = generateFilePath(selectedNewFile.name);
      const selectedUrl = await uploadFile(selectedNewFile, filePath);
      const selectedNewTheme = await prismadb.chatTheme.create({
        data: {
          userId,
          url: selectedUrl || ""
        }
      })
      themeId = selectedNewTheme.id;
    }

    const chatSetting = await prismadb.chatSetting.findFirst({
      where: {
        userId: userId
      }
    });

    if (chatSetting) {
      const updatedChatSetting = await prismadb.chatSetting.update({
        where: {
          id: chatSetting.id
        },
        data: {
          voiceId,
          themeId,
          prompt,
          chat_model
        }
      })
      if (!updatedChatSetting) {
        return NextResponse.json("Not Found", {status: 404})
      }
    } else {
      const createdChatSetting = await prismadb.chatSetting.create({
        data: {
          userId,
          voiceId,
          themeId,
          prompt,
          chat_model
        }
      })
      if (!createdChatSetting) {
        return NextResponse.json("Not Found", {status: 404})
      }
    }
    return NextResponse.json("Success", {status: 200});
  } catch (error) {
    console.log("[CHARACTER_GET_CHAT_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
