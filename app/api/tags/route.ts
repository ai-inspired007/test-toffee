import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTag = await prismadb.tag.create({
      data: {
        name: body.name,
        categoryId: body.categoryId
      }
    });
    return NextResponse.json(newTag);
  } catch (error) {
    console.log("[TAG_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET() {
  try {
    const tags = await prismadb.tag.findMany({
      select: {
        id: true,
        name: true,
        category: true
      }
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.log("[TAG_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}