// import {
//   GenerateContentRequest,
//   HarmBlockThreshold,
//   HarmCategory,
//   VertexAI,
// } from "@google-cloud/vertexai";

// import { writeFileSync } from "fs";

// export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID!;
// const location = "us-central1";

// const base64Encoded = process.env.GCP_JSON_BASE64;

// function init() {
//   // Check if the environment variable is set
//   if (!base64Encoded) {
//     console.error("The environment variable GCP_JSON_BASE64 is not set.");
//   } else {
//     // Decode the base64 string
//     const decodedData = Buffer.from(base64Encoded, "base64").toString("utf8");

//     // Write the decoded content back to a file
//     const deploymentEnvironment = process.env.VERCEL_ENV;
//     console.log("DEPLOY ENV:", deploymentEnvironment);
//     let writePath = null;
//     if (
//       deploymentEnvironment &&
//       (deploymentEnvironment == "preview" ||
//         deploymentEnvironment == "production")
//     ) {
//       writePath = "/tmp/goog.json";
//     } else {
//       writePath = "goog.json";
//     }
//     console.log("writing app creds to", writePath);
//     writeFileSync(writePath, decodedData);
//     // writeFileSync("goog.json", decodedData);
//   }
// }

// // Initialize Vertex with your Cloud project and location
// let vertex_ai: VertexAI | null = null;

import {
  GoogleGenerativeAI,
  InputContent,
  InlineDataPart,
  HarmCategory,
  HarmBlockThreshold,
  SafetySetting,
  GenerateContentRequest,
  Part,
} from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

/**
 * Call Gemini Pro Chat model
 */
export async function callGeminiProChat(
  prompt: string,
  history: InputContent[] | undefined,
  stream?: boolean
) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // safety settings are
  const chat = model.startChat({
    history,
    safetySettings,
  });

  if (stream) {
    const result = await chat.sendMessageStream(prompt);
    return result.stream;
  } else {
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    // console.log("GEMINI CHAT RESPONSE (NON-STREAMING)", response);
    const text = response.text();
    return text;
  }

  // https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini#chat
  // https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/send-chat-prompts-gemini
}

export async function callGeminiProVision(
  prompt: string,
  imageParts: InlineDataPart[],
  stream?: boolean
  // imageUrl: string | null,
  // mimeType = "image/webp"
) {
  // For images, the SDK supports both Google Cloud Storage URI and base64 strings
  //   const filePart = imageUrl
  //     ? {
  //         fileData: {
  //           fileUri: imageUrl,
  //           mimeType: mimeType,
  //         },
  //       }
  //     : null;
  //   const textPart = {
  //     text: prompt,
  //   };

  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const request: string | GenerateContentRequest | (string | Part)[] = {
    safetySettings,
    contents: [{ role: "user", parts: [...imageParts, { text: prompt }] }],
  };

  if (stream) {
    const result = await model.generateContentStream(request);
    return result.stream;
  } else {
    const result = await model.generateContent(request);
    const response = result.response;
    const text = response.text();
    return text;
  }
}

/**
//  * TODO(developer): Update these variables before running the sample.
//  */
// async function countTokensGemini(
//   model: "gemini-pro" | "gemini-pro-vision",
//   prompt: string
// ) {
//   // Instantiate the model
//   const generativeModel = vertex_ai.preview.getGenerativeModel({
//     model: model,
//   });

//   const req = {
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//   };

//   const countTokensResp = await generativeModel.countTokens(req);
//   console.log("count tokens response: ", countTokensResp);
//   return countTokensResp;
// }
