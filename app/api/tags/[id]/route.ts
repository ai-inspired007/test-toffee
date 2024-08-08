import prismadb from "@/lib/prismadb";  
import { NextResponse } from "next/server";  

export async function GET(req: Request, { params }: { params: { id: string } }) {  
  try {  
    const { id } = params;  
    const tag = await prismadb.tag.findUnique({  
      where: { id },  
      select: {  
        id: true,  
        name: true,  
        category: {  
          select: {  
            id: true,  
            name: true,  
          }  
        }  
      }  
    });  

    if (!tag) {  
      return new NextResponse("Tag not found", { status: 404 });  
    }  

    return NextResponse.json(tag);  
  } catch (error) {  
    console.log("[TAG_GET]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}  

export async function PUT(req: Request, { params }: { params: { id: string } }) {  
  try {  
    const { id } = params;  
    const body = await req.json();  
    
    const updatedTag = await prismadb.tag.update({  
      where: { id },  
      data: {  
        name: body.name,  
        categoryId: body.categoryId,  
      },  
      select: {  
        id: true,  
        name: true,  
        category: {  
          select: {  
            id: true,  
            name: true,  
          }  
        }  
      }  
    });  

    return NextResponse.json(updatedTag);  
  } catch (error) {  
    console.log("[TAG_PUT]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {  
  try {  
    const { id } = params;  

    await prismadb.tag.delete({  
      where: { id },  
    });  

    return new NextResponse(null, { status: 204 });  
  } catch (error) {  
    console.log("[TAG_DELETE]", error);  
    return new NextResponse("Internal Error", { status: 500 });  
  }  
}