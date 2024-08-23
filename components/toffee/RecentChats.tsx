"use client";
import { useState, useEffect, useRef } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BotAvatar } from "@/components/BotAvatar";
import { Character } from "@prisma/client";
const RecentChats = ({ characters }: { characters: Character[] }) => {
  const [orderby, setOrderBy] = useState("Recent");
  const { data: session } = useSession();
  const user = session?.user;
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
  const RecentList = () => characters.length > 0 && user ? (
    characters.map((character, index) => (
      <Link
        key={index}
        className={`flex cursor-pointer flex-row items-center gap-2 rounded-md hover:bg-[#242424] p-2`}
        href={`/chat/${character.id}`}
      >
        <BotAvatar size={10} image={character.image} />
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
      </Link>
    ))
  ) : (<div className="mt-12 flex w-full flex-col items-center gap-2">
    <div className="rounded-full bg-[#202020] p-3 text-[#B1B1B1]">
      <User2 className="h-6 w-6" />
    </div>
    <span className="text-center text-lg text-[#B1B1B1]">
      {"No recent chats"}
    </span>
    <span className="max-w-[210px] text-center text-sm text-[#777777]">
      {"After you use some of the chats, they will be shown here"}
    </span>
  </div>
  );

  return (
    <div className="flex h-full flex-grow flex-col overflow-hidden bg-[#121212] mb-8">
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
        <div className="absolute h-full w-full bg-black/50 backdrop-blur-[10px] flex flex-col z-[9999]">
          <div className="w-full bg-bg-2 rounded-t-2xl pt-8 pb-12 px-5 mt-auto" ref={modalRef}>
            <span className=" text-sm text-text-tertiary">Sort by</span>
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
};
export default RecentChats;
