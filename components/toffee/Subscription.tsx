"use client";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { GroupIcon } from "./icons/Group";
import { X, Check } from "lucide-react";
import { CheckOut } from "./CheckoutButton";
import { UnionSVG } from "./icons/Union";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import { featureItems as items } from "./features";

export const Subscription = () => {
  const { pop, togglePop } = useSidebarContext();

  const [isMobile, setIsMobile] = useState(false);
  const [unfold, setUnfold] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);
    setUnfold(mediaQuery.matches);

    const handleMediaQueryChange = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addListener(handleMediaQueryChange);

    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, []);

  return (
    <Modal isOpen={pop} onClose={() => false}>
      <div className="w-full flex-col flex justify-end sm:justify-center items-center h-screen">
        <div className="bg-bg-2 w-full sm:w-[571px] max-h-[90vh] sm:max-h-[80vh] sm:rounded-3xl rounded-t-3xl flex flex-col p-6 sm:p-10 gap-4 sm:gap-8 relative overflow-hidden sm:border border-[#FDCE48] z-20">
          <X className="absolute right-5 top-5 text-[#B1B1B1] cursor-pointer z-10" onClick={() => togglePop(false)} />
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-4">
              <GroupIcon />
              <span className="font-semibold text-xl text-white">Toffee+</span>
            </div>
            {!unfold && (
              <p className={`text-sm text-[#B1B1B1] leading-snug w-full sm:w-[70%]`}>
                This feature is available only for the Toffee+ plan. Enhance your current plan to unlock a wider range of features and exclusive privileges.
              </p>
            )}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-end">
              <div className="flex flex-row items-end gap-5">
                <span className="text-[32px] text-transparent bg-gradient-to-l from-[#FDCE48] via-[#EFA732] to-[#E69B33] bg-clip-text font-semibold">$9.99 / month</span>
              </div>
              {!unfold && (
                <span className={`text-sm text-white underline mb-2 cursor-pointer z-10`} onClick={() => setUnfold(true)}>
                  Read all features
                </span>
              )}
            </div>
          </div>
          {unfold && (
            <div className={`flex flex-col gap-5 w-full h-full overflow-auto no-scrollbar z-20`}>
              {items.map((item, index) => (
                <div className="flex flex-row gap-4" key={index}>
                  <Check className="text-white w-6 h-6" />
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-sm font-medium">{item.main}</span>
                    <span className="text-[#b1b1b1] text-[13px]">{item?.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <CheckOut />
          <div className="w-[571px] h-[318px] bg-gradient-to-b from-[#e69b3323] via-[#efa6320c] to-[#FDCE4800] absolute top-0 left-0 rounded-3xl flex justify-end">
            <UnionSVG />
          </div>
        </div>
        <div className={`w-[679px] opacity-40 bg-gradient-to-r from-[#FDCE486e] via-[#EFA7326e] to-[#fdcd486e] blur-[100px] absolute z-10 ${unfold ? "h-[765px] rounded-[765px]" : "h-[281px] rounded-[679px]"}`} />
      </div>
    </Modal>
  );
};