"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpSLineIcon } from "../../icons/ArrowUpSLineIcon";

export type DropdownWrapperProps = {
  label: string;
  children: React.ReactNode;
};

export function DropdownWrapper({ label, children }: DropdownWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex max-h-[22%] flex-col rounded-lg bg-bg-2 p-4">
      <div className="flex w-full flex-row items-center justify-between">
        <span className="text-base font-[500] text-text-sub">{label}</span>
        <ArrowUpSLineIcon
          className={`h-6 w-6 cursor-pointer transition-transform ease-in-out ${isOpen ? "rotate-0" : "rotate-[540deg]"}`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <motion.div
        animate={{ height: isOpen ? "auto" : "0px" }}
        className={`mt-2  overflow-hidden`}
      >
        {children}
      </motion.div>
    </div>
  );
}
