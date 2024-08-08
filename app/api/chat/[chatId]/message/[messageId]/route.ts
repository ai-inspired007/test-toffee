import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { chatId: string, messageId: string } },) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();
    const { content } = body;

    if (!params.messageId) {
      return new NextResponse("Message ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const updatedMessage = await prismadb.message.update({
      where: {
        id: params.messageId,
      },
      data: {
        content: content
      }
    });

    if (!updatedMessage) {
      return new NextResponse("User not authorized to delete.", {
        status: 401,
      });
    }

    return NextResponse.json("Update successfully", { status: 200 });
  } catch (error) {
    console.error('[FORM_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.messageId) {
      return new NextResponse("Message ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    const deletedMessage = await prismadb.message.delete({
      where: {
        id: params.messageId,
      },
    });

    if (!deletedMessage) {
      return new NextResponse("User not authorized to delete.", {
        status: 401,
      });
    }

    return NextResponse.json("Delete successfully.", { status: 200 });
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}