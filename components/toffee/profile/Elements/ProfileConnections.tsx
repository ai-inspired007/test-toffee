"use client";
import { Discord, Instagram, TikTok, Twitter } from "../../icons/ProfileIcons";

export const ProfileConnections = () => {
  return (
    <div className="flex w-full max-w-[560px] gap-10 items-start">
      <div className="flex flex-col w-full gap-6 items-start">
        <span className=" text-lg font-medium leading-6 tracking-tight text-text-sub">Connected accounts</span>
        <div className="flex flex-col w-full gap-2">
          <div className="w-full py-4 pl-4 pr-6 flex justify-between items-center border border-white/5 rounded-[8px]">
            <div className="flex items-center gap-4">
              <Discord />
              <div className="flex flex-col gap-2 w-[88px]">
                <span className=" font-medium text-base leading-5 text-text-sub">Discord</span>
                <span className=" font-normal text-xs text-text-tertiary">Username2424</span>
              </div>
            </div>
            <div className="flex justify-center items-center w-[116px] rounded-[20px] px-4 py-[6px] gap-1 bg-bg-3">
              <div className=" font-medium text-sm leading-[18px] text-text-sub">Disconnect</div>
            </div>
          </div>

          <div className="w-full py-4 pl-4 pr-6 flex justify-between items-center border border-white/5 rounded-[8px]">
            <div className="flex items-center gap-4">
              <Instagram />
              <div className="flex flex-col gap-2 w-[88px]">
                <span className=" font-medium text-base leading-5 text-text-sub">Discord</span>
                <span className=" font-normal text-xs text-text-tertiary">Username2424</span>
              </div>
            </div>
            <div className="flex justify-center items-center w-[116px] rounded-[20px] px-4 py-[6px] gap-1 bg-bg-3">
              <div className=" font-medium text-sm leading-[18px] text-text-sub">Disconnect</div>
            </div>
          </div>

          <div className="w-full py-4 pl-4 pr-6 flex justify-between items-center border border-white/5 rounded-[8px]">
            <div className="flex items-center gap-4">
              <TikTok />
              <div className="flex flex-col gap-2 w-[88px]">
                <span className=" font-medium text-base leading-5 text-text-sub">Discord</span>
                <span className=" font-normal text-xs text-text-tertiary">Username2424</span>
              </div>
            </div>
            <div className="flex justify-center items-center w-[116px] rounded-[20px] px-4 py-[6px] gap-1 bg-bg-3">
              <div className=" font-medium text-sm leading-[18px] text-text-sub">Disconnect</div>
            </div>
          </div>

          <div className="w-full py-4 pl-4 pr-6 flex justify-between items-center border border-white/5 bg-bg-3 rounded-[8px]">
            <div className="flex items-center gap-4">
              <Twitter />
              <div className="flex flex-col gap-2 w-[88px]">
                <span className=" font-medium text-base leading-5 text-text-sub">Discord</span>
                <span className=" font-normal text-xs text-text-tertiary">Username2424</span>
              </div>
            </div>
            <div className="flex justify-center items-center w-[116px] rounded-[20px] px-4 py-[6px] gap-1 bg-white">
              <div className=" font-medium text-sm leading-[18px] text-black">Connect</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}