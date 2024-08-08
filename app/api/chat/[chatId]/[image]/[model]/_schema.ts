import { z } from "zod";

export const ChatAPIBodySchema = z.object({
  prompt: z.string(),
});

export type ChatAPIBody = z.infer<typeof ChatAPIBodySchema>;
