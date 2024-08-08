"use client";

import { Character, File, Summary } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronLeft,
  Cog,
  HomeIcon,
  MoreVertical,
  Trash,
  Trash2,
  Trash2Icon,
  TrashIcon,
  UserCog,
  Wand2,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import axios, { AxiosResponse } from "axios";
import { getFiles, getVectors } from "@/lib/utils";
import { MAX_VECTORS } from "@/lib/const";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import useWindowSize from "react-use/lib/useWindowSize";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "./ui/dialog";
import { useAIContext } from "@/contexts/AIProvider";
import { CONTRACTIONS, SPECIAL_CHARACTERS } from "@/lib/const";
import { Label } from "./ui/label";
import Link from "next/link";
import { blob } from "stream/consumers";
import { createWorker } from "tesseract.js";
import prismadb from "@/lib/prismadb";

type FileWithMeta = File & { summaries: Summary[] }

interface EvolveProps {
    character: Character,
    files: FileWithMeta[],
    numVectors: number,
}

export const EvolvePage = ({ character, files, numVectors }: EvolveProps) => {
  const router = useRouter();
  if (!character) {
    router.push("/models");
    router.refresh();
  }

  useEffect(() => {
    (async () => {
      const pdfjs =
        // @ts-expect-error Add .d.ts
        window.pdfjsLib as typeof import("pdfjs-dist/types/src/pdf");
      //@ts-expect-error Add d.ts?
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      console.log("pdfjs", pdfjs);
    })();
  }, []);

  const [loading, setLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [PDF, setIsPDF] = useState(false);
  const [fileName, setFileName] = useState("");

  // useEffect(() => {
  //     console.log("TEXT: " + currentText);
  // }, [currentText])

  function base64ToArrayBuffer(base64: string) {
    // console.log("base64", base64);
    var binaryString = atob(base64.substring(28));
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const convertToText = async (images: string[]) => {
    const worker = await createWorker("eng");

    const container = document.getElementById("container");
    let ret = "";
    for (const image of images) {
      const {
        data: { text },
      } = await worker.recognize(image);
      ret += text;
    }

    await worker.terminate();
    return ret;
  };

  const convertToImage = async (pdf: any) => {
    const container = document.getElementById("container");
    const images = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      container?.appendChild(canvas);
      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      }).promise;
      images.push(canvas.toDataURL("image/png"));
    }
    return images;
  };

  const handlePDF = async (blob: string) => {
    console.log("HANDLING PDF");
    if (blob.length > 10000000) {
      toast({
        description:
          "File size is too large. Please upload a smaller file, break it up into multiple files, or compress it.",
        variant: "destructive",
      });
      setLoading(false);
      return "";
    }
    try {
      setLoading(true);
      let res: string = "";

      // pdf to text https://stackoverflow.com/questions/78121846/how-to-get-pdfjs-dist-working-with-next-js-14
      // https://github.com/vercel/next.js/issues/58313
      const pdfjs =
        // @ts-ignore
        window.pdfjsLib as typeof import("pdfjs-dist/types/src/pdf");
      console.log("pdfjs in handlePDF", pdfjs);
      // @ts-ignore
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const buffer = base64ToArrayBuffer(blob);
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      const images = await convertToImage(pdf);
      res += await convertToText(images);
      //   console.log("dear god please work", res);

      //   await axios
      //     .post("/api/utils/parsePDF", { base: blob })
      //     .then((response: AxiosResponse) => {
      //       res = response.data as string;
      //     });
      return res;
    } catch (error) {
      console.log(error);
      toast({
        description:
          "Something went wrong. Please wait a bit and try again. If the error persists, contact a developer.",
        variant: "destructive",
      });
      setLoading(false);
      return "";
    }
  };

  const uploadFile = (e: FormEvent<HTMLInputElement>) => {
    setLoading(true);
    let files_curr = (e.target as HTMLInputElement)?.files;
    if (files_curr) {
      const reader = new FileReader();
      const PDFReader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (content) {
          setCurrentText(content.toString());
          setLoading(false);
        }
      };
      PDFReader.onload = async (e) => {
        const content = e.target?.result;
        // console.log("help", new Uint8Array(content as ArrayBuffer));
        // console.log("content", typeof content);
        if (content) {
          setCurrentText(content as string);
          setIsPDF(true);
          setLoading(false);
        }
      };
      let index = 0;
      if (files_curr[index].size > 10000000) {
        toast({
          description:
            "File size is too large. Please upload a smaller file, break it up into multiple files, or compress it.",
          variant: "destructive",
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setLoading(false);
        return;
      }
      // console.log("TYPE: " + files[index].type);
      if (files_curr[index].type == "text/plain") {
        reader.readAsText(files_curr[index]);
        for (let i = 0; i < files.length; i++) {
          if (files[i].name == files_curr[index].name) {
            toast({
              description:
                "A file with the same name exists. Please rename your file and try again.",
              variant: "destructive",
            });
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            setLoading(false);
            return;
          }
        }
        setFileName(files_curr[index].name);
      } else if (files_curr[index].type == "application/pdf") {
        // toast({
        //     description: "PDF files are not supported yet. Please convert to a .txt and upload.",
        //     variant: "destructive"
        // })
        // if (inputRef.current) {
        //     inputRef.current.value = "";
        // }
        PDFReader.readAsDataURL(files_curr[index]);
        for (let i = 0; i < files.length; i++) {
          if (files[i].name == files_curr[index].name) {
            toast({
              description:
                "A file with the same name exists. Please rename your file and try again.",
              variant: "destructive",
            });
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            setLoading(false);
            return;
          }
        }
        setFileName(files_curr[index].name);
      } else {
        toast({
          description: "Unsupported file type.",
          variant: "destructive",
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setLoading(false);
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_TEXT_LENGTH = 450000;

  const onSubmit = async (text: string) => {
    if (text.length > MAX_TEXT_LENGTH) {
      toast({
        description:
          "Text exceeds maximum length. Please upload a smaller file, or break it up into multiple files.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const preprocessText = (s: string) => {
      // remove extra spaces
      let res = s.replaceAll(/[ \t]+/g, " ").trim();
      res = res.replaceAll(/[\n\r]+/g, "\n").trim();

      // remove special characters
      for (let c in SPECIAL_CHARACTERS) {
        res = res.replaceAll(c, "");
      }

      // replace contractions
      for (let contraction in CONTRACTIONS.keys()) {
        const sol = CONTRACTIONS.get(contraction);
        if (sol) {
          res = res.replaceAll(contraction, sol);
        }
      }

      return res;
    };

    const parsedString = preprocessText(text);
    if (parsedString.length > MAX_TEXT_LENGTH) {
      toast({
        description:
          "Text exceeds maximum length. Please upload a smaller file, or break it up into multiple files.",
        variant: "destructive",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setLoading(false);
      return;
    }

    console.log("PARSED STRING:\n\n" + parsedString);
    setCurrentText("");
    setLoading(true);
    console.log("GETTING VECTORS");
    if (numVectors == MAX_VECTORS) {
      toast({
        description:
          "You've reached the maximum amount of data this character can recieve.",
        variant: "destructive",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setLoading(false);
      return;
    }
    if (!parsedString || parsedString == "") {
      toast({
        description:
          "Something went wrong. Make sure the file extension is .txt or .pdf. If the error persists, contact a developer.",
        variant: "destructive",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setLoading(false);
    } else {
      try {
        console.log(`/api/character/${character.id}/evolve`);
        await axios.post(`/api/character/${character.id}/evolve`, {
          text: parsedString,
          origin: fileName,
          characterId: character.id,
        });
        setLoading(false);
        toast({
          description: "Success.",
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        router.push(`/character/${character.id}/evolve`);
        router.refresh();
      } catch (error) {
        console.log(error);
        toast({
          description:
            "Something went wrong. Please wait a bit and try again. If the error persists, contact a developer.",
          variant: "destructive",
        });
      }
    }
  };

  // console.log(files);

  // useEffect(() => {
  //     console.log("CONTENT: " + currentText);
  // }, [currentText]);

  const onDeleteFile = async (name: string) => {
    try {
      await axios.delete(`/api/character/${character.id}/evolve/${name}`);
      toast({
        description: "Successfully deleted file.",
      });
      router.push(`/character/${character.id}/evolve`);
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async () => {
    console.log(`id: /api/${character.id}/evolve`);
    try {
      await axios.delete(`/api/character/${character.id}/evolve`);
      toast({
        description: "Successfully cleared all public info.",
      });
      router.push(`/character/${character.id}/evolve`);
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl flex-1 space-y-2 p-4">
      <script async src="/pdf.mjs" type="module" />
      <div className="flex justify-center">
        <div>
          <Button
            className="hidden md:flex"
            variant="ghost"
            onClick={() => {
              router.push(`/chat/${character.id}`);
            }}
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="w-full space-y-2">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-base font-medium md:text-lg">
                Upload Knowledge
              </h3>
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="align-center flex h-5 w-5 md:h-6 md:w-6"
                  >
                    <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="pb-3">Clear memory?</DialogTitle>
                    <DialogDescription>
                      By confirming, you will delete all public files related to
                      this character. This action cannot be undone. Are you sure
                      you want to do this?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button type="submit" onClick={onDelete}>
                        Confirm
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground md:text-sm">
                  Make your character truly unique.
                </p>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {numVectors >= 0
                    ? `${((numVectors / MAX_VECTORS) * 100).toFixed(1)}% memory used`
                    : "Loading..."}
                </p>
              </div>
            </div>
            <Separator className="my-2 bg-primary/10" />
            <div>
              <Link className="absolute p-2 md:hidden" href="/models">
                <Button size="sm" variant={"secondary"}>
                  Back
                </Button>
              </Link>
              <div className="mb-3 flex justify-center rounded border bg-gradient-to-br from-blue-200 to-green-400">
                <div className="relative m-5 h-60 w-60">
                  <Image
                    fill
                    className="rounded-full border-2 border-white border-opacity-60 bg-gradient-to-br from-white to-green-300 object-cover opacity-90"
                    alt="Empty"
                    src={character.image}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 pt-1">
              <Label>Upload File</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={(e) => uploadFile(e)}
                  ref={inputRef}
                />
                {!loading ? (
                  <Button
                    className="flex gap-2"
                    onClick={async () => {
                      if (currentText == "") {
                        toast({
                          description: "Please upload a file first.",
                          variant: "destructive",
                        });
                        return;
                      }
                      if (PDF) {
                        const parsed = await handlePDF(currentText as string);
                        console.log("PARSED: " + parsed);
                        onSubmit(parsed);
                      } else {
                        console.log("ABOUT TO SUBMIT");
                        await onSubmit(currentText);
                      }
                    }}
                  >
                    Evolve
                    <Wand2 />
                  </Button>
                ) : (
                  <Button className="flex gap-1 bg-gray-500">
                    {" "}
                    Loading. . .
                  </Button>
                )}
              </div>
            </div>
            <div className="border-b py-2" />
            <h1 className="mt-4 font-semibold">File List</h1>

            <div className="mt-2 h-40 max-h-40 w-full flex-col gap-y-2 overflow-y-scroll rounded-lg">
              <div className="flex w-full bg-muted px-2 py-1">
                <p className="w-1/2 text-xs text-muted-foreground md:text-sm">
                  File Name
                </p>
                <p className="w-1/4 text-xs text-muted-foreground md:text-sm">
                  Size
                </p>
                <p className="w-1/4 text-xs text-muted-foreground md:text-sm">
                  Date
                </p>
              </div>
              {files.length == 0 && (
                <p className="p-2 text-xs text-muted-foreground md:text-sm">
                  No files uploaded yet.
                </p>
              )}
              {files.map((file) => {
                return (
                  <div
                    className="flex w-full border-b px-2 py-3"
                    key={file.name}
                  >
                    <div className="flex w-1/2 items-center">
                      <Dialog>
                        <DialogTrigger>
                          <Trash2Icon
                            size={"14"}
                            className="mr-1 cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            Are you sure you want to delete this file?
                          </DialogHeader>
                          <DialogDescription>
                            Once you delete this file, your character will not
                            remember the information it contains. This action
                            cannot be undone.
                          </DialogDescription>
                          <DialogFooter>
                            <DialogClose>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  await onDeleteFile(file.name);
                                }}
                              >
                                Confirm
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <p className="truncate text-xs text-black/70 md:text-sm">
                        {file.name}
                      </p>
                    </div>
                    <p className="w-1/4 truncate text-xs text-black/70 md:text-sm">
                      {((file.summaries.length / MAX_VECTORS) * 100).toFixed(2)}%
                    </p>
                    <p className="w-1/4 truncate text-xs text-black/70 md:text-sm">
                      {file.createdAt.toDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
