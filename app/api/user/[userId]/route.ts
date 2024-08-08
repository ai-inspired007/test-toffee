import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { uploadFile } from '@/lib/gcs';

function generateFilePath(fileName: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
  const extension = fileName.substring(fileName.lastIndexOf("."));
  return `user/bg/${timestamp}${extension}`;
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.userId) {
      return new NextResponse("User ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const data = await req.formData()
    const name = data.get('name') as string
    const avatar = data.get('avatar') as File

    let avatarUrl: string | null= '';
    if(avatar){
      const imgPath = generateFilePath(avatar.name);
      avatarUrl = await uploadFile(avatar, imgPath);
    }

    const nowUser = await prismadb.userSettings.findUnique({
      where: {
        userId: params.userId
      }
    })

    const updatedUser = await prismadb.userSettings.update({
      where: {
        userId: params.userId
      },
      data: {
        name,
        profile_image: avatar ? avatarUrl : nowUser?.profile_image,
      }
    })
    if (!updatedUser) {
      return new NextResponse('User not found.', { status: 404 });
    }

    return NextResponse.json("Success", {status: 200})
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}