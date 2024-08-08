"use client";

import { Character, Subscription } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import {
  ExternalLink,
  Globe,
  Home,
  Link2Icon,
  LinkIcon,
  Lock,
  LockKeyhole,
  MessageCircle,
  Radio,
  Share2Icon,
  ShareIcon,
  Shield,
  Star,
  Tag,
  UserCheck,
  Users,
} from "lucide-react";
import { CharacterWithMeta } from "@/lib/character/util";
import { DEFAULT_PFP } from "@/lib/const";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "./ui/popover";
import { StarFilledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CarouselCharacterCardProps {
  // character: Partial<Character> & { username: string | null };
  character: CharacterWithMeta;
  ownership?: "public" | "owner" | "link" | "shared";
  isMyModelPage?: boolean;
  isCarousel?: boolean;
  subscriptions?: Set<string>;
  loggedIn?: boolean;
}

const CarouselCharacterCard = ({
  character,
  ownership,
  isMyModelPage,
  isCarousel,
  subscriptions,
  loggedIn,
}: CarouselCharacterCardProps) => {
  const MAX_NAME_LEN = 13;
  const MAX_LEN = 22;

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toFixed(0);
  };

  const results = new Map([
    ["public", "Shared with you"],
    ["link", "Access by link"],
    ["shared", "Anyone can access"],
    ["owner", "Only you can access"],
  ]);

  const renderOwnership = () => {
    switch (ownership) {
      case "public":
        return (
          <TooltipTrigger>
            <Users className="absolute left-0 top-0 z-10 h-6 w-6 rounded-full border-4 border-white/40 bg-white text-green-600 " />
          </TooltipTrigger>
        );
      case "link":
        return (
          <TooltipTrigger>
            <Link2Icon className="absolute right-0 top-0 z-10 h-6 w-6 rounded-full border-4 border-white/40 bg-white text-red-600 " />
          </TooltipTrigger>
        );
      case "shared":
        return (
          // <Radio  />
          <TooltipTrigger>
            <Globe className="absolute left-0 top-0 z-10 h-6 w-6 rounded-full border-4 border-white/40 bg-white text-blue-600 " />
          </TooltipTrigger>
        );
      case "owner":
        return (
          // <Tag
          //   className="sm:w-4 sm:h-4 lg:w-6 lg:h-6 absolute top-1 right-1 z-10"
          //   fill="#EDC021"
          // />
          <TooltipTrigger>
            <Lock className="absolute left-0 top-0 z-10 h-6 w-6 rounded-full border-4 border-white/40 bg-white text-yellow-600" />
          </TooltipTrigger>
          // <Home  />
        );
      default:
        return <></>;
    }
  };

  const renderCreatorName = (type: string) => {
    let name = "Anonymous";
    if (character.userId) {
      name = character.username || character.userId;
    }
    return (
      <div className="flex w-full items-center justify-start">
        <div className="z-20 w-4/5 max-w-fit rounded-md">
          <div className="flex h-full w-full items-center">
            <Link
              suppressHydrationWarning
              className="z-10 max-w-[6rem]"
              href={`/profile/${encodeURIComponent(character.userId!)}`}
            >
              <p
                className={
                  "truncate text-xs font-normal " +
                  (type == "light" ? "text-black/50" : "text-white/80")
                }
              >
                {name}
              </p>
            </Link>
            <div className="flex items-center">
              <span
                className={
                  "px-1.5 " +
                  (type == "light" ? "text-black/80" : "text-white/80")
                }
              >
                &#183;
              </span>
              <div className="flex items-end justify-end text-xs font-bold">
                <div className="flex items-center gap-0.5">
                  <MessageCircle
                    className={
                      "mb-[1px] h-4 w-4 " +
                      (type == "light" ? "text-black/50" : "text-white/80")
                    }
                    strokeWidth={2}
                  />
                  <p
                    className={
                      "text-[0.6rem] font-normal md:w-min md:text-xs " +
                      (type == "light" ? "text-black/60" : "text-white/80")
                    }
                  >
                    {formatNumber(character.numChats)}
                  </p>
                  {/* <Users className="w-4 h-4" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let initSubscribed = subscriptions?.has(character.id);
    setSubscribed(initSubscribed ? true : false);
  }, []);

  const router = useRouter();

  const onSubscribe = async () => {
    try {
      if (subscribed) {
        await axios.delete(`/api/character/${character.id}/share`);
        toast({
          description: "Successfully unsubscribed.",
        });
        setSubscribed(false);
      } else {
        await axios.post(`/api/character/${character.id}/share`);
        toast({
          description: "Successfully subscribed.",
        });
        setSubscribed(true);
      }
    } catch (error) {
      console.log(error);
      toast({
        description:
          "Something went wrong. Contact developers if the issue persists.",
        variant: "destructive",
      });
    }
  };

  return !isCarousel ? (
    <div
      suppressHydrationWarning
      className="max-w-basis-56 relative m-2 aspect-[14/18] min-w-56 grow overflow-hidden rounded-lg border hover:border-black/30"
    >
      <Link
        suppressHydrationWarning
        className="group"
        href={`/chat/${character.id}`}
      >
        <div className="absolute flex h-full w-full items-center p-0.5">
          <div className="relative h-full w-full">
            <Image
              src={character.image}
              alt="character_img"
              fill
              className="delay-10 absolute z-0 scale-100 overflow-clip rounded-lg object-cover transition duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>
      </Link>
      {isMyModelPage && (
        <TooltipProvider>
          <Tooltip>
            <div className="delay-20 absolute left-2 top-1 m-1 h-8 w-8 rounded-full border-4 border-white/40 opacity-0 transition-all duration-500 group-hover:translate-x-8 group-hover:opacity-100 ">
              {renderOwnership()}
            </div>
            <TooltipContent side="bottom" className="rounded-lg px-2 py-0.5">
              <p className="text-[0.7rem]">
                {ownership ? results.get(ownership) : "Undefined"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <Link suppressHydrationWarning href={`/profile/${character.userId}`}>
        <div className="absolute left-2 top-2 pr-1">
          <Image
            src={character.userImage || DEFAULT_PFP}
            alt="pfp"
            width={32}
            height={32}
            className={
              "ease-inout rounded-full border-4 border-white/40 transition-all duration-500 hover:scale-110"
            }
          />
        </div>
      </Link>
      {isMyModelPage && (
        <div className="absolute right-2 top-2 pr-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
          {character.userId !== "public" &&
            (ownership == "public" ? (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={onSubscribe}
                className="h-6"
              >
                {subscribed ? (
                  <Star
                    size={20}
                    fill={"#EAB308"}
                    className="text-yellow-500 transition-all duration-200 ease-in-out hover:scale-110"
                  />
                ) : (
                  <Star
                    size={20}
                    className="text-white transition-all duration-200 ease-in-out hover:scale-110 hover:text-yellow-500"
                  />
                )}
              </Button>
            ) : ownership == "shared" ? (
              <Link href={`/character/${character.id}/share`}>
                <Button variant={"secondary"} size={"sm"} className="h-6 px-2">
                  Share <ExternalLink size={15} className="ml-1" />{" "}
                </Button>
              </Link>
            ) : (
              <></>
            ))}
        </div>
      )}
      {!isMyModelPage && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
          {character.userId !== "public" &&
            loggedIn &&
            ownership == "public" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={onSubscribe}
                className="h-6"
              >
                {subscribed ? (
                  <Star
                    size={20}
                    fill={"#EAB308"}
                    className="text-yellow-500 transition-all duration-200 ease-in-out hover:scale-110"
                  />
                ) : (
                  <Star
                    size={20}
                    className="text-white transition-all duration-200 ease-in-out hover:scale-110 hover:text-yellow-500"
                  />
                )}
              </Button>
            )}
        </div>
      )}
      <div className="flex h-full w-full flex-col-reverse">
        <div className="delay-20 z-10 flex h-fit w-full flex-col justify-around bg-white bg-gradient-to-t pl-3.5 pt-3 transition-all duration-500 ease-in-out">
          <div className="mb-1">
            <p className="font-medium text-black">{character.name}</p>
            {renderCreatorName("light")}
          </div>
          <p className="mb-1.5 line-clamp-4 max-h-0 w-[14rem] text-xs font-light text-black/40 opacity-0 transition-all duration-500 ease-in-out group-hover:mb-3 group-hover:max-h-20 group-hover:opacity-100">
            {character.description}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div
      suppressHydrationWarning
      className="relative h-[16rem] w-[14rem] overflow-hidden rounded-lg border md:h-[19rem] md:w-[17rem]"
    >
      <Link
        suppressHydrationWarning
        className="group"
        href={`/chat/${character.id}`}
      >
        <Image
          src={character.image}
          alt="character_img"
          fill
          className="delay-10 z-0 scale-100 overflow-clip rounded-lg object-cover transition duration-500 ease-in-out group-hover:scale-110"
        />
        <Link
          suppressHydrationWarning
          href={`/profile/${encodeURIComponent(character.userId!)}`}
        >
          <div className="absolute left-2 top-2 pr-1">
            <Image
              src={character.userImage || DEFAULT_PFP}
              alt="pfp"
              width={32}
              height={32}
              className={
                "ease-inout rounded-full border-4 border-white/40 transition-all duration-500 hover:scale-110"
              }
            />
          </div>
          <div className="absolute right-2 top-2 pr-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            {character.userId !== "public" && (
              <Link
                suppressHydrationWarning
                href={`/character/${character.id}/share`}
              >
                <Button variant={"secondary"} size={"sm"} className="h-6 px-2">
                  Share <ExternalLink size={15} className="ml-1" />{" "}
                </Button>
              </Link>
            )}
          </div>
        </Link>
        <div className="flex h-full w-full flex-col-reverse">
          <div className="delay-20 delay-20 z-20 flex h-[9.5rem] w-full flex-col justify-end rounded-lg bg-gradient-to-t from-black to-black/0 pl-4 pt-24 transition-all duration-500 ease-in-out group-hover:h-[14rem]">
            <p className="text-base font-medium text-white">{character.name}</p>
            {renderCreatorName("dark")}
            <p className="delay-20 mb-2 mt-2 line-clamp-4 max-w-full whitespace-normal break-words text-xs font-light text-white/70 opacity-0 transition-all duration-500 ease-in-out group-hover:mb-5 group-hover:opacity-100">
              {character.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarouselCharacterCard;
