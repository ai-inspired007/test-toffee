import { LiveTranscriptionEvent } from "@deepgram/sdk";
import moment from "moment"

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
};

function contextualGreeting(text: string): string {
  const greeting = {
    text: `%s. - ${text}`,
    strings: [contextualHello()],
  };

  return sprintf(greeting.text, ...greeting.strings);
};

/**
 * Generate random string of alphanumerical characters.
 * 
 * @param {number} length this is the length of the string to return
 * @returns {string}
 */
function generateRandomString(length: number): string {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    let randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    result += randomChar;
  }

  return result;

  return 'test';
}

export {
  generateRandomString,
  contextualGreeting,
  utteranceText
};