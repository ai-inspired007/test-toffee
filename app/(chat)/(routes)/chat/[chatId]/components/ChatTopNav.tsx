"use client";

import { Button } from "@/components/ui/button";
import { Character, Message } from "@prisma/client";
import {
  ChevronLeft,
  UserCog,
  MoreVertical,
  Trash2,
  Eraser,
  Library,
  BookCopy,
  Settings2,
  Settings,
  Wand2,
  FileEdit,
  Share,
  Forward,
  Share2,
  ChevronDown,
  LockKeyholeIcon,
  UsersIcon,
  GlobeIcon,
  Link2Icon,
  PanelRight
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { BotAvatar } from "./BotAvatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/Toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
interface ChatHeaderProps {
  character: Character & {
    messages: Message[];
  };
  onClear: () => Promise<void>;
  userId: string;
  needsOverlay?: boolean;
  setRightOpen: () => void;
}

export const ChatTopNav = ({
  character,
  onClear,
  userId,
  needsOverlay,
  setRightOpen
}: ChatHeaderProps) => {
  const router = useRouter();
  const MAX_LEN = 40;
  const MAX_NAME_LEN = 25;

  const [initialVisibility, setInitialVisibility] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    const getInitialChecked = async () => {
      const comp = await axios.get(
        `/api/character/${character.id}/share/toggle`,
      );
      if (!comp.data) {
        toast({
          description:
            "An unintended error has occured. Please notify developers.",
          variant: "destructive",
        });
        return;
      }

      const ret = comp.data;

      setInitialVisibility(ret.shared);
      setIsLoading(false);
    };

    getInitialChecked();
  }, [character.id]);

  const onDelete = async () => {
    try {
      await axios.delete(`/api/character/${character.id}`);
      toast({
        description: "Successfully deleted your character.",
      });
      router.push("/models");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        description: `Something went wrong in character deletion.`,
        variant: "destructive",
      });
    }
  };

  const onCopy = (text: string) => {
    if (!text) {
      return;
    }
    navigator.clipboard.writeText(text);
    toast({
      description: "Link copied to clipboard.",
    });
  };

  const onSwitch = async (checked: string) => {
    try {
      await axios.post(`/api/character/${character.id}/share/toggle`, {
        checked,
      });
      setInitialVisibility(checked);
    } catch (error) {
      toast({
        description:
          "Something went wrong while toggling share. Make sure your bot is allowed under OpenAI moderation rules. If the error persists, please contact the developers.",
        variant: "destructive",
      });
    }
  };

  const messages = [
    "Only you can access this model.",
    "Anyone with the link can add this model to their dashboard.",
    "This model will show up in the discover page for anyone to access.",
  ];

  return (
    <div className="w-full px-6 py-3 flex justify-between border-b border-b-white/10">
      <div className="flex flex-row gap-2 items-center">
        <BotAvatar size={8} image={character.image} />
        <span className=" font-[500]">{character.name}</span>
        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full">Toffee</span>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <Settings className="h-6 w-6 cursor-pointer"/>
        <PanelRight className="h-6 w-6 cursor-pointer" onClick={setRightOpen}/>
      </div>
      {/* <ModeToggle />
      {userId == character.userId && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 justify-start"
            >
              <Share className="mb-0.5 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <p className="text-lg font-semibold">Share your character?</p>
            <p className="text-base">
              Use the dropdown menu to change the visibility of your character.
            </p>
            <div className="mb-2 flex items-center justify-between gap-x-2 rounded-md border p-4">
              <div className="flex items-center gap-x-4">
                <Share2 className="h-7 w-7" />
                <div className="flex flex-col gap-y-1">
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center outline-0">
                        <Label className="cursor-pointer outline-0 focus:outline-0">
                          {initialVisibility}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-0.5 h-4 w-4 justify-start"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="outline-none"
                      >
                        <DropdownMenuItem
                          onClick={() => onSwitch("Private")}
                          className="cursor-pointer outline-none focus:outline-0"
                        >
                          <LockKeyholeIcon className="inline h-5 w-5" />
                          <p className="select-none pl-1">Private</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSwitch("Restricted")}
                          className="cursor-pointer outline-none focus:outline-0"
                        >
                          <Link2Icon className="inline h-5 w-5" />
                          <p className="select-none pl-1">Restricted</p>
                        </DropdownMenuItem>
                        <DialogTrigger className="w-full">
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="w-full cursor-pointer"
                          >
                            <GlobeIcon className="inline h-5 w-5" />
                            <p className="select-none pl-1">Public</p>
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="w-[22rem] outline-none lg:w-[26rem]">
                      <DialogTitle className="">Are you sure?</DialogTitle>
                      <DialogDescription className="pb-2">
                        By confirming, you will make your character public. This
                        means that anyone with the link can add this model to
                        their dashboard.
                      </DialogDescription>
                      <DialogClose className="outline-none">
                        <div className="-mb-2 flex w-full justify-end gap-x-2">
                          <Button
                            type="submit"
                            onClick={() => onSwitch("Public")}
                          >
                            Confirm
                          </Button>
                          <Button type="submit" variant={"secondary"}>
                            Cancel
                          </Button>
                        </div>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-black/60">
                    {
                      messages[
                        initialVisibility == "Private"
                          ? 0
                          : initialVisibility == "Restricted"
                            ? 1
                            : 2
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-x-2">
              <Image
                width={50}
                height={50}
                className="rounded-lg object-cover"
                src={character.image}
                alt="character"
              />
              <div className="flex w-full items-center rounded-lg border bg-muted">
                <p
                  className={cn(
                    "p-2 text-xs text-muted-foreground",
                    initialVisibility == "Private"
                      ? "select-none"
                      : " cursor-pointer hover:text-gray-700",
                  )}
                  onClick={() => {
                    if (initialVisibility == "Private") {
                      return;
                    }
                    onCopy(
                      `${window.location.origin}/character/${character.id}/share`,
                    );
                  }}
                >
                  {initialVisibility == "Private"
                    ? "Your character is currently private. Publish your character to generate a link."
                    : `${window.location.origin}/character/${character.id}/share`}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {userId === character.userId && (
        <Button variant="ghost" size="icon">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <UserCog />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/character/${character.id}`);
                }}
              >
                <FileEdit className="inline h-5 w-5 pr-1" />
                <div>
                  <p className="font-base pl-1">Modify</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/character/${character.id}/evolve`);
                }}
              >
                <Wand2 className="inline h-5 w-5 pr-1" />
                <div className="font-base pl-1">Evolve</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eraser />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-3">Clear memory?</DialogTitle>
            <DialogDescription>
              By confirming, you will delete all messages related this character
              from our servers. This action cannot be undone. Are you sure you
              want to do this?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button type="submit" onClick={onClear}>
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {userId === character.userId && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-3">Delete character?</DialogTitle>
              <DialogDescription>
                By confirming, you will delete all traces of this character from
                our servers. This action cannot be undone. Are you sure you want
                to do this?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
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
                        await onDelete();
                      } catch (error) {
                        toast({
                          description:
                            "Something went wrong when deleting your character.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                >
                  <p> Delete</p>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
};
