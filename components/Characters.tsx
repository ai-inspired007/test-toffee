"use client";

import { Character, Subscription } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState, useRef } from "react";
import { toast } from "./ui/use-toast";
import axios from "axios";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import CarouselCharacterCard from "./CarouselCharacterCard";
import { CharacterWithMeta } from "@/lib/character/util";

interface CharacterProps {
  data: CharacterWithMeta[];
  isMyModelPage?: boolean;
  isProfilePage?: boolean;
  isCarousel?: boolean;
  subscriptions: Set<string>;
  loggedIn?: boolean;
}

export const Characters = ({
  data,
  isMyModelPage,
  isProfilePage,
  isCarousel,
  subscriptions,
  loggedIn,
}: CharacterProps) => {
  const { data: session, status } = useSession();
  let user = session?.user;

  const router = useRouter();
  const [text, setText] = useState("");

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 pt-5 text-center">
        <div className="relative h-60 w-64">
          <Image fill className="grayscale" alt="Empty" src="/empty.png" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {" "}
          couldn&apos;t find any characters 😢{" "}
        </p>
      </div>
    );
  }

  const getType = (character: CharacterWithMeta) => {
    if (status === "loading") {
      return "";
    }
    if (!user || character.userId === "public") {
      return "public";
    } else if (character.userId === user.id) {
      if (character.shared && !character.private) {
        return "shared";
      } else if (character.shared && character.private) {
        return "link";
      } else {
        return "owner";
      }
    }

    return "public";
  };
  // data.forEach((item) => {
  //     console.log(item.name);
  // })

  return (
    // <div className="flex flex-wrap gap-y-3 gap-x-2 w-full after:grow after:basis-auto min-[400px]:after:basis-[32%] sm:after:basis-[24%] md:after:basis-[15%]">
    <div
      className={
        "grid-container justify-items-stretch gap-4 gap-x-2 gap-y-6 pb-5 md:gap-x-1 " +
        (isProfilePage ? "justify-center pl-2 pr-5" : "justify-start pl-5 pr-5")
      }
    >
      <style jsx>{`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
          gap: 20px;
        }
      `}</style>
      {data.map((item) => (
        <div
          key={item.id}
          // className="grow basis-auto min-[400px]:basis-[32%] sm:basis-[24%] md:basis-[15%]"
          className="flex grow items-center justify-center"
        >
          <div className="group h-full flex-1 rounded-xl transition">
            {status === "authenticated" && (
              <></>
              // <div
              //   className={
              //     "absolute flex items-center z-40 max-w-20 max-h-6 mt-2 rounded-md opacity-90 group-hover:opacity-100 p-2 bg-gradient-to-br"
              //   }
              // >
              //   {getType(item) == "shared" && (
              //     <div className="flex items-center justify-center bg-red-600 hover:bg-red-700 border-white border opacity-80 rounded-full w-5 h-5 hover:opacity-100">
              //       <Dialog>
              //         <DialogTrigger asChild>
              //           <Button variant="ghost" size="icon">
              //             <X className="w-4 h-4 text-white" />
              //           </Button>
              //         </DialogTrigger>
              //         <DialogContent>
              //           <p className="text-lg font-semibold">
              //             Remove this character from your dashboard?
              //           </p>
              //           Once you remove it, you will not be able to access it
              //           unless the owner shares the link with you again.
              //           <div className="flex gap-x-2">
              //             <Input
              //               placeholder='Type "I understand" and press delete.'
              //               onChange={(event) => {
              //                 setText(event.target.value);
              //               }}
              //             />
              //             <DialogClose
              //               disabled={text.toLowerCase() !== "i understand"}
              //               className="p-0 m-0 w-22"
              //             >
              //               <Button
              //                 className="w-22"
              //                 onClick={async () => {
              //                   if (text.toLowerCase() !== "i understand") {
              //                     toast({
              //                       description: `${"Type \"I understand\" and press the delete button to continue. Make sure you've spelled the words right, and don't include any punctuation."}`,
              //                       variant: "destructive",
              //                     });
              //                   } else {
              //                     try {
              //                       await axios.delete(
              //                         `/api/character/${item.id}/share`
              //                       );
              //                       toast({
              //                         description: "Successfully unsubscribed.",
              //                       });
              //                       router.push(`/models`);
              //                       router.refresh();
              //                     } catch (error) {
              //                       toast({
              //                         description:
              //                           "Something went wrong when unsubscribing to a character.",
              //                         variant: "destructive",
              //                       });
              //                     }
              //                   }
              //                 }}
              //               >
              //                 <p> Delete</p>
              //               </Button>
              //             </DialogClose>
              //           </div>
              //         </DialogContent>
              //       </Dialog>
              //     </div>
              //   )}
              // </div>
            )}
            {/* <div className="relative">
            <Image
              src={item.image}
              width={1000}
              height={1000}
              className="rounded-xl z-1 transition ease-in-out delay-10 group-hover:opacity-95 object-cover "
              alt="Character"
            />
          </div> */}

            {isMyModelPage ? (
              <Dialog>
                <ContextMenu>
                  <ContextMenuTrigger>
                    {/* <div className="bg-primary/5 rounded-xl w-min"></div> */}
                    <CarouselCharacterCard
                      character={item}
                      isMyModelPage={isMyModelPage}
                      ownership={getType(item) || "public"}
                      isCarousel={isCarousel}
                      subscriptions={subscriptions}
                      loggedIn={loggedIn}
                      // ownership="owner"
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    <DialogTrigger asChild>
                      <ContextMenuItem
                        inset
                        disabled={getType(item) !== "public"}
                      >
                        Remove Shared Character
                      </ContextMenuItem>
                    </DialogTrigger>
                  </ContextMenuContent>
                </ContextMenu>
                <DialogContent>
                  <p className="text-lg font-semibold">
                    Remove this character from your dashboard?
                  </p>
                  Once you remove it, you will not be able to access it unless
                  the owner shares the link with you again.
                  <div className="flex gap-x-2">
                    <Input
                      placeholder='Type "I understand" and press delete.'
                      onChange={(event) => {
                        setText(event.target.value);
                      }}
                    />
                    <DialogClose
                      disabled={text.toLowerCase() !== "i understand"}
                      className="w-22 m-0 p-0"
                    >
                      <Button
                        className="w-22"
                        onClick={async () => {
                          if (text.toLowerCase() !== "i understand") {
                            toast({
                              description: `${"Type \"I understand\" and press the delete button to continue. Make sure you've spelled the words right, and don't include any punctuation."}`,
                              variant: "destructive",
                            });
                          } else {
                            try {
                              await axios.delete(
                                `/api/character/${item.id}/share`,
                              );
                              toast({
                                description: "Successfully unsubscribed.",
                              });
                              router.push(`/models`);
                              router.refresh();
                            } catch (error) {
                              toast({
                                description:
                                  "Something went wrong when unsubscribing to a character.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        <p> Delete</p>
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <CarouselCharacterCard
                character={item}
                isMyModelPage={isMyModelPage}
                ownership={getType(item) || "public"}
                isCarousel={isCarousel}
                subscriptions={subscriptions}
                loggedIn={loggedIn}
              />
            )}

            {/* <div className="relative aspect-square">              
              <Image
                src={item.image}
                width={1000}
                height={1000}
                className="rounded-xl z-1 transition ease-in-out delay-10 group-hover:opacity-95 object-cover "
                alt="Character"
              />
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};
