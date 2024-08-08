import { z } from "zod";

export type GCPBucketNames = "chat" | "character" | "background_images";

// Perhaps add parameter "destPath" for the upload path, probably remove 'type' property
export const UploadToGCSInputSchema = z.object({
  type: z.union([
    z.literal("chat"),
    z.literal("character"),
    z.literal("background_images"),
  ]),
  image: z.object({
    base64: z.string(),
    fileName: z.string(),
  }),
});

export type UploadToGCSInput = z.infer<typeof UploadToGCSInputSchema>;
