'use client';
import { SessionProvider } from "next-auth/react";
import { AIProvider } from "@/contexts/AIProvider";
import { SidebarProvider } from "@/contexts/SidebarProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AIProvider>
          {children}
        </AIProvider>
      </SidebarProvider>
    </SessionProvider>
  )
}