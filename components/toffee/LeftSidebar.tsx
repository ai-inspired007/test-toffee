"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "@/components/BotAvatar";
import { Character } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "@/contexts/SidebarProvider";
import { HomeLineIcon } from "./icons/HomeLineIcon";
import { SearchLineIcon } from "./icons/SearchLineIcon";
import { Sparking2FillIcon } from "./icons/Sparking2FillIcon";

const LeftSideBar = ({ characters }: { characters: Character[] }) => {
  const { open, toggleOpen } = useSidebarContext();
  const [orderby, setOrderBy] = useState("Recent");
  const { data: session } = useSession();
  const user = session?.user;

  let page = "";
  const path = usePathname();
  if (path === "/search") {
    page = "Search";
  }

  const [isMobile, setIsMobile] = useState(false);
  const checkIfMobile = () => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
    }
  };
  const handleResize = () => {
    checkIfMobile();
    if (isMobile && open) {
      toggleOpen(false);
    }
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, isMobile]);

  const sidebarWidth = open ? (isMobile ? "100%" : "320px") : (isMobile ? "0%" : "60px");
  const RecentList = () => characters.length > 0 && user ? (
    characters.map((character, index) => (
      <Link
        key={index}
        className={`flex cursor-pointer flex-row items-center gap-2 rounded-md hover:bg-[#242424] ${open && "p-2"}`}
        href={`/chat/${character.id}`}
      >
        <BotAvatar size={open ? 10 : 8} image={character.image} />
        {open && (
          <div className="flex flex-col gap-1">
            <span className="font-[400] text-white">
              {character.name}
            </span>
            <span className="text-xs text-[#B3B3B3]">
              {character.description.length > 20
                ? `${character.description.slice(0, 20)}...`
                : character.description}
            </span>
          </div>
        )}
      </Link>
    ))
  ) : ((open) ? (
    <div className="mt-12 flex w-full flex-col items-center gap-2">
      <div className="rounded-full bg-[#202020] p-3 text-[#B1B1B1]">
        <User2 className="h-6 w-6" />
      </div>
      <span className="text-center text-lg text-[#B1B1B1]">
        {"No recent chats"}
      </span>
      <span className="max-w-[210px] text-center text-sm text-[#777777]">
        {"After you use some of the chats, they will be shown here"}
      </span>
    </div>) : (<></>)
  );
  const TopPanel = () => (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-[#121212] px-2 py-3">
      <div
        className={`flex w-full flex-row items-center justify-center mt-1 ${open ? "px-2" : ""}`}
      >
        {open && (
          <div className="flex flex-grow flex-row items-center mb-2">
            <Image
              width={29}
              height={29}
              alt="Logo"
              src="/toffee.svg"
              className="inline"
            />
            <span className="ml-2 inline text-xl font-[400] text-white">
              toffee
            </span>
          </div>
        )}

        <div
          className="cursor-pointer"
          onClick={() => toggleOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3.9 3.8999H20.1C20.3387 3.8999 20.5676 3.99472 20.7364 4.16351C20.9052 4.33229 21 4.56121 21 4.7999V19.1999C21 19.4386 20.9052 19.6675 20.7364 19.8363C20.5676 20.0051 20.3387 20.0999 20.1 20.0999H3.9C3.66131 20.0999 3.43239 20.0051 3.2636 19.8363C3.09482 19.6675 3 19.4386 3 19.1999V4.7999C3 4.56121 3.09482 4.33229 3.2636 4.16351C3.43239 3.99472 3.66131 3.8999 3.9 3.8999ZM8.4 5.6999H4.8V18.2999H8.4V5.6999ZM10.2 5.6999V18.2999H19.2V5.6999H10.2Z"
              fill="#B1B1B1"
            />
          </svg>
        </div>
      </div>

      <Link
        className={`flex w-full flex-row items-center ${open ? "justify-start px-3" : "justify-center"}`}
        href={`/`}
      >
        <HomeLineIcon className="w-5 h-5" />
        {open && (
          <span className={"ml-4 font-[400] text-sm " + ((page == "Home") ? "text-[#FFFFF]" : "text-[#B1B1B1]")}>Home</span>
        )}
      </Link>
      <Link href={'/search'}
        className={`flex w-full flex-row items-center mb-2 ${open ? "justify-start px-3" : "justify-center"}`}
      >
        <SearchLineIcon className="w-6 h-6" />
        {open && (
          <span className={"ml-4 inline-block text-sm font-[400] " + ((page == "Search") ? "text-[#FFFFFF]" : "text-[#B1B1B1]")}>
            Search
          </span>
        )}
      </Link>
      <Link href={'/create'} className="flex w-full cursor-pointer flex-row items-center justify-center rounded-full bg-[#202020] p-1 py-2 font-semibold">
        <Sparking2FillIcon className="w-6 h-6" />
        {open && (
          <span className="ml-1 inline-block text-sm font-[400] text-[#DDDDDD]">
            Create
          </span>
        )}
      </Link>
    </div>
  );
  const SubPanel = () => (
    <div className="mt-2 flex h-full flex-grow flex-col  overflow-hidden rounded-lg bg-[#121212] px-2 py-3">
      <div
        className={`flex w-full flex-row items-center ${open ? "justify-between px-2" : "justify-center"}`}
      >
        {open && (
          <span className="inline  font-[400] text-[#DEDFE4]">
            Recents
          </span>
        )}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="outline-none">
            <div className="cursor-pointer">
              <svg
                width="24"
                height="24"
                className="inline-block "
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.1999 4.7998V15.5998H21.8999L18.2999 20.0998L14.6999 15.5998H17.3999V4.7998H19.1999ZM11.9999 17.3998V19.1998H3.8999V17.3998H11.9999ZM13.7999 11.0998V12.8998H3.8999V11.0998H13.7999ZM13.7999 4.7998V6.5998H3.8999V4.7998H13.7999Z"
                  fill="#B1B1B1"
                />
              </svg>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="mt-1 w-40 rounded-lg bg-[#242424]  text-sm text-white"
            align={open ? "end" : "start"}
          >
            <DropdownMenu.CheckboxItem
              className="flex w-full cursor-pointer select-none flex-row items-center justify-between px-3 pb-1 pt-2 outline-none data-[highlighted]:rounded-t-lg data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
              onClick={() => setOrderBy("Recent")}
              checked={orderby === "Recent"}
            >
              Recent
              <DropdownMenu.ItemIndicator className="text-2xl text-[#BC7F44]">
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem
              className="flex w-full cursor-pointer select-none flex-row items-center justify-between px-3 py-1 outline-none data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
              onClick={() => setOrderBy("Favorites")}
              checked={orderby === "Favorites"}
            >
              Favorites
              <DropdownMenu.ItemIndicator className="text-2xl text-[#BC7F44]">
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem
              className="flex w-full cursor-pointer select-none flex-row items-center justify-between px-3 pb-2 pt-1 outline-none data-[highlighted]:rounded-b-lg data-[highlighted]:bg-[#323232] data-[highlighted]:text-violet-100"
              onClick={() => setOrderBy("Following")}
              checked={orderby === "Following"}
            >
              Following
              <DropdownMenu.ItemIndicator className="text-2xl text-[#BC7F44]">
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="no-scrollbar mt-4 flex flex-grow flex-col gap-2 overflow-y-auto">
        <RecentList />
      </div>
      {open && (
        <div className="flex h-14  w-full cursor-pointer items-center justify-end overflow-hidden rounded-lg bg-[#202020] pl-4 min-w-360">
          <p className=" text-white">Join our Discord</p>
          <svg
            width="73"
            height="73"
            viewBox="0 0 73 73"
            fill="none"
            className="ml-auto mt-4 rounded-lg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M71.9913 18.3093C68.2332 14.8418 63.9805 11.7457 59.2955 9.16602C59.2541 9.1421 59.2064 9.13065 59.1591 9.13327C59.1118 9.13589 59.0672 9.15244 59.0314 9.18064C58.0625 9.95846 56.9145 11.014 56.0681 11.8697C51.0643 9.23049 45.7072 7.29436 40.1722 6.12472C40.0546 4.7948 39.8591 3.46887 39.5867 2.15307C39.5776 2.10815 39.5544 2.06633 39.5201 2.03319C39.4858 2.00006 39.4422 1.97718 39.395 1.96762C34.1461 0.957126 28.8967 0.618947 23.7861 0.884275C23.7426 0.885422 23.701 0.899204 23.667 0.923772C10.181 10.0352 3.34964 21.2064 0.258035 33.5579C0.250868 33.5883 0.25037 33.62 0.25657 33.6512C0.26277 33.6823 0.275537 33.7122 0.294097 33.7391C4.26396 39.2164 9.14873 44.0614 14.7439 48.0711C14.7828 48.0993 14.8293 48.116 14.8772 48.1192C14.9252 48.1223 14.9723 48.1117 15.0126 48.0887C16.9582 46.8998 18.7879 45.5538 20.4826 44.0649C20.5059 44.0446 20.5242 44.0196 20.5362 43.9915C20.5481 43.9635 20.5535 43.9331 20.5519 43.9023C20.5502 43.8716 20.5417 43.8413 20.5268 43.8134C20.5118 43.7855 20.4909 43.7607 20.4654 43.7407C18.8317 42.4066 17.3053 40.9575 15.9002 39.4068C15.875 39.3789 15.8572 39.3457 15.8484 39.3104C15.8397 39.275 15.8402 39.2385 15.85 39.2042C15.8598 39.1699 15.8786 39.1388 15.9046 39.1137C15.9306 39.0886 15.9631 39.0703 15.9991 39.0605C16.455 38.9409 16.9149 38.8106 17.3573 38.674C17.3971 38.6617 17.4402 38.6603 17.4818 38.6699C17.5235 38.6796 17.562 38.6999 17.593 38.7286C27.2458 47.6097 39.5668 52.0626 52.5338 51.3567C52.5765 51.3536 52.6198 51.362 52.6587 51.3809C52.6976 51.3998 52.7306 51.4285 52.7539 51.4637C53.0058 51.8543 53.2731 52.2474 53.5502 52.6319C53.572 52.6621 53.5858 52.6968 53.5903 52.7326C53.5949 52.7684 53.59 52.8044 53.5762 52.8373C53.5624 52.8701 53.54 52.8989 53.5111 52.9209C53.4822 52.9429 53.4477 52.9576 53.4106 52.9636C51.3421 53.2675 49.2558 53.4031 47.1275 53.3737C47.0949 53.3731 47.0629 53.379 47.0335 53.3912C47.0041 53.4033 46.978 53.4214 46.9571 53.4442C46.9361 53.467 46.9207 53.494 46.912 53.5234C46.9032 53.5528 46.9012 53.5839 46.9062 53.6147C47.2778 55.8491 47.8323 58.0487 48.5378 60.2021C48.5526 60.2464 48.5813 60.2859 48.62 60.3152C48.6586 60.3445 48.7053 60.3621 48.7538 60.3657C55.6285 60.8684 62.4921 60.268 69.0546 58.59C69.0863 58.5825 69.1157 58.5686 69.1408 58.5492C69.1659 58.5298 69.1861 58.5053 69.2 58.4775C75.6263 45.2279 76.0751 31.8601 72.0538 18.4175C72.047 18.3761 72.0248 18.3377 71.9913 18.3093ZM25.827 34.5971C22.4027 33.3595 20.6228 29.4483 21.9038 25.9037C23.1859 22.3563 26.9991 20.4696 30.4784 21.7271C33.9838 22.994 35.7298 26.9174 34.4015 30.4205C33.1195 33.9679 29.3063 35.8545 25.827 34.5971ZM48.9306 42.947C45.5035 41.7084 43.7264 37.7983 45.0075 34.2536C46.2895 30.7063 50.0998 28.8185 53.582 30.0771C57.0874 31.3439 58.8335 35.2673 57.5052 38.7705C56.2231 42.3178 52.4389 44.215 48.9306 42.947Z"
              fill="#2F2F2F"
            />
          </svg>
        </div>
      )}
      {user ? (
        <div
          className={`mt-4 flex cursor-pointer flex-row items-center gap-2 rounded-md hover:bg-[#242424] ${open ? "p-2" : ""}`}
        >
          <UserAvatar size={open ? 10 : 8} />
          {open && (
            <div className="flex flex-col ml-1">
              <div className=" font-[400] text-[#B1B1B1]">
                VectorChat
              </div>
              <div className="text-xs text-[#727272]">{user.name}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col gap-2">
          <div className="w-full cursor-pointer rounded-full  border border-white/20 bg-gradient-to-r from-[#C28851] via-[#B77536] to-[#B77536] py-1.5 text-center  font-[400] text-white">
            Sign Up
          </div>
          <div className="w-full cursor-pointer rounded-full border bg-[#202020] py-1.5 text-center  text-[#DDDDDD]">
            Login
          </div>
        </div>
      )}
    </div>
  );
  const MobileTopPanel = () => {
    const [openRecentModal, setResentModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setResentModal(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    return (
      <div className="flex h-full flex-grow flex-col overflow-hidden bg-[#121212] ">
        <div className="flex flex-row justify-between px-5 py-3.5">
          <span className="inline text-[20px] font-[600] text-[#DDD]">
            Recents
          </span>
          <div className="cursor-pointer" onClick={() => setResentModal(!openRecentModal)}>
            <svg
              width="24"
              height="24"
              className="inline-block "
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.1999 4.7998V15.5998H21.8999L18.2999 20.0998L14.6999 15.5998H17.3999V4.7998H19.1999ZM11.9999 17.3998V19.1998H3.8999V17.3998H11.9999ZM13.7999 11.0998V12.8998H3.8999V11.0998H13.7999ZM13.7999 4.7998V6.5998H3.8999V4.7998H13.7999Z"
                fill="#B1B1B1"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col px-3 mt-2">
          <RecentList />
        </div>
        {openRecentModal && (
          <div className="absolute h-full w-full bg-black/50 backdrop-blur-[10px] flex flex-col">
            <div className="w-full bg-bg-2 rounded-t-2xl pt-8 pb-12 px-5 mt-auto" ref={modalRef}>
              <span className="font-inter text-sm text-text-tertiary">Sort by</span>
              <div className="flex flex-col mt-8 gap-4">
                <div className="flex flex-row justify-between" onClick={() => setOrderBy("Recent")}>
                  <span className="text-sm text-white">Recent</span>
                  {orderby === "Recent" && <CheckIcon className="text-2xl text-[#BC7F44]" />}
                </div>
                <div className="w-full h-[1px] bg-[#BABABA1A]" />
                <div className="flex flex-row justify-between" onClick={() => setOrderBy("Favorites")}>
                  <span className="text-sm text-white">Favorites</span>
                  {orderby === "Favorites" && <CheckIcon className="text-2xl text-[#BC7F44]" />}
                </div>
                <div className="w-full h-[1px] bg-[#BABABA1A]" />
                <div className="flex flex-row justify-between" onClick={() => setOrderBy("Following")}>
                  <span className="text-sm text-white">Following</span>
                  {orderby === "Following" && <CheckIcon className="text-2xl text-[#BC7F44]" />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {isMobile ? (
        <>
        </>
      ) : (
        <motion.div
          className={`z-10 bg-bg-1 flex flex-col justify-between h-screen overflow-hidden ${open ? "lg:w-[320px] min-w-[320px] w-full" : "lg:w-[60px] min-w-[60px] w-full"} ${isMobile ? "absolute top-0 left-0 p-0" : "py-2 pl-2"}`}
          animate={{ width: sidebarWidth }}
        >
          <TopPanel />
          <SubPanel />
        </motion.div>
      )}
    </>
  );
};
export default LeftSideBar;
