import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const session = await auth();
    const user = session?.user;

    const query = searchParams.get("query") ? (searchParams.get("query") as string) : "";
    console.log(Object.fromEntries(searchParams))
    
    const total = await prismadb.category.count({
      where: {
        AND: {
          name: {
            contains: query,
          },
        },
      },
    })
    const categoriesWithTags = await prismadb.category.findMany({
      where: {
        AND: {
          name: {
            contains: query,
          },
        },
      },
      select: {
        id: true,
        name: true,
        tags: true
      },
      // orderBy: {
      //   tags: {
      //     _count: "desc"
      //   }
      // },
    });
    console.log(categoriesWithTags.length)

    return NextResponse.json({
      total,
      categoriesWithTags
    }, {status: 200});
  } catch (error) {
    console.log("[CHARACTER_GET_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
