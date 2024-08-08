import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const tags = await prismadb.tag.findMany({
      where: { categoryId: id },
      select: { id: true, name: true }
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.log("[TAGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedCategory = await prismadb.category.update({
      where: { id },
      data: {
        name: body.name,
      },
      select: {
        id: true,
        name: true,
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log("[CATEGORY_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prismadb.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}