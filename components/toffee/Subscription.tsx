"use client";
import { useState } from "react";
import Modal from "./Modal"
import { GroupIcon } from "./icons/Group";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { CheckOut } from "./CheckoutButton";
import { UnionSVG } from "./icons/Union";
import { useSidebarContext } from "@/contexts/SidebarProvider";
export const Subscription = () => {
  const { pop, togglePop } = useSidebarContext();
  const items = [
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Unlimited Chatting and Voice Calls",
      sub: "No queues or waiting rooms!"
    },
    {
      main: "No Ads",
      sub: ""
    },
    {
      main: "Faster response times",
      sub: ""
    },
    {
      main: "Early access to new features",
      sub: ""
    },
    {
      main: "? Memories per Query instead of ?.",
      sub: ""
    },
    {
      main: "Enhanced Memory",
      sub: ""
    },
    {
      main: "Make up to ? Candies a month",
      sub: ""
    },
    {
      main: "Create and personalize characters with unlimited Knowledge Packs",
      sub: ""
    },
    {
      main: "Customize Chat UI",
      sub: ""
    },
    {
      main: "Toffee+ Profile Badge",
      sub: ""
    }
  ]
  const [unfold, setUnfold] = useState(false);
  return (
    <Modal isOpen={pop} onClose={() => false} className="w-full flex-col flex justify-center items-center">
      <>
        <div className="bg-bg-2 w-[90%] sm:w-[571px] max-h-[80vh] rounded-3xl flex flex-col p-6 sm:p-10 gap-4 sm:gap-8 relative overflow-hidden border border-[#FDCE48] z-20">
          <X className="absolute right-5 top-5 text-[#B1B1B1] cursor-pointer z-10" onClick={() => togglePop(false)} />
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-4">
              <GroupIcon />
              <span className="font-semibold  text-xl text-white">Toffee+</span>
            </div>
            {!unfold && <p className="text-sm  text-[#B1B1B1] leading-snug w-full sm:w-[70%]">This feature available only for the Toffee+ Enhance your current plan to unlock a wider range of features and exclusive privileges.</p>}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-end">
              <div className="flex flex-row items-end gap-5">
                <span className=" text-[32px] text-transparent bg-gradient-to-l from-[#FDCE48] via-[#EFA732] to-[#E69B33] bg-clip-text font-semibold">$9.99 / month</span>
                {unfold && <span className="text-text-additional  font-medium mb-2 line-through">$12 / month</span>}
              </div>
              {!unfold && <span className="text-sm text-white  underline mb-2 cursor-pointer z-10" onClick={() => setUnfold(true)}>Read all features</span>}
            </div>
          </div>
          {unfold && <div className="flex flex-col gap-5 w-full h-full overflow-auto no-scrollbar z-20">
            {items.map((item, index) => (
              <div className="flex flex-row gap-4" key={index}>
                <Check className="text-[#777777]" />
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-medium ">{item.main}</span>
                  <span className="text-[#b1b1b1] text-[13px] ">{item?.sub}</span>
                </div>
              </div>
            ))}
          </div>}
          <CheckOut />
          <div className="w-[571px] h-[318px] bg-gradient-to-b from-[#e69b3323] via-[#efa6320c] to-[#FDCE4800] absolute top-0 left-0 rounded-3xl flex justify-end" >
            <UnionSVG />
          </div>
        </div>
        <div className={`w-[679px] opacity-40 bg-gradient-to-r from-[#FDCE486e] via-[#EFA7326e] to-[#fdcd486e] blur-[100px] absolute z-10 ${unfold?"h-[765px] rounded-[765px]":"h-[281px] rounded-[679px]"}`} />
      </>
    </Modal>
  )
}