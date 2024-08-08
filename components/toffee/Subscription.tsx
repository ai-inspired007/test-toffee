"use client";
import { useState } from "react";
import Modal from "./Modal"
import { GroupIcon } from "./icons/Group";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { CheckOut } from "./CheckoutButton";
export const Subscription = () => {
  const [open, setOpen] = useState(true);
  const items = [
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    }
  ]
  const [unfold, setUnfold] = useState(false);
  return (
    <Modal isOpen={open} onClose={() => false} className="w-full flex-col flex justify-center items-center">
      <div className="bg-bg-2 w-[90%] sm:w-[571px] max-h-[80vh] rounded-3xl flex flex-col p-6 sm:p-10 gap-4 sm:gap-8 relative overflow-hidden">
        <X className="absolute right-5 top-5 text-[#B1B1B1] cursor-pointer z-10" onClick={() => setOpen(false)} />
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-4">
            <GroupIcon />
            <span className="font-semibold font-inter text-xl text-white">Toffee+</span>
          </div>
          {!unfold && <p className="text-sm font-inter text-[#B1B1B1] leading-snug w-full sm:w-[70%]">This feature available only for the Toffee+ Enhance your current plan to unlock a wider range of features and exclusive privileges.</p>}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-end">
            <span className="font-inter text-[32px] text-[#a758f2] font-semibold">$9.99 / month</span>
            {!unfold && <span className="text-sm text-white font-inter underline mb-2 cursor-pointer z-10" onClick={() => setUnfold(true)}>Read all features</span>}
          </div>
        </div>
        {unfold && <div className="flex flex-col gap-5 w-full h-full overflow-auto no-scrollbar z-20">
          {items.map((item, index) => (
            <div className="flex flex-row gap-4" key={index}>
              <Check className="text-[#777777]" />
              <div className="flex flex-col gap-1">
                <span className="text-white text-sm font-medium font-inter">{item.main}</span>
                <span className="text-[#b1b1b1] text-[13px] font-inter">{item?.sub}</span>
              </div>
            </div>
          ))}
        </div>}
        <CheckOut />
        <div className="w-[571px] h-[318px] bg-gradient-to-b from-[#a858f221] via-[#7b19eb21] to-[#a33cba00] absolute top-0 left-0 rounded-3xl" />
      </div>
    </Modal>
  )
}