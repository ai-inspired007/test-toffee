"use client";

import { createContext, useContext, useState } from "react";

interface AIContextValue {
  API: APIModelName;
  updateAPI: (newValue: APIModelName) => void;
  blocked: boolean;
  toggleBlocked: (block: boolean) => void;
}

type APIModelName = "OpenAI" | "BitAPAI" | "Llama" | "Gemini";

const AIContext = createContext<AIContextValue>({
  API: "OpenAI",
  updateAPI: (newValue) => {},
  blocked: false,
  toggleBlocked: (block) => {},
});

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const [API, setAPI] = useState<APIModelName>("OpenAI");
  const [blocked, setBlocked] = useState<boolean>(false);

  const updateAPI = (apiName: APIModelName) => {
    setAPI(apiName);
  };

  const toggleBlocked = (block: boolean) => {
    setBlocked(block);
  };

  return (
    <AIContext.Provider value={{ API, updateAPI, blocked, toggleBlocked }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = (): AIContextValue => {
  return useContext(AIContext);
};
