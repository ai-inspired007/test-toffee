import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import bcrypt from 'bcrypt';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword } = body;
    
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.userId) {
      return new NextResponse("User ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const user = await prismadb.userSettings.findUnique({
      where: {
        userId: userId
      }
    });

    let currentPassword = user?.password || "";

    const isValidPassword = await bcrypt.compare(oldPassword, currentPassword);
    if (isValidPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prismadb.userSettings.update({
        where: {
          userId: userId
        },
        data: {
          password: hashedPassword
        }
      });

      if (!updatedUser) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "Not match password" }, { status: 400 });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}