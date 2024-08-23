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

    const data = await req.formData();
    const avatarFile = data.get('avatarFile') as File | null;
    const bannerFile = data.get('bannerFile') as File | null;
    const userInfo = data.get('userInfo') as string;
    const body = JSON.parse(userInfo);
    const {
      avatar,
      banner,
      name,
      email,
      shared,
      language,
    } = body;

    let avatarUrl = avatar;
    if (avatarFile) {
      const imgPath = generateFilePath(avatarFile.name);
      avatarUrl = await uploadFile(avatarFile, imgPath);
    }

    let bannerUrl = banner;
    if (bannerFile) {
      const imgPath = generateFilePath(bannerFile.name);
      bannerUrl = await uploadFile(bannerFile, imgPath);
    }

    const nowUser = await prismadb.userSettings.findUnique({
      where: {
        userId: params.userId
      }
    });

    if (!nowUser) {
      return new NextResponse('User not found.', { status: 404 });
    }

    const updateData: Partial<typeof body> = {};

    if (avatarUrl !== null) updateData.profile_image = avatarUrl;
    if (bannerUrl !== null) updateData.banner_image = bannerUrl;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (shared !== undefined) updateData.shared = shared;
    if (language !== undefined) updateData.language = language;

    const updatedUser = await prismadb.userSettings.update({
      where: {
        userId: params.userId
      },
      data: updateData
    });

    if (!updatedUser) {
      return new NextResponse('User not found.', { status: 404 });
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}