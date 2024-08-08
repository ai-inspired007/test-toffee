"use client";

import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAIContext } from "@/contexts/AIProvider";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import prismadb from "@/lib/prismadb";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  key: z
    .string()
    .min(1, {
      message: "Key is required.",
    })
    .max(50, {
      message: "Invalid key.",
    }),
});

export const ModeToggle = () => {
  const { API, updateAPI, blocked, toggleBlocked } = useAIContext();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      key: "",
    },
  });

  const isLoad = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    let caughtError = false;
    try {
      await axios.post(`/api/key/${values.key}`);
    } catch (error) {
      console.log(error);
      toast({
        description: `Something went wrong. Make sure your API key is correct, and wait a bit and try again. If the issue persists, contact a developer.`,
        variant: "destructive",
      });
      caughtError = true;
    } finally {
      if (!caughtError) {
        updateAPI("BitAPAI");
      }
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bot />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-base">
          <DropdownMenuItem
            disabled={blocked}
            onClick={() => {
              updateAPI("OpenAI");
            }}
          >
            <div>
              <p
                className={cn(
                  "inline",
                  API == "OpenAI" ? "font-semibold" : "font-base",
                )}
              >
                {" "}
                GPT-4 Turbo{" "}
              </p>
            </div>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <div>
                <p
                  className={cn(
                    "inline",
                    API == "BitAPAI" ? "font-semibold" : "font-base",
                  )}
                >
                  {" "}
                  Bittensor{" "}
                </p>
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={() => {
              updateAPI("Llama");
            }}
          >
            <div>
              <p
                className={cn(
                  "inline",
                  API == "Llama" ? "font-semibold" : "font-base",
                )}
              >
                {" "}
                Llama 2{" "}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              updateAPI("Gemini");
            }}
          >
            <div>
              <p
                className={cn(
                  "inline",
                  API == "Gemini" ? "font-semibold" : "font-base",
                )}
              >
                {" "}
                Gemini{" "}
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-3">Enter Corcel Key</DialogTitle>
          <DialogDescription>
            Due to API restrictions, to use Corcel (formerly BitAPAI), you will
            need to input your API key. You can create one at{" "}
            <a
              href="https://corcel.io"
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold"
            >
              https://corcel.io
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="items-begin flex w-full"
            >
              <FormField
                name="key"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input
                        className="mr-2 w-72"
                        disabled={isLoad}
                        placeholder="Enter BitAPAI key (with dashes)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose>
                <Button type="submit" disabled={isLoad}>
                  Confirm
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogFooter>
        <DialogHeader />
      </DialogContent>
    </Dialog>
  );
};
