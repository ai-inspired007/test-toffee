"use client";

import { CircleUserRound, LogIn, LogInIcon, Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeToggle } from "@/components/Toggle";
import { MobileSidebar } from "@/components/MobileSidebar";
import { SearchInput } from "@/components/SearchInput";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const BottomBar = () => {
  // const { user } = useUser();
  return (
    <div className="relative ml-[13.9rem] flex h-16 items-center justify-center border border-primary/10 bg-white py-2">
      <p className="text-sm text-black/60">
        Unleashing the Potential of Conversational Intelligence with
        Cutting-Edge AI.{" "}
      </p>
    </div>
  );
};
