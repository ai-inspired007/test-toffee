import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Trash2 } from 'lucide-react';
import { RiImageAddLine } from "../../icons/AddImageLine";
import { GCPBucketNames, UploadToGCSInput } from "@/app/api/upload/_schema";
import { uploadCharacterPic, validImageInputTypes } from "@/lib/upload/util";
interface ImageUploadProps {
  value: string | null | undefined;
  setValue: (src: string | null) => void;
  setFile: Dispatch<SetStateAction<File | null>>;
}
const CharacterImage = ({
  value,
  setValue,
  setFile
}: ImageUploadProps) => {
  return (
    <div
      className="h-[236px] w-[204px] rounded-lg"
    >
      {value ? (
        <div className="relative w-full">
          <Image
            src={value}
            alt="Background"
            className="h-[236px] w-[204px] rounded-lg object-cover"
            width={0}
            height={0}
            sizes="100vw"
          />
          <div className="absolute top-2 right-2 bg-bg-3 text-icon-3 p-2 rounded-lg cursor-pointer" onClick={() => setValue(null)}><Trash2 className="h-6 w-6" /></div>
        </div>
      ) : (
        <label
          htmlFor="file-input"
          className="flex h-[236px] w-[204px] cursor-pointer flex-col items-center justify-center rounded-lg border border-white/10 bg-[#121212] relative"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <RiImageAddLine className="text-icon-3 w-6 h-6 mb-4" />
          </div>
          <input
            type="file"
            id="file-input"
            onChange={async (e) => {
              const file = e.target.files![0];
              const fileBlob = file as Blob;
              const tempUrl = URL.createObjectURL(fileBlob);
              setFile(e.target.files![0]);
              setValue(tempUrl);
              e.target.value = "";
            }}
            accept={validImageInputTypes.join(", ")}
            className="hidden"
          />
        </label>
      )}

    </div>
  );
};

export default CharacterImage;
