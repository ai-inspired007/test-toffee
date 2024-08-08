import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { rateLimit } from "@/lib/rate-limit";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string, followId: string } },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params.userId || !params.followId) {
      return new NextResponse("ID is required.", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User not authorized.", { status: 401 });
    }

    // const identifier = req.url + "-" + userId;
    // const { limit } = await rateLimit(identifier, 3);

    // if (!limit) {
    //   return new NextResponse("Rate limit exceeded", { status: 429 });
    // }

    const deletedFollow = await prismadb.follow.delete({
      where: {
        id: params.followId
      },
    });

    if (!deletedFollow) {
      return new NextResponse("Not found!", {
        status: 404,
      });
    }

    return new NextResponse("Success!", { status: 200});
  } catch (error) {
    console.log("[EVOLVE_MEMORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}