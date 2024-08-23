import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "auth";
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const { _2faStatus, qrSecret } = body;
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.userId) {
      return new NextResponse("User ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }
    const updatedUser = await prismadb.userSettings.update({
      where: {
        userId: userId
      },
      data: {
        mta: _2faStatus === "enabled" ? true : false,
        qr_code: _2faStatus === "enabled" ? qrSecret : ""
      }
    });
    if (!updatedUser) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error('[2FA_PASS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}