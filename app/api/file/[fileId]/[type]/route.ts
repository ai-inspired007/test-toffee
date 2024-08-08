import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { auth } from "auth";
import { NextResponse } from "next/server";
import { deleteVectors } from "@/lib/memory/indexing";

export const maxDuration = 35;

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string, type: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.fileId) {
      return new NextResponse("Character ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    await deleteVectors([params.fileId])
    let deletedFile;
    if (params.type === "FILE") {
      deletedFile = await prismadb.knowledgeFile.delete({
        where: {
          id: params.fileId,
        },
      });
    } else if (params.type === "TEXT") {
      deletedFile = await prismadb.knowledgeText.delete({
        where: {
          id: params.fileId,
        },
      });
    } else if (params.type === "LINK") {
      deletedFile = await prismadb.knowledgeLink.delete({
        where: {
          id: params.fileId,
        },
      });
    }

    if (!deletedFile) {
      return new NextResponse("User not authorized to delete.", {
        status: 401,
      });
    }

    return NextResponse.json("Delete successfully.",{status:200});
  } catch (error) {
    console.log("[CHARACTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}