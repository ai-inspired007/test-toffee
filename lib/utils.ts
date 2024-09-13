import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import prismadb from "./prismadb"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getVectors = async (knowledgePackId: string) => {
  let pack = await prismadb.knowledgePack.findUnique({
    where: {
      id: knowledgePackId
    },
    include: {
      files: true
    }
  });

  if (!pack) {
    return 0;
  } else {
    let acc = 0;

    // iterate over the files, and count the number of summaries for each one
    for (let i = 0; i < pack.files.length; i++) {
      const file = pack.files[i];
      const numSummaries = await prismadb.summary.count({
        where: {
          fileId: file.id
        }
      });
      acc += numSummaries
    }
    return acc;
  }
}

export function formatNumber(number: number) {
  let n = number;

  if (n < 1e3) {
    return Math.round(n).toString();
  } else if (n < 1e6) {
    return (n / 1e3) + "K";
  } else if (n < 1e9) {
    return (n / 1e6) + "M";
  } else {
    return (n / 1e9) + "B";
  }

}

export const getURL = (path: string = "") => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
      process?.env?.NEXT_PUBLIC_VERCEL_URL &&
        process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
        "http://localhost:3000/";

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, "");
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, "");

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

export const cosinesim = (A: number[], B: number[]) => {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return mA === 0 || mB === 0 ? 1 : dotproduct / (mA * mB);
};

export const generateGradientBackgrounds = (colors: string[], length: number): string[] => {
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
  const selectedColors = shuffledColors.slice(0, length);
  return selectedColors.map(color => `linear-gradient(to right, ${color}4D 0%, ${color}00 45.07%)`);
};