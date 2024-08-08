import prismadb from "@/lib/prismadb";  
import { NextResponse } from "next/server";  

export async function POST(req: Request) {  
  try {  
    const body = await req.json();  
    await prismadb.category.create({  
      data: {  
        name: body.name  
      }  
    });  
    const categories = await prismadb.category.findMany({  
      select: {  
        id: true,  
        name: true,  
        tags: true 
      }  
    });  
    return NextResponse.json(categories);  
  } catch (error) {  
    console.log("[CATEGORY_POST]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}  

export async function GET() {  
  try {  
    const categories = await prismadb.category.findMany({  
      select: {  
        id: true,  
        name: true,  
        tags: true 
      }  
    });  
    return NextResponse.json(categories);  
  } catch (error) {  
    console.log("[CATEGORY_GET]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}