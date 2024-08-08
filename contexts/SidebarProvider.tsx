"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  open: boolean;
  toggleOpen: (block: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  open: false,
  toggleOpen: (block) => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(true);

  const toggleOpen = (block: boolean) => {
    setOpen(block);
  };

  return (
    <SidebarContext.Provider value={{ open, toggleOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextValue => {
  return useContext(SidebarContext);
};
