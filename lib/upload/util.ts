import { UploadToGCSInput } from "@/app/api/upload/_schema";
import { GCPBucketNames } from "@/app/api/upload/_schema";
import { toast } from "react-toastify";

export const validImageInputTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const validAudioInputTypes = [
  "audio/mpeg",
  "audio/wav"
];

export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const uploadCharacterPic = async (
  img: File,
  temp: GCPBucketNames,
  disabled?: boolean,
) => {
  // console.log("type", img.type);
  if (disabled) {
    return;
  }
  if (!validImageInputTypes.includes(img.type)) {
    toast.error(`Invalid image input type. ${validImageInputTypes.join(
        ", ",
      )} are accepted.`, {theme: "colored", autoClose: 1500, hideProgressBar: true,});
    return;
  }

  // "data:image/png;base64,/9j/..." split at ','
  const base64 = ((await getBase64(img)) as string).split(",")[1];
  // console.log(base64);

  const payload: UploadToGCSInput = {
    type: temp,
    image: {
      fileName: img.name,
      base64,
    },
  };

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.status !== 200) {
      throw new Error(json.message);
    }

    return json.publicUrl;
  } catch (e: any) {
    // console.log("ImageUpload.tsx", e);
    console.log((e.message as string).indexOf("moderation-image") > -1);
    if ((e.message as string).indexOf("moderation-image") > -1) {
      toast.error("That image was flagged for moderation purposes. Contact devs to resolve.", {theme: "colored", autoClose: 1500, hideProgressBar: true,});
    } else {
      toast.error("Upload failed. Please wait a bit and try again.", {theme: "colored", autoClose: 1500, hideProgressBar: true,});
    }
  }
};
