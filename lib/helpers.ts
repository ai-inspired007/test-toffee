import { CandyFile } from "@/components/toffee/create/Candy";
import { LiveTranscriptionEvent } from "@deepgram/sdk";
import moment from "moment";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import { toast } from "react-toastify";

const VoiceUrl = `https://api.elevenlabs.io/v1/voices/`;

/**
 * get the sentence from a LiveTranscriptionEvent
 * @param {LiveTranscriptionEvent} event
 * @returns {string}
 */
const utteranceText = (event: LiveTranscriptionEvent) => {
  const words = event.channel.alternatives[0].words;
  return words.map((word: any) => word.punctuated_word ?? word.word).join(" ");
};

const sprintf = (template: string, ...args: any[]) => {
  return template.replace(/%[sdf]/g, (match: any) => {
    const arg = args.shift();
    switch (match) {
      case "%s":
        return String(arg);
      case "%d":
        return parseInt(arg, 10).toString();
      case "%f":
        return parseFloat(arg).toString();
      default:
        return match;
    }
  });
};

/**
 * @returns {string}
 */
function contextualHello(): string {
  const hour = moment().hour();

  if (hour > 3 && hour <= 12) {
    return "Good morning";
  } else if (hour > 12 && hour <= 15) {
    return "Good afternoon";
  } else if (hour > 15 && hour <= 20) {
    return "Good evening";
  } else if (hour > 20 || hour <= 3) {
    return "You're up late";
  } else {
    return "Hello";
  }
}

function contextualGreeting(text: string): string {
  const greeting = {
    text: `%s. - ${text}`,
    strings: [contextualHello()],
  };

  return sprintf(greeting.text, ...greeting.strings);
}

/**
 * Generate random string of alphanumerical characters.
 *
 * @param {number} length this is the length of the string to return
 * @returns {string}
 */
function generateRandomString(length: number): string {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    let randomChar = characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
    result += randomChar;
  }

  return result;

  return "test";
}

interface AudioChunk {
  audio: string;
  isFinal: boolean;
  alignment: {
    char_start_times_ms: number[];
    chars_durations_ms: number[];
    chars: string[];
  };
  normalizedAlignment: {
    char_start_times_ms: number[];
    chars_durations_ms: number[];
    chars: string[];
  };
}

function inputStreamTextToSpeech(
  textStream: AsyncIterable<string>,
): AsyncGenerator<AudioChunk> {
  const voiceId = "FGY2WhTYpPnrIDTdsKH5"; // replace "default_voice_id" with your default voice ID if needed
  const modelId = "eleven_multilingual_v2";
  const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${modelId}`;
  const socket = new WebSocket(wsUrl);

  socket.onopen = function () {
    const streamStart = {
      text: " ",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
      xi_api_key: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
    };

    socket.send(JSON.stringify(streamStart));

    // send stream until done
    const streamComplete = new Promise((resolve, reject) => {
      (async () => {
        for await (const message of textStream) {
          const request = {
            text: message,
            try_trigger_generation: true,
          };
          socket.send(JSON.stringify(request));
        }
      })()
        .then(resolve)
        .catch(reject);
    });

    streamComplete
      .then(() => {
        const endStream = {
          text: "",
        };

        socket.send(JSON.stringify(endStream));
      })
      .catch((e) => {
        throw e;
      });
  };

  return (async function* audioStream() {
    let isDone = false;
    let chunks: AudioChunk[] = [];
    let resolve: (value: unknown) => void;
    let waitForMessage = new Promise((r) => (resolve = r));

    socket.onmessage = function (event) {
      const audioChunk = JSON.parse(event.data as string) as AudioChunk;
      if (audioChunk.audio && audioChunk.alignment) {
        chunks.push(audioChunk);
        resolve(null);
        waitForMessage = new Promise((r) => (resolve = r));
      }
    };

    socket.onerror = function (error) {
      throw error;
    };

    // Handle socket closing
    socket.onclose = function () {
      isDone = true;
    };

    while (!isDone) {
      await waitForMessage;
      yield* chunks;
      chunks = [];
    }
  })();
}

async function* llmMessageSource(
  llmStream: ChatCompletionStream,
): AsyncIterable<string> {
  for await (const chunk of llmStream) {
    const message = chunk.choices[0].delta.content;
    console.log(message);
    if (message) {
      yield message;
    }
  }
}

async function addVoice({
  name,
  description,
  files,
  labels,
}: {
  name: string;
  description: string;
  files: CandyFile[];
  labels: JSON;
}) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    files?.forEach((file) => file.file && formData.append("files", file.file));
    formData.append("labels", JSON.stringify(labels));

    //   formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    // });
    const response = await fetch("/api/knowledge/create", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("Successfully created Candy!", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    } else {
      const error = await response.text();
      toast.error(`Error creating candy: ${error}`, {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  } catch (error) {
    console.error("Error creating candy:", error);
    toast.error("Error creating candy", {
      theme: "colored",
      hideProgressBar: true,
      autoClose: 1500,
    });
  } finally {
  }
}

export {
  generateRandomString,
  contextualGreeting,
  utteranceText,
  llmMessageSource,
  inputStreamTextToSpeech,
  addVoice,
};
