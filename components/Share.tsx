"use client";

import { Character } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Link,
  LinkIcon,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  PlusSquare,
  ShareIcon,
  Users,
  UsersIcon,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { NextResponse } from "next/server";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Badge } from "./ui/badge";

const MAX_NAME_LEN = 25;
const MAX_LEN = 40;
const MAX_GREETING = 100;

export const Share = ({
  character,
  count,
  userId,
}: {
  character: Character;
  count: number;
  userId: string | null;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubscribe = async () => {
    if (!userId) {
      const url = window.location.href;
      return router.push(`/sign-in?after_sign_in_url=${url}`);
    }
    setIsLoading(true);
    try {
      await axios.post(`/api/character/${character.id}/share`).then((value) => {
        setIsLoading(false);
      });
      toast({
        description: "Successfully subscribed.",
      });
      router.push("/models");
      router.refresh();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        description:
          "Something went wrong. You may already be subscribed, or are the owner of this character.",
        variant: "destructive",
      });
    }
  };

  const onCopy = (content: string) => {
    if (!content) {
      return;
    }
    navigator.clipboard.writeText(content);
    toast({
      description: "Link copied to clipboard.",
    });
  };

  return (
    <>
      <div className="mx-auto flex max-w-md flex-col items-center overflow-hidden bg-white py-6">
        <div className="h-[30rem] w-[20rem] rounded-md border border-opacity-50 shadow-lg lg:h-[34rem] lg:w-[22rem]">
          <div className="z-30 flex h-24 w-full justify-end rounded-t-lg bg-black lg:h-36"></div>
          <div className="-mt-10 flex h-32 w-full skew-y-12 justify-center bg-black lg:-mt-12 lg:h-36" />
          <div className="flex w-full flex-col justify-between">
            <div />
            <div className="flex w-full justify-center">
              <div className="-mt-16 flex h-full w-52 flex-col items-center text-center">
                <div className="relative h-32 w-32 rounded-full border-4 border-white">
                  <Image
                    src={character.image}
                    alt="character_img"
                    fill
                    className="rounded-full bg-white object-cover"
                  />
                </div>
                <p className="mt-2 text-3xl font-semibold">{character.name}</p>
                <p className="mt-1 line-clamp-2 h-10 text-sm text-black/70">
                  {character.description}
                </p>
              </div>
            </div>
            <div className="mx-auto mb-8 mt-6 w-64" />
            <div className="flex w-full justify-center gap-x-4">
              <Button onClick={onSubscribe}> Add to Dashboard </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  onCopy(window.location.href);
                }}
              >
                {" "}
                Copy Link{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
