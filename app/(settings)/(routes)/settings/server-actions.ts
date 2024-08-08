"use server";

import {
  getGCSInstance,
  uploadToBackgroundImageStorage,
  uploadToStorage,
} from "@/lib/gcs";
import prismadb from "@/lib/prismadb";
import { auth, signIn } from "auth";
import { revalidatePath } from "next/cache";
import path from "path";

export async function deleteBackgroundImage() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        status: "failed",
      };
    }
    // delete all saves background images
    const storagePath = path.join("background_image_url", userId);
    // TODO: change to background_images bucket once permissions get figured out
    const bucket = getGCSInstance().bucket("gs://vectorchat_media");
    bucket.getFiles({ prefix: storagePath }, async (err, files) => {
      if (err || !files || files.length === 0) {
        console.error("[DELETE_BACKGROUND_IMAGE]", err);
        return {
          status: "failed",
        };
      }
      for (const file of files) {
        await file.delete();
      }
    });
    // delete the chat_background_image field in the userSettings table
    await prismadb.userSettings.update({
      where: {
        userId: userId,
      },
      data: {
        chat_background_image: null,
      },
    });
    revalidatePath("/chat/[chatId]", "page");
    return {
      status: "success",
    };
  } catch (error) {
    console.error("[DELETE_BACKGROUND_IMAGE]", error);
    return {
      status: "failed",
    };
  }
}

export async function addBackgroundImage(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? "";

    const file = formData.get("background_image_url") as File;
    const base64 = formData.get("base64") as string;
    console.log("file", file);
    // console.log("base64", base64);
    const fileInfo = {
      image: {
        fileName: file.name,
        base64: base64,
      },
      type: "background_image_url",
    };
    const publicUrl = await uploadToStorage(
      fileInfo.image.base64,
      fileInfo.image.fileName,
      path.join(fileInfo.type, userId), // upload path
    );
    // console.log("background_image_file", file);
    // const { publicUrl } = await res.json();
    console.log("background_image_url", publicUrl);
    const userSettings = await prismadb.userSettings.findUnique({
      where: {
        userId: userId,
      },
    });
    if (userSettings) {
      await prismadb.userSettings.update({
        where: {
          userId: userId,
        },
        data: {
          chat_background_image: publicUrl,
        },
      });
    } else {
      await prismadb.userSettings.create({
        data: {
          userId: userId,
          chat_background_image: publicUrl,
        },
      });
    }
    revalidatePath("/chat/[chatId]", "page");
    return {
      status: "success",
    };
  } catch (error) {
    console.error("[ADD_BACKGROUND_IMAGE]", error);
    return {
      status: "failed",
    };
  }
}
