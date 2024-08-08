import { createContext } from "react";

export const StreamingCompletionContext = createContext<{
    completion: string;
    stopGenerating: () => void;
} | null>(null);