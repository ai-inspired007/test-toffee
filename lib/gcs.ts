import { Storage } from "@google-cloud/storage";
import md5 from "md5";
import path from "path";
import sharp from "sharp";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { google } from "@google-cloud/vision/build/protos/protos";

let instance: Storage | null = null;

// const privateKey = process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n");
const privateKey = process.env
  .GCP_PRIVATE_KEY!.replace(
    /-----BEGIN PRIVATE KEY----- /g,
    "-----BEGIN PRIVATE KEY-----\n",
  )
  .replace(/ -----END PRIVATE KEY----- /g, "\n-----END PRIVATE KEY-----\n");

// console.log("raw");
// console.log(process.env.GCP_PRIVATE_KEY);

// console.log("formatted");
// console.log(privateKey);

export const getGCSInstance = () => {
  if (!instance) {
    // console.log("creating GCS instance");
    // console.log(process.env.GCP_CLIENT_EMAIL);

    instance = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  }

  return instance;
};

let imageAnnotator: ImageAnnotatorClient | null = null;

export const getImageAnnotatorInstance = () => {
  if (!imageAnnotator) {
    imageAnnotator = new ImageAnnotatorClient({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  }

  return imageAnnotator;
};

// const base64ToWebp = (base64: string, from: string) => {
//   // base64str of image
//   // base64str image type jpg,png ...
//   //option: options and quality,it should be given between 0 to 100
//   return new Promise<string>((resolve, reject) => {
//     webp
//       .str2webpstr(base64, from, "-q 80")
//       .then((result: string) => {
//         resolve(result as string);
//       })
//       .catch(() => {
//         reject("Unable to convert to webp base64");
//       });
//   });
// };

const isImageFlagged = (
  detections: google.cloud.vision.v1.ISafeSearchAnnotation,
  verbose?: boolean,
) => {
  if (verbose) {
    console.log(`Adult: ${detections.adult}`);
    console.log(`Spoof: ${detections.spoof}`);
    console.log(`Medical: ${detections.medical}`);
    console.log(`Violence: ${detections.violence}`);
  }

  if (detections.adult) {
    switch (detections.adult) {
      case "LIKELY":
      case "VERY_LIKELY":
        return true;
      default:
        return false;
    }
  }

  if (detections.racy) {
    switch (detections.racy) {
      case "LIKELY":
      case "VERY_LIKELY":
        return true;
      default:
        return false;
    }
  }

  if (detections.violence) {
    switch (detections.violence) {
      case "VERY_LIKELY":
        return true;
      default:
        return false;
    }
  }

  if (detections.medical) {
    switch (detections.medical) {
      case "VERY_LIKELY":
        return true;
      default:
        return false;
    }
  }
};

const sendMessage = async (imageUrl: string) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const body = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    photo: imageUrl,
    caption: "This image has been flagged.",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Message sent", data);
  } catch (error) {
    console.error("Error sending message", error);
  }
};

export async function checkIfJpegImageExistsFromWebpUrl(webpUrl: string) {
  console.log("checking if jpeg exists from webp url", webpUrl);
  const bucket = getGCSInstance().bucket("gs://vectorchat_media");
  const newUrl = webpUrl.replace(".webp", ".jpeg");

  const newBucketPath = newUrl
    .replace("https://storage.googleapis.com/vectorchat_media/", "")
    .replaceAll("%2F", "/");

  const exists = await bucket.file(newBucketPath).exists();

  console.log("exists", exists, "newurl", newUrl);

  return exists;
}

export async function checkIfPngImageExistsFromWebpUrl(webpUrl: string) {
  console.info("checking if png exists from webp url", webpUrl);
  const bucket = getGCSInstance().bucket("gs://vectorchat_media");
  const newUrl = webpUrl.replace(".webp", ".png");

  let newBucketPath: string;

  if (webpUrl.includes("cloudinary.com")) {
    newBucketPath = path
      .join(
        "public",
        newUrl
          .replace("https://res.cloudinary.com/dmrruqnog/image/upload/", "")
          .replaceAll("%2F", "/"),
      )
      .replaceAll(/\\/g, "/");
  } else {
    newBucketPath = newUrl
      .replace("https://storage.googleapis.com/vectorchat_media/", "")
      .replaceAll("%2F", "/");
  }

  console.log("new bucket path", newBucketPath);

  const exists = await bucket.file(newBucketPath).exists();

  return exists;
}

export const fromWebpUrlUploadToStorage = async (webpUrl: string) => {
  try {
    const bucket = getGCSInstance().bucket("gs://vectorchat_media");

    let webpBucketPath: string;

    if (webpUrl.includes("cloudinary.com")) {
      webpBucketPath = path
        .join(
          "public",
          webpUrl
            .replace("https://res.cloudinary.com/dmrruqnog/image/upload/", "")
            .replaceAll("%2F", "/"),
        )
        .replaceAll(/\\/g, "/");
    } else {
      webpBucketPath = webpUrl
        .replace("https://storage.googleapis.com/vectorchat_media/", "")
        .replaceAll("%2F", "/");
    }

    console.log("webp bucket path", webpBucketPath);

    const newBucketPath = webpBucketPath
      .replace(".webp", `.png`)
      .replaceAll(/\\/g, "/");

    console.log(
      "webp bucket path",
      webpBucketPath,
      "new bucket path",
      newBucketPath,
    );

    const webpFile = await bucket.file(webpBucketPath).download({
      destination: undefined,
    });

    const webpBuffer = webpFile[0];

    // const jpegBuffer = await sharp(webpBuffer).toFormat("jpeg").jpeg({ quality: 80 }).toBuffer();
    // https://stackoverflow.com/questions/72450625/strapi-vipsjpeg-premature-end-of-input-file-error
    const pngBuffer = await sharp(webpBuffer)
      .toFormat("png")
      .png({ compressionLevel: 6 })
      .toBuffer();

    await bucket.file(newBucketPath).save(pngBuffer);

    console.log("saved png version to", newBucketPath, "from", webpBucketPath);

    return bucket.file(newBucketPath).publicUrl();
  } catch (error) {
    console.error("Error uploading from webp url to storage", error);
    throw error;
  }
};

export const uploadToBackgroundImageStorage = async (
  base64Img: string,
  fileName: string,
  storageFolderPath: string,
) =>
  uploadToStorage(
    base64Img,
    fileName,
    storageFolderPath,
    "gs://background_images",
  );

export const uploadToStorage = async (
  base64Img: string,
  fileName: string,
  storageFolderPath: string,
  bucket_name: string = "gs://vectorchat_media",
) => {
  try {
    // Make sure we aren't doing anything fishy with buckets
    if (
      bucket_name !== "gs://vectorchat_media" &&
      bucket_name !== "gs://background_images"
    ) {
      return null;
    }
    const bucket = getGCSInstance().bucket(bucket_name);

    // const hash = md5(fileName + new Date().getTime()).replace(/\//g, "_"); // no slashes
    const hash = md5(base64Img).replace(/\//g, "_");

    const storagePath = path
      .join(storageFolderPath, hash + ".webp")
      .replace(/\\/g, "/"); // backward to forward slashes

    if ((await bucket.file(storagePath).exists())[0]) {
      console.log("FILE ALREADY EXISTS at", storagePath);
      return bucket.file(storagePath).publicUrl();
    }

    // console.log("uploading to", storagePath)

    const split = fileName.split(".");
    const ext = split[split.length - 1];

    let convertedBuf = null;

    const imageBuffer = Buffer.from(base64Img, "base64");

    console.log("image buffer", imageBuffer);

    if (ext != "webp") {
      // const stream = bufferToStream(Buffer.from(base64Img, "base64"));

      // convertedBuf = await convertImage(stream, "webp");
      convertedBuf = await sharp(imageBuffer, {
        failOnError: false,
      })
        .toFormat("webp")
        .webp({ quality: 80 })
        .toBuffer();

      console.log("converted image to webp");
    }

    const webpImageBuffer = convertedBuf ?? imageBuffer;

    console.log("moderating image", fileName);

    // Perform image moderation
    const imageAnnotator = getImageAnnotatorInstance();
    const [result] = await imageAnnotator.safeSearchDetection(webpImageBuffer);

    const detections = result.safeSearchAnnotation;
    if (!detections) {
      throw new Error("No detections found for image moderation");
    }

    const flagged = isImageFlagged(detections, true);

    if (flagged) {
      // try {
      //   const [res] = await bucket.file(storagePath).delete()
      //   console.log(res.statusCode)
      // } catch (e) {
      //   console.log("FAILED TO DELETE FLAGGED FILE")
      //   console.error(e)
      // }

      throw new Error("moderation-image");
    }

    // make jpeg buffer as well if needed
    // const jpegBuffer = (ext !== "jpeg" && ext !== "jpg") ? await sharp(imageBuffer).toFormat("jpeg").jpeg({ quality: 80 }).toBuffer() : imageBuffer;
    const pngBuffer =
      ext !== "png"
        ? await sharp(imageBuffer)
            .toFormat("png")
            .png({ compressionLevel: 6 })
            .toBuffer()
        : imageBuffer;

    // Upload the webp + jpeg file to bucket
    await bucket.file(storagePath).save(webpImageBuffer);
    await bucket.file(storagePath.replace(".webp", ".png")).save(pngBuffer);

    console.log("saved", fileName, "to", storagePath);
    console.log("saved png version to", storagePath.replace(".webp", ".png"));

    // await bucket.file().makePublic();

    return bucket.file(storagePath).publicUrl();
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async(
  file: File,
  filePath : string,
  bucket_name: string = "gs://vectorchat_media",
)=> {
  try {
    if (
      bucket_name !== "gs://vectorchat_media" &&
      bucket_name !== "gs://background_images"
    ) {
      return null;
    }
    const bucket = getGCSInstance().bucket(bucket_name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const split = file.name.split(".");
    const ext = split[split.length - 1];
    if(["png", "jpg", "jpeg", "webp"].includes(ext)){
      const imageAnnotator = getImageAnnotatorInstance();
      const [result] = await imageAnnotator.safeSearchDetection(buffer);
  
      const detections = result.safeSearchAnnotation;
      if (!detections) {
        throw new Error("No detections found for image moderation");
      }  
      const flagged = isImageFlagged(detections, true);  
      if (flagged) {
        throw new Error("moderation-image");
      }
    }
    await bucket.file(filePath).save(buffer);
    console.log("saved", file.name, "to", filePath);
    return bucket.file(filePath).publicUrl().replaceAll("%2F", "/");
  } catch (error) {
    throw error;
  }
}