"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  open: boolean;
  toggleOpen: (block: boolean) => void;
  pop: boolean;
  togglePop: (block: boolean)=>void
}

const SidebarContext = createContext<SidebarContextValue>({
  open: false,
  toggleOpen: (block) => {},
  pop: true,
  togglePop: (block)=>{}
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [pop, setPop] = useState<boolean>(true);
  const togglePop = (block: boolean) => {
    setPop(block)
  }
  const toggleOpen = (block: boolean) => {
    setOpen(block);
  };

  return (
    <SidebarContext.Provider value={{ open, toggleOpen, pop, togglePop }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextValue => {
  return useContext(SidebarContext);
};
