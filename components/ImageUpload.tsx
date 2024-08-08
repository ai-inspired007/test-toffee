"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import { GCPBucketNames, UploadToGCSInput } from "@/app/api/upload/_schema";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { X, XCircle } from "lucide-react";
import { ClipLoader, DotLoader } from "react-spinners";
import { uploadCharacterPic, validImageInputTypes } from "@/lib/upload/util";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
  size: number;
  gcpBucket: GCPBucketNames;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

// Component to control uploading images
//  1) Drag and Drop controlled by <div>
//  2) Button controlled by <input> (<input> is hidden)
export const ImageUpload = ({
  value,
  onChange,
  disabled,
  size,
  gcpBucket,
  setIsLoading,
}: ImageUploadProps) => {
  // const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // if (e.type === "dragenter" || e.type === "dragover") {
    //   setDragActive(true);
    // } else if (e.type === "dragleave") {
    //   setDragActive(false);
    // }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log(e.dataTransfer);

    if (!e.dataTransfer.files[0]) return;

    const file = e.dataTransfer.files[0];
    const fileBlob = file as Blob;

    if (setIsLoading) setIsLoading(true);
    const tempUrl = URL.createObjectURL(fileBlob);
    //   setFile(e.target.files![0]);
    onChange(tempUrl);
    let publicUrl = null;
    uploadCharacterPic(file, gcpBucket, disabled).then((result) => {
      publicUrl = result;
      if (setIsLoading) setIsLoading(false);
      onChange(publicUrl);
      URL.revokeObjectURL(tempUrl);
    });

    // setDragActive(false);
    e.dataTransfer.clearData();
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        {/* <CldUploadButton
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="bjao8g3d"
      >
        
      </CldUploadButton> */}

        <div
          className={cn(
            "group relative m-2 flex aspect-square w-1/3 flex-col items-end rounded-xl border-4 border-dashed border-primary/10 p-2 transition",
          )}
        >
          {gcpBucket === "chat" && (
            <>
              {!disabled && value && (
                <Button
                  className="absolute -right-1 -top-1 z-50 m-1 h-6 w-6 rounded-full bg-red-600 hover:bg-red-700"
                  variant="ghost"
                  size="icon"
                  onClick={() => onChange("")}
                >
                  <X className="h-5 w-5 p-0 text-white " />
                </Button>
              )}
            </>
          )}
          <div
            className={cn(`relative h-full cursor-pointer`)}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => {
              document.getElementById("file-input")?.click();
            }}
          >
            {gcpBucket === "chat" && (
              <div className="absolute flex h-full w-full items-center justify-center">
                {disabled && value && (
                  <>
                    <p className="z-50">
                      {
                        <ClipLoader
                          size={40}
                          speedMultiplier={0.8}
                          color="white"
                        />
                      }
                    </p>
                  </>
                )}
              </div>
            )}
            <Image
              width={1000}
              height={1000}
              alt="Upload"
              src={value || "/placeholder.svg"}
              className={cn(
                ["aspect-square h-full rounded-lg object-cover"],
                [disabled && "blur brightness-75"],
              )}
            />
          </div>
          <input
            type="file"
            id="file-input"
            onChange={async (e) => {
              const file = e.target.files![0];
              // console.log(file);
              const fileBlob = file as Blob;
              if (setIsLoading) setIsLoading(true);
              // console.log("UPLOADING");
              const tempUrl = URL.createObjectURL(fileBlob);
              //   setFile(e.target.files![0]);
              onChange(tempUrl);
              let publicUrl = null;
              uploadCharacterPic(file, gcpBucket, disabled).then((result) => {
                publicUrl = result;
                if (setIsLoading) setIsLoading(false);
                onChange(publicUrl);
                URL.revokeObjectURL(tempUrl);
              });
              e.target.value = "";
            }}
            accept={validImageInputTypes.join(", ")}
            className="hidden"
          />
        </div>
      </div>
    </>
  );
};
