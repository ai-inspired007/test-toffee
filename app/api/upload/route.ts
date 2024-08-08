import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/gcs";
import path from "path";
import { z } from "zod";

// Update the schema to remove 'type' and add 'destPath'
const UploadToGCSInputSchema = z.object({
  type: z.string(),
  image: z.object({
    base64: z.string(),
    fileName: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return new NextResponse("User not logged in.", { status: 401 });
    }

    const body = await req.json();

    // Validate the request body against the schema
    const { image, type } = UploadToGCSInputSchema.parse(body);

    if (!type || !user.id) {
      throw new Error("Invalid destination path or user ID.");
    }

    // Ensure destPath is a valid string
    if (typeof type !== "string" || typeof user.id !== "string") {
      throw new Error("Invalid data types for destination path or user ID.");
    }

    // Use destPath instead of type for the upload path
    const uploadPath = path.join(type, user.id);

    const publicUrl = await uploadToStorage(
      image.base64,
      image.fileName,
      uploadPath,
    );

    return NextResponse.json({
      publicUrl,
    });
  } catch (error: any) {
    console.error("[UPLOAD_GCS]", error);
    if (error.message?.includes("moderation-image")) {
      console.error("IMAGE MODERATION ERROR");
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
