import type { Metadata } from "next";
import { Providers } from "./providers";

import "./styles/globals.css";
import "./slide.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import { Subscription } from "@/components/toffee/Subscription";
import "react-toastify/dist/ReactToastify.css";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
export const metadata: Metadata = {
  title: "Toffee",
  description: "Character chat platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  let isProUser = false;

  if (session && session.user && session.user.id) {
    const userSettings = await prismadb.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    isProUser = userSettings != null && userSettings.plan === "PRO";
    console.log("[USER_PRO_PLAN]", isProUser);
  } else {
    console.log("User is not authenticated or user id is not available");
  }
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          {!isProUser && session && <Subscription />}
        </Providers>
        <Toaster />
        <ToastContainer />
      </body>
    </html>
  );
}
