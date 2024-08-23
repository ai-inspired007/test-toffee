import { HomeLineIcon } from "./icons/HomeLineIcon";
import { SearchLineIcon } from "./icons/SearchLineIcon";
import { Sparking2FillIcon } from "./icons/Sparking2FillIcon";
import { RiChat1Line } from "./icons/ChatLineIcon";
import { RiUserLine } from "./icons/UserLineIcon";
import Link from "next/link";
const MobileNavPanel = () => {
    return (
      <div className="fixed bottom-0 w-full z-50">
        <div className="flex flex-row px-7 pt-3 pb-1 border-t border-white/10 w-full bg-bg-2 justify-between items-end text-white">
          <Link className="flex flex-col items-center" href={"/"}>
            <HomeLineIcon className="w-5 h-5" />
            <span className="text-text-tertiary  text-[11px] mt-0.5">Home</span>
          </Link>
          <Link className="flex flex-col items-center" href={"/"}>
            <RiChat1Line className="w-6 h-6" />
            <span className="text-text-tertiary  text-[11px] mt-0.5">Chat</span>
          </Link>
          <Link className="flex flex-col items-center" href={"/create"}>
            <Sparking2FillIcon className="w-10 h-10 rounded-full p-1 bg-[#BC7F44]" />
          </Link>
          <Link className="flex flex-col items-center" href={"/search"}>
            <SearchLineIcon className="w-6 h-6" />
            <span className="text-text-tertiary  text-[11px] mt-0.5">Search</span>
          </Link>
          <Link className="flex flex-col items-center" href={"/profile"}>
            <RiUserLine className="w-6 h-6" />
            <span className="text-text-tertiary  text-[11px] mt-0.5">Profile</span>
          </Link>
        </div>
        <div className="w-full h-[34px] flex items-center justify-center bg-bg-2">
          <div className="w-1/3 h-[5px] rounded-full bg-white/10 mt-auto mb-2" />
        </div>
      </div>
    )
  }

  export default MobileNavPanel